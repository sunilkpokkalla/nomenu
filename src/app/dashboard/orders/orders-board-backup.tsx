"use client";

import { useState, useEffect, useRef } from "react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";
import { differenceInMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { createBrowserClient } from "@supabase/ssr";
import { Clock, CheckCircle2, ChefHat, User, MapPin, XCircle, Calendar as CalendarIcon, ChevronDown, ChevronUp, X, Maximize, Minimize, AlertTriangle } from "lucide-react";
import { updateOrderStatus } from "./actions";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

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

export function OrdersBoard({ initialOrders, restaurantId, timezone, supabaseUrl, supabaseAnonKey }: { initialOrders: Order[], restaurantId: string, timezone: string, supabaseUrl: string, supabaseAnonKey: string }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [isKdsMode, setIsKdsMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedDateStr) {
      setOrders(initialOrders);
      return;
    }

    const fetchOrders = async () => {
      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
      const [y, m, d] = selectedDateStr.split("-").map(Number);
      const { data } = await supabase
        .from("orders")
        .select(`*, order_items (id, quantity, customer_notes, menu_items (name, price))`)
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
  }, [selectedDateStr, restaurantId, initialOrders, timezone, supabaseUrl, supabaseAnonKey]);

  useEffect(() => {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    const channel = supabase.channel(`orders-${restaurantId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurantId}` },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const { data: newOrder } = await supabase
              .from("orders")
              .select(`*, order_items (id, quantity, customer_notes, menu_items (name, price))`)
              .eq("id", payload.new.id)
              .single();
            
            if (newOrder) {
              try {
                const audio = new Audio('/notification.mp3');
                audio.play().catch(e => console.log('Audio play prevented', e));
              } catch (e) {}
              setOrders(prev => [...prev, newOrder as Order]);
            }
          } else if (payload.eventType === "UPDATE") {
            setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o));
          }
        }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [restaurantId, supabaseUrl, supabaseAnonKey]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) setIsKdsMode(false);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleKdsMode = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => console.error(err));
      setIsKdsMode(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setIsKdsMode(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await updateOrderStatus(orderId, newStatus);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    await handleStatusChange(draggableId, destination.droppableId);
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const columns = [
    { id: "pending", title: "New Orders", icon: Clock, 
      lightHeader: "bg-blue-50 border-blue-200 text-blue-700", darkHeader: "bg-blue-900/40 border-blue-800 text-blue-400" },
    { id: "preparing", title: "Preparing", icon: ChefHat, 
      lightHeader: "bg-amber-50 border-amber-200 text-amber-700", darkHeader: "bg-amber-900/40 border-amber-800 text-amber-400" },
    { id: "completed", title: "Completed", icon: CheckCircle2, 
      lightHeader: "bg-emerald-50 border-emerald-200 text-emerald-700", darkHeader: "bg-emerald-900/40 border-emerald-800 text-emerald-400" },
    { id: "cancelled", title: "Cancelled", icon: XCircle, 
      lightHeader: "bg-rose-50 border-rose-200 text-rose-700", darkHeader: "bg-rose-900/40 border-rose-800 text-rose-400" }
  ];

  const getUrgency = (createdAt: string, status: string) => {
    if (status === "completed" || status === "cancelled") return null;
    const mins = differenceInMinutes(currentTime, new Date(createdAt));
    if (mins >= 15) return "critical";
    if (mins >= 10) return "warning";
    return "normal";
  };

  const wrapperClasses = isKdsMode 
    ? "fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col gap-6 overflow-hidden font-sans"
    : "flex flex-col gap-6";

  if (!mounted) return null;

  return (
    <div ref={containerRef} className={wrapperClasses}>
      {/* Header Bar */}
      <div className={`flex items-center justify-between ${isKdsMode ? "text-slate-100" : "text-slate-700"}`}>
        <h2 className="font-semibold text-xl flex items-center gap-3">
          {isKdsMode ? <ChefHat className="w-6 h-6 text-amber-400" /> : null}
          {isKdsMode ? "Kitchen Display System" : "Live Kitchen View"}
        </h2>
        
        <div className="flex items-center gap-4">
          {!isKdsMode && (
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
                <button onClick={() => setSelectedDateStr(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          
          <button 
            onClick={toggleKdsMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
              isKdsMode 
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {isKdsMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            {isKdsMode ? "Exit KDS Mode" : "Full Screen KDS"}
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ${isKdsMode ? "h-full pb-4" : "h-[calc(100vh-250px)] min-h-[600px]"}`}>
          {columns.map(col => {
            const colOrders = orders.filter(o => o.status === col.id);
            const Icon = col.icon;
            
            return (
              <div key={col.id} className={`${isKdsMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"} border rounded-2xl flex flex-col overflow-hidden shadow-sm`}>
                {/* Column Header */}
                <div className={`px-5 py-4 border-b flex items-center justify-between ${isKdsMode ? col.darkHeader : col.lightHeader}`}>
                  <h3 className="font-bold flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    {col.title}
                  </h3>
                  <span className={`${isKdsMode ? "bg-slate-950/50" : "bg-white/60"} px-2.5 py-0.5 rounded-full text-sm font-bold shadow-sm`}>
                    {colOrders.length}
                  </span>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto p-4 flex flex-col gap-4 transition-colors ${
                        snapshot.isDraggingOver ? (isKdsMode ? "bg-slate-800/50" : "bg-slate-100/50") : ""
                      }`}
                    >
                      {colOrders.length === 0 ? (
                        <div className={`text-center p-8 italic text-sm ${isKdsMode ? "text-slate-600" : "text-slate-400"}`}>
                          No orders {col.id}
                        </div>
                      ) : (
                        colOrders.map((order, index) => {
                          const isActiveColumn = col.id === "pending" || col.id === "preparing";
                          const isToggled = expandedOrders.has(order.id);
                          const showFullCard = isActiveColumn ? !isToggled : isToggled;
                          const urgency = getUrgency(order.created_at, col.id);

                          return (
                            <Draggable key={order.id} draggableId={order.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`
                                    relative flex flex-col gap-3 overflow-hidden transition-all
                                    ${isKdsMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-slate-200"}
                                    ${snapshot.isDragging ? "shadow-2xl ring-2 ring-indigo-500 rotate-2 scale-105 z-50" : "shadow-sm hover:shadow-md"}
                                    ${isKdsMode ? "rounded-none border-x-0 border-b-2 border-t-0 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)]" : "rounded-xl border"}
                                  `}
                                  style={{
                                    ...provided.draggableProps.style,
                                    // Receipt styling for KDS mode (jagged bottom)
                                    clipPath: isKdsMode && !snapshot.isDragging ? "polygon(0 0, 100% 0, 100% calc(100% - 8px), 95% 100%, 90% calc(100% - 8px), 85% 100%, 80% calc(100% - 8px), 75% 100%, 70% calc(100% - 8px), 65% 100%, 60% calc(100% - 8px), 55% 100%, 50% calc(100% - 8px), 45% 100%, 40% calc(100% - 8px), 35% 100%, 30% calc(100% - 8px), 25% 100%, 20% calc(100% - 8px), 15% 100%, 10% calc(100% - 8px), 5% 100%, 0 calc(100% - 8px))" : "none",
                                    paddingBottom: isKdsMode && !snapshot.isDragging ? "12px" : "0px"
                                  }}
                                >
                                  {/* Urgency Bar */}
                                  {urgency === "critical" && <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500 animate-pulse" />}
                                  {urgency === "warning" && <div className="absolute top-0 left-0 w-full h-1 bg-amber-400" />}

                                  {/* Header */}
                                  <div 
                                    onClick={() => toggleExpand(order.id)}
                                    className={`p-3.5 flex justify-between items-start cursor-pointer transition-colors ${
                                      isKdsMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                                    }`}
                                  >
                                    <div className="flex flex-col gap-1.5">
                                      <span className={`text-xl font-black px-2.5 py-1 rounded-md w-fit tracking-wider shadow-sm font-mono ${
                                        col.id === "cancelled" ? (isKdsMode ? "bg-rose-900/50 text-rose-400" : "bg-rose-100 text-rose-800") : 
                                        col.id === "completed" ? (isKdsMode ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-100 text-emerald-800") :
                                        (isKdsMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-900")
                                      }`}>
                                        #{String(order.daily_order_number).padStart(3, '0')}
                                      </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                      <div className={`font-bold text-lg ${isKdsMode ? "text-slate-100" : "text-slate-900"}`}>
                                        ${Number(order.total_amount).toFixed(2)}
                                      </div>
                                      <div className={`${isKdsMode ? "text-slate-500" : "text-slate-400"} mt-1`}>
                                        {showFullCard ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                      </div>
                                    </div>
                                  </div>

                                  {showFullCard && (
                                    <div className="px-3.5 pb-3.5 flex flex-col gap-4">
                                      {/* Items */}
                                      <div className={`flex flex-col gap-2 py-2 border-t ${isKdsMode ? "border-slate-700 border-dashed" : "border-slate-100"}`}>
                                        {order.order_items?.map((item: OrderItem, idx: number) => {
                                          const menuItem = Array.isArray(item.menu_items) ? item.menu_items[0] : item.menu_items;
                                          return (
                                            <div key={idx} className={`flex flex-col ${isKdsMode ? "text-slate-200" : "text-slate-700"} ${isKdsMode ? "font-mono text-base" : "text-sm"}`}>
                                              <div className="flex justify-between items-start w-full gap-2">
                                                <div className="flex items-start gap-2">
                                                  <span className="font-bold whitespace-nowrap text-indigo-500 text-lg leading-none pt-0.5">{item.quantity}x</span>
                                                  <span className="font-semibold leading-tight pt-0.5">{menuItem?.name || "Unknown Item"}</span>
                                                </div>
                                              </div>
                                              {item.customer_notes && (
                                                <span className={`text-[13px] font-medium italic mt-1 ml-6 p-1.5 rounded bg-rose-500/10 ${isKdsMode ? "text-rose-400" : "text-rose-600"}`}>
                                                  *** Note: {item.customer_notes}
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>

                                      {/* Customer Info */}
                                      {(order.customer_name || order.table_number) && (
                                        <div className={`flex gap-3 text-xs p-2.5 rounded-lg border mt-2 ${
                                          isKdsMode ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-100"
                                        }`}>
                                          {order.customer_name && (
                                            <div className={`flex items-center gap-1.5 font-semibold uppercase tracking-wide ${isKdsMode ? "text-slate-300" : "text-slate-600"}`}>
                                              <User className="w-3.5 h-3.5 opacity-70" />
                                              {order.customer_name}
                                            </div>
                                          )}
                                          {order.table_number && (
                                            <div className={`flex items-center gap-1.5 font-bold ml-auto px-2 py-0.5 rounded-full ${
                                              isKdsMode ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100/50 text-indigo-700"
                                            }`}>
                                              <MapPin className="w-3 h-3" />
                                              Table {order.table_number}
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* Timestamp */}
                                      <div className={`text-[11px] font-medium flex items-center justify-between ${
                                        urgency === "critical" ? "text-rose-500" : 
                                        urgency === "warning" ? "text-amber-500" : 
                                        (isKdsMode ? "text-slate-500" : "text-slate-400")
                                      }`}>
                                        <div className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {formatTimeAgoWithExact(order.created_at, timezone)}
                                        </div>
                                        {urgency === "critical" && <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />}
                                      </div>

                                      {/* Actions (Only in Light mode or when not dragging) */}
                                      {!isKdsMode && (
                                        <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
                                          <div className="flex gap-2 w-full">
                                            {col.id === "pending" && (
                                              <button onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, "preparing"); }} className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-2 rounded-lg text-sm transition-colors">Start Preparing</button>
                                            )}
                                            {col.id === "preparing" && (
                                              <button onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, "completed"); }} className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold py-2 rounded-lg text-sm transition-colors">Mark Completed</button>
                                            )}
                                            {col.id === "completed" && (
                                              <button onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, "pending"); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 rounded-lg text-sm transition-colors">Move Back</button>
                                            )}
                                          </div>
                                          {(col.id === "pending" || col.id === "preparing") && (
                                            <button onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, "cancelled"); }} className="w-full text-center text-xs text-rose-500 font-semibold hover:text-rose-700 hover:underline py-1">Cancel Order</button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          );
                        })
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
