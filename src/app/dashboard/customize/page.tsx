import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomizeDashboardClient } from "./customize-client";

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Customize Menu Layout</h1>
        <p className="mt-1 text-slate-600">
          Design your custom digital experience, set theme colors, and configure Wi-Fi access.
        </p>
      </div>

      <CustomizeDashboardClient 
        restaurant={restaurant} 
        menus={menus || []} 
      />
      
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
