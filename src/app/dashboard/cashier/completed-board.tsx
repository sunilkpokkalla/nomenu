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
        const time = new Date(o.paid_at || o.created_at);
        return time >= oneHourAgo;
      });
    }

    // 2. Group by table + customer
    const groups = new Map<string, GroupedTab>();

    for (const order of filteredOrders) {
      const cName = order.customer_name || "Anonymous";
      const key = `${order.table_number}::${cName}`;
      
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          table_number: order.table_number,
          customer_name: cName,
          total_amount: 0,
          last_activity: order.paid_at || order.created_at,
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
      const orderTime = new Date(order.paid_at || order.created_at).getTime();
      const groupTime = new Date(group.last_activity).getTime();
      if (orderTime > groupTime) {
        group.last_activity = order.paid_at || order.created_at;
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-3xl font-black text-slate-900">{currencySymbol}{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Settled Tabs</p>
            <p className="text-3xl font-black text-slate-900">{filteredAndGroupedTabs.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <History className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 sm:text-sm transition-colors"
            placeholder="Search by table or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setTimeFilter("last_hour")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${timeFilter === "last_hour" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            Last Hour
          </button>
          <button 
            onClick={() => setTimeFilter("today")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${timeFilter === "today" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            Today
          </button>
        </div>
      </div>

      {filteredAndGroupedTabs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Receipt className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No History Found</h3>
          <p className="text-slate-500 mt-2 max-w-sm">No settled or cancelled tabs match your current filters.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Table / Customer</th>
                  <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Items</th>
                  <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndGroupedTabs.map((tab) => (
                  <React.Fragment key={tab.key}>
                    <tr 
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setExpandedTabId(expandedTabId === tab.key ? null : tab.key)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                            {tab.table_number}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{tab.customer_name}</div>
                            <div className="text-xs text-slate-500">Grouped Tab</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {tab.status === 'Paid' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">
                        {currencySymbol}{tab.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {tab.order_count} {tab.order_count === 1 ? 'Order' : 'Orders'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        <div className="flex items-center justify-between">
                          <span>{formatTimeAgoWithExact(tab.last_activity, timezone)}</span>
                          {expandedTabId === tab.key ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedTabId === tab.key && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={5} className="px-6 py-4 border-b border-slate-100">
                          <div className="pl-14">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Orders in this Tab</h4>
                            <div className="space-y-2">
                              {tab.orders.map(order => (
                                <div key={order.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
                                  <div>
                                    <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded mr-3">
                                      #{order.id.slice(0, 8)}
                                    </span>
                                    <span className="text-sm font-medium text-slate-700">
                                      {formatTimeAgoWithExact(order.created_at, timezone)}
                                    </span>
                                  </div>
                                  <div className="font-bold text-slate-900">
                                    {currencySymbol}{Number(order.total_amount).toFixed(2)}
                                  </div>
                                </div>
                              ))}
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
