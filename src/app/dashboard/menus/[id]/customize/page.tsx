import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Crown } from "lucide-react";

import { updateMenuBranding } from "@/app/dashboard/actions";
import { BrandingForm } from "@/components/dashboard/branding-form";
import { createClient } from "@/lib/supabase/server";

export default async function MenuCustomizePage(
  props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ message?: string; success?: string; error?: string }>;
  }
) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get restaurant to check plan
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, plan")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!restaurant) redirect("/dashboard");

  const plan = restaurant.plan?.toLowerCase() || "basic";
  const isPremiumThemeEnabled = plan === "enterprise" || plan === "elite" || plan === "pro";

  // Get menu
  const { data: menu } = await supabase
    .from("menus")
    .select("*")
    .eq("id", params.id)
    .eq("restaurant_id", restaurant.id)
    .single();

  if (!menu) redirect("/dashboard/menus");

  // Create curried action
  const updateMenuBrandingAction = updateMenuBranding.bind(null, menu.id);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/menus" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Customize Menu: {menu.name}</h2>
        </div>
      </div>

      {!isPremiumThemeEnabled ? (
        <div className="mt-8 rounded-xl border bg-card p-12 text-center shadow-sm flex flex-col items-center max-w-2xl mx-auto">
          <div className="bg-amber-100 p-4 rounded-full mb-6">
            <Crown className="w-12 h-12 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight mb-3">Premium Feature Locked</h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Custom per-menu designs are exclusively available on Pro and Elite plans. Upgrade today to unlock infinite branding possibilities.
          </p>
          <Link 
            href="/dashboard/billing" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8"
          >
            Upgrade Plan
          </Link>
        </div>
      ) : (
        <BrandingForm 
          entity={menu}
          type="menu"
          action={updateMenuBrandingAction} 
          successMessage={searchParams.success}
          errorMessage={searchParams.error}
        />
      )}
    </div>
  );
}
