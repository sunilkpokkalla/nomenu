import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { MenuClientView } from "@/components/menu/menu-client-view";
import { CartProvider } from "@/components/menu/cart-context";
import { FloatingCart } from "@/components/menu/floating-cart";

export default async function PublicMenuPage(
  props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ qr?: string; table?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const menuId = params.id;
  const qrCodeId = searchParams.qr;
  const tableNumber = searchParams.table;

  const supabase = await createClient();

  // 1. Fetch menu details
  const { data: menu } = await supabase
    .from("menus")
    .select("*")
    .eq("id", menuId)
    .maybeSingle();

  if (!menu) {
    notFound();
  }

  // 2. Fetch restaurant details
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", menu.restaurant_id)
    .maybeSingle();

  if (!restaurant) {
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
  if (qrCodeId) {
    const userAgent = (await headers()).get("user-agent") || "";
    let deviceType = "Desktop";
    if (/android/i.test(userAgent)) {
      deviceType = "Android";
    } else if (/ipad|iphone|ipod/i.test(userAgent)) {
      deviceType = "iOS";
    }

    // Insert scan log
    await supabase.from("menu_scans").insert({
      qr_code_id: qrCodeId,
      restaurant_id: restaurant.id,
      device_type: deviceType,
      country: (await headers()).get("x-vercel-ip-country") || "US",
    });

    // Increment scan count on QR code record
    const { data: qrRecord } = await supabase
      .from("qr_codes")
      .select("scan_count")
      .eq("id", qrCodeId)
      .maybeSingle();

    if (qrRecord) {
      await supabase
        .from("qr_codes")
        .update({ scan_count: (qrRecord.scan_count || 0) + 1 })
        .eq("id", qrCodeId);
    }
  }

  // 6. Theme Fallback Logic (Paywall Enforced)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const designConfig = (menu.design_config as any) || {};
  const hasCustomDesign = Object.keys(designConfig).length > 0;
  const canUseCustomDesign = ['pro', 'elite'].includes(restaurant.plan?.toLowerCase() || '') && hasCustomDesign;

  const activeThemeStyle = canUseCustomDesign && designConfig.theme_style ? designConfig.theme_style : restaurant.theme_style;
  const activePrimaryColor = canUseCustomDesign && designConfig.primary_color ? designConfig.primary_color : restaurant.primary_color;
  const activeAccentColor = canUseCustomDesign && designConfig.accent_color ? designConfig.accent_color : restaurant.accent_color;

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
        tableNumber={tableNumber}
        qrCodeId={qrCodeId}
      />
      {restaurant.plan?.toLowerCase() === "elite" && (
        <FloatingCart 
          restaurantId={restaurant.id}
          menuId={menu.id}
          tableNumber={tableNumber}
          themeStyle={activeThemeStyle || "bistro"}
          primaryColor={activePrimaryColor || "#000"}
          currencySymbol={restaurant.currency || "USD"}
          taxRate={menu.tax_rate || 0}
          serviceCharge={menu.service_charge || 0}
          serviceChargeType={menu.service_charge_type || "percentage"}
        />
      )}
    </CartProvider>
  );
}

