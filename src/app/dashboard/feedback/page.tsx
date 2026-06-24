import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Star, ArrowUpRight, ArrowDownRight, TrendingUp, User, MapPin, Mail, QrCode, MessageSquarePlus } from "lucide-react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { FeedbackAnalytics, FeedbackData } from "./feedback-analytics";
import { FeedbackList } from "./feedback-list";
import { FeedbackStrategyForm } from "./feedback-strategy-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Customer Feedback | NoMenu Dashboard",
  description: "View and manage customer feedback.",
};

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const tab = params.tab === "strategy" ? "strategy" : "reviews";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's restaurant
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, timezone, plan, loyalty_pin, recovery_offer_text, recovery_message")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

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
    .select("*, qr_codes(label, location_zone)")
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

      {!restaurant.plan || !["pro", "elite", "enterprise"].includes(restaurant.plan.trim().toLowerCase()) ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm max-w-2xl mx-auto mt-12">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Upgrade to Pro</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Private customer feedback, rating analytics, and instant alerts are exclusively available on the Pro plan. Upgrade to listen to your customers.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-[1.02]"
          >
            View Pricing Plans
          </Link>
        </div>
      ) : (
        <Tabs defaultValue={tab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
            <TabsTrigger value="strategy">Strategy Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews" className="space-y-8 mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="mb-8">
              <FeedbackList feedbacks={allFeedbacks} timezone={restaurant.timezone || "UTC"} restaurantId={restaurant.id} supabaseUrl={getSupabaseEnv().url} supabaseAnonKey={getSupabaseEnv().anonKey} />
            </div>
            <FeedbackAnalytics feedbacks={allFeedbacks} timezone={restaurant.timezone || "UTC"} />
          </TabsContent>
          
          <TabsContent value="strategy" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <FeedbackStrategyForm 
              initialLoyaltyPin={restaurant.loyalty_pin || "1234"}
              initialRecoveryOffer={restaurant.recovery_offer_text || "15% off your next visit with code MAKEITRIGHT15"}
              initialRecoveryMessage={restaurant.recovery_message || "Thank you. Our manager has been notified and will reach out to you at {contact} to apologize personally."}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
