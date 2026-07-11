"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Receipt, History, User, Search, DollarSign, Users, ChevronDown, ChevronUp } from "lucide-react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";

type CompletedOrder = {
  id: string;
  table_number: string;
  customer_name: string | null;
  status: string;
  is_paid: boolean;
  total_amount: number;
  created_at: string;
  paid_at: string | null;
};

type GroupedTab = {
  key: string;
  table_number: string;
  customer_name: string;
  total_amount: number;
  last_activity: string;
  order_count: number;
  status: string;
  orders: CompletedOrder[];
};

export function CompletedBoard({ restaurantId, timezone, supabaseUrl, supabaseAnonKey, currencySymbol }: { restaurantId: string; timezone: string; supabaseUrl: string; supabaseAnonKey: string; currencySymbol: string }) {
  const formatTable = (raw: string) => raw.includes(" - ") ? raw.split(" - ")[1] : raw;
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("today"); // today, last_hour, all
  const [expandedTabId, setExpandedTabId] = useState<string | null>(null);

  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    fetchCompletedHistory();

    const channel = supabase.channel(`history_${restaurantId}`)
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurantId}` }, 
          (payload) => {
             // Refresh on any relevant change to keep history updated
             fetchCompletedHistory();
          }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId, supabaseUrl, supabaseAnonKey]);

  const fetchCompletedHistory = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("orders")
        .select("id, table_number, customer_name, status, is_paid, total_amount, created_at")
        .eq("restaurant_id", restaurantId)
        .is("customer_phone", null) // Dine-in only
        .or('is_paid.eq.true,status.eq.cancelled')
        .gte("created_at", today.toISOString()) // default fetch today to keep payload small
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCompletedOrders(data as CompletedOrder[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndGroupedTabs = useMemo(() => {
    // 1. Filter by time
    let filteredOrders = completedOrders;
    const now = new Date();
    
    if (timeFilter === "last_hour") {
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      filteredOrders = filteredOrders.filter(o => {
        const time = new Date((o as CompletedOrder & { paid_at?: string | null }).paid_at || o.created_at);
        return time >= oneHourAgo;
      });
    }

    // 2. Group by table + customer
    const groups = new Map<string, GroupedTab>();

    for (const order of filteredOrders) {
      if (order.status === 'cancelled' && (!order.total_amount || Number(order.total_amount) === 0)) {
        continue;
      }

      const cName = order.customer_name || "Anonymous";
      const key = `${order.table_number}::${cName}`;
      
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          table_number: order.table_number,
          customer_name: cName,
          total_amount: 0,
          last_activity: (order as CompletedOrder & { paid_at?: string | null }).paid_at || order.created_at,
          order_count: 0,
          status: order.is_paid ? 'Paid' : 'Cancelled',
          orders: []
        });
      }
      
      const group = groups.get(key)!;
      group.orders.push(order);
      if (order.status?.toLowerCase() !== 'cancelled') {
        group.total_amount += Number(order.total_amount);
      }
      group.order_count += 1;
      
      // Update last activity to the most recent timestamp
      const orderTime = new Date((order as CompletedOrder & { paid_at?: string | null }).paid_at || order.created_at).getTime();
      const groupTime = new Date(group.last_activity).getTime();
      if (orderTime > groupTime) {
        group.last_activity = (order as CompletedOrder & { paid_at?: string | null }).paid_at || order.created_at;
      }
      
      // If any order in the group is paid, mark the whole group as paid
      if (order.is_paid) {
        group.status = 'Paid';
      }
    }

    // 3. Convert to array and filter by search query
    let result = Array.from(groups.values());
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g => 
        g.customer_name.toLowerCase().includes(q) || 
        g.table_number.toLowerCase().includes(q)
      );
    }
    
    // 4. Sort by most recently active
    return result.sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime());

  }, [completedOrders, searchQuery, timeFilter]);

  const totalRevenue = useMemo(() => {
    return filteredAndGroupedTabs
      .filter(t => t.status === 'Paid')
      .reduce((sum, tab) => sum + tab.total_amount, 0);
  }, [filteredAndGroupedTabs]);

  if (loading) return <div className="animate-pulse flex gap-6"><div className="w-96 h-96 bg-slate-100 rounded-2xl" /></div>;

  return (
    <div className="flex flex-col gap-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-8 flex items-center justify-between shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Revenue</p>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{currencySymbol}{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center relative z-10 border border-emerald-100/50 shadow-inner">
            <DollarSign className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-8 flex items-center justify-between shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Settled Tabs</p>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{filteredAndGroupedTabs.length}</p>
          </div>
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center relative z-10 border border-blue-100/50 shadow-inner">
            <History className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-[2rem] shadow-xl shadow-slate-200/20">
        <div className="relative w-full md:w-[400px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3.5 border-none rounded-2xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-slate-100 focus:ring-0 sm:text-sm font-medium transition-colors"
            placeholder="Search by table or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar bg-slate-50 p-1.5 rounded-2xl">
          <button 
            onClick={() => setTimeFilter("last_hour")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${timeFilter === "last_hour" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            Last Hour
          </button>
          <button 
            onClick={() => setTimeFilter("today")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${timeFilter === "today" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            Today
          </button>
        </div>
      </div>

      {filteredAndGroupedTabs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-32 bg-white rounded-[3rem] shadow-xl shadow-slate-200/20">
          <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
            <Receipt className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">No History Found</h3>
          <p className="text-slate-500 mt-2 max-w-sm font-medium">No settled or cancelled tabs match your current filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/20 overflow-hidden pt-4 pb-2">
          <div className="overflow-x-auto px-4">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Table / Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Items</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndGroupedTabs.map((tab) => (
                  <React.Fragment key={tab.key}>
                    <tr 
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => setExpandedTabId(expandedTabId === tab.key ? null : tab.key)}
                    >
                      <td className="px-6 py-5 rounded-l-2xl group-hover:bg-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="min-w-[3rem] px-3 h-12 shrink-0 rounded-[1rem] bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-sm whitespace-nowrap text-center">
                            {formatTable(tab.table_number)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{tab.customer_name}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grouped Tab</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 group-hover:bg-slate-50">
                        {tab.status === 'Paid' ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-600">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600">
                            Voided
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 group-hover:bg-slate-50">
                        <span className="font-black text-slate-900 text-lg tabular-nums tracking-tight">
                          {currencySymbol}{tab.total_amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-5 group-hover:bg-slate-50">
                        <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                          {tab.order_count} {tab.order_count === 1 ? 'Order' : 'Orders'}
                        </span>
                      </td>
                      <td className="px-6 py-5 rounded-r-2xl group-hover:bg-slate-50 text-sm font-medium text-slate-500">
                        <div className="flex items-center justify-between">
                          <span>{formatTimeAgoWithExact(tab.last_activity, timezone)}</span>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${expandedTabId === tab.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'}`}>
                            {expandedTabId === tab.key ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    {expandedTabId === tab.key && (
                      <tr>
                        <td colSpan={5} className="px-6 py-2">
                          <div className="pl-16 pr-4 pb-6">
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 shadow-inner">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Orders in this Tab</h4>
                              <div className="space-y-3">
                                {tab.orders.map(order => (
                                  <div key={order.id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-4">
                                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md uppercase">
                                        #{order.id.slice(0, 8)}
                                      </span>
                                      <span className="text-sm font-bold text-slate-700">
                                        {formatTimeAgoWithExact(order.created_at, timezone)}
                                      </span>
                                    </div>
                                    <div className="font-black text-slate-900 tracking-tight tabular-nums">
                                      {currencySymbol}{Number(order.total_amount).toFixed(2)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
