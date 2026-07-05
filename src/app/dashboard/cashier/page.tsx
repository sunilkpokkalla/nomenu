import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { CashierBoard } from "@/app/dashboard/cashier/cashier-board";
import { WaitlistBoard } from "@/app/dashboard/cashier/waitlist-board";
import { CompletedBoard } from "@/app/dashboard/cashier/completed-board";
import { FloorPlanBoard } from "@/app/dashboard/cashier/floor-plan-board";
import { getOrCreateFloorPlans } from "@/app/dashboard/cashier/floor-plan-actions";
import { Wallet } from "lucide-react";
import { getActiveRestaurant } from "@/lib/rbac";
import { getCurrencySymbol } from "@/lib/currency-options";

export const metadata = {
  title: "Cashier Tabs | NoMenu Dashboard",
  description: "Manage open table tabs and process payments.",
};

export default async function CashierPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams;
  let tab = params.tab || "floor-plan";
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

  // Fetch only unpaid dine-in orders initially to calculate open tabs
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
    .eq("is_paid", false)
    .neq("status", "cancelled")
    .order("created_at", { ascending: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let floorPlansData: any[] = [];
  const res = await getOrCreateFloorPlans(restaurant.id);
  if (res.success) {
    floorPlansData = res.floorPlans || [];
  }

  const isLocked = !restaurant.plan || !["pro", "elite", "enterprise"].includes(restaurant.plan.toLowerCase());
  
  if (isLocked) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Front of House</h1>
          <p className="text-slate-500 mt-2">Manage open table tabs and waitlists.</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm max-w-2xl mx-auto mt-12 w-full">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Wallet className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Upgrade to Pro</h2>
          <p className="text-slate-600 mb-8">
            The Cashier and Waitlist systems are available on the Pro plan. Manage your tables, waitlist, and floor plan efficiently.
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

  const isPro = restaurant.plan?.toLowerCase() === "pro";
  
  if (isPro && (tab === "active" || tab === "history")) {
    tab = "floor-plan";
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Front of House</h1>
          <p className="text-slate-500 mt-2">Manage open table tabs and waitlists.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <Link 
            href="/dashboard/cashier?tab=floor-plan"
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "floor-plan" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Floor Plan
          </Link>
          <Link 
            href="/dashboard/cashier?tab=waitlist"
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "waitlist" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Waitlist
          </Link>
          {!isPro && (
            <>
              <Link 
                href="/dashboard/cashier?tab=active"
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "active" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Active Tabs
              </Link>
              <Link 
                href="/dashboard/cashier?tab=history"
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "history" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Completed History
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="relative flex-1 min-h-[500px]">
        {tab === "active" && (
          <CashierBoard 
            initialOrders={initialOrders || []} 
            restaurantId={restaurant.id} 
            timezone={restaurant.timezone || "UTC"} 
            supabaseUrl={getSupabaseEnv().url} 
            supabaseAnonKey={getSupabaseEnv().anonKey} 
            currencySymbol={getCurrencySymbol(restaurant.currency)} 
          />
        )}
        {tab === "waitlist" && (
          <WaitlistBoard 
            restaurantId={restaurant.id} 
            supabaseUrl={getSupabaseEnv().url} 
            supabaseAnonKey={getSupabaseEnv().anonKey} 
            floorPlans={floorPlansData}
            activeOrders={initialOrders || []}
          />
        )}
        {tab === "history" && (
          <CompletedBoard 
            restaurantId={restaurant.id} 
            timezone={restaurant.timezone || "UTC"} 
            supabaseUrl={getSupabaseEnv().url} 
            supabaseAnonKey={getSupabaseEnv().anonKey} 
            currencySymbol={getCurrencySymbol(restaurant.currency)} 
          />
        )}
        {tab === "floor-plan" && floorPlansData.length > 0 && (
          <FloorPlanBoard
            restaurantId={restaurant.id}
            initialFloorPlans={floorPlansData}
            activeOrders={initialOrders || []}
          />
        )}
      </div>
    </div>
  );
}
