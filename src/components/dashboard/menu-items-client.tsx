"use client";

import { useState, useTransition, useEffect } from "react";
import { Flame, Leaf, Award, ShieldAlert, Sparkles, Trash2, Plus, Clock, MoreHorizontal, Edit2, ChevronRight, Folder, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { deleteMenuItem, toggleMenuItemStatus, createMenuItem } from "@/app/dashboard/actions";
import { DeleteConfirmForm } from "@/components/dashboard/delete-confirm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreateItemForm } from "@/components/dashboard/create-item-form";
import { EditItemModal } from "@/components/dashboard/edit-item-modal";
import { ImportItemsModal } from "@/components/dashboard/import-items-modal";
import { ManageCategoriesModal } from "@/components/dashboard/manage-categories-modal";
import { ImportTemplateModal } from "@/components/dashboard/import-template-modal";
import { MagicImportModal } from "@/components/dashboard/magic-import-modal";
import { SquareSyncButton } from "@/components/dashboard/square-sync-button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

export function MenuItemsClient({ 
  menus, 
  categories, 
  items, 
  restaurant,
  initialMenuId = "all",
  initialCategoryId = "all"
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menus: any[]; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[]; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[]; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  restaurant: any;
  initialMenuId?: string;
  initialCategoryId?: string;
}) {
  const [selectedMenuId, setSelectedMenuId] = useState(initialMenuId);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

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

  // Group items
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedItems: { category: any, menu: any, items: any[] }[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemsByCategoryId: Record<string, any[]> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uncategorizedItems: any[] = [];
  
  filteredItems.forEach(item => {
    if (item.category_id) {
      if (!itemsByCategoryId[item.category_id]) {
        itemsByCategoryId[item.category_id] = [];
      }
      itemsByCategoryId[item.category_id].push(item);
    } else {
      uncategorizedItems.push(item);
    }
  });

  restaurantCategories.forEach(category => {
    if (itemsByCategoryId[category.id] && itemsByCategoryId[category.id].length > 0) {
      const menu = menus.find((m) => m.id === category.menu_id);
      groupedItems.push({
        category,
        menu,
        items: itemsByCategoryId[category.id]
      });
    }
  });
  
  if (uncategorizedItems.length > 0) {
    groupedItems.push({
      category: null,
      menu: null,
      items: uncategorizedItems
    });
  }

  const selectedMenuName = selectedMenuId === "all" ? "All Menus" : menus.find(m => m.id === selectedMenuId)?.name;
  const selectedCategoryName = selectedCategoryId === "all" ? "All Categories" : restaurantCategories.find(c => c.id === selectedCategoryId)?.name;

  // Group menus by location
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedMenusByLocation: Record<string, any[]> = {};
  menus.forEach(menu => {
    const loc = menu.location_label || "Other";
    if (!groupedMenusByLocation[loc]) groupedMenusByLocation[loc] = [];
    groupedMenusByLocation[loc].push(menu);
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* LEFT SIDEBAR NAVIGATION */}
      <div className="w-full lg:w-64 shrink-0 bg-white border border-slate-200 rounded-xl overflow-hidden sticky top-6 flex flex-col max-h-[calc(100vh-3rem)] shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-semibold text-slate-800">Menu Navigation</h2>
        </div>
        <div className="p-3 overflow-y-auto space-y-1">
          <button
            onClick={() => { setSelectedMenuId("all"); setSelectedCategoryId("all"); }}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedMenuId === "all" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>All Menus</span>
            <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded-full border">{items.length}</span>
          </button>

          <div className="space-y-4 pt-2">
            {Object.entries(groupedMenusByLocation).map(([location, locationMenus]) => (
              <div key={location} className="space-y-1">
                <div className="pb-1">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    📍 {location}
                  </p>
                </div>
                <div className="space-y-1">
                  {locationMenus.map(menu => {
                    const isSelected = selectedMenuId === menu.id;
                    const menuCategories = restaurantCategories.filter((c) => c.menu_id === menu.id);
                    
                    return (
                      <div key={menu.id} className="space-y-1">
                        <button
                          onClick={() => { setSelectedMenuId(menu.id); setSelectedCategoryId("all"); }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isSelected && selectedCategoryId === "all" ? "bg-primary text-white" : isSelected ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <Folder className="h-4 w-4 shrink-0" />
                          <span className="truncate w-full text-left">{menu.name}</span>
                        </button>
                        
                        {isSelected && menuCategories.length > 0 && (
                          <div className="ml-4 pl-2 border-l-2 border-slate-100 space-y-1 mt-1 mb-3">
                            {menuCategories.map(cat => (
                              <button
                                key={cat.id}
                                onClick={() => setSelectedCategoryId(cat.id)}
                                className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                                  selectedCategoryId === cat.id ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                              >
                                <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                                <span className="truncate text-left">{cat.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0 w-full space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-[200px] flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">
                {selectedMenuId === "all" ? "All Items" : selectedCategoryId === "all" ? `${selectedMenuName}` : `${selectedCategoryName}`}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-end gap-2">
              {selectedMenuId !== "all" && (
                <ManageCategoriesModal
                  categories={restaurantCategories.filter((c) => c.menu_id === selectedMenuId)}
                  targetMenuId={selectedMenuId}
                />
              )}
              <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
                <SheetTrigger asChild>
                  <Button className="shadow-sm bg-slate-900 text-white hover:bg-slate-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md overflow-y-auto border-l-0 sm:border-l">
                  <SheetHeader>
                    <SheetTitle>Create Menu Item</SheetTitle>
                    <SheetDescription>
                      Add a new dish or drink to your digital menu.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    {menus.length === 0 ? (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        <ShieldAlert className="inline mr-2 h-4 w-4 text-amber-600" />
                        Please create a menu first.
                        <Button className="mt-4 w-full" variant="outline" asChild>
                          <Link href="/dashboard/menus">Create Menu</Link>
                        </Button>
                      </div>
                    ) : (
                      <CreateItemForm
                        cuisineType={restaurant.cuisine_type}
                        menus={menus}
                        categories={restaurantCategories}
                        createAction={createMenuItem}
                        onSuccess={() => setIsCreateSheetOpen(false)}
                      />
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {selectedMenuId !== "all" && (
            <div className="flex items-center gap-2 pt-4 border-t border-slate-100 overflow-x-auto pb-1 hide-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Import Tools:</span>
              <MagicImportModal 
                menuId={selectedMenuId} 
                restaurantId={restaurant.id} 
              />
              <ImportItemsModal 
                menus={menus} 
                categories={restaurantCategories} 
                items={items}
                targetMenuId={selectedMenuId} 
              />
              <ImportTemplateModal 
                menuId={selectedMenuId} 
                restaurantId={restaurant.id} 
              />
              <SquareSyncButton 
                targetMenuId={selectedMenuId} 
                isConnected={!!restaurant.square_merchant_id} 
              />
            </div>
          )}
        </div>

        {/* ITEMS LIST */}
        {filteredItems.length > 0 ? (
          <div className="space-y-10">
            {groupedItems.map((group, index) => (
              <div key={group.category?.id || `uncategorized-${index}`} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {group.category ? (
                      selectedMenuId === "all" && group.menu ? (
                        <>
                          <Badge variant="outline" className="text-xs bg-slate-50">{group.menu.name}</Badge>
                          {group.category.name}
                        </>
                      ) : (
                        group.category.name
                      )
                    ) : (
                      "Uncategorized"
                    )}
                  </h2>
                  <span className="text-sm font-normal text-slate-400 ml-2">({group.items.length})</span>
                </div>
                
                <div className="grid gap-3">
                  {group.items.map((item) => {
                    const category = group.category;
                    const menu = group.menu;
                    const toggleAction = toggleMenuItemStatus.bind(null, item.id, item.is_available);

                    return (
                      <Card key={item.id} className={`overflow-visible group transition-all hover:shadow-md hover:border-slate-300 ${!item.is_available ? "opacity-60 grayscale-[0.2]" : ""}`}>
                        <div className="flex p-4 gap-4 items-center sm:items-start">
                          {/* Thumbnail */}
                          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50 relative flex items-center justify-center shadow-sm transition-transform group-hover:scale-[1.02]">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                <span className="text-2xl font-bold text-slate-400/50">
                                  {item.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-lg font-bold text-slate-900 truncate">{item.name}</h3>
                                  {!item.is_available && (
                                    <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200 h-5 px-1.5 text-[10px] uppercase tracking-wider">
                                      Sold Out
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2 max-w-xl">
                                  {item.description || <span className="italic opacity-50">No description provided</span>}
                                </p>
                              </div>
                              <div className="text-left sm:text-right shrink-0 mt-2 sm:mt-0">
                                <div className="text-lg font-bold text-slate-900">
                                  {restaurant.currency || "USD"} {Number(item.price).toFixed(2)}
                                </div>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {item.cooking_time && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                                  <Clock className="h-3 w-3" /> {item.cooking_time}m
                                </span>
                              )}
                              {item.is_popular && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200/50">
                                  <Award className="h-3 w-3" /> Popular
                                </span>
                              )}
                              {item.is_vegetarian && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-medium text-green-700 border border-green-200/50">
                                  <Leaf className="h-3 w-3" /> Veg
                                </span>
                              )}
                              {item.is_spicy && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-700 border border-rose-200/50">
                                  <Flame className="h-3 w-3" /> Spicy
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Inline Actions */}
                          <div className="shrink-0 flex flex-col items-end gap-3 ml-2 border-l border-slate-100 pl-4">
                            {/* Toggle Availability */}
                            <OptimisticItemToggle item={item} />
                            
                            <div className="flex items-center gap-1 mt-auto">
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
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
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
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/50 p-20 text-center">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
              <UtensilsCrossed className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-serif tracking-tight text-slate-900">
              No items found
            </h3>
            <p className="mt-3 text-slate-500 max-w-sm mx-auto mb-8">
              {selectedCategoryId !== "all" 
                ? "This category doesn't have any items yet. Create one to get started." 
                : "Your menu is empty. Add your first item to start building your digital menu."}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button onClick={() => setIsCreateSheetOpen(true)} className="min-w-[150px]">
                <Plus className="mr-2 h-4 w-4" /> Create Item
              </Button>
              {selectedMenuId !== "all" && restaurantCategories.filter(c => c.menu_id === selectedMenuId).length === 0 && (
                <ImportTemplateModal menuId={selectedMenuId} restaurantId={restaurant.id} />
              )}
            </div>
          </div>
        )}
      </div>
  );
}

// Subcomponent for handling instant optimistic toggle without form submission issues
function OptimisticItemToggle({ item }: { item: any }) {
  const [optimisticAvailable, setOptimisticAvailable] = useState(item.is_available);
  const [isPending, startTransition] = useTransition();

  // Sync state if server revalidates and prop changes
  useEffect(() => {
    setOptimisticAvailable(item.is_available);
  }, [item.is_available]);

  const handleToggle = (checked: boolean) => {
    const previousState = optimisticAvailable;
    setOptimisticAvailable(checked);
    
    startTransition(async () => {
      await toggleMenuItemStatus(item.id, previousState);
    });
  };

  return (
    <div className="flex items-center gap-2" title={optimisticAvailable ? "In Stock" : "Sold Out"}>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {optimisticAvailable ? "In Stock" : "Sold Out"}
      </span>
      <Switch 
        checked={optimisticAvailable} 
        onCheckedChange={handleToggle}
        disabled={isPending}
        className="scale-75 origin-right"
      />
    </div>
  );
}
