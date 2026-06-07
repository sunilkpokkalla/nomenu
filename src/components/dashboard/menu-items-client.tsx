"use client";

import { useState } from "react";
import { Flame, Leaf, Award, ShieldAlert, Sparkles, Trash2, Plus, Clock } from "lucide-react";
import Link from "next/link";
import { deleteMenuItem, toggleMenuItemStatus, createMenuItem } from "@/app/dashboard/actions";
import { DeleteConfirmForm } from "@/components/dashboard/delete-confirm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateItemForm } from "@/components/dashboard/create-item-form";
import { EditItemModal } from "@/components/dashboard/edit-item-modal";
import { ImportItemsModal } from "@/components/dashboard/import-items-modal";
import { ManageCategoriesModal } from "@/components/dashboard/manage-categories-modal";

export function MenuItemsClient({ 
  menus, 
  categories, 
  items, 
  restaurant,
  initialMenuId = "all",
  initialCategoryId = "all"
}: { 
  menus: any[]; 
  categories: any[]; 
  items: any[]; 
  restaurant: any;
  initialMenuId?: string;
  initialCategoryId?: string;
}) {
  const [selectedMenuId, setSelectedMenuId] = useState(initialMenuId);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);

  const menuIds = menus.map((m) => m.id);
  const restaurantCategories = categories.filter((cat) => menuIds.includes(cat.menu_id));

  // Filter items in JS
  let filteredItems = [...items];

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
    <>
      {/* Menu Filter Pills */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Filter by Menu</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setSelectedMenuId("all"); setSelectedCategoryId("all"); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition active:scale-95 ${
              selectedMenuId === "all"
                ? "bg-primary text-white"
                : "bg-white border text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Menus
          </button>
          {menus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => { setSelectedMenuId(menu.id); setSelectedCategoryId("all"); }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition active:scale-95 ${
                selectedMenuId === menu.id
                  ? "bg-primary text-white"
                  : "bg-white border text-slate-600 hover:bg-slate-50"
              }`}
            >
              {menu.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Pills */}
      {selectedMenuId !== "all" && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Filter by Category</p>
            <div className="flex items-center gap-2">
              {menus.length > 1 && (
                <ImportItemsModal 
                  menus={menus} 
                  categories={restaurantCategories} 
                  items={items}
                  targetMenuId={selectedMenuId} 
                />
              )}
              <ManageCategoriesModal
                categories={restaurantCategories.filter((c) => c.menu_id === selectedMenuId)}
                targetMenuId={selectedMenuId}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategoryId("all")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition active:scale-95 ${
                selectedCategoryId === "all"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-white border text-slate-600 hover:bg-slate-50"
              }`}
            >
              All Categories
            </button>
            {restaurantCategories
              .filter((cat) => cat.menu_id === selectedMenuId)
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition active:scale-95 ${
                    selectedCategoryId === cat.id
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-white border text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat.name}
                </button>
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
                const menu = menus.find((m) => m.id === category?.menu_id);
                const toggleAction = toggleMenuItemStatus.bind(null, item.id, item.is_available);

                return (
                  <Card key={item.id} className={`overflow-hidden transition ${!item.is_available ? "opacity-60" : ""}`}>
                    <div className="flex flex-col sm:flex-row justify-between p-5 gap-4">
                      <div className="flex flex-1 gap-4">
                        <div className="h-16 w-16 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-slate-50 relative flex items-center justify-center">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                              <span className="text-xl font-bold text-slate-400/50">
                                {item.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
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
                            {item.calories && (
                              <span className="inline-flex items-center gap-1 rounded bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
                                {item.calories} kcal
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
                          <EditItemModal 
                            item={item} 
                            menus={menus} 
                            categories={restaurantCategories} 
                          />
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
              <p className="mt-2 text-sm text-slate-500 max-w-sm mb-4">
                Try clearing your filters or create a new menu item on the right.
              </p>
              {selectedMenuId !== "all" && menus.length > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <ImportItemsModal 
                    menus={menus} 
                    categories={restaurantCategories} 
                    items={items}
                    targetMenuId={selectedMenuId} 
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Item Form */}
        <div>
          <Card className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create Menu Item</CardTitle>
              <CardDescription>
                Add a new dish, drink, or item to your digital menus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {menus.length === 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <ShieldAlert className="inline mr-2 h-4 w-4 text-amber-600" />
                  Please create a menu first before adding menu items.
                  <Button className="mt-2 w-full" variant="outline" asChild>
                    <Link href="/dashboard/menus">Create Menu</Link>
                  </Button>
                </div>
              ) : (
                <CreateItemForm
                  cuisineType={restaurant.cuisine_type}
                  menus={menus}
                  categories={restaurantCategories}
                  createAction={createMenuItem}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
