"use client";

import { useState } from "react";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { MessageSquare, Star, ArrowUpRight, ArrowDownRight, User, MapPin, Mail, QrCode, Calendar as CalendarIcon, ChevronDown, ChevronUp, X } from "lucide-react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";

export function FeedbackList({ feedbacks, timezone }: { feedbacks: any[], timezone: string }) {
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  // Default to keeping "Today" open
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ "Today": true });

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  if (feedbacks.length === 0) {
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
  let filteredFeedbacks = feedbacks;
  if (selectedDateStr) {
    // selectedDateStr comes from input type="date" which is 'yyyy-MM-dd'
    const [y, m, d] = selectedDateStr.split("-").map(Number);
    const selectedDate = new Date(y, m - 1, d); // local midnight of selected date
    
    filteredFeedbacks = feedbacks.filter(feedback => {
      if (!feedback.created_at) return false;
      // Convert feedback UTC to restaurant timezone date
      const fbDate = toZonedTime(new Date(feedback.created_at), timezone);
      // Compare just the YYYY-MM-DD
      return fbDate.getFullYear() === selectedDate.getFullYear() && 
             fbDate.getMonth() === selectedDate.getMonth() && 
             fbDate.getDate() === selectedDate.getDate();
    });
  }

  // 2. Group by date string (Today, Yesterday, etc)
  const groupedFeedbacks: Record<string, any[]> = {};
  filteredFeedbacks.forEach(feedback => {
    if (!feedback.created_at) return;
    const date = toZonedTime(new Date(feedback.created_at), timezone);
    let dateStr = "";
    if (isToday(date)) {
      dateStr = "Today";
    } else if (isYesterday(date)) {
      dateStr = "Yesterday";
    } else {
      dateStr = format(date, "EEEE, MMMM d, yyyy");
    }
    
    if (!groupedFeedbacks[dateStr]) groupedFeedbacks[dateStr] = [];
    groupedFeedbacks[dateStr].push(feedback);
  });

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
          {Object.entries(groupedFeedbacks).map(([dateLabel, feedbacksForDay]) => {
            const isOpen = openGroups[dateLabel] ?? false; // closed by default except Today
            
            return (
              <div key={dateLabel} className="border-b last:border-b-0 border-slate-100">
                {/* Accordion Header */}
                <button 
                  onClick={() => toggleGroup(dateLabel)}
                  className="w-full px-6 py-3 bg-white hover:bg-slate-50 text-left flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">{dateLabel}</span>
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {feedbacksForDay.length}
                    </span>
                  </div>
                  <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Accordion Body */}
                {isOpen && (
                  <div className="divide-y divide-slate-100 bg-slate-50/30 border-t border-slate-100">
                    {feedbacksForDay.map((feedback) => (
                      <div key={feedback.id} className="p-5 flex flex-col gap-3 hover:bg-slate-50/80 transition-colors pl-8">
                        {/* Header: Stars, Sentiment, Time */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            {/* Stars */}
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
                            {/* Sentiment Badge */}
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
                          {/* Time Ago */}
                          <div className="text-xs text-slate-500 font-medium shrink-0">
                            {feedback.created_at ? formatTimeAgoWithExact(feedback.created_at, timezone) : "Unknown date"}
                          </div>
                        </div>

                        {/* Body: Comment */}
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
}
