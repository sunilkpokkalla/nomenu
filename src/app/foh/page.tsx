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
import { Wallet, LogOut } from "lucide-react";
import { getActiveRestaurant, getUserRole } from "@/lib/rbac";
import { getCurrencySymbol } from "@/lib/currency-options";
import { TabSaver } from "@/app/dashboard/cashier/tab-saver";
import { FohClientWrapper } from "./foh-client-wrapper";

export default async function FOHPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
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
    .eq("is_paid", false) // Exclude paid orders from active tabs
    .not("status", "in", '("cancelled","cancelled_by_customer","cancelled_by_restaurant","awaiting_payment","cleared")')
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
      <div className="flex h-screen w-full items-center justify-center bg-slate-100 font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 shadow-sm">
            <Wallet className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Front of House Locked</h3>
          <p className="mt-3 text-sm text-slate-500 mb-6 font-medium">
            Upgrade to the Pro Plan to unlock the Cashier, Waitlist, and Floor Plan systems.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-block w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-slate-800 transition shadow-xl shadow-slate-900/20"
          >
            Upgrade to Pro Plan
          </Link>
        </div>
      </div>
    );
  }

  const isPro = restaurant.plan?.toLowerCase() === "pro";
  
  if (isPro && (tab === "history")) {
    tab = "floor-plan";
  }

  return (
    <FohClientWrapper>
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
                href="/foh?tab=floor-plan"
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${tab === "floor-plan" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                Floor Plan
              </Link>
              <Link 
                href="/foh?tab=waitlist"
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${tab === "waitlist" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                Waitlist
              </Link>
              <Link 
                href="/foh?tab=active"
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${tab === "active" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                Active Tabs
              </Link>
              {!isPro && (
                <Link 
                  href="/foh?tab=history"
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${tab === "history" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                >
                  History
                </Link>
              )}
            </div>
            <form action="/auth/signout" method="post">
              <button type="submit" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </form>
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
              userRole={userRole || "waitstaff"}
            />
          )}
        </div>
      </div>
    </FohClientWrapper>
  );
}
