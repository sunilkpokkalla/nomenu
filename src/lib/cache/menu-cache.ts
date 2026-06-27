import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Stateless client for caching public data without hitting Next.js headers/cookies
const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getCachedMenuData = unstable_cache(
  async (restaurantSlug: string, menuSlug: string) => {
    // 1. Fetch restaurant
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("*, stripe_account_id, loyalty_pin_code")
      .eq("slug", restaurantSlug)
      .maybeSingle();

    if (!restaurant) return { restaurant: null, menu: null, categoriesList: [], itemsList: [] };

    // 2. Fetch menu
    const { data: menu } = await supabase
      .from("menus")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .eq("slug", menuSlug)
      .maybeSingle();

    if (!menu) return { restaurant, menu: null, categoriesList: [], itemsList: [] };

    // 3. Fetch categories
    const { data: categories } = await supabase
      .from("categories")
      .select("*")
      .eq("menu_id", menu.id)
      .order("sort_order", { ascending: true });

    // 4. Fetch menu items
    const { data: menuItems } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .eq("is_available", true);

    return {
      restaurant,
      menu,
      categoriesList: categories || [],
      itemsList: menuItems || [],
    };
  },
  ['storefront-menu-data'],
  {
    revalidate: 60,
    tags: ['menu-data']
  }
);
