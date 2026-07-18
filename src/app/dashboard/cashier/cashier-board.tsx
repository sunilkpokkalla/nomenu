"use client";

import { useState, useEffect } from "react";
import { formatOrderNumber } from "@/lib/utils";
import { createBrowserClient } from "@supabase/ssr";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { formatTimeAgoWithExact } from "@/lib/date-utils";
import { Users, Receipt, CircleDollarSign, XCircle, CreditCard, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { settleTableTab, voidTableTab, clearTableTab } from "@/app/dashboard/cashier/actions";

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

export function CashierBoard({ initialOrders, restaurantId, restaurantCreatedAt, timezone, supabaseUrl, supabaseAnonKey, currencySymbol = "$" }: { initialOrders: Order[], restaurantId: string, restaurantCreatedAt?: string | null, timezone: string, supabaseUrl: string, supabaseAnonKey: string, currencySymbol?: string }) {
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
    const tz = timezone || "UTC";
    const nowUtc = new Date();
    const nowZoned = toZonedTime(nowUtc, tz);
    const startOfTodayZoned = new Date(nowZoned);
    startOfTodayZoned.setHours(0, 0, 0, 0);
    const startOfTodayUtc = fromZonedTime(startOfTodayZoned, tz);
    
    // Fetch active orders
    const { data: activeData } = await supabase
      .from("orders")
      .select(`*, order_items (id, quantity, customer_notes, menu_items (name, price))`)
      .eq("restaurant_id", restaurantId)
      .is("customer_phone", null)
      .eq("is_paid", false) // Exclude paid orders from active tabs
      .not("status", "in", '("cancelled","cancelled_by_customer","cancelled_by_restaurant","awaiting_payment","cleared")')
      .order("created_at", { ascending: true });
      
    if (activeData) setOrders(activeData as unknown as Order[]);
    
    // Fetch history (paid or cancelled today)
    const { data: historyData } = await supabase
      .from("orders")
      .select(`*, order_items (id, quantity, customer_notes, menu_items (name, price))`)
      .eq("restaurant_id", restaurantId)
      .is("customer_phone", null)
      .or(`paid_at.gte.${startOfTodayUtc.toISOString()},and(status.in.(cancelled,cancelled_by_customer,cancelled_by_restaurant),created_at.gte.${startOfTodayUtc.toISOString()})`)
      .order("created_at", { ascending: false });
      
    if (historyData) setHistoryOrders(historyData as unknown as Order[]);
  };

  // Polling Auto-Refresh Fallback (runs every 15 seconds)
  useEffect(() => {
    const interval = setInterval(fetchLatestOrders, 300000);
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
              
              if (newOrder) {
                setOrders(prev => {
                  if (prev.some(o => o.id === newOrder.id)) return prev;
                  return [...prev, newOrder as Order];
                });
              }
            }, 1500);
          } else if (payload.eventType === "UPDATE") {
            if (payload.new.customer_phone !== null) return;
            
            if (["cancelled", "cancelled_by_customer", "cancelled_by_restaurant", "awaiting_payment", "cleared"].includes(payload.new.status)) {
              // Remove it from the board if it gets cancelled, cleared, or hasn't finished checking out
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
  const [confirmClear, setConfirmClear] = useState<string | null>(null);

  const handleClearTab = async (table_number: string, customer_name: string) => {
    if (isProcessing) return;
    const processKey = `${table_number}::${customer_name}`;
    
    if (confirmClear !== processKey) {
      setConfirmClear(processKey);
      setConfirmSettle(null);
      setConfirmVoid(null);
      setTimeout(() => setConfirmClear(null), 3000); // revert after 3s
      return;
    }
    
    setIsProcessing(processKey);
    setConfirmClear(null);
    
    try {
      await clearTableTab(restaurantId, table_number, customer_name);
      // Remove it from active board locally
      setOrders(prev => prev.filter(o => !(o.table_number === table_number && (o.customer_name || "Anonymous") === customer_name)));
    } catch (e) {
      console.error(e);
      alert("Failed to clear table");
    } finally {
      setIsProcessing(null);
    }
  };

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

  const actionableTabs = tableTabs.filter(t => t.total_amount > 0);
  const emptyTabs = tableTabs.filter(t => t.total_amount === 0);

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

  return (
    <div className="space-y-8 pb-24">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-inner">
            <Receipt className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Active Tabs</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
          {actionableTabs.map(tab => (
              <div key={`${tab.table_number}-${tab.customer_names[0]}`} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col border border-slate-200/60 hover:-translate-y-1 transition-transform duration-300">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 flex items-start justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <div className="relative z-10 flex-1 pr-4">
                    <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Table</div>
                    <div className={`font-black tracking-tight leading-[1.2] ${tab.table_number.length > 18 ? 'text-lg' : tab.table_number.length > 10 ? 'text-xl' : 'text-3xl'}`}>{formatTable(tab.table_number)}</div>
                  </div>
                  <div className="text-right relative z-10 shrink-0">
                    <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Total Due</div>
                    <div className="text-3xl font-black text-emerald-400">{currencySymbol}{tab.total_amount.toFixed(2)}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col bg-slate-50/50">
                  <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-slate-700 truncate">{tab.customer_names[0] !== "Anonymous" ? tab.customer_names[0] : "Walk-in Customer"}</div>
                  </div>

                  <div className="flex-1 space-y-4">
                    {/* Order Items Summary */}
                    {tab.orders.map((o) => (
                      <div key={o.id} className="text-sm">
                        <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Order #{formatOrderNumber(o.table_number, o.daily_order_number, o.created_at, o.restaurant_id, restaurantCreatedAt)}</div>
                        <div className="space-y-1.5 border-l-2 border-indigo-100 pl-3 py-1">
                          {o.order_items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-slate-600 font-medium">
                              <span className="truncate pr-2">{item.quantity}x {item.menu_items?.name}</span>
                              <span className="shrink-0">{currencySymbol}{((item.menu_items?.price || 0) * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-slate-200/60 flex gap-3">
                    {tab.orders.every(o => o.is_paid) ? (
                      <button 
                        onClick={() => handleClearTab(tab.table_number, tab.customer_names[0])}
                        disabled={isProcessing === `${tab.table_number}::${tab.customer_names[0]}`}
                        className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-90 text-white shadow-lg ${confirmClear === `${tab.table_number}::${tab.customer_names[0]}` ? "bg-slate-900 hover:bg-slate-800 shadow-slate-900/25 scale-[0.98]" : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-blue-500/25 hover:scale-[1.02]"}`}
                      >
                        {isProcessing === `${tab.table_number}::${tab.customer_names[0]}` && confirmClear === `${tab.table_number}::${tab.customer_names[0]}` ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Clearing...</>
                        ) : confirmClear === `${tab.table_number}::${tab.customer_names[0]}` ? (
                          <><CheckCircle2 className="w-5 h-5 animate-pulse text-blue-200" /> Confirm Clear</>
                        ) : (
                          <><CheckCircle2 className="w-5 h-5" /> Clear Table</>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleSettleTab(tab.table_number, tab.customer_names[0])}
                        disabled={isProcessing === `${tab.table_number}::${tab.customer_names[0]}`}
                        className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-90 text-white shadow-lg ${confirmSettle === `${tab.table_number}::${tab.customer_names[0]}` ? "bg-slate-900 hover:bg-slate-800 shadow-slate-900/25 scale-[0.98]" : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-emerald-500/25 hover:scale-[1.02]"}`}
                      >
                        {isProcessing === `${tab.table_number}::${tab.customer_names[0]}` && confirmSettle === `${tab.table_number}::${tab.customer_names[0]}` ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Settling...</>
                        ) : confirmSettle === `${tab.table_number}::${tab.customer_names[0]}` ? (
                          <><CheckCircle2 className="w-5 h-5 animate-pulse text-emerald-400" /> Confirm Payment</>
                        ) : (
                          <><CircleDollarSign className="w-5 h-5" /> Settle Tab</>
                        )}
                      </button>
                    )}
                    <button 
                      onClick={() => handleVoidTab(tab.table_number, tab.customer_names[0])}
                      disabled={isProcessing === `${tab.table_number}::${tab.customer_names[0]}`}
                      className={`w-14 rounded-2xl font-bold flex items-center justify-center transition-all disabled:opacity-50 ${confirmVoid === `${tab.table_number}::${tab.customer_names[0]}` ? "bg-rose-600 text-white shadow-lg shadow-rose-600/25 scale-[0.98]" : "bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500"}`}
                      title="Void unpaid tab"
                    >
                      {isProcessing === `${tab.table_number}::${tab.customer_names[0]}` && confirmVoid === `${tab.table_number}::${tab.customer_names[0]}` ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : confirmVoid === `${tab.table_number}::${tab.customer_names[0]}` ? (
                        <Trash2 className="w-5 h-5 animate-pulse" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {emptyTabs.length > 0 && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">Currently Seated (Waiting to Order)</h2>
              <span className="ml-auto text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-full shadow-sm">{emptyTabs.length}</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {emptyTabs.map(tab => {
                const elapsedMins = Math.floor((new Date().getTime() - new Date(tab.created_at).getTime()) / 60000);
                return (
                  <div key={`${tab.table_number}-${tab.customer_names[0]}`} className="bg-white border border-slate-200/60 rounded-2xl p-4 flex flex-col shadow-sm relative group">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Table</div>
                      <button
                        onClick={() => handleVoidTab(tab.table_number, tab.customer_names[0])}
                        disabled={!!isProcessing}
                        className={`${confirmVoid === `${tab.table_number}::${tab.customer_names[0]}` ? 'text-red-600 bg-red-50' : 'text-slate-400 hover:text-red-500 hover:bg-slate-50'} rounded-full p-1 -mt-1 -mr-1 transition-colors`}
                        title="Remove Table"
                      >
                        {confirmVoid === `${tab.table_number}::${tab.customer_names[0]}` ? (
                          <span className="text-[10px] font-bold px-1">Confirm</span>
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="font-black text-slate-900 text-lg truncate mb-3">{formatTable(tab.table_number)}</div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 truncate max-w-[80px]" title={tab.customer_names[0] !== "Anonymous" ? tab.customer_names[0] : "Walk-in"}>
                        <Users className="w-3.5 h-3.5" />
                        <span className="truncate">{tab.customer_names[0] !== "Anonymous" ? tab.customer_names[0] : "Walk-in"}</span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${elapsedMins > 60 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {elapsedMins}m
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
  );
}
