import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Star, ArrowUpRight, ArrowDownRight, TrendingUp, User, MapPin, Mail, QrCode, MessageSquarePlus } from "lucide-react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { FeedbackAnalytics, FeedbackData } from "./feedback-analytics";
import { FeedbackList } from "./feedback-list";
import { FeedbackStrategyForm } from "./feedback-strategy-form";
import { LoyaltyQrGenerator } from "@/app/dashboard/feedback/loyalty-qr-generator";
import { LoyaltyDesignEditor } from "@/app/dashboard/feedback/loyalty-design-editor";
import { CustomerDirectory } from "./customer-directory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getActiveRestaurant, UserRole } from "@/lib/rbac";

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
  const restaurant = await getActiveRestaurant(supabase, user.id);

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
        <MessageSquare className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700">No Restaurant Found</h2>
        <p className="text-slate-500 mt-2">Please set up your restaurant profile first.</p>
      </div>
    );
  }

  const plan = restaurant.plan?.toLowerCase() || "free";
  
  if (false && plan === "free") {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 max-w-md shadow-sm">
          <MessageSquare className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Upgrade to Unlock Feedback</h2>
          <p className="text-slate-600 mb-6">
            Collect real-time customer feedback, intercept negative reviews before they hit Google, and build loyalty with digital reward cards.
          </p>
          <Link href="/dashboard/billing" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
            Upgrade to Pro
          </Link>
        </div>
      </div>
    );
  }

  // Fetch feedback
  const { data: feedbacks, error } = await supabase
    .from("customer_feedback")
    .select("*, qr_codes(label, location_zone), loyalty_cards(id, stamps, last_stamp_at)")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching feedback:", error);
  }

  const allFeedbacks: FeedbackData[] = (feedbacks || []) as FeedbackData[];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Feedback & Loyalty</h1>
        <p className="text-slate-500">Manage customer feedback, automated service recovery, and your digital loyalty program.</p>
      </div>

      {false ? (
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
          <TabsList className="mb-8 p-1 h-auto bg-slate-100/80 rounded-xl overflow-x-auto justify-start flex-nowrap hide-scrollbar flex w-full border border-slate-200">
            <TabsTrigger value="reviews" className="rounded-lg py-2.5 px-4 data-[state=active]:shadow-sm text-sm font-medium transition-all">Customer Reviews</TabsTrigger>
            <TabsTrigger value="strategy" className="rounded-lg py-2.5 px-4 data-[state=active]:shadow-sm text-sm font-medium transition-all">Service Recovery</TabsTrigger>
            
            <div className="w-px h-6 bg-slate-300 mx-3 self-center shrink-0 hidden md:block"></div>
            
            <TabsTrigger value="directory" className="rounded-lg py-2.5 px-4 data-[state=active]:shadow-sm text-sm font-medium transition-all">Loyalty Members</TabsTrigger>
            <TabsTrigger value="design" className="rounded-lg py-2.5 px-4 data-[state=active]:shadow-sm text-sm font-medium transition-all">Loyalty Card Design</TabsTrigger>
            <TabsTrigger value="scanner" className="ml-auto rounded-lg py-2.5 px-4 data-[state=active]:shadow-sm text-sm font-bold text-amber-700 data-[state=active]:text-amber-900 data-[state=active]:bg-amber-100 transition-all border border-amber-200/50 bg-amber-50/50">Staff Scanner (QR)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews" className="space-y-8 mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="mb-8">
              <FeedbackList feedbacks={allFeedbacks} timezone={restaurant.timezone || "UTC"} restaurantId={restaurant.id} supabaseUrl={getSupabaseEnv().url} supabaseAnonKey={getSupabaseEnv().anonKey} />
            </div>
            <FeedbackAnalytics feedbacks={allFeedbacks} timezone={restaurant.timezone || "UTC"} />
          </TabsContent>

          <TabsContent value="directory" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <CustomerDirectory feedbacks={allFeedbacks} timezone={restaurant.timezone || "UTC"} />
          </TabsContent>
          
          <TabsContent value="strategy" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <FeedbackStrategyForm 
              initialRecoveryOffer={restaurant.recovery_offer_text || ""}
              initialRecoveryMessage={restaurant.recovery_message || "We are so sorry your experience wasn't perfect. Our manager has been alerted and is looking into this immediately. In case we miss you before you leave, please let us know how we can make this right:"}
              initialServiceRecoveryEnabled={restaurant.service_recovery_enabled ?? false}
              initialOfferManagerVisit={restaurant.offer_manager_visit ?? true}
              initialOfferCompensation={restaurant.offer_compensation ?? false}
            />
          </TabsContent>

          <TabsContent value="design" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <LoyaltyDesignEditor 
              restaurantId={restaurant.id}
              initialColor={restaurant.loyalty_stamp_color || "amber"}
              initialIcon={restaurant.loyalty_stamp_icon || "star"}
              initialLayout={restaurant.loyalty_card_layout || "classic"}
              initialRewardText={restaurant.loyalty_reward_text}
              restaurantName={restaurant.name}
              primaryColor={restaurant.primary_color || "#000000"}
              restaurantLogo={restaurant.logo_url}
            />
          </TabsContent>

          <TabsContent value="scanner" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <LoyaltyQrGenerator restaurantId={restaurant.id} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
