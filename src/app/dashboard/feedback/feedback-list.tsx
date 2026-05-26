"use client";

import { useState, useEffect } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { MessageSquare, Star, ArrowUpRight, ArrowDownRight, User, MapPin, Mail, QrCode, Calendar as CalendarIcon, ChevronDown, ChevronUp, X, Clock } from "lucide-react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";
import { createClient } from "@/lib/supabase/client";

export function FeedbackList({ feedbacks, timezone, restaurantId }: { feedbacks: any[], timezone: string, restaurantId: string }) {
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  
  // Real-time state
  const [liveFeedbacks, setLiveFeedbacks] = useState<any[]>(feedbacks);

  // Group toggle state
  // We'll store open state like "Today-Lunch": true or "Yesterday-Dinner": true
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Today-Morning": false,
    "Today-Lunch": false,
    "Today-Dinner": false,
    "Today-Other Hours": false,
    "Today": true // Day accordion is open
  });

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Setup Supabase real-time subscription
  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase.channel(`feedbacks-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "customer_feedback",
          filter: `restaurant_id=eq.${restaurantId}`
        },
        async (payload) => {
          // A new feedback arrived!
          const newFeedbackId = payload.new.id;
          
          // Let's fetch the full record including qr_code label to match our data shape
          const { data: fullFeedback } = await supabase
            .from("customer_feedback")
            .select("*, qr_codes(label)")
            .eq("id", newFeedbackId)
            .single();

          if (fullFeedback) {
            const fb: any = fullFeedback;
            // Append to top of the list
            setLiveFeedbacks(prev => [fb, ...prev]);
            
            // Optionally, automatically open the relevant shift accordion so they see it
            const fbDate = toZonedTime(new Date(fb.created_at), timezone);
            const hour = fbDate.getHours();
            let shift = "Other Hours";
            if (hour >= 8 && hour < 12) shift = "Morning";
            else if (hour >= 12 && hour < 16) shift = "Lunch";
            else if (hour >= 18 && hour < 23) shift = "Dinner";
            
            let dateStr = "Today"; // Usually new feedback is "Today"
            setOpenGroups(prev => ({
              ...prev,
              [dateStr]: true,
              [`${dateStr}-${shift}`]: true
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, timezone]);

  if (liveFeedbacks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900 text-lg">Recent Responses</h2>
        </div>
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No feedback yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">
            When customers leave feedback on your digital menu, it will appear here.
          </p>
        </div>
      </div>
    );
  }

  // 1. Filter by selected date
  let filteredFeedbacks = liveFeedbacks;
  if (selectedDateStr) {
    const [y, m, d] = selectedDateStr.split("-").map(Number);
    const selectedDate = new Date(y, m - 1, d);
    
    filteredFeedbacks = liveFeedbacks.filter(feedback => {
      if (!feedback.created_at) return false;
      const fbDate = toZonedTime(new Date(feedback.created_at), timezone);
      return fbDate.getFullYear() === selectedDate.getFullYear() && 
             fbDate.getMonth() === selectedDate.getMonth() && 
             fbDate.getDate() === selectedDate.getDate();
    });
  }

  // 2. Group by date string (Today, Yesterday, etc) AND then by Shift
  const groupedFeedbacks: Record<string, Record<string, any[]>> = {};
  
  filteredFeedbacks.forEach(feedback => {
    if (!feedback.created_at) return;
    const date = toZonedTime(new Date(feedback.created_at), timezone);
    
    // Determine Date Label
    let dateStr = "";
    if (isToday(date)) dateStr = "Today";
    else if (isYesterday(date)) dateStr = "Yesterday";
    else dateStr = format(date, "EEEE, MMMM d, yyyy");
    
    // Determine Shift Label based on 24hr hour
    const hour = date.getHours();
    let shiftStr = "Other Hours";
    if (hour >= 8 && hour < 12) {
      shiftStr = "Morning"; // 8 AM - 11:59 AM
    } else if (hour >= 12 && hour < 16) {
      shiftStr = "Lunch";   // 12 PM - 3:59 PM
    } else if (hour >= 18 && hour < 23) {
      shiftStr = "Dinner";  // 6 PM - 10:59 PM
    }

    if (!groupedFeedbacks[dateStr]) groupedFeedbacks[dateStr] = {};
    if (!groupedFeedbacks[dateStr][shiftStr]) groupedFeedbacks[dateStr][shiftStr] = [];
    
    groupedFeedbacks[dateStr][shiftStr].push(feedback);
  });

  const shiftOrder = ["Morning", "Lunch", "Dinner", "Other Hours"];

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 sm:p-6 border-b bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-semibold text-slate-900 text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-400" />
          Recent Responses
        </h2>
        
        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="date" 
              value={selectedDateStr || ""}
              onChange={(e) => setSelectedDateStr(e.target.value || null)}
              className="pl-9 pr-3 py-1.5 text-sm border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 cursor-pointer min-w-[140px]"
            />
          </div>
          {selectedDateStr && (
            <button 
              onClick={() => setSelectedDateStr(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              title="Clear date filter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div className="p-12 text-center">
          <h3 className="text-lg font-medium text-slate-900">No feedback found</h3>
          <p className="text-slate-500 mt-1">There is no feedback matching this date.</p>
          <button 
            onClick={() => setSelectedDateStr(null)}
            className="mt-4 text-sm text-indigo-600 font-medium hover:underline"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          {Object.entries(groupedFeedbacks).map(([dateLabel, shiftsObj]) => {
            const isDayOpen = openGroups[dateLabel] ?? false; // closed by default except Today
            
            // Calculate total feedback for this day
            const totalForDay = Object.values(shiftsObj).reduce((acc, curr) => acc + curr.length, 0);

            return (
              <div key={dateLabel} className="border-b last:border-b-0 border-slate-200">
                {/* Day Accordion Header */}
                <button 
                  onClick={() => toggleGroup(dateLabel)}
                  className="w-full px-6 py-4 bg-white hover:bg-slate-50 text-left flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-slate-800 uppercase tracking-wider">{dateLabel}</span>
                    <span className="bg-slate-100 text-slate-500 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {totalForDay}
                    </span>
                  </div>
                  <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
                    {isDayOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Day Accordion Body (contains Shift Accordions) */}
                {isDayOpen && (
                  <div className="bg-slate-50/50 flex flex-col border-t border-slate-100 pb-2">
                    {shiftOrder.map(shiftLabel => {
                      const feedbacksForShift = shiftsObj[shiftLabel];
                      if (!feedbacksForShift || feedbacksForShift.length === 0) return null;
                      
                      const shiftKey = `${dateLabel}-${shiftLabel}`;
                      const isShiftOpen = openGroups[shiftKey] ?? false;

                      // Time range string for UI context
                      const timeContext = 
                        shiftLabel === "Morning" ? "8 AM - 12 PM" :
                        shiftLabel === "Lunch" ? "12 PM - 4 PM" :
                        shiftLabel === "Dinner" ? "6 PM - 11 PM" : "Off-Peak";

                      return (
                        <div key={shiftKey} className="mx-4 mt-2 border rounded-xl bg-white shadow-sm overflow-hidden">
                          {/* Shift Accordion Header */}
                          <button 
                            onClick={() => toggleGroup(shiftKey)}
                            className="w-full px-4 py-3 bg-white hover:bg-slate-50 text-left flex items-center justify-between transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                                <Clock className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-slate-800">{shiftLabel}</span>
                                  <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                    {feedbacksForShift.length}
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-400 font-medium">{timeContext}</span>
                              </div>
                            </div>
                            <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
                              {isShiftOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </button>

                          {/* Shift Accordion Body (Feedback Items) */}
                          {isShiftOpen && (
                            <div className="divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/30">
                              {feedbacksForShift.map((feedback) => (
                                <div key={feedback.id} className="p-5 flex flex-col gap-3 hover:bg-white transition-colors">
                                  {/* Feedback Render (Stars, Sentiment, Time) */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                                    <div className="flex items-center gap-3 flex-wrap">
                                      <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={star}
                                            className={`w-4 h-4 ${
                                              star <= feedback.rating 
                                                ? "fill-amber-400 text-amber-400" 
                                                : "fill-slate-200 text-slate-300"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <div>
                                        {feedback.rating >= 4 ? (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                                            <ArrowUpRight className="w-3 h-3" /> Positive
                                          </span>
                                        ) : feedback.rating === 3 ? (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
                                            Neutral
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">
                                            <ArrowDownRight className="w-3 h-3" /> Needs Attention
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium shrink-0">
                                      {feedback.created_at ? formatTimeAgoWithExact(feedback.created_at, timezone) : "Unknown date"}
                                    </div>
                                  </div>

                                  {/* Comment */}
                                  <div>
                                    {feedback.comment ? (
                                      <p className="text-slate-700 leading-relaxed text-[14px]">
                                        "{feedback.comment}"
                                      </p>
                                    ) : (
                                      <p className="text-slate-400 italic text-[14px]">
                                        No written comment provided.
                                      </p>
                                    )}
                                  </div>

                                  {/* Footer: Customer Info & Table Info */}
                                  {(feedback.customer_name || feedback.contact_info || feedback.table_number || feedback.qr_codes?.label) && (
                                    <div className="mt-1 flex flex-wrap items-center gap-4 pt-3 border-t border-slate-200/60">
                                      {feedback.customer_name && (
                                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                          <User className="w-3.5 h-3.5 text-slate-400" />
                                          <span className="font-medium">{feedback.customer_name}</span>
                                        </div>
                                      )}
                                      {feedback.contact_info && (
                                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                                          <span>{feedback.contact_info}</span>
                                        </div>
                                      )}
                                      {feedback.table_number && (
                                        <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 ml-auto">
                                          <MapPin className="w-3 h-3" />
                                          Table {feedback.table_number}
                                        </div>
                                      )}
                                      {feedback.qr_codes?.label && (
                                        <div className="flex items-center gap-1.5 text-xs text-fuchsia-700 font-semibold bg-fuchsia-50 px-2 py-0.5 rounded border border-fuchsia-100 ml-auto">
                                          <QrCode className="w-3 h-3" />
                                          {feedback.qr_codes.label}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
