"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { BrandingForm } from "@/components/dashboard/branding-form";
import { Crown } from "lucide-react";
import Link from "next/link";
import { updateRestaurantBranding, updateMenuBranding } from "@/app/dashboard/actions";
import { Label } from "@/components/ui/label";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CustomizeDashboardClient({ restaurant, menus }: { restaurant: any, menus: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedScope, setSelectedScope] = useState<string>(searchParams.get("scope") || "global");

  useEffect(() => {
    const scope = searchParams.get("scope");
    if (scope && scope !== selectedScope) {
      setSelectedScope(scope);
    }
  }, [searchParams, selectedScope]);

  const handleScopeChange = (val: string) => {
    setSelectedScope(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val === "global") {
      params.delete("scope");
    } else {
      params.set("scope", val);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const selectedMenu = selectedScope !== "global" ? menus.find(m => m.id === selectedScope) : null;
  const isMenuScope = !!selectedMenu;

  // The entity passed to the form
  const entity = isMenuScope ? {
    id: selectedMenu.id,
    name: selectedMenu.name,
    use_custom_design: !!selectedMenu.design_config,
    primary_color: selectedMenu.design_config?.primary_color || restaurant.primary_color,
    accent_color: selectedMenu.design_config?.accent_color || restaurant.accent_color,
    theme_style: selectedMenu.design_config?.theme_style || restaurant.theme_style,
    wifi_password: (selectedMenu.design_config as any)?.wifi_password !== undefined ? (selectedMenu.design_config as any)?.wifi_password : restaurant.wifi_password,
    plan: restaurant.plan, // Pass global plan for pro-gating
    address: restaurant.address,
    phone: restaurant.phone,
    cuisine_type: restaurant.cuisine_type,
  } : {
    id: restaurant.id,
    name: restaurant.name,
    cuisine_type: restaurant.cuisine_type,
    primary_color: restaurant.primary_color,
    accent_color: restaurant.accent_color,
    theme_style: restaurant.theme_style,
    wifi_password: restaurant.wifi_password,
    plan: restaurant.plan,
    address: restaurant.address,
    phone: restaurant.phone,
  };

  // Action wrapper for menu to inject menuId into the server action
  const menuActionWrapper = async (formData: FormData) => {
    return updateMenuBranding(selectedMenu!.id, formData, `/dashboard/customize?scope=${selectedMenu!.id}`);
  };

  const plan = restaurant.plan?.toLowerCase() || "basic";
  const isPremiumThemeEnabled = plan === "enterprise" || plan === "elite" || plan === "pro";

  return (
    <div className="space-y-6">
      {/* Scope Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Label className="text-base font-bold text-slate-800">Design Scope</Label>
          <p className="text-xs text-slate-500">Choose whether to edit the global branding or a specific menu.</p>
        </div>
        <div className="w-full sm:w-[300px]">
          <select
  value={selectedScope}
  onChange={(e) => handleScopeChange(e.target.value)}
  className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
>
  <option value="global" className="font-semibold">Global Default</option>
  {menus.map((menu) => (
    <option key={menu.id} value={menu.id}>
      Menu: {menu.name} {menu.design_config ? "(Custom)" : ""}
    </option>
  ))}
</select>
        </div>
      </div>

      {/* The actual Branding Form */}
      <div>
        {isMenuScope && !isPremiumThemeEnabled ? (
          <div className="mt-8 rounded-xl border bg-white p-12 text-center shadow-sm flex flex-col items-center max-w-2xl mx-auto">
            <div className="bg-amber-100 p-4 rounded-full mb-6">
              <Crown className="w-12 h-12 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-3">Premium Feature Locked</h3>
            <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
              Custom per-menu designs are exclusively available on Pro and Elite plans. Upgrade today to unlock infinite branding possibilities.
            </p>
            <Link 
              href="/dashboard/billing" 
              className="bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8"
            >
              Upgrade Plan
            </Link>
          </div>
        ) : (
          <BrandingForm 
            key={selectedScope} 
            type={isMenuScope ? "menu" : "restaurant"}
            entity={entity}
            action={isMenuScope ? menuActionWrapper : updateRestaurantBranding}
          />
        )}
      </div>
    </div>
  );
}
