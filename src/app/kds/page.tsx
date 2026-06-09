import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { OrdersBoard } from "@/app/dashboard/orders/orders-board";
import { ClipboardList } from "lucide-react";

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

  // Fetch today's/active orders initially
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  // If not elite or enterprise plan, lock it
  if (!restaurant.plan || !["elite", "enterprise"].includes(restaurant.plan.toLowerCase())) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100 font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <ClipboardList className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Live Orders Locked</h3>
          <p className="mt-3 text-sm text-slate-500 mb-6 font-medium">
            Upgrade to the Elite Plan to unlock the real-time ordering system and kitchen display board.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-block w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-slate-800 transition"
          >
            Upgrade to Elite Plan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen w-full overflow-hidden bg-[#0f1115]">
      <OrdersBoard 
        initialOrders={initialOrders || []} 
        restaurantId={restaurant.id} 
        timezone={restaurant.timezone || "UTC"} 
        supabaseUrl={getSupabaseEnv().url} 
        supabaseAnonKey={getSupabaseEnv().anonKey} 
        isStandalone={true}
      />
    </main>
  );
}
