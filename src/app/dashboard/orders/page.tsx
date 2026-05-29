import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { OrdersBoard } from "./orders-board";
import { ClipboardList } from "lucide-react";

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
    .or(`status.in.(pending,preparing),created_at.gte.${today.toISOString()}`)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Orders Dashboard</h1>
        <p className="text-slate-500 mt-2">Manage incoming orders from your customers in real-time.</p>
      </div>

      <div className="relative flex-1">
        {(!restaurant.plan || !["elite", "enterprise"].includes(restaurant.plan.toLowerCase())) && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-100 min-h-[500px]">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <ClipboardList className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Live Orders Locked</h3>
              <p className="mt-3 text-sm text-slate-500 mb-6 font-medium">
                Upgrade to the Elite Plan to unlock the real-time ordering system and kitchen display board.
              </p>
              <a
                href="/dashboard/billing"
                className="inline-block w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-slate-800 transition"
              >
                Upgrade to Elite Plan
              </a>
            </div>
          </div>
        )}
        <div className={!restaurant.plan || !["elite", "enterprise"].includes(restaurant.plan.toLowerCase()) ? "opacity-30 pointer-events-none select-none filter blur-sm transition-all h-[500px] overflow-hidden" : ""}>
          <OrdersBoard initialOrders={initialOrders || []} restaurantId={restaurant.id} timezone={restaurant.timezone || "UTC"} supabaseUrl={getSupabaseEnv().url} supabaseAnonKey={getSupabaseEnv().anonKey} />
        </div>
      </div>
    </div>
  );
}
