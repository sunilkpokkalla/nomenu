"use client";

import { useState } from "react";
import { BrandingForm } from "@/components/dashboard/branding-form";
import { updateRestaurantBranding, updateMenuBranding } from "@/app/dashboard/actions";
import { Label } from "@/components/ui/label";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CustomizeDashboardClient({ restaurant, menus }: { restaurant: any, menus: any[] }) {
  const [selectedScope, setSelectedScope] = useState<string>("global");

  const isPro = restaurant.plan === "pro" || restaurant.plan === "elite";

  const handleScopeChange = (val: string) => {
    setSelectedScope(val);
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
    wifi_password: restaurant.wifi_password, // Menus don't override wifi
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
    return updateMenuBranding(selectedMenu!.id, formData);
  };

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

      {/* Paywall Overlay for Menu Scope if not Pro */}
      <div className="relative">
        {isMenuScope && !isPro && (
          <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-[6px] bg-white/40 rounded-xl">
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 text-center max-w-md mx-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Pro Feature</h2>
              <p className="text-slate-600 mb-6">
                Applying custom designs to specific menus requires the Pro or Elite plan. Upgrade to unlock this and many other features!
              </p>
              <button 
                onClick={() => window.location.href = "/dashboard/billing"}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}
        
        {/* The actual Branding Form */}
        <div className={isMenuScope && !isPro ? "pointer-events-none opacity-50" : ""}>
          <BrandingForm 
            key={selectedScope} 
            type={isMenuScope ? "menu" : "restaurant"}
            entity={entity}
            action={isMenuScope ? menuActionWrapper : updateRestaurantBranding}
          />
        </div>
      </div>
    </div>
  );
}
