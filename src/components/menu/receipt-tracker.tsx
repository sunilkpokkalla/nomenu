"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Receipt, X, ChefHat, CheckCircle2, Clock, Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";

interface OrderItem {
  id: string;
  quantity: number;
  price_at_time_of_order: number;
  customer_notes: string | null;
  menu_items: {
    name: string;
  };
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  daily_order_number?: number;

  table_number: string | null;
  customer_name: string | null;
  created_at: string;
  order_items: OrderItem[];
}

interface ReceiptTrackerProps {
  restaurantId: string;
  locationLabel?: string | null;
  taxRate?: number;
  serviceCharge?: number;
  serviceChargeType?: string;
  restaurantName?: string;
}

export function ReceiptTracker({ restaurantId, locationLabel, taxRate = 0, serviceCharge = 0, serviceChargeType = "percentage", restaurantName }: ReceiptTrackerProps) {
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDownloadingId, setIsDownloadingId] = useState<string | null>(null);

  const supabase = createClient();

  const handleDownloadPng = async (orderId: string, orderNumber: number) => {
    const el = document.getElementById(`receipt-${orderId}`);
    if (!el) return;
    setIsDownloadingId(orderId);
    try {
      const dataUrl = await toPng(el, { 
        cacheBust: true, 
        pixelRatio: 3,
        filter: (node) => {
          // exclude buttons with 'print:hidden'
          if (node.classList && typeof node.classList.contains === 'function') {
            return !node.classList.contains('print:hidden');
          }
          return true;
        }
      });
      const link = document.createElement("a");
      link.download = `receipt_${String(orderNumber).padStart(3, '0')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate receipt image", err);
    } finally {
      setIsDownloadingId(null);
    }
  };

  useEffect(() => {
    let savedOrderIds: string[] = [];
    try {
      const stored = localStorage.getItem("nomenu_orders");
      if (stored) savedOrderIds = JSON.parse(stored);
      
      // migrate legacy
      const legacy = localStorage.getItem("nomenu_last_order");
      if (legacy && !savedOrderIds.includes(legacy)) {
        savedOrderIds.unshift(legacy);
        localStorage.removeItem("nomenu_last_order");
        localStorage.setItem("nomenu_orders", JSON.stringify(savedOrderIds));
      }
    } catch(e) {
      // Ignore localStorage errors (e.g., if cookies/storage are blocked)
      console.warn("localStorage is not available.");
    }

    if (savedOrderIds.length > 0) {
      setOrderIds(savedOrderIds);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      fetchOrders(savedOrderIds);
    } else {
      setLoading(false);
    }

    const handleNewOrder = () => {
      let updatedOrderIds: string[] = [];
      try {
        const stored = localStorage.getItem("nomenu_orders");
        if (stored) updatedOrderIds = JSON.parse(stored);
      } catch(e) {}
      
      if (updatedOrderIds.length > 0) {
        setOrderIds(updatedOrderIds);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        fetchOrders(updatedOrderIds);
      }
    };

    window.addEventListener("nomenu_order_placed", handleNewOrder);
    return () => window.removeEventListener("nomenu_order_placed", handleNewOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (orderIds.length === 0) return;

    const channels = orderIds.map(id => {
      return supabase
        .channel(`order_updates_${id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `id=eq.${id}`,
          },
          (payload) => {
            setOrders((prev) => prev.map(o => o.id === id ? { ...o, status: payload.new.status } : o));
          }
        )
        .subscribe();
    });

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, [orderIds, supabase]);

  const fetchOrders = async (ids: string[]) => {
    if (!ids || ids.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        total_amount,
        daily_order_number,

        table_number,
        customer_name,
        created_at,
        order_items (
          id,
          quantity,
          price_at_time_of_order,
          customer_notes,
          menu_items (
            name
          )
        )
      `)
      .in("id", ids)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch orders:", error);
    } else if (data) {
      const now = new Date().getTime();
      const validOrders = data.filter((o) => {
        const orderTime = new Date(o.created_at).getTime();
        return (now - orderTime) < 24 * 60 * 60 * 1000;
      });
      const validIds = validOrders.map((o) => o.id);
      
      // Update local storage if any got filtered out
      if (validIds.length !== ids.length) {
         try {
           localStorage.setItem("nomenu_orders", JSON.stringify(validIds));
         } catch(e) {}
         setOrderIds(validIds);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setOrders(validOrders as any);
    }
    setLoading(false);
  };

  if (orderIds.length === 0 || loading) return null;
  if (orders.length === 0) return null;

  // Render status icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return <div className="flex items-center gap-2 text-amber-600"><Clock className="w-4 h-4 animate-pulse" /> RECEIVED</div>;
      case "preparing":
        return <div className="flex items-center gap-2 text-orange-600"><ChefHat className="w-4 h-4 animate-bounce" /> PREPARING</div>;
      case "completed":
        return <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="w-4 h-4" /> READY</div>;
      default:
        return <span className="uppercase text-slate-500">{status}</span>;
    }
  };

  return (
    <>
      {/* Floating Receipt Button */}
      {!isOpen && (
        <div className="fixed bottom-24 right-4 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-14 h-14 bg-white text-slate-900 rounded-full shadow-2xl border border-slate-200 hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="relative">
              <Receipt className="w-6 h-6" />
              {orders.some(o => o.status !== "completed") && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              )}
              {orders.some(o => o.status !== "completed") && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </div>
          </button>
        </div>
      )}

      {/* Receipt Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center p-4 bg-black/60 backdrop-blur-sm transition-all pointer-events-auto">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-sm mx-auto flex flex-col h-full max-h-[85vh] animate-in slide-in-from-bottom-10 pointer-events-auto pb-6">
            
            <div className="flex justify-between items-center bg-black text-white p-4 rounded-t-2xl z-10 shadow-lg">
                <h2 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                  <Receipt className="w-4 h-4" /> YOUR RECEIPTS ({orders.length})
                </h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => window.print()} className="p-1.5 text-slate-300 hover:text-white print:hidden bg-slate-800 rounded-full" title="Save / Print All">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-300 hover:text-white print:hidden bg-slate-800 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
            </div>

            {/* Scrollable Feed of Receipts */}
            <div className="overflow-y-auto overflow-x-hidden space-y-6 pt-2 pb-10 flex-1 hide-scrollbar">
              {orders.map((o) => (
                <div key={o.id} className="relative w-full">
                  <div id={`receipt-${o.id}`} className="relative w-full bg-[#f9f9f9] text-[#111] font-mono flex flex-col shadow-xl" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))" }}>
                    <div className="w-full h-3 bg-repeat-x" style={{ backgroundImage: "linear-gradient(-45deg, transparent 4px, #f9f9f9 0), linear-gradient(45deg, transparent 4px, #f9f9f9 0)", backgroundSize: "8px 8px", backgroundPosition: "left top", marginTop: "-3px" }} />
                  
                  <div className="p-6 pt-4 pb-8">
                    {restaurantName && (
                      <div className="text-center font-black text-xl mb-6 uppercase tracking-wider border-b-2 border-slate-900 pb-2">
                        {restaurantName}
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <div className="text-sm uppercase tracking-widest text-slate-500 mb-1">Order Number</div>
                      <div className="text-5xl font-black mb-4">#{String(o.daily_order_number || 0).padStart(3, '0')}</div>
                      
                      <div className="flex justify-between items-end text-left border-t border-slate-200 pt-4 mt-2">
                        {o.customer_name ? (
                          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                            Guest<br/><span className="text-sm text-slate-900">{o.customer_name}</span>
                          </div>
                        ) : <div />}
                        {o.table_number && (
                          <div className="text-right">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                              {(locationLabel || "TABLE").toUpperCase()}
                            </div>
                            <div className="text-base border-2 border-slate-900 text-slate-900 rounded px-2 py-0.5 font-black uppercase inline-block">
                              {o.table_number}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center mb-6 py-3 border-y-2 border-dashed border-slate-300 font-bold text-lg">
                      {getStatusDisplay(o.status)}
                    </div>

                    <div className="space-y-4 mb-6 text-sm">
                      {o.order_items.map((item) => (
                        <div key={item.id} className="flex flex-col">
                          <div className="flex justify-between">
                            <span className="font-bold">{item.quantity}x {item.menu_items?.name || "Item"}</span>
                            <span>${(item.price_at_time_of_order * item.quantity).toFixed(2)}</span>
                          </div>
                          {item.customer_notes && (
                            <span className="text-slate-500 text-xs mt-0.5 max-w-[80%] uppercase ml-5">
                              [{item.customer_notes}]
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="border-t-2 border-dashed border-slate-300 pt-4 mb-6 space-y-1.5">
                      <div className="flex justify-between text-sm opacity-70">
                        <span>Subtotal</span>
                        <span>${o.order_items.reduce((sum, item) => sum + (item.price_at_time_of_order * item.quantity), 0).toFixed(2)}</span>
                      </div>
                      {taxRate > 0 && (
                        <div className="flex justify-between text-sm opacity-70">
                          <span>Tax ({taxRate}%)</span>
                          <span>${(o.order_items.reduce((sum, item) => sum + (item.price_at_time_of_order * item.quantity), 0) * (taxRate / 100)).toFixed(2)}</span>
                        </div>
                      )}
                      {serviceCharge > 0 && (
                        <div className="flex justify-between text-sm opacity-70">
                          <span>Service Fee {serviceChargeType === 'percentage' ? `(${serviceCharge}%)` : ''}</span>
                          <span>${(serviceChargeType === "flat" ? serviceCharge : o.order_items.reduce((sum, item) => sum + (item.price_at_time_of_order * item.quantity), 0) * (serviceCharge / 100)).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xl font-black pt-2 border-t border-slate-200 mt-2">
                        <span>TOTAL</span>
                        <span>${o.total_amount.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-center text-slate-400 mt-4 uppercase">
                        {new Date(o.created_at).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-center text-xs font-bold tracking-widest">
                      THANK YOU!
                    </div>
                  </div>
                  
                  <div className="w-full h-3 bg-repeat-x rotate-180" style={{ backgroundImage: "linear-gradient(-45deg, transparent 4px, #f9f9f9 0), linear-gradient(45deg, transparent 4px, #f9f9f9 0)", backgroundSize: "8px 8px", backgroundPosition: "left bottom", marginBottom: "-3px" }} />
                  </div>
                  
                  {/* Download PNG Button */}
                  <div className="absolute top-4 right-4 z-10 print:hidden">
                    <button
                      onClick={() => handleDownloadPng(o.id, o.daily_order_number || 0)}
                      disabled={isDownloadingId === o.id}
                      className="p-2.5 bg-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white rounded-full shadow-sm transition-colors"
                      title="Save as Image (PNG)"
                    >
                      {isDownloadingId === o.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
