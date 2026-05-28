"use client";

import { useState, useEffect, useRef } from "react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";
import { differenceInMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { createBrowserClient } from "@supabase/ssr";
import { Clock, CheckCircle2, ChefHat, User, MapPin, XCircle, Calendar as CalendarIcon, ChevronDown, ChevronUp, X, Maximize, Minimize, AlertTriangle, ExternalLink } from "lucide-react";
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

export function OrdersBoard({ initialOrders, restaurantId, timezone, supabaseUrl, supabaseAnonKey, isStandalone = false }: { initialOrders: Order[], restaurantId: string, timezone: string, supabaseUrl: string, supabaseAnonKey: string, isStandalone?: boolean }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isKdsMode, setIsKdsMode] = useState(isStandalone);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notification, setNotification] = useState<{ id: string; title: string; subtitle: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const knownOrderIds = useRef<Set<string>>(new Set(initialOrders.map(o => o.id)));

  useEffect(() => {
    if (selectedDateStr) return; // Only notify on live "Today" view
    
    const newOrders = orders.filter(o => !knownOrderIds.current.has(o.id));
    
    if (newOrders.length > 0) {
      const latestNew = newOrders[newOrders.length - 1];
      
      // Don't play sound on initial mount if they were already there
      // Wait, initialOrders are already in knownOrderIds, so this only triggers on NEW orders arriving after mount.
      playNotificationSound();
      setNotification({
        id: latestNew.id,
        title: `New Order #${String(latestNew.daily_order_number || 0).padStart(3, '0')}`,
        subtitle: latestNew.table_number ? `Table ${latestNew.table_number}` : (latestNew.customer_name || 'Anonymous')
      });
      
      setTimeout(() => setNotification(null), 6000);
      
      // Add to known IDs
      newOrders.forEach(o => knownOrderIds.current.add(o.id));
    }
  }, [orders, selectedDateStr]);

  const playNotificationSound = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // First note
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gain1.gain.setValueAtTime(0, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.5);
      
      // Second note
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1108.73, ctx.currentTime + 0.1);
      gain2.gain.setValueAtTime(0, ctx.currentTime + 0.1);
      gain2.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.8);
    } catch(e) {
      console.error("Audio playback failed", e);
    }
  };

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLatestOrders = async () => {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    let query = supabase
      .from("orders")
      .select(`*, order_items (id, quantity, customer_notes, menu_items (name, price))`)
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: true });
      
    if (selectedDateStr) {
      // Archive Mode: Fetch all orders for the exact selected date
      const [y, m, d] = selectedDateStr.split("-").map(Number);
      const startOfDay = new Date(y, m - 1, d, 0, 0, 0);
      const endOfDay = new Date(y, m - 1, d, 23, 59, 59, 999);
      query = query.gte("created_at", startOfDay.toISOString()).lte("created_at", endOfDay.toISOString());
    } else {
      // Live Mode: Fetch active tickets OR tickets created today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query = query.or(`status.in.(pending,preparing),created_at.gte.${today.toISOString()}`);
    }

    const { data } = await query;
    if (!data) return;
    
    setOrders(data as unknown as Order[]);
  };

  // Initial load or date filter change
  useEffect(() => {
    if (!selectedDateStr) {
      setOrders(initialOrders);
      // Fetch latest immediately just in case
      fetchLatestOrders();
    } else {
      fetchLatestOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateStr, initialOrders]);

  // Polling Auto-Refresh Fallback (runs every 15 seconds)
  useEffect(() => {
    const interval = setInterval(fetchLatestOrders, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateStr, restaurantId, timezone, supabaseUrl, supabaseAnonKey]);

  // WebSockets Realtime (Fastest)
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
              setOrders(prev => {
                // Prevent duplicate insertions if polling already grabbed it
                if (prev.some(o => o.id === newOrder.id)) return prev;
                return [...prev, newOrder as Order];
              });
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
      if (!document.fullscreenElement && !isStandalone) setIsKdsMode(false);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isStandalone]);

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
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await updateOrderStatus(orderId, newStatus);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    await handleStatusChange(draggableId, destination.droppableId);
  };

  const columns = [
    { id: "pending", title: "New Orders", icon: Clock },
    { id: "preparing", title: "Preparing", icon: ChefHat },
    { id: "completed", title: "Ready / Done", icon: CheckCircle2 },
    { id: "cancelled", title: "Cancelled", icon: XCircle }
  ];

  const getUrgency = (createdAt: string, status: string) => {
    if (status === "completed" || status === "cancelled") return null;
    const mins = differenceInMinutes(currentTime, new Date(createdAt));
    if (mins >= 15) return "critical";
    if (mins >= 10) return "warning";
    return "normal";
  };

  const wrapperClasses = isKdsMode 
    ? "fixed inset-0 z-50 bg-[#0f1115] p-6 flex flex-col gap-8 font-sans overflow-hidden"
    : "flex flex-col gap-6 font-sans";

  if (!mounted) return null;

  return (
    <div ref={containerRef} className={wrapperClasses}>
      {/* HEADER */}
      <div className={`flex items-center justify-between ${isKdsMode ? "text-slate-100" : "text-slate-900"}`}>
        <h2 className="font-extrabold tracking-tight text-2xl flex items-center gap-3">
          {isKdsMode ? <ChefHat className="w-7 h-7 text-emerald-400" /> : <Clock className="w-6 h-6 text-indigo-500" />}
          {isKdsMode ? "KDS Live Terminal" : "Kitchen Display System"}
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
                  className="pl-9 pr-3 py-2 text-sm border-2 border-slate-200 rounded-lg bg-white shadow-sm focus:border-indigo-500 focus:outline-none font-medium text-slate-700 cursor-pointer min-w-[150px] hover:border-slate-300 transition-colors"
                />
              </div>
              {selectedDateStr && (
                <button onClick={() => setSelectedDateStr(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          
          {!isKdsMode && !isStandalone && (
            <button 
              onClick={() => window.open('/kds', 'KDS', 'width=1280,height=800,menubar=no,toolbar=no')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            >
              <ExternalLink className="w-4 h-4" />
              Pop-out KDS
            </button>
          )}
          <button 
            onClick={toggleKdsMode}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
              isKdsMode 
                ? "bg-white/10 hover:bg-white/20 text-white" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 shadow-lg"
            }`}
          >
            {isKdsMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            {isKdsMode ? "Exit Fullscreen" : "Fullscreen KDS"}
          </button>
        </div>
      </div>

      {/* Visual Notification Toast */}
      {selectedDateStr && (
        <div className="bg-amber-100 border border-amber-200 text-amber-900 px-4 py-2 rounded-xl flex justify-center items-center font-semibold text-sm shadow-sm gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Archive Mode: You are viewing orders from {selectedDateStr}. Modifying orders is disabled.
        </div>
      )}

      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-indigo-600/30 flex items-center gap-4 min-w-[300px]">
            <div className="bg-white/20 p-2 rounded-xl">
              <ChefHat className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight">{notification.title}</span>
              <span className="text-indigo-200 font-medium text-sm">{notification.subtitle}</span>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="ml-auto bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* BOARD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={`flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory ${isKdsMode ? "h-full" : "h-[calc(100vh-250px)] min-h-[600px]"} scrollbar-hide`}>
          {columns.map(col => {
            const colOrders = orders.filter(o => o.status === col.id);
            const Icon = col.icon;
            
            return (
              <div 
                key={col.id} 
                className={`min-w-[340px] w-full max-w-[420px] flex-shrink-0 flex flex-col gap-4 rounded-[1.5rem] p-4 snap-start ${
                  isKdsMode ? "bg-[#161920]" : "bg-slate-100/60"
                }`}
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between px-2 pb-1`}>
                  <h3 className={`font-black text-lg tracking-tight flex items-center gap-2 ${isKdsMode ? "text-slate-200" : "text-slate-800"}`}>
                    <Icon className="w-5 h-5 opacity-50" />
                    {col.title}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-lg text-sm font-bold ${
                    isKdsMode ? "bg-white/10 text-white" : "bg-white text-slate-800 shadow-sm border border-slate-200"
                  }`}>
                    {colOrders.length}
                  </span>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto flex flex-col gap-3 rounded-xl transition-colors ${
                        snapshot.isDraggingOver ? (isKdsMode ? "bg-white/5" : "bg-slate-200/50") : ""
                      }`}
                      style={{ paddingBottom: '20px' }}
                    >
                      {colOrders.length === 0 ? (
                        <div className={`text-center py-10 text-sm font-medium ${isKdsMode ? "text-slate-600" : "text-slate-400"}`}>
                          No {col.title.toLowerCase()}
                        </div>
                      ) : (
                        colOrders.map((order, index) => {
                          const urgency = getUrgency(order.created_at, col.id);

                          return (
                            <Draggable key={order.id} draggableId={order.id} index={index} isDragDisabled={!!selectedDateStr}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`
                                    relative flex flex-col gap-4 p-4 transition-all
                                    ${isKdsMode ? "bg-[#21252d] text-slate-200" : "bg-white text-slate-900"}
                                    ${snapshot.isDragging ? "shadow-2xl ring-2 ring-indigo-500 rotate-2 scale-105 z-50" : "shadow-sm hover:shadow-md"}
                                    ${isKdsMode ? "rounded-2xl" : "rounded-2xl border border-slate-200/80"}
                                  `}
                                >
                                  {/* Urgency Dot */}
                                  {urgency === "critical" && <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />}
                                  {urgency === "warning" && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-400" />}

                                  {/* Header: Order Number & Price */}
                                  <div className="flex justify-between items-start">
                                    <span className={`text-2xl font-black tracking-tighter font-mono ${
                                      col.id === "cancelled" ? "text-rose-500" : 
                                      col.id === "completed" ? "text-emerald-500" :
                                      (isKdsMode ? "text-slate-100" : "text-slate-900")
                                    }`}>
                                      #{String(order.daily_order_number).padStart(3, '0')}
                                    </span>
                                    {urgency !== "critical" && (
                                      <span className={`font-bold ${isKdsMode ? "text-slate-400" : "text-slate-400"}`}>
                                        ${Number(order.total_amount).toFixed(2)}
                                      </span>
                                    )}
                                  </div>

                                  {/* Items List */}
                                  <div className="flex flex-col gap-3 mt-1">
                                    {order.order_items?.map((item: OrderItem, idx: number) => {
                                      const menuItem = Array.isArray(item.menu_items) ? item.menu_items[0] : item.menu_items;
                                      return (
                                        <div key={idx} className="flex items-start gap-3">
                                          <span className={`px-2 py-1 rounded-md text-[13px] font-black mt-0.5 ${
                                            isKdsMode ? "bg-[#2d323b] text-indigo-400" : "bg-indigo-50 text-indigo-700"
                                          }`}>
                                            {item.quantity}x
                                          </span>
                                          <div className="flex flex-col pt-0.5">
                                            <span className={`font-semibold leading-tight ${isKdsMode ? "text-slate-200" : "text-slate-800"}`}>
                                              {menuItem?.name || "Unknown Item"}
                                            </span>
                                            {item.customer_notes && (
                                              <span className={`text-xs font-semibold italic mt-1 px-2 py-1 rounded w-fit ${
                                                isKdsMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600"
                                              }`}>
                                                Note: {item.customer_notes}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Bottom Bar: Customer / Time / Actions */}
                                  <div className={`pt-4 mt-1 border-t flex flex-wrap items-center justify-between gap-3 ${
                                    isKdsMode ? "border-slate-700" : "border-slate-100"
                                  }`}>
                                    
                                    {/* Left Side: Time and Customer info */}
                                    <div className="flex flex-col gap-1.5">
                                      <div className={`text-xs font-bold flex items-center gap-1.5 ${
                                        urgency === "critical" ? "text-rose-500" : 
                                        urgency === "warning" ? "text-amber-500" : 
                                        (isKdsMode ? "text-slate-500" : "text-slate-400")
                                      }`}>
                                        <Clock className="w-3.5 h-3.5" />
                                        {formatTimeAgoWithExact(order.created_at, timezone)}
                                      </div>
                                      
                                      {(order.customer_name || order.table_number) && (
                                        <div className="flex items-center gap-2">
                                          {order.table_number && (
                                            <span className={`text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${
                                              isKdsMode ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                                            }`}>
                                              Table {order.table_number}
                                            </span>
                                          )}
                                          {order.customer_name && (
                                            <span className={`text-[11px] font-bold ${isKdsMode ? "text-slate-400" : "text-slate-500"}`}>
                                              {order.customer_name}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {/* Right Side: Quick Action Button (Light mode only to keep KDS clean, or maybe keep everywhere) */}
                                    {!selectedDateStr && (
                                      <div className="flex items-center gap-2 ml-auto">
                                        {col.id === "pending" && (
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, "preparing"); }} 
                                          className="bg-amber-500 text-amber-950 hover:bg-amber-400 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition-colors active:scale-95"
                                        >
                                          Start
                                        </button>
                                      )}
                                      {col.id === "preparing" && (
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, "completed"); }} 
                                          className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition-colors active:scale-95"
                                        >
                                          Done
                                        </button>
                                      )}
                                      {col.id === "completed" && (
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, "cancelled"); }} 
                                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors active:scale-95 ${
                                            isKdsMode ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                          }`}
                                        >
                                          Cancel
                                        </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
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
