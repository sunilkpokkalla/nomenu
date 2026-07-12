import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/env";
import { CashierBoard } from "@/app/dashboard/cashier/cashier-board";
import { WaitlistBoard } from "@/app/dashboard/cashier/waitlist-board";
import { CompletedBoard } from "@/app/dashboard/cashier/completed-board";
import { FloorPlanBoard } from "@/app/dashboard/cashier/floor-plan-board";
import { getOrCreateFloorPlans } from "@/app/dashboard/cashier/floor-plan-actions";
import { Wallet } from "lucide-react";
import { getActiveRestaurant, getUserRole } from "@/lib/rbac";
import { getCurrencySymbol } from "@/lib/currency-options";
import { TabSaver } from "./tab-saver";
import { FohPopoutButton } from "./foh-popout-button";

export const metadata = {
  title: "Cashier Tabs | NoMenu Dashboard",
  description: "Manage open table tabs and process payments.",
};

export default async function CashierPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const lastFohTab = cookieStore.get("last_foh_tab")?.value;
  let tab = params.tab || lastFohTab || "active";
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
  
  const userRole = await getUserRole(supabase, user.id, restaurant.id);

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
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mb-20">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Front of House</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage open table tabs and waitlists.</p>
        </div>
        
        <div className="bg-white border border-slate-200/60 rounded-3xl p-10 text-center shadow-xl shadow-slate-200/20 max-w-2xl mx-auto mt-12 w-full">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
            <Wallet className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Upgrade to Pro</h2>
          <p className="text-slate-500 font-medium mb-8">
            The Cashier and Waitlist systems are available on the Pro plan. Manage your tables, waitlist, and floor plan efficiently.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:-translate-y-0.5"
          >
            View Pricing Plans
          </Link>
        </div>
      </div>
    );
  }

  const isPro = restaurant.plan?.toLowerCase() === "pro";

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-32">
      <TabSaver tab={tab} />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Front of House</h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">Manage open table tabs and waitlists.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          <div className="flex items-center bg-white border border-slate-200/60 p-1.5 rounded-full shadow-sm gap-1">
            <Link 
              href="/dashboard/cashier?tab=floor-plan"
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${tab === "floor-plan" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
            >
              Floor Plan
            </Link>
            <Link 
              href="/dashboard/cashier?tab=waitlist"
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${tab === "waitlist" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
            >
              Waitlist
            </Link>
            <Link 
              href="/dashboard/cashier?tab=active"
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${tab === "active" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
            >
              Active Tabs
            </Link>
            <Link 
              href="/dashboard/cashier?tab=history"
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${tab === "history" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
            >
              Overview & History
            </Link>
          </div>
          <FohPopoutButton />
        </div>
      </div>

      <div className="relative flex-1 min-h-[500px]">
        {tab === "active" && (
          <CashierBoard 
            initialOrders={initialOrders || []} 
            restaurantId={restaurant.id} 
            restaurantCreatedAt={restaurant.created_at}
            timezone={restaurant.timezone || "UTC"} 
            supabaseUrl={getSupabaseEnv().url} 
            supabaseAnonKey={getSupabaseEnv().anonKey} 
            currencySymbol={getCurrencySymbol(restaurant.currency)} 
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
        {tab === "waitlist" && (
          <WaitlistBoard 
            restaurantId={restaurant.id} 
            supabaseUrl={getSupabaseEnv().url} 
            supabaseAnonKey={getSupabaseEnv().anonKey} 
            floorPlans={floorPlansData}
            activeOrders={initialOrders || []}
          />
        )}
        {tab === "floor-plan" && floorPlansData.length > 0 && (
          <FloorPlanBoard
            restaurantId={restaurant.id}
            initialFloorPlans={floorPlansData}
            activeOrders={initialOrders || []}
            userRole={userRole || "waitstaff"}
          />
        )}
      </div>
    </div>
  );
}
