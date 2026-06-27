import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { OrdersBoard } from "./orders-board";
import { ClipboardList } from "lucide-react";
import { getActiveRestaurant } from "@/lib/rbac";
import { WaitTimeToggle } from "@/components/dashboard/wait-time-toggle";

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

  // Fetch today's orders initially
  // We'll let the client component handle real-time and more complex fetching
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  const { data: initialOrders } = await supabase
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
    .is("customer_phone", null) // Exclusively Dine-In orders
    .or(`status.in.(pending,preparing),created_at.gte.${today.toISOString()}`)
    .order("created_at", { ascending: false });

  const isLocked = !restaurant.plan || !["elite", "enterprise"].includes(restaurant.plan.toLowerCase());
  
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
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Orders Dashboard</h1>
          <p className="text-slate-500 mt-2">Manage incoming orders from your customers in real-time.</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm max-w-2xl mx-auto mt-12 w-full">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <ClipboardList className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Upgrade to Elite</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            The Live Kitchen Display System (KDS) and real-time ordering board are exclusively available on the Elite plan. Upgrade to start accepting live orders.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-[1.02]"
          >
            View Pricing Plans
          </Link>
        </div>
      </div>
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
        <OrdersBoard initialOrders={initialOrders || []} restaurantId={restaurant.id} timezone={restaurant.timezone || "UTC"} supabaseUrl={getSupabaseEnv().url} supabaseAnonKey={getSupabaseEnv().anonKey} locationLabel={locationLabel} />
      </div>
    </div>
  );
}
