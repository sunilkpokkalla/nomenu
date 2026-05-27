"use client";

import { useState, useEffect } from "react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";
import { format, isToday } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { createClient } from "@/lib/supabase/client";
import { Clock, CheckCircle2, ChefHat, User, MapPin, XCircle, Calendar as CalendarIcon, ChevronDown, ChevronUp, X } from "lucide-react";
import { updateOrderStatus } from "./actions";

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
  daily_order_number?: number;
  order_items?: OrderItem[];
};

export function OrdersBoard({ initialOrders, restaurantId, timezone }: { initialOrders: Order[], restaurantId: string, timezone: string }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Fetch orders for a specific date when the date changes
  useEffect(() => {
    if (!selectedDateStr) {
      setOrders(initialOrders);
      return;
    }

    const fetchOrders = async () => {
      const supabase = createClient();
      
      const [y, m, d] = selectedDateStr.split("-").map(Number);
      // We want orders from start of the selected day to end of selected day in restaurant timezone
      // For simplicity, we just fetch all orders for this restaurant and filter locally since this is a demo, 
      // but ideally this would be a strict query.
      const { data } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            quantity,
            customer_notes,
            menu_items (
              name,
              price
            )
          )
        `)
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: true });
        
      if (data) {
        const selectedDate = new Date(y, m - 1, d);
        const filtered = data.filter(order => {
          const orderDate = toZonedTime(new Date(order.created_at), timezone);
          return orderDate.getFullYear() === selectedDate.getFullYear() && 
                 orderDate.getMonth() === selectedDate.getMonth() && 
                 orderDate.getDate() === selectedDate.getDate();
        });
        setOrders(filtered as unknown as Order[]);
      }
    };

    fetchOrders();
  }, [selectedDateStr, restaurantId, initialOrders, timezone]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase.channel(`orders-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to INSERT and UPDATE
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // Fetch order with items
            const { data: newOrder } = await supabase
              .from("orders")
              .select(`
                *,
                order_items (
                  id,
                  quantity,
                  customer_notes,
                  menu_items (
                    name,
                    price
                  )
                )
              `)
              .eq("id", payload.new.id)
              .single();
            
            if (newOrder) {
              // Play a sound for new order!
              try {
                const audio = new Audio('/notification.mp3'); // We'll assume a generic notification sound later, or ignore for now
                audio.play().catch(e => console.log('Audio play prevented', e));
              } catch (e) {}
              
              // Add to the end (newest orders at the bottom)
              setOrders(prev => [...prev, newOrder as Order]);
            }
          } else if (payload.eventType === "UPDATE") {
            // Just update the status or relevant fields
            setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Optimistic UI update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    // Server action
    await updateOrderStatus(orderId, newStatus);
  };

  const columns = [
    { id: "pending", title: "New Orders", icon: Clock, color: "bg-blue-50 border-blue-200 text-blue-700" },
    { id: "preparing", title: "Preparing", icon: ChefHat, color: "bg-amber-50 border-amber-200 text-amber-700" },
    { id: "completed", title: "Completed", icon: CheckCircle2, color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { id: "cancelled", title: "Cancelled", icon: XCircle, color: "bg-rose-50 border-rose-200 text-rose-700" }
  ];

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Date Filter */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-700">Live Kitchen View</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="date" 
              value={selectedDateStr || ""}
              onChange={(e) => setSelectedDateStr(e.target.value || null)}
              className="pl-9 pr-3 py-2 text-sm border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 cursor-pointer min-w-[150px]"
            />
          </div>
          {selectedDateStr && (
            <button 
              onClick={() => setSelectedDateStr(null)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              title="Clear date filter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
      {columns.map(col => {
        const colOrders = orders.filter(o => o.status === col.id);
        const Icon = col.icon;
        
        return (
          <div key={col.id} className="bg-slate-50 border rounded-2xl flex flex-col overflow-hidden shadow-sm">
            {/* Column Header */}
            <div className={`px-5 py-4 border-b flex items-center justify-between ${col.color}`}>
              <h3 className="font-bold flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {col.title}
              </h3>
              <span className="bg-white/60 px-2.5 py-0.5 rounded-full text-sm font-bold shadow-sm">
                {colOrders.length}
              </span>
            </div>

            {/* Column Body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {colOrders.length === 0 ? (
                <div className="text-center p-8 text-slate-400 italic text-sm">
                  No orders {col.id}
                </div>
              ) : (
                colOrders.map(order => {
                  const isActiveColumn = col.id === "pending" || col.id === "preparing";
                  const isToggled = expandedOrders.has(order.id);
                  const showFullCard = isActiveColumn ? !isToggled : isToggled;

                  return (
                  <div key={order.id} className="bg-white border border-slate-200 shadow-sm rounded-xl flex flex-col gap-3 overflow-hidden">
                    {/* Header: Order Number and Price */}
                    <div 
                      onClick={() => toggleExpand(order.id)}
                      className="p-3.5 flex justify-between items-start cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-col gap-1.5">
                        <span className={`text-sm font-black px-2.5 py-1 rounded-md w-fit tracking-wide shadow-sm ${
                          col.id === "cancelled" ? "bg-rose-100 text-rose-800" : 
                          col.id === "completed" ? "bg-emerald-100 text-emerald-800" :
                          "bg-indigo-100 text-indigo-900"
                        }`}>
                          #{String(order.daily_order_number).padStart(3, '0')}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="font-bold text-lg text-slate-900">
                          ${Number(order.total_amount).toFixed(2)}
                        </div>
                        <div className="text-slate-400 mt-1">
                          {showFullCard ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {showFullCard && (
                      <div className="px-3.5 pb-3.5 flex flex-col gap-4">
                        
                        {/* Items (Primary Focus) */}
                        <div className="flex flex-col gap-1.5 py-1">
                          {order.order_items?.map((item: OrderItem, idx: number) => {
                            const menuItem = Array.isArray(item.menu_items) ? item.menu_items[0] : item.menu_items;
                            return (
                              <div key={idx} className="flex flex-col text-sm text-slate-700">
                                <div className="flex justify-between items-center w-full">
                                  <div className="flex items-center gap-1.5 truncate">
                                    <span className="text-slate-400 font-medium">{idx + 1}.</span>
                                    <span className="font-medium truncate">{menuItem?.name || "Unknown Item"}</span>
                                  </div>
                                  <span className="font-bold ml-2 whitespace-nowrap text-indigo-700">x{item.quantity}</span>
                                </div>
                                {item.customer_notes && (
                                  <span className="text-[11px] text-rose-600 font-medium italic ml-4">Note: {item.customer_notes}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Customer Info (Bottom) */}
                        {(order.customer_name || order.table_number) && (
                          <div className="flex gap-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                            {order.customer_name && (
                              <div className="flex items-center gap-1.5 text-slate-600 font-semibold uppercase tracking-wide">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                {order.customer_name}
                              </div>
                            )}
                            {order.table_number && (
                              <div className="flex items-center gap-1.5 text-indigo-700 font-bold ml-auto bg-indigo-100/50 px-2 py-0.5 rounded-full">
                                <MapPin className="w-3 h-3" />
                                Table {order.table_number}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Timestamp (Very Small) */}
                        <div className="text-[10px] font-medium text-slate-400 flex items-center justify-between" suppressHydrationWarning>
                          <span>{formatTimeAgoWithExact(order.created_at, timezone)}</span>
                        </div>

                        {/* Actions */}
                        <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
                          <div className="flex gap-2 w-full">
                            {col.id === "pending" && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, "preparing"); }}
                                className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-2 rounded-lg text-sm transition-colors"
                              >
                                Start Preparing
                              </button>
                            )}
                            {col.id === "preparing" && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, "completed"); }}
                                className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold py-2 rounded-lg text-sm transition-colors"
                              >
                                Mark Completed
                              </button>
                            )}
                            {col.id === "completed" && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, "pending"); }}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 rounded-lg text-sm transition-colors"
                              >
                                Move Back
                              </button>
                            )}
                          </div>
                          
                          {/* Cancel Button */}
                          {(col.id === "pending" || col.id === "preparing") && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, "cancelled"); }}
                              className="w-full text-center text-xs text-rose-500 font-semibold hover:text-rose-700 hover:underline py-1"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )})
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
  );
}
