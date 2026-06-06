import { redirect } from "next/navigation";
import { Palette } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CustomizeDashboardClient } from "./customize-client";
import Link from "next/link";

export default async function CustomizePage(
  props: {
    searchParams: Promise<{ message?: string; success?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!restaurant) {
    redirect("/dashboard?message=Please%20set%20up%20your%20restaurant%20first");
  }

  // Fetch menus for the scope dropdown
  const { data: menus } = await supabase
    .from("menus")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: true });

  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const isLocked = currentPlan === "free";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Customize Menu Layout</h1>
        <p className="mt-1 text-slate-600">
          Design your custom digital experience, set theme colors, and configure Wi-Fi access.
        </p>
      </div>

      {isLocked ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm max-w-2xl mx-auto mt-12">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Palette className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Upgrade to Pro</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Advanced brand customization, custom color themes, and premium typography are exclusively available on the Pro plan. Upgrade to make your menu stand out.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-[1.02]"
          >
            View Pricing Plans
          </Link>
        </div>
      ) : (
        <CustomizeDashboardClient 
          restaurant={restaurant} 
          menus={menus || []} 
        />
      )}
      
      {/* Toast Messages */}
      {searchParams.success && (
        <div className="fixed bottom-4 right-4 bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg border border-emerald-200 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4">
          {searchParams.success}
        </div>
      )}
      {searchParams.message && (
        <div className="fixed bottom-4 right-4 bg-red-50 text-red-800 px-4 py-3 rounded-lg border border-red-200 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4">
          {searchParams.message}
        </div>
      )}
    </div>
  );
}
