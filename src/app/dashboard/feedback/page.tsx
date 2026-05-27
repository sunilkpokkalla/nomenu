import { redirect } from "next/navigation";
import { MessageSquare, Star, ArrowUpRight, ArrowDownRight, TrendingUp, User, MapPin, Mail, QrCode } from "lucide-react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { FeedbackAnalytics, FeedbackData } from "./feedback-analytics";
import { FeedbackList } from "./feedback-list";

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
    .select("id, timezone, plan")
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

  const allFeedbacks: FeedbackData[] = (feedbacks || []) as FeedbackData[];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Feedback</h1>
        <p className="text-slate-500">See what your customers are saying about your menu.</p>
      </div>

      <div className="relative">
        {(!restaurant.plan || restaurant.plan.toLowerCase() === "free") && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-100">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Star className="h-8 w-8 fill-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Feedback Locked</h3>
              <p className="mt-3 text-sm text-slate-500 mb-6 font-medium">
                Upgrade to the Pro Plan to collect, manage, and analyze private customer feedback and ratings.
              </p>
              <a
                href="/dashboard/billing"
                className="inline-block w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-slate-800 transition"
              >
                Upgrade to Pro Plan
              </a>
            </div>
          </div>
        )}
        <div className={!restaurant.plan || restaurant.plan.toLowerCase() === "free" ? "opacity-30 pointer-events-none select-none filter blur-sm transition-all" : ""}>
          <FeedbackList feedbacks={allFeedbacks} timezone={restaurant.timezone || "UTC"} restaurantId={restaurant.id} supabaseUrl={getSupabaseEnv().url} supabaseAnonKey={getSupabaseEnv().anonKey} />
          <div className="mt-8">
            <FeedbackAnalytics feedbacks={allFeedbacks} timezone={restaurant.timezone || "UTC"} />
          </div>
        </div>
      </div>
    </div>
  );
}
