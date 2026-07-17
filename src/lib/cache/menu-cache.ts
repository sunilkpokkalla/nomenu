import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Helper to lazily create the client so it doesn't crash during build-time module resolution
const getSupabase = () => createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getCachedMenuData = async (restaurantSlug: string, menuSlug: string) => {
  // 1. Fetch restaurant
  const supabase = getSupabase();
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*, stripe_account_id")
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

  // 3 & 4. Fetch categories and items concurrently to save time
  const [categoriesRes, menuItemsRes] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .eq("menu_id", menu.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .eq("is_available", true)
  ]);

  return {
    restaurant,
    menu,
    categoriesList: categoriesRes.data || [],
    itemsList: menuItemsRes.data || [],
  };
};
