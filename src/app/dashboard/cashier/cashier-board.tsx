"use client";

import { useState, useEffect } from "react";
import { formatOrderNumber } from "@/lib/utils";
import { createBrowserClient } from "@supabase/ssr";
import { formatTimeAgoWithExact } from "@/lib/date-utils";
import { Users, Receipt, CircleDollarSign, XCircle, CreditCard, CheckCircle2 } from "lucide-react";
import { settleTableTab, voidTableTab } from "@/app/dashboard/cashier/actions";

type OrderItem = {
  id: string;
  quantity: number;
  customer_notes: string | null;
  menu_items: {
    name: string;
    price: number;
  } | null;
};

type Order = {
  id: string;
  restaurant_id: string;
  table_number: string | null;
  customer_name: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  daily_order_number?: number | null;
  payment_intent_id?: string | null;
  is_paid?: boolean;
  party_size?: number | null;
  order_items?: OrderItem[];
};

type TableTab = {
  table_number: string;
  orders: Order[];
  total_amount: number;
  customer_names: string[];
  party_size: number;
  created_at: string;
  paid_at?: string | null;
};

export function CashierBoard({ initialOrders, restaurantId, timezone, supabaseUrl, supabaseAnonKey, currencySymbol = "$" }: { initialOrders: Order[], restaurantId: string, timezone: string, supabaseUrl: string, supabaseAnonKey: string, currencySymbol?: string }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null); // table_number
  
  // Pagination state
  const [activePage, setActivePage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchLatestOrders = async () => {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Fetch active orders
    const { data: activeData } = await supabase
      .from("orders")
      .select(`*, order_items (id, quantity, customer_notes, menu_items (name, price))`)
      .eq("restaurant_id", restaurantId)
      .is("customer_phone", null)
      .eq("is_paid", false)
      .not("status", "in", '("cancelled","cancelled_by_customer","cancelled_by_restaurant","awaiting_payment")')
      .order("created_at", { ascending: true });
      
    if (activeData) setOrders(activeData as unknown as Order[]);
    
    // Fetch history (paid or cancelled today)
    const { data: historyData } = await supabase
      .from("orders")
      .select(`*, order_items (id, quantity, customer_notes, menu_items (name, price))`)
      .eq("restaurant_id", restaurantId)
      .is("customer_phone", null)
      .or(`paid_at.gte.${today.toISOString()},and(status.in.(cancelled,cancelled_by_customer,cancelled_by_restaurant),created_at.gte.${today.toISOString()})`)
      .order("created_at", { ascending: false });
      
    if (historyData) setHistoryOrders(historyData as unknown as Order[]);
  };

  // Polling Auto-Refresh Fallback (runs every 15 seconds)
  useEffect(() => {
    const interval = setInterval(fetchLatestOrders, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId, timezone, supabaseUrl, supabaseAnonKey]);

  // WebSockets Realtime
  useEffect(() => {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    const channel = supabase.channel(`cashier-${restaurantId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurantId}` },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            if (payload.new.customer_phone !== null) return; // Only track Dine-In
            if (payload.new.is_paid) return; // Only care about unpaid
            if (payload.new.status === 'awaiting_payment') return; // Hide unconfirmed checkouts
            
            // Give the backend 1.5s to finish inserting the order_items before we fetch the full order
            setTimeout(async () => {
              const { data: newOrder } = await supabase
                .from("orders")
                .select(`*, order_items (id, quantity, customer_notes, menu_items (name, price))`)
                .eq("id", payload.new.id)
                .single();
              
              if (newOrder && !newOrder.is_paid) {
                setOrders(prev => {
                  if (prev.some(o => o.id === newOrder.id)) return prev;
                  return [...prev, newOrder as Order];
                });
              }
            }, 1500);
          } else if (payload.eventType === "UPDATE") {
            if (payload.new.customer_phone !== null) return;
            
            if (payload.new.is_paid || ["cancelled", "cancelled_by_customer", "cancelled_by_restaurant", "awaiting_payment"].includes(payload.new.status)) {
              // Remove it from the board if it gets paid, cancelled, or hasn't finished checking out
              setOrders(prev => prev.filter(o => o.id !== payload.new.id));
            } else {
              setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o));
            }
          }
        }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [restaurantId, supabaseUrl, supabaseAnonKey]);

  // Helper to group orders into Table Tabs
  const groupOrdersToTabs = (ordersToGroup: Order[]) => {
    const tabs: TableTab[] = [];
    const grouped = ordersToGroup.reduce((acc, order) => {
      const table = order.table_number || "Unknown";
      const customer = order.customer_name || "Anonymous";
      const key = `${table}::${customer}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(order);
      return acc;
    }, {} as Record<string, Order[]>);

    for (const [key, tableOrders] of Object.entries(grouped)) {
      const [table_number, customer_name] = key.split("::");
      const total_amount = tableOrders
        .filter(o => !["cancelled", "cancelled_by_customer", "cancelled_by_restaurant"].includes(o.status?.toLowerCase()))
        .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
      const party_size = Math.max(...tableOrders.map(o => o.party_size || 0));
      const created_at = tableOrders.reduce((oldest, o) => !oldest || new Date(o.created_at) < new Date(oldest) ? o.created_at : oldest, tableOrders[0]?.created_at || new Date().toISOString());
      // For history tabs, we want the most recent paid_at
      const paid_at = tableOrders.reduce((newest, o) => (o as Order & { paid_at?: string | null }).paid_at && (!newest || new Date((o as Order & { paid_at?: string | null }).paid_at!) > new Date(newest)) ? (o as Order & { paid_at?: string | null }).paid_at! : newest, null as string | null);
      
      tabs.push({
        table_number,
        orders: tableOrders,
        total_amount,
        customer_names: [customer_name],
        party_size,
        created_at,
        paid_at: paid_at || undefined // Attach paid_at if it exists
      } as TableTab & { paid_at?: string });
    }

    tabs.sort((a, b) => {
      const aNum = parseInt(a.table_number);
      const bNum = parseInt(b.table_number);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        if (aNum !== bNum) return aNum - bNum;
      } else if (a.table_number !== b.table_number) {
        return a.table_number.localeCompare(b.table_number);
      }
      return a.customer_names[0].localeCompare(b.customer_names[0]);
    });
    
    return tabs;
  };

  const tableTabs = groupOrdersToTabs(orders);
  
  // Helper to strip out zone like "Main Dining - Table 1" -> "Table 1"
  const formatTable = (raw: string) => raw;
  
  // History tabs are sorted by paid_at descending
  const historyTabs = groupOrdersToTabs(historyOrders).sort((a, b) => {
    return new Date((b as TableTab & { paid_at?: string | null }).paid_at || b.created_at).getTime() - new Date((a as TableTab & { paid_at?: string | null }).paid_at || a.created_at).getTime();
  });

  const [confirmSettle, setConfirmSettle] = useState<string | null>(null);
  const [confirmVoid, setConfirmVoid] = useState<string | null>(null);

  const handleSettleTab = async (table_number: string, customer_name: string) => {
    if (isProcessing) return;
    const processKey = `${table_number}::${customer_name}`;
    
    if (confirmSettle !== processKey) {
      setConfirmSettle(processKey);
      setConfirmVoid(null);
      setTimeout(() => setConfirmSettle(null), 3000); // revert after 3s
      return;
    }
    
    setIsProcessing(processKey);
    setConfirmSettle(null);
    
    try {
      await settleTableTab(restaurantId, table_number, customer_name);
      const settled = orders.filter(o => o.table_number === table_number && (o.customer_name || "Anonymous") === customer_name);
      setOrders(prev => prev.filter(o => !(o.table_number === table_number && (o.customer_name || "Anonymous") === customer_name)));
      setHistoryOrders(prev => [...settled.map(o => ({...o, is_paid: true, paid_at: new Date().toISOString()} as Order & { paid_at?: string | null })), ...prev]);
    } catch (e) {
      console.error(e);
      alert("Failed to settle tab");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleVoidTab = async (table_number: string, customer_name: string) => {
    if (isProcessing) return;
    const processKey = `${table_number}::${customer_name}`;

    if (confirmVoid !== processKey) {
      setConfirmVoid(processKey);
      setConfirmSettle(null);
      setTimeout(() => setConfirmVoid(null), 3000); // revert after 3s
      return;
    }
    
    setIsProcessing(processKey);
    setConfirmVoid(null);

    try {
      await voidTableTab(restaurantId, table_number, customer_name);
      const voided = orders.filter(o => o.table_number === table_number && (o.customer_name || "Anonymous") === customer_name);
      setOrders(prev => prev.filter(o => !(o.table_number === table_number && (o.customer_name || "Anonymous") === customer_name)));
      setHistoryOrders(prev => [...voided.map(o => ({...o, status: "cancelled", paid_at: new Date().toISOString()} as Order & { paid_at?: string | null })), ...prev]);
    } catch (e) {
      console.error(e);
      alert("Failed to void tab");
    } finally {
      setIsProcessing(null);
    }
  };

  if (!mounted) return <div className="animate-pulse flex gap-6"><div className="w-96 h-96 bg-slate-100 rounded-2xl" /></div>;

  if (tableTabs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Receipt className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Open Tabs</h3>
        <p className="text-slate-500 mt-2 max-w-sm">All tables have settled their bills. Unpaid dine-in orders will appear here automatically.</p>
      </div>
    );
  }

  const actionableTabs = tableTabs.filter(t => t.total_amount > 0);
  const emptyTabs = tableTabs.filter(t => t.total_amount === 0);

  return (
    <div className="flex flex-col gap-16 pb-12">
      {/* Actionable Tabs (Orders with Money) */}
      {actionableTabs.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <Receipt className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Tabs to Settle</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
            {actionableTabs.map(tab => (
              <div key={`${tab.table_number}-${tab.customer_names[0]}`} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col border border-slate-200/60 hover:-translate-y-1 transition-transform duration-300">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 flex items-start justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Table</div>
                    <div className={`font-black tracking-tight leading-[1.1] pr-2 ${formatTable(tab.table_number).length > 12 ? 'text-2xl mt-1' : 'text-4xl'}`}>
                      {formatTable(tab.table_number)}
                    </div>
                  </div>
                  <div className="text-right relative z-10">
                    <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Total Due</div>
                    <div className="text-3xl font-black text-emerald-400 tracking-tight">{currencySymbol}{tab.total_amount.toFixed(2)}</div>
                  </div>
                </div>
                
                {/* Customers Summary */}
                <div className="px-6 py-4 bg-slate-50/80 border-b border-dashed border-slate-300 flex items-center gap-3 text-sm text-slate-700 font-bold overflow-hidden whitespace-nowrap text-ellipsis">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  {tab.customer_names[0] !== "Anonymous" ? tab.customer_names[0] : "Walk-in Customer"}
                </div>

                {/* Receipt Body */}
                <div className="p-6 flex-1 max-h-[300px] overflow-y-auto hide-scrollbar space-y-5 bg-amber-50/30">
                  {tab.orders.map(order => (
                    <div key={order.id} className="pb-5 border-b border-dashed border-slate-200 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Order #{formatOrderNumber(order.table_number, order.daily_order_number)}</div>
                      </div>
                      
                      <div className="space-y-3">
                        {order.order_items?.map(item => (
                          <div key={item.id} className="flex justify-between items-start text-sm">
                            <div className="flex gap-3">
                              <span className="font-bold text-slate-400 w-4">{item.quantity}x</span>
                              <span className="text-slate-700 font-medium">{item.menu_items?.name}</span>
                            </div>
                            <span className="font-semibold text-slate-900 tabular-nums">
                              {currencySymbol}{((item.menu_items?.price || 0) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="p-5 bg-white flex flex-col gap-3 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] relative z-10">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleSettleTab(tab.table_number, tab.customer_names[0])}
                      disabled={isProcessing === `${tab.table_number}::${tab.customer_names[0]}`}
                      className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-white shadow-lg ${confirmSettle === `${tab.table_number}::${tab.customer_names[0]}` ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-orange-500/25" : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-emerald-500/25 hover:scale-[1.02]"}`}
                    >
                      {confirmSettle === `${tab.table_number}::${tab.customer_names[0]}` ? (
                        <>Sure? Click to Settle</>
                      ) : (
                        <><CircleDollarSign className="w-5 h-5" /> Settle Tab</>
                      )}
                    </button>
                    <button 
                      onClick={() => handleVoidTab(tab.table_number, tab.customer_names[0])}
                      disabled={isProcessing === `${tab.table_number}::${tab.customer_names[0]}`}
                      className={`w-14 rounded-2xl font-bold flex items-center justify-center transition-all disabled:opacity-50 ${confirmVoid === `${tab.table_number}::${tab.customer_names[0]}` ? "bg-red-500 text-white shadow-lg shadow-red-500/25" : "bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500"}`}
                      title="Void unpaid tab"
                    >
                      {confirmVoid === `${tab.table_number}::${tab.customer_names[0]}` ? <XCircle className="w-6 h-6 animate-pulse" /> : <XCircle className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Walk-in & History Split View */}
      {(emptyTabs.length > 0 || historyTabs.length > 0) && (
        <div className={actionableTabs.length > 0 ? "pt-12 border-t border-slate-200/60" : ""}>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
            
            {/* Left Column: Currently Seated */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">Currently Seated</h2>
                <span className="ml-auto text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-full shadow-sm">{emptyTabs.length}</span>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/20 flex flex-col min-h-[400px]">
                <div className="overflow-x-auto flex-1 p-2">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                      <tr>
                        <th className="px-6 py-4">Table</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Guests</th>
                        <th className="px-6 py-4">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {emptyTabs.slice((activePage - 1) * 15, activePage * 15).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-medium">No tables currently seated.</td>
                        </tr>
                      ) : (
                        emptyTabs.slice((activePage - 1) * 15, activePage * 15).map(tab => {
                          const elapsedMins = Math.floor((new Date().getTime() - new Date(tab.created_at).getTime()) / 60000);
                          return (
                            <tr key={`${tab.table_number}-${tab.customer_names[0]}`} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="font-black text-slate-900 text-lg">{formatTable(tab.table_number)}</div>
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-600 truncate max-w-[120px]" title={tab.customer_names[0] !== "Anonymous" ? tab.customer_names[0] : "Walk-in"}>
                                {tab.customer_names[0] !== "Anonymous" ? tab.customer_names[0] : "Walk-in"}
                              </td>
                              <td className="px-6 py-4">
                                {tab.party_size > 0 ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{tab.party_size}</span>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${elapsedMins > 60 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                  {elapsedMins}m
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Active */}
                {emptyTabs.length > 15 && (
                  <div className="bg-slate-50/50 border-t border-slate-100 p-4 flex justify-between items-center text-sm font-bold">
                    <button 
                      disabled={activePage === 1} 
                      onClick={() => setActivePage(p => p - 1)}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 shadow-sm transition-all"
                    >
                      Prev
                    </button>
                    <span className="text-slate-400">Page {activePage} of {Math.ceil(emptyTabs.length / 15)}</span>
                    <button 
                      disabled={activePage >= Math.ceil(emptyTabs.length / 15)} 
                      onClick={() => setActivePage(p => p + 1)}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 shadow-sm transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: History (Cleared) */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">Cleared Today</h2>
                <span className="ml-auto text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full">{historyTabs.length}</span>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/10 flex flex-col min-h-[400px]">
                <div className="overflow-x-auto flex-1 p-2">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                      <tr>
                        <th className="px-6 py-4">Table</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {historyTabs.slice((historyPage - 1) * 15, historyPage * 15).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-medium">No cleared tables yet today.</td>
                        </tr>
                      ) : (
                        historyTabs.slice((historyPage - 1) * 15, historyPage * 15).map(tab => {
                          const isCancelled = tab.orders.some(o => ["cancelled", "cancelled_by_customer", "cancelled_by_restaurant"].includes(o.status?.toLowerCase() || ""));
                          return (
                            <tr key={`${tab.table_number}-${tab.customer_names[0]}-${tab.created_at}`} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4 font-black text-slate-900 text-lg">{formatTable(tab.table_number)}</td>
                              <td className="px-6 py-4 font-bold text-slate-600 truncate max-w-[120px]" title={tab.customer_names[0] !== "Anonymous" ? tab.customer_names[0] : "Walk-in"}>
                                {tab.customer_names[0] !== "Anonymous" ? tab.customer_names[0] : "Walk-in"}
                              </td>
                              <td className="px-6 py-4">
                                {isCancelled ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600">Voided</span>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">Paid</span>
                                )}
                              </td>
                              <td className="px-6 py-4 font-black text-slate-900">
                                {currencySymbol}{tab.total_amount.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination History */}
                {historyTabs.length > 15 && (
                  <div className="bg-slate-50/50 border-t border-slate-100 p-4 flex justify-between items-center text-sm font-bold">
                    <button 
                      disabled={historyPage === 1} 
                      onClick={() => setHistoryPage(p => p - 1)}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 shadow-sm transition-all"
                    >
                      Prev
                    </button>
                    <span className="text-slate-400">Page {historyPage} of {Math.ceil(historyTabs.length / 15)}</span>
                    <button 
                      disabled={historyPage >= Math.ceil(historyTabs.length / 15)} 
                      onClick={() => setHistoryPage(p => p + 1)}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 shadow-sm transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
