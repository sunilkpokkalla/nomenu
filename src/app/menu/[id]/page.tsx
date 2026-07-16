import { headers } from "next/headers";
import { QrCode } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { MenuClientView } from "@/components/menu/menu-client-view";
import { CartProvider } from "@/components/menu/cart-context";
import { FloatingCart } from "@/components/menu/floating-cart";
import { ReceiptTracker } from "@/components/menu/receipt-tracker";
import { getCurrencySymbol } from "@/lib/currency-options";

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
  const { data: _restaurantData } = await supabase
    .from("restaurants")
    .select("*, stripe_account_id")
    .eq("id", menu.restaurant_id)
    .maybeSingle();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const restaurant = _restaurantData as any;

  if (!restaurant) {
    notFound();
  }

  // Redirect to the new beautiful URL format if slugs are available
  if (restaurant.slug && menu.slug) {
    const searchParamsString = new URLSearchParams(await props.searchParams as Record<string, string>).toString();
    const query = searchParamsString ? `?${searchParamsString}` : '';
    redirect(`/${restaurant.slug}/${menu.slug}${query}`);
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
  const activeWifiPassword = canUseCustomDesign && designConfig.wifi_password !== undefined ? designConfig.wifi_password : restaurant.wifi_password;

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
          wifi_password: activeWifiPassword,
          primary_color: activePrimaryColor,
          accent_color: activeAccentColor,
          theme_style: activeThemeStyle,
          currency: restaurant.currency,
          plan: restaurant.plan,
          opening_time: restaurant.opening_time,
          closing_time: restaurant.closing_time,
          wait_time_status: restaurant.wait_time_status
        }}
        categories={categoriesList}
        items={itemsList}
        tableNumber={effectiveTableNumber}
        qrCodeId={qrCodeId}
        locationLabel={menu.location_label}
        menuId={menu.id}
        displayLanguage={menu.display_language}
      />
      {['elite', 'enterprise'].includes(restaurant.plan?.toLowerCase() || '') && (
        <FloatingCart 
          restaurantId={restaurant.id}
          restaurantCreatedAt={restaurant.created_at}
          menuId={menu.id}
          tableNumber={effectiveTableNumber}
          themeStyle={activeThemeStyle || "bistro"}
          primaryColor={activePrimaryColor || "#000"}
          currencySymbol={getCurrencySymbol(restaurant.currency)}
          taxRate={menu.tax_rate || 0}
          serviceCharge={menu.service_charge || 0}
          serviceChargeType={menu.service_charge_type || "percentage"}
          stripeAccountId={restaurant.plan?.toLowerCase() === 'enterprise' ? restaurant.stripe_account_id : null}
          locationLabel={menu.location_label}
          fulfillmentType={menu.fulfillment_type || "dine_in"}
          prepTimeMinutes={restaurant.prep_time_minutes ?? 20}
          maxTakeawayPerSlot={restaurant.max_takeaway_per_slot ?? 5}
          maxReservePerSlot={restaurant.max_reserve_per_slot ?? 2}
          openingTime={restaurant.opening_time ? restaurant.opening_time.substring(0, 5) : "09:00"}
          closingTime={restaurant.closing_time ? restaurant.closing_time.substring(0, 5) : "23:00"}
        />
      )}
      <ReceiptTracker 
        restaurantId={restaurant.id} 
        restaurantCreatedAt={restaurant.created_at}
        restaurantName={restaurant.name}
        restaurantAddress={restaurant.address}
        restaurantPhone={restaurant.phone}
        locationLabel={menu.location_label} 
        taxRate={menu.tax_rate || 0}
        serviceCharge={menu.service_charge || 0}
        serviceChargeType={menu.service_charge_type || "percentage"}
        currencySymbol={getCurrencySymbol(restaurant.currency)}
      />

      {/* Viral Marketing Badge - Only for Free Plan */}
      {(!restaurant.plan || restaurant.plan.toLowerCase() === 'free') && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[40]">
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 bg-[#1A1A1A]/90 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-white/10 hover:bg-black transition-colors group"
          >
            <QrCode className="w-3 h-3 text-white/70 group-hover:text-white transition-colors" />
            <span className="text-white/90 group-hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors">
              Powered by NoMenu
            </span>
          </a>
        </div>
      )}
    </CartProvider>
  );
}

