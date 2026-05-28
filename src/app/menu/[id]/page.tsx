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
  const canUseCustomDesign = ['pro', 'elite'].includes(restaurant.plan?.toLowerCase() || '') && menu.use_custom_design;

  const activeThemeStyle = canUseCustomDesign && menu.theme_style ? menu.theme_style : restaurant.theme_style;
  const activePrimaryColor = canUseCustomDesign && menu.primary_color ? menu.primary_color : restaurant.primary_color;
  const activeAccentColor = canUseCustomDesign && menu.accent_color ? menu.accent_color : restaurant.accent_color;

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
          tableNumber={tableNumber}
          themeStyle={activeThemeStyle || "bistro"}
          primaryColor={activePrimaryColor || "#000"}
          currencySymbol={restaurant.currency || "USD"}
        />
      )}
    </CartProvider>
  );
}

