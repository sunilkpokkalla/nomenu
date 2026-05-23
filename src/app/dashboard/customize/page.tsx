import { redirect } from "next/navigation";

import { updateRestaurantBranding } from "@/app/dashboard/actions";
import { BrandingForm } from "@/components/dashboard/branding-form";
import { createClient } from "@/lib/supabase/server";

export default async function CustomizePage({
  searchParams,
}: {
  searchParams: { message?: string; success?: string };
}) {
  const supabase = createClient();
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Customize Menu Layout</h1>
        <p className="mt-1 text-slate-600">
          Design your custom digital experience, set theme colors, and configure Wi-Fi access.
        </p>
      </div>

      <BrandingForm
        restaurant={{
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
        }}
        action={updateRestaurantBranding}
        successMessage={searchParams.success}
        errorMessage={searchParams.message}
      />
    </div>
  );
}
