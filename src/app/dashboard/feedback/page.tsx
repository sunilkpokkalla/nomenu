import { redirect } from "next/navigation";
import { MessageSquare, Star, ArrowUpRight, ArrowDownRight, TrendingUp, User, MapPin, Mail } from "lucide-react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";

import { createClient } from "@/lib/supabase/server";

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
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching feedback:", error);
  }

  const allFeedbacks = feedbacks || [];
  
  // Calculate analytics
  const totalFeedback = allFeedbacks.length;
  const averageRating = totalFeedback > 0 
    ? (allFeedbacks.reduce((sum, item) => sum + item.rating, 0) / totalFeedback).toFixed(1) 
    : "0.0";
    
  const positiveCount = allFeedbacks.filter(f => f.rating >= 4).length;
  const positivePercentage = totalFeedback > 0 ? Math.round((positiveCount / totalFeedback) * 100) : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Feedback</h1>
        <p className="text-slate-500">See what your customers are saying about your menu.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-600">Total Feedback</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalFeedback}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <h3 className="font-medium text-slate-600">Average Rating</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 flex items-baseline gap-2">
            {averageRating} <span className="text-sm font-medium text-slate-500">/ 5.0</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-600">Positive Sentiment</h3>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-slate-900">{positivePercentage}%</p>
            <div className="flex items-center text-sm text-emerald-600 font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              4 & 5 Stars
            </div>
          </div>
        </div>
      </div>

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
          <div className="divide-y">
            {allFeedbacks.map((feedback) => (
              <div key={feedback.id} className="p-6 flex flex-col md:flex-row gap-4 md:gap-8 hover:bg-slate-50/50 transition-colors">
                {/* Left Col: Rating & Time */}
                <div className="flex md:flex-col items-center md:items-start justify-between md:w-48 shrink-0 gap-3">
                  <div className="flex flex-col gap-2 md:gap-3">
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
                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= feedback.rating 
                              ? "fill-amber-400 text-amber-400" 
                              : "fill-slate-100 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-slate-500 font-medium whitespace-nowrap md:mt-1">
                    {feedback.created_at ? formatTimeAgoWithExact(feedback.created_at, restaurant.timezone) : "Unknown date"}
                  </span>
                </div>

                {/* Right Col: Comment */}
                <div className="flex-1">
                  {feedback.comment ? (
                    <p className="text-slate-700 leading-relaxed text-[15px]">
                      "{feedback.comment}"
                    </p>
                  ) : (
                    <p className="text-slate-400 italic text-[15px]">
                      No written comment provided.
                    </p>
                  )}
                  
                  {/* Customer Info & Table Info */}
                  {(feedback.customer_name || feedback.contact_info || feedback.table_number) && (
                    <div className="mt-4 flex flex-wrap gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      {feedback.customer_name && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">{feedback.customer_name}</span>
                        </div>
                      )}
                      {feedback.contact_info && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span>{feedback.contact_info}</span>
                        </div>
                      )}
                      {feedback.table_number && (
                        <div className="flex items-center gap-1.5 text-sm text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 ml-auto">
                          <MapPin className="w-3.5 h-3.5" />
                          Table {feedback.table_number}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
