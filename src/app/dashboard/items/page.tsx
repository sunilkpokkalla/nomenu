import { Flame, Leaf, Award, ShieldAlert, Sparkles, Trash2, Plus, Clock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createMenuItem, deleteMenuItem, toggleMenuItemStatus } from "@/app/dashboard/actions";
import { DeleteConfirmForm } from "@/components/dashboard/delete-confirm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { MenuItemsClient } from "@/components/dashboard/menu-items-client";
export default async function ItemsPage(
  props: {
    searchParams: Promise<{ menuId?: string; categoryId?: string; message?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
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

  // Fetch menus
  const { data: menus } = await supabase
    .from("menus")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("name", { ascending: true });

  const menusList = menus || [];
  const selectedMenuId = searchParams.menuId || "all";

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  const menuIds = menusList.map((m) => m.id);
  const restaurantCategories = (categories || []).filter((cat) => menuIds.includes(cat.menu_id));
  const selectedCategoryId = searchParams.categoryId || "all";

  // Fetch items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("name", { ascending: true });

  const itemsList = menuItems || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Menu Items</h1>
          <p className="mt-1 text-slate-600">
            Create, edit, and organize dishes, drinks, and dietary labels.
          </p>
        </div>
        {/* Top-level actions can go here if needed, but menu-specific actions are moved down */}
      </div>

      {searchParams.message ? (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {searchParams.message}
        </div>
      ) : null}

      <MenuItemsClient 
        menus={menusList} 
        categories={restaurantCategories} 
        items={itemsList} 
        restaurant={restaurant} 
        initialMenuId={selectedMenuId}
        initialCategoryId={selectedCategoryId}
      />
    </div>
  );
}
