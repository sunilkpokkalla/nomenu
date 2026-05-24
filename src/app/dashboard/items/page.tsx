import { Flame, Leaf, Award, ShieldAlert, Sparkles, Trash2, Plus, Clock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createMenuItem, deleteMenuItem, toggleMenuItemStatus } from "@/app/dashboard/actions";
import { ImageUploader } from "@/components/dashboard/image-uploader";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";

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

  // Filter items in JS
  let filteredItems = [...itemsList];

  if (selectedMenuId && selectedMenuId !== "all") {
    const targetCategoryIds = restaurantCategories
      .filter((cat) => cat.menu_id === selectedMenuId)
      .map((cat) => cat.id);
    filteredItems = filteredItems.filter((item) => targetCategoryIds.includes(item.category_id));
  }

  if (selectedCategoryId && selectedCategoryId !== "all") {
    filteredItems = filteredItems.filter((item) => item.category_id === selectedCategoryId);
  }

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
      </div>

      {searchParams.message ? (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {searchParams.message}
        </div>
      ) : null}

      {/* Menu Filter Pills */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Filter by Menu</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/items?menuId=all&categoryId=all`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              selectedMenuId === "all"
                ? "bg-primary text-white"
                : "bg-white border text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Menus
          </Link>
          {menusList.map((menu) => (
            <Link
              key={menu.id}
              href={`/dashboard/items?menuId=${menu.id}&categoryId=all`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                selectedMenuId === menu.id
                  ? "bg-primary text-white"
                  : "bg-white border text-slate-600 hover:bg-slate-50"
              }`}
            >
              {menu.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Category Filter Pills (contextual to selected menu) */}
      {selectedMenuId !== "all" && (
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Filter by Category</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/dashboard/items?menuId=${selectedMenuId}&categoryId=all`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                selectedCategoryId === "all"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-white border text-slate-600 hover:bg-slate-50"
              }`}
            >
              All Categories
            </Link>
            {restaurantCategories
              .filter((cat) => cat.menu_id === selectedMenuId)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/dashboard/items?menuId=${selectedMenuId}&categoryId=${cat.id}`}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    selectedCategoryId === cat.id
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-white border text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        {/* Items List */}
        <div className="space-y-6">
          {filteredItems.length > 0 ? (
            <div className="grid gap-4">
              {filteredItems.map((item) => {
                const category = restaurantCategories.find((c) => c.id === item.category_id);
                const menu = menusList.find((m) => m.id === category?.menu_id);
                const toggleAction = toggleMenuItemStatus.bind(null, item.id, item.is_available);

                return (
                  <Card key={item.id} className={`overflow-hidden transition ${!item.is_available ? "opacity-60" : ""}`}>
                    <div className="flex flex-col sm:flex-row justify-between p-5 gap-4">
                      <div className="flex flex-1 gap-4">
                        {item.image_url && (
                          <div className="h-16 w-16 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-slate-50 relative flex items-center justify-center">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                            <Badge variant="secondary">
                              {menu?.name || "No Menu"} • {category?.name || "General"}
                            </Badge>
                            {!item.is_available && (
                              <Badge variant="outline" className="border-slate-300 text-slate-500 bg-slate-100">
                                Sold Out
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 max-w-xl">
                            {item.description || "No description provided."}
                          </p>
                          {/* Dietary tags */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.cooking_time && (
                              <span className="inline-flex items-center gap-1 rounded bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
                                <Clock className="h-3 w-3" /> {item.cooking_time} mins
                              </span>
                            )}
                            {item.is_popular && (
                              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                                <Award className="h-3 w-3" /> Popular
                              </span>
                            )}
                            {item.is_vegetarian && (
                              <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 border border-green-200">
                                <Leaf className="h-3 w-3" /> Vegetarian
                              </span>
                            )}
                            {item.is_vegan && (
                              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                <Sparkles className="h-3 w-3" /> Vegan
                              </span>
                            )}
                            {item.is_gluten_free && (
                              <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                                GF
                              </span>
                            )}
                            {item.is_spicy && (
                              <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
                                <Flame className="h-3 w-3" /> Spicy
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col justify-between sm:items-end gap-3 min-w-[120px]">
                        <span className="text-xl font-bold text-slate-900">
                          {restaurant.currency || "USD"} {Number(item.price).toFixed(2)}
                        </span>
                        
                        <div className="flex gap-2">
                          <form action={toggleAction}>
                            <Button
                              type="submit"
                              variant={item.is_available ? "default" : "outline"}
                              size="sm"
                              className="h-8 text-xs"
                            >
                              {item.is_available ? "In Stock" : "Sold Out"}
                            </Button>
                          </form>
                           <DeleteConfirmForm
                            action={deleteMenuItem}
                            confirmMessage={`Are you sure you want to delete "${item.name}"?`}
                            name="itemId"
                            value={item.id}
                          >
                            <Button
                              type="submit"
                              variant="ghost"
                              size="sm"
                              className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive p-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DeleteConfirmForm>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-white p-12 text-center shadow-sm">
              <Plus className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No items found</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-sm">
                Try clearing your filters or create a new menu item on the right.
              </p>
            </div>
          )}
        </div>

        {/* Add Item Form */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Create Menu Item</CardTitle>
              <CardDescription>
                Add a new dish, drink, or item to your digital menus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {menusList.length === 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <ShieldAlert className="inline mr-2 h-4 w-4 text-amber-600" />
                  Please create a menu first before adding menu items.
                  <Button className="mt-2 w-full" variant="outline" asChild>
                    <Link href="/dashboard/menus">Create Menu</Link>
                  </Button>
                </div>
              ) : (
                <form action={createMenuItem} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input id="name" name="name" placeholder="e.g. Ribeye Steak, Cappuccino" required />
                  </div>
                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="menuId">Assign to Menu</Label>
                      <select
                        id="menuId"
                        name="menuId"
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        required
                      >
                        {menusList.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cookingTime">Cooking Time (minutes) — Optional</Label>
                    <Input
                      id="cookingTime"
                      name="cookingTime"
                      type="number"
                      min="0"
                      placeholder="e.g. 15"
                    />
                  </div>

                  <div className="space-y-2 border-t pt-3">
                    <Label htmlFor="categoryId">Category</Label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="">— Create New Category (Enter below) —</option>
                      {restaurantCategories.map((cat) => {
                        const m = menusList.find((menu) => menu.id === cat.menu_id);
                        return (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({m?.name || "Menu"})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newCategoryName">Or Create New Category</Label>
                    <Input
                      id="newCategoryName"
                      name="newCategoryName"
                      placeholder="e.g. Starters, Desserts, Cocktails"
                    />
                    <p className="text-xs text-muted-foreground">
                      Creates category in the chosen menu if select above is set to create new.
                    </p>
                  </div>

                  <div className="space-y-2 border-t pt-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="e.g. Served with seasonal roasted vegetables and fresh garlic herb butter."
                    />
                  </div>

                  <div className="space-y-2 border-t pt-3">
                    <Label>Dietary & Marketing Labels</Label>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                        <input type="checkbox" name="isPopular" value="true" className="rounded text-primary focus:ring-primary h-4 w-4" />
                        Popular / Chef Spec
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                        <input type="checkbox" name="isVegetarian" value="true" className="rounded text-primary focus:ring-primary h-4 w-4" />
                        Vegetarian
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                        <input type="checkbox" name="isVegan" value="true" className="rounded text-primary focus:ring-primary h-4 w-4" />
                        Vegan
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                        <input type="checkbox" name="isGlutenFree" value="true" className="rounded text-primary focus:ring-primary h-4 w-4" />
                        Gluten Free
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                        <input type="checkbox" name="isSpicy" value="true" className="rounded text-primary focus:ring-primary h-4 w-4" />
                        Spicy
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                        <input type="checkbox" name="isAvailable" value="true" defaultChecked className="rounded text-primary focus:ring-primary h-4 w-4" />
                        In Stock / Available
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-3">
                    <ImageUploader />
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Save Menu Item
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
