import { redirect } from "next/navigation";
import { MessageSquare, Star, ArrowUpRight, ArrowDownRight, TrendingUp, User, MapPin, Mail, QrCode } from "lucide-react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";

import { createClient } from "@/lib/supabase/server";
import { FeedbackAnalytics } from "./feedback-analytics";
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

  const allFeedbacks: any[] = feedbacks || [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Feedback</h1>
        <p className="text-slate-500">See what your customers are saying about your menu.</p>
      </div>

      <FeedbackAnalytics feedbacks={allFeedbacks} timezone={restaurant.timezone || "UTC"} />

      <FeedbackList feedbacks={allFeedbacks} timezone={restaurant.timezone || "UTC"} />
    </div>
  );
}
