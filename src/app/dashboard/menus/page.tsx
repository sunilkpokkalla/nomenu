import { Eye, Menu as MenuIcon, Plus, QrCode, Trash2, Utensils } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createMenu, deleteMenu, toggleMenuStatus } from "@/app/dashboard/actions";
import { MenuDescriptionField } from "@/components/dashboard/menu-description-field";
import { DeleteConfirmForm } from "@/components/dashboard/delete-confirm";
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
import {
  GLOBAL_MENU_TYPES,
  REGIONAL_MENU_TYPES,
  SPECIALTY_MENU_TYPES,
  getChefRecommendations
} from "@/lib/menu-type-options";

const getGridClass = (count: number) => {
  if (count <= 4) return "grid-cols-1 md:grid-cols-2";
  if (count <= 8) return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";
  return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4";
};

export default async function MenusPage(
  props: {
    searchParams: Promise<{ message?: string }>;
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

  const chefRecommendations = getChefRecommendations(restaurant.cuisine_type);

  const { data: menus } = await supabase
    .from("menus")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false });

  const menusList = menus || [];

  // Determine site URL on the server
  const host = (await headers()).get("host") || "localhost:3000";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">My Menus</h1>
          <p className="mt-1 text-slate-600">
            Create different menus for lunch, dinner, drinks, or seasonal specials.
          </p>
        </div>
      </div>

      {searchParams.message ? (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {searchParams.message}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        {/* Menus List */}
        <div className="space-y-6">
          {menusList.length > 0 ? (
            <div className="space-y-10">
              {Object.entries(
                menusList.reduce((acc, menu) => {
                  const format = menu.location_label || "Unassigned Location";
                  if (!acc[format]) acc[format] = [];
                  acc[format].push(menu);
                  return acc;
                }, {} as Record<string, typeof menusList>)
              ).map(([format, menusInFormat]) => (
                <div key={format} className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-800 border-b pb-2 flex items-center gap-2 capitalize">
                    <MenuIcon className="w-5 h-5 text-slate-400" />
                    {format.replace(/_/g, " ")} Menus
                  </h3>
                  <div className={`grid gap-6 ${getGridClass(menusInFormat.length)}`}>
                    {menusInFormat.map((menu) => {
                const toggleAction = toggleMenuStatus.bind(null, menu.id, menu.is_active);

                return (
                  <Card key={menu.id} className="relative flex flex-col overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <MenuIcon className="h-5 w-5" />
                        </div>
                        <form action={toggleAction}>
                          <Button
                            type="submit"
                            variant={menu.is_active ? "default" : "outline"}
                            size="sm"
                            className="h-7 text-xs font-semibold"
                          >
                            {menu.is_active ? "Active" : "Inactive"}
                          </Button>
                        </form>
                      </div>
                      <div className="flex flex-col gap-1 mt-4">
                        <CardTitle className="text-xl flex flex-wrap items-center gap-2">
                          {menu.name}
                          {menu.menu_type && (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-800 border border-slate-200 uppercase tracking-wider">
                              {menu.menu_type}
                            </span>
                          )}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2 min-h-[40px] mt-2">
                        {menu.description || "No description provided."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pt-0">
                      <div className="grid grid-cols-3 gap-2 border-t pt-4">
                        <Button variant="outline" size="sm" className="w-full px-2 text-xs" asChild>
                          <Link href={`/menu/${menu.id}`} target="_blank">
                            <Eye className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                            Preview
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full px-2 text-xs" asChild>
                          <Link href={`/dashboard/items?menuId=${menu.id}&categoryId=all`}>
                            <Utensils className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                            Items
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full px-2 text-xs" asChild>
                          <Link href={`/dashboard/qrcodes?menuId=${menu.id}`}>
                            <QrCode className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                            QR
                          </Link>
                        </Button>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <DeleteConfirmForm
                          action={deleteMenu}
                          confirmMessage="Are you sure you want to delete this menu? This will delete all its categories and items!"
                          name="menuId"
                          value={menu.id}
                        >
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="mr-1.5 h-4 w-4" />
                            Delete Menu
                          </Button>
                        </DeleteConfirmForm>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-white p-12 text-center shadow-sm">
              <MenuIcon className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No menus created yet</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-sm">
                Get started by creating your first digital menu on the right. You can assign items to it later.
              </p>
            </div>
          )}
        </div>

        {/* Add Menu Form */}
        <div>
          <Card className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create Menu</CardTitle>
              <CardDescription>
                Add a new digital menu to your restaurant dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createMenu} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Menu Name</Label>
                  <Input id="name" name="name" placeholder="e.g. Lunch Specials, Wine List" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menuType">Menu Format / Type</Label>
                  <select
                    id="menuType"
                    name="menuType"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10 cursor-pointer"
                    required
                  >
                    <option value="">Select Format...</option>
                    
                    {chefRecommendations.length > 0 && (
                      <optgroup label="👨‍🍳 Chef's Recommendations for your Cuisine">
                        {chefRecommendations.map((c) => (
                          <option key={`rec-${c.value}`} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </optgroup>
                    )}

                    <optgroup label="🌍 Global Formats">
                      {GLOBAL_MENU_TYPES.map((c) => (
                        <option key={`global-${c.value}`} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="🎌 Regional & Cultural Formats">
                      {REGIONAL_MENU_TYPES.map((c) => (
                        <option key={`regional-${c.value}`} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="✨ Specialty Formats">
                      {SPECIALTY_MENU_TYPES.map((c) => (
                        <option key={`specialty-${c.value}`} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locationLabel">Guest Location Type</Label>
                  <select
                    id="locationLabel"
                    name="locationLabel"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10 cursor-pointer"
                  >
                    <option value="Table">Table (Restaurant, Cafe, Bar)</option>
                    <option value="Room">Room (In-Room Dining)</option>
                    <option value="Cabana">Cabana (Poolside, Beach Club)</option>
                    <option value="Sunbed">Sunbed (Resorts)</option>
                    <option value="Seat">Seat (Theaters, Stadiums)</option>
                    <option value="Lane">Lane (Bowling Alleys)</option>
                  </select>
                </div>
                <MenuDescriptionField />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input id="taxRate" name="taxRate" type="number" step="0.01" min="0" placeholder="e.g. 8.5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceCharge">Service Fee</Label>
                    <Input id="serviceCharge" name="serviceCharge" type="number" step="0.01" min="0" placeholder="e.g. 10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceChargeType">Service Fee Type</Label>
                  <select
                    id="serviceChargeType"
                    name="serviceChargeType"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount ($)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isActive">Status</Label>
                  <select
                    id="isActive"
                    name="isActive"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="true">Active (Visible when scanned)</option>
                    <option value="false">Inactive (Draft mode)</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Save Menu
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
