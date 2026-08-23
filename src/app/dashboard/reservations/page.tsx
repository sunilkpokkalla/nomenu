import { redirect } from "next/navigation";
import { ComponentProps } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { ReservationsBoardWrapper } from "@/components/client-wrappers";
import { ClipboardList } from "lucide-react";
import { getActiveRestaurant, UserRole } from "@/lib/rbac";
import { safeToZonedTime, safeFromZonedTime } from "@/lib/date-utils";

import { FeatureLockout } from "@/components/dashboard/feature-lockout";

export const metadata = {
  title: "Priority Reservations | NoMenu Dashboard",
  description: "Manage incoming priority reservations in real-time.",
};

export default async function ReservationsPage() {
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
      .not("reservation_time", "is", null) // Exclusively Priority Reservations
      .or(`status.in.(pending,preparing),created_at.gte.${startOfTodayUtc.toISOString()}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching initial reservations:", error);
    } else if (data) {
      initialOrders = data;
    }
  } catch (err) {
    console.error("Exception in ReservationsPage order fetching:", err);
  }

  const isTrial = restaurant.created_at ? new Date(restaurant.created_at).getTime() + 24 * 60 * 60 * 1000 > Date.now() : false;
  const isLocked = !isTrial && (!restaurant.plan || !["enterprise"].includes(restaurant.plan.toLowerCase()));
  
  if (isLocked) {
    return (
      <FeatureLockout 
        featureName="Priority Reservations"
        requiredPlan="Enterprise"
        description="The Priority Reservations system is exclusively available on the Enterprise plan. Upgrade to start accepting priority orders."
        icon={ClipboardList}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      <div className="flex-1 overflow-hidden p-6 relative z-10">
        <ReservationsBoardWrapper 
          initialOrders={(initialOrders as unknown as ComponentProps<typeof ReservationsBoardWrapper>['initialOrders']) || []} 
          restaurantId={restaurant.id}
          restaurantCreatedAt={restaurant.created_at}
          timezone={restaurant.timezone || "UTC"}
          supabaseUrl={getSupabaseEnv().url}
          supabaseAnonKey={getSupabaseEnv().anonKey}
        />
      </div>
    </div>
  );
}
