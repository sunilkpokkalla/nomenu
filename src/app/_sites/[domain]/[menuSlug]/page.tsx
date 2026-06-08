import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { MenuClientView } from "@/components/menu/menu-client-view";
import { CartProvider } from "@/components/menu/cart-context";
import { FloatingCart } from "@/components/menu/floating-cart";
import { ReceiptTracker } from "@/components/menu/receipt-tracker";

export default async function SubdomainMenuPage(
  props: {
    params: Promise<{ domain: string; menuSlug: string }>;
    searchParams: Promise<{ qr?: string; table?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const domain = params.domain; // This comes from middleware rewrite
  const menuSlug = params.menuSlug;
  const qrCodeId = searchParams.qr;
  const tableNumber = searchParams.table;

  const supabase = await createClient();

  // 1. Fetch restaurant details by domain
  const { data: _restaurantData } = await supabase
    .from("restaurants")
    .select("*, stripe_account_id")
    .or(`subdomain.eq.${domain},custom_domain.eq.${domain}`)
    .maybeSingle();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const restaurant = _restaurantData as any;

  if (!restaurant) {
    notFound();
  }

  // 2. Fetch menu details by slug
  const { data: menu } = await supabase
    .from("menus")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("slug", menuSlug)
    .maybeSingle();

  if (!menu) {
    notFound();
  }

  // 3. Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("menu_id", menu.id)
    .order("sort_order", { ascending: true });

  const categoriesList = categories || [];

  // 4. Fetch menu items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("is_available", true);

  const itemsList = menuItems || [];

  // 5. Track scan analytics if accessed via QR code
  let locationZone: string | null = null;
  if (qrCodeId) {
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
    );

    const userAgent = (await headers()).get("user-agent") || "";
    let deviceType = "Desktop";
    if (/android/i.test(userAgent)) {
      deviceType = "Android";
    } else if (/ipad|iphone|ipod/i.test(userAgent)) {
      deviceType = "iOS";
    }

    // Insert scan log securely bypassing RLS
    await supabaseAdmin.from("menu_scans").insert({
      qr_code_id: qrCodeId,
      restaurant_id: restaurant.id,
      device_type: deviceType,
      country: (await headers()).get("x-vercel-ip-country") || "US",
    });

    // Increment scan count on QR code record securely
    const { data: qrRecord } = await supabaseAdmin
      .from("qr_codes")
      .select("scan_count, location_zone")
      .eq("id", qrCodeId)
      .maybeSingle();

    if (qrRecord) {
      locationZone = qrRecord.location_zone || null;
      await supabaseAdmin
        .from("qr_codes")
        .update({ scan_count: (qrRecord.scan_count || 0) + 1 })
        .eq("id", qrCodeId);
    }
  }

  // 6. Theme Fallback Logic (Paywall Enforced)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const designConfig = (menu.design_config as any) || {};
  const hasCustomDesign = Object.keys(designConfig).length > 0;
  const canUseCustomDesign = ['pro', 'elite', 'enterprise'].includes(restaurant.plan?.toLowerCase() || '') && hasCustomDesign;

  const activeThemeStyle = canUseCustomDesign && designConfig.theme_style ? designConfig.theme_style : restaurant.theme_style;
  const activePrimaryColor = canUseCustomDesign && designConfig.primary_color ? designConfig.primary_color : restaurant.primary_color;
  const activeAccentColor = canUseCustomDesign && designConfig.accent_color ? designConfig.accent_color : restaurant.accent_color;

  const effectiveTableNumber = locationZone && tableNumber 
    ? `${locationZone} - ${tableNumber}` 
    : tableNumber;

  return (
    <CartProvider>
      <MenuClientView 
        restaurant={{
          id: restaurant.id,
          name: restaurant.name,
          cuisine_type: restaurant.cuisine_type,
          address: restaurant.address,
          phone: restaurant.phone,
          wifi_password: restaurant.wifi_password,
          primary_color: activePrimaryColor,
          accent_color: activeAccentColor,
          theme_style: activeThemeStyle,
          currency: restaurant.currency,
          plan: restaurant.plan
        }}
        categories={categoriesList}
        items={itemsList}
        tableNumber={effectiveTableNumber}
        qrCodeId={qrCodeId}
        locationLabel={menu.location_label}
      />
      {['elite', 'enterprise'].includes(restaurant.plan?.toLowerCase() || '') && (
        <FloatingCart 
          restaurantId={restaurant.id}
          menuId={menu.id}
          tableNumber={effectiveTableNumber}
          themeStyle={activeThemeStyle || "bistro"}
          primaryColor={activePrimaryColor || "#000"}
          currencySymbol={restaurant.currency || "USD"}
          taxRate={menu.tax_rate || 0}
          serviceCharge={menu.service_charge || 0}
          serviceChargeType={menu.service_charge_type || "percentage"}
          stripeAccountId={restaurant.plan?.toLowerCase() === 'enterprise' ? restaurant.stripe_account_id : null}
          locationLabel={menu.location_label}
        />
      )}
      <ReceiptTracker 
        restaurantId={restaurant.id} 
        restaurantName={restaurant.name}
        locationLabel={menu.location_label} 
        taxRate={menu.tax_rate || 0}
        serviceCharge={menu.service_charge || 0}
        serviceChargeType={menu.service_charge_type || "percentage"}
      />
    </CartProvider>
  );
}
