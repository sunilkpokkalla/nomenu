import { redirect } from "next/navigation";
import { MessageSquare, Star, ArrowUpRight, ArrowDownRight, TrendingUp, User, MapPin, Mail, QrCode } from "lucide-react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";

import { createClient } from "@/lib/supabase/server";
import { FeedbackAnalytics } from "./feedback-analytics";
import { toZonedTime } from "date-fns-tz";
import { format, isToday, isYesterday } from "date-fns";

export const metadata = {
  title: "Customer Feedback | NoMenu Dashboard",
  description: "View and manage customer feedback.",
};

export default async function FeedbackPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's restaurant
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, timezone")
    .eq("owner_id", user.id)
    .single();

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
        <MessageSquare className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700">No Restaurant Found</h2>
        <p className="text-slate-500 mt-2">Please set up your restaurant profile first.</p>
      </div>
    );
  }

  // Fetch feedback
  const { data: feedbacks, error } = await supabase
    .from("customer_feedback")
    .select("*, qr_codes(label)")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching feedback:", error);
  }

  const allFeedbacks = feedbacks || [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Feedback</h1>
        <p className="text-slate-500">See what your customers are saying about your menu.</p>
      </div>

      <FeedbackAnalytics feedbacks={allFeedbacks} timezone={restaurant.timezone} />

      {/* Feedback List */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900 text-lg">Recent Responses</h2>
        </div>
        
        {allFeedbacks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No feedback yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              When customers leave feedback on your digital menu, it will appear here.
            </p>
          </div>
        ) : (
          (() => {
            const groupedFeedbacks: Record<string, typeof allFeedbacks> = {};
            
            allFeedbacks.forEach(feedback => {
              if (!feedback.created_at) return;
              const date = toZonedTime(new Date(feedback.created_at), restaurant.timezone || "UTC");
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

            return Object.entries(groupedFeedbacks).map(([dateLabel, feedbacksForDay]) => (
              <div key={dateLabel} className="border-b last:border-b-0 border-slate-100">
                <div className="px-6 py-2.5 bg-slate-50/80 border-y border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm">
                  {dateLabel}
                </div>
                <div className="divide-y divide-slate-100">
                  {feedbacksForDay.map((feedback) => (
                    <div key={feedback.id} className="p-5 flex flex-col gap-3 hover:bg-slate-50/50 transition-colors">
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
                              : "fill-slate-100 text-slate-200"
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
                    {feedback.created_at ? formatTimeAgoWithExact(feedback.created_at, restaurant.timezone) : "Unknown date"}
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
                  <div className="mt-1 flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100">
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
          </div>
        ))
      })()}
      </div>
    </div>
  );
}
