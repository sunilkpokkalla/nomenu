"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Receipt, X, ChefHat, CheckCircle2, Clock } from "lucide-react";

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
  created_at: string;
  order_items: OrderItem[];
}

export function ReceiptTracker({ restaurantId }: { restaurantId: string }) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    // Check local storage for an existing order on mount
    const savedOrderId = localStorage.getItem("nomenu_last_order");
    if (savedOrderId) {
      setOrderId(savedOrderId);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      fetchOrder(savedOrderId);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!orderId) return;

    // Subscribe to real-time status updates
    const channel = supabase
      .channel(`order_updates_${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder((prev) => prev ? { ...prev, status: payload.new.status } : null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, supabase]);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        total_amount,
        daily_order_number,
        table_number,
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
      .eq("id", id)
      .single();

    if (error) {
      console.error("Failed to fetch order:", error);
      // If we can't fetch it, maybe it was deleted or invalid, clear it
      localStorage.removeItem("nomenu_last_order");
      setOrderId(null);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setOrder(data as any);
    }
    setLoading(false);
  };

  if (!orderId || loading) return null;
  if (!order) return null;

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
              {order.status !== "completed" && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              )}
              {order.status !== "completed" && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </div>
          </button>
        </div>
      )}

      {/* Receipt Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-sm mx-auto shadow-2xl bg-[#f9f9f9] text-[#111] font-mono flex flex-col animate-in slide-in-from-bottom-10" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))" }}>
            
            {/* Zig-zag top border for thermal receipt look */}
            <div className="w-full h-3 bg-repeat-x" style={{ backgroundImage: "linear-gradient(-45deg, transparent 4px, #f9f9f9 0), linear-gradient(45deg, transparent 4px, #f9f9f9 0)", backgroundSize: "8px 8px", backgroundPosition: "left top", marginTop: "-3px" }} />
            
            <div className="p-6 pt-4 pb-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="font-bold text-xl uppercase tracking-widest flex items-center gap-2">
                  <Receipt className="w-5 h-5" /> RECEIPT
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-black">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="text-sm uppercase tracking-widest text-slate-500 mb-1">Order Number</div>
                <div className="text-5xl font-black">{String(order.daily_order_number || order.id.slice(0,4)).padStart(3, '0')}</div>
                {order.table_number && (
                  <div className="mt-2 text-lg border-2 border-black rounded inline-block px-3 py-1 font-bold">
                    TABLE {order.table_number}
                  </div>
                )}
              </div>

              <div className="flex justify-center mb-6 py-3 border-y-2 border-dashed border-slate-300 font-bold text-lg">
                {getStatusDisplay(order.status)}
              </div>

              <div className="space-y-4 mb-6 text-sm">
                {order.order_items.map((item) => (
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

              <div className="border-t-2 border-dashed border-slate-300 pt-4 mb-6">
                <div className="flex justify-between text-xl font-black">
                  <span>TOTAL</span>
                  <span>${order.total_amount.toFixed(2)}</span>
                </div>
                <div className="text-xs text-center text-slate-400 mt-4 uppercase">
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
              
              <div className="text-center text-xs font-bold tracking-widest">
                THANK YOU!
              </div>
            </div>

            {/* Zig-zag bottom border */}
            <div className="w-full h-3 bg-repeat-x rotate-180" style={{ backgroundImage: "linear-gradient(-45deg, transparent 4px, #f9f9f9 0), linear-gradient(45deg, transparent 4px, #f9f9f9 0)", backgroundSize: "8px 8px", backgroundPosition: "left bottom", marginBottom: "-3px" }} />
          </div>
        </div>
      )}
    </>
  );
}
