import { redirect } from "next/navigation";
import { ComponentProps } from "react";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { ClipboardList } from "lucide-react";
import { getActiveRestaurant } from "@/lib/rbac";
import { WaitTimeToggle } from "@/components/dashboard/wait-time-toggle";
import { getCurrencySymbol } from "@/lib/currency-options";
import { safeToZonedTime, safeFromZonedTime } from "@/lib/date-utils";
import { FeatureLockout } from "@/components/dashboard/feature-lockout";
import { OrdersBoardWrapper } from "@/components/client-wrappers";

export const metadata = {
  title: "Orders | NoMenu Dashboard",
  description: "Manage incoming customer orders in real-time.",
};

export default async function OrdersPage() {
  const supabase = await createClient();

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get restaurant
  const restaurant = await getActiveRestaurant(supabase, user.id);

  if (!restaurant) {
    redirect("/dashboard/settings");
  }

  let initialOrders: unknown[] = [];
  try {
    // Fetch today's orders initially
    const tz = restaurant.timezone || "UTC";
    const nowUtc = new Date();
    const nowZoned = safeToZonedTime(nowUtc, tz);
    
    const startOfTodayZoned = new Date(nowZoned);
    startOfTodayZoned.setHours(0, 0, 0, 0); // Start of today in local restaurant time
    
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
      .or(`status.in.(pending,preparing),created_at.gte.${startOfTodayUtc.toISOString()}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading initial orders:", error);
    } else if (data) {
      initialOrders = data;
    }
  } catch (err) {
    console.error("Exception in OrdersPage order fetching:", err);
  }

  const isTrial = restaurant.created_at ? new Date(restaurant.created_at).getTime() + 24 * 60 * 60 * 1000 > Date.now() : false;
  const isLocked = !isTrial && (!restaurant.plan || !["elite", "enterprise"].includes(restaurant.plan.toLowerCase()));
  
  // Fetch active menu to get custom location label
  const { data: menu } = await supabase
    .from("menus")
    .select("location_label")
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  const locationLabel = menu?.location_label || "TABLE";
  
  if (isLocked) {
    return (
      <FeatureLockout 
        featureName="Orders Dashboard"
        requiredPlan="Elite"
        description="The Live Kitchen Display System (KDS) and real-time ordering board are exclusively available on the Elite plan. Upgrade to start accepting live orders."
        icon={ClipboardList}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Orders Dashboard</h1>
          <p className="text-slate-500 mt-2">Manage incoming orders from your customers in real-time.</p>
        </div>
        <WaitTimeToggle restaurantId={restaurant.id} initialStatus={restaurant.wait_time_status || "normal"} />
      </div>

      <div className="relative flex-1">
        <OrdersBoardWrapper initialOrders={(initialOrders as unknown as ComponentProps<typeof OrdersBoardWrapper>['initialOrders']) || []} restaurantId={restaurant.id} restaurantCreatedAt={restaurant.created_at} timezone={restaurant.timezone || "UTC"} supabaseUrl={getSupabaseEnv().url} supabaseAnonKey={getSupabaseEnv().anonKey} locationLabel={locationLabel} currencySymbol={getCurrencySymbol(restaurant.currency)} />
      </div>
    </div>
  );
}
