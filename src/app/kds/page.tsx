import { redirect } from "next/navigation";
import { ComponentProps } from "react";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { safeToZonedTime, safeFromZonedTime } from "@/lib/date-utils";
import { ClipboardList } from "lucide-react";
import { FeatureLockout } from "@/components/dashboard/feature-lockout";
import { OrdersBoardWrapper } from "@/components/client-wrappers";

export const metadata = {
  title: "Live KDS | NoMenu",
  description: "Standalone Kitchen Display System.",
};

export default async function KDSPage() {
  const supabase = await createClient();

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get restaurant
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!restaurant) {
    redirect("/dashboard/settings");
  }

  let initialOrders: unknown[] = [];
  try {
    // Fetch today's/active orders initially
    const tz = restaurant.timezone || "UTC";
    const nowUtc = new Date();
    const nowZoned = safeToZonedTime(nowUtc, tz);
    const startOfTodayZoned = new Date(nowZoned);
    startOfTodayZoned.setHours(0, 0, 0, 0);
    const startOfTodayUtc = safeFromZonedTime(startOfTodayZoned, tz);

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          quantity,
          customer_notes,
          menu_items (
            name,
            price
          )
        )
      `)
      .eq("restaurant_id", restaurant.id)
      .in("status", ["pending", "preparing"])
      .gte("created_at", startOfTodayUtc.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading KDS initial orders:", error);
    } else if (data) {
      initialOrders = data;
    }
  } catch (err) {
    console.error("Exception in KDSPage order fetching:", err);
  }

  const isTrial = restaurant.created_at ? new Date(restaurant.created_at).getTime() + 24 * 60 * 60 * 1000 > Date.now() : false;
  
  // If not elite or enterprise plan, lock it
  if (!isTrial && (!restaurant.plan || !["elite", "enterprise"].includes(restaurant.plan.toLowerCase()))) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <FeatureLockout 
            featureName="Kitchen Display System (KDS)"
            requiredPlan="Elite"
            description="The real-time Kitchen Display System is exclusively available on the Elite plan. Upgrade to start managing orders efficiently in your kitchen."
            icon={ClipboardList}
          />
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen w-full overflow-hidden bg-[#0f1115]">
      <OrdersBoardWrapper 
        initialOrders={(initialOrders as unknown as ComponentProps<typeof OrdersBoardWrapper>['initialOrders']) || []} 
        restaurantId={restaurant.id} 
        timezone={restaurant.timezone || "UTC"} 
        supabaseUrl={getSupabaseEnv().url} 
        supabaseAnonKey={getSupabaseEnv().anonKey} 
        isStandalone={true}
      />
    </main>
  );
}
