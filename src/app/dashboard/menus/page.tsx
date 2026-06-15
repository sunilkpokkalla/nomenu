import { Eye, Menu as MenuIcon, Plus, QrCode, Trash2, Utensils, BedDouble, Coffee, Wine, Sun, Car, MapPin, Building, Armchair, Target } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createMenu, deleteMenu, toggleMenuStatus, editMenu } from "@/app/dashboard/actions";
import { EditMenuModal } from "@/components/dashboard/edit-menu-modal";
import { DeleteConfirmForm } from "@/components/dashboard/delete-confirm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CreateMenuSheet } from "@/components/dashboard/create-menu-sheet";
import { MenuShareModal } from "@/components/dashboard/menu-share-modal";
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

const getLocationIcon = (format: string) => {
  const normalized = format.toLowerCase();
  if (normalized.includes("room") || normalized.includes("hotel") || normalized.includes("suite")) return BedDouble;
  if (normalized.includes("table") || normalized.includes("dining") || normalized.includes("restaurant")) return Utensils;
  if (normalized.includes("bar") || normalized.includes("drink") || normalized.includes("wine")) return Wine;
  if (normalized.includes("cafe") || normalized.includes("coffee") || normalized.includes("lounge")) return Coffee;
  if (normalized.includes("pool") || normalized.includes("patio") || normalized.includes("outdoor") || normalized.includes("beach") || normalized.includes("cabana") || normalized.includes("sunbed")) return Sun;
  if (normalized.includes("lobby") || normalized.includes("building")) return Building;
  if (normalized.includes("drive") || normalized.includes("car") || normalized.includes("curb")) return Car;
  if (normalized.includes("seating") || normalized.includes("waiting") || normalized.includes("chair") || normalized.includes("seat")) return Armchair;
  if (normalized.includes("lane") || normalized.includes("bowling") || normalized.includes("alley")) return Target;
  if (normalized.includes("none")) return MenuIcon;
  return MapPin;
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
  const baseUrl = process.env.NODE_ENV === 'development' ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`);
  const rootDomain = baseUrl.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "");
  const plan = restaurant.plan?.toLowerCase() || 'free';
  const domainPrefix = ['elite', 'enterprise'].includes(plan) ? 'order' : 'menu';
  const isLocalhost = rootDomain.includes('localhost') || rootDomain.includes('127.0.0.1');
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
        <div className="shrink-0">
          <CreateMenuSheet createAction={createMenu} chefRecommendations={chefRecommendations} />
        </div>
      </div>

      {searchParams.message && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {searchParams.message}
        </div>
      )}

      {/* Menus List */}
      <div className="space-y-12">
        {menusList.length > 0 ? (
          Object.entries(
            menusList.reduce((acc, menu) => {
              const format = menu.location_label || "Unassigned Location";
              if (!acc[format]) acc[format] = [];
              acc[format].push(menu);
              return acc;
            }, {} as Record<string, typeof menusList>)
          ).map(([format, menusInFormat]) => {
            const FormatIcon = getLocationIcon(format);
            return (
            <div key={format} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-2.5 shadow-sm">
                  <FormatIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  {format.replace(/_/g, " ")} Menus
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menusInFormat.map((menu) => {
                  const toggleAction = toggleMenuStatus.bind(null, menu.id, menu.is_active);

                  return (
                    <div key={menu.id} className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden">
                      {/* Top Section */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 text-slate-600 shadow-inner">
                            <FormatIcon className="h-6 w-6" />
                          </div>
                          <div className="flex items-center gap-4">
                            <form action={toggleAction} className="flex items-center gap-2" title={menu.is_active ? "Active" : "Inactive"}>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                {menu.is_active ? "Live" : "Draft"}
                              </span>
                              <Switch 
                                checked={menu.is_active} 
                                type="submit" 
                                className="scale-90 data-[state=checked]:bg-indigo-600"
                              />
                            </form>
                            <div className="h-5 w-px bg-slate-200" />
                            <EditMenuModal 
                              menu={menu} 
                              cuisineType={restaurant.cuisine_type} 
                              editAction={editMenu} 
                            />
                            <div className="h-5 w-px bg-slate-200" />
                            <DeleteConfirmForm
                              action={deleteMenu}
                              confirmMessage="Delete this menu and ALL its items?"
                              name="menuId"
                              value={menu.id}
                            >
                              <Button
                                type="submit"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                                title="Delete Menu"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DeleteConfirmForm>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{menu.name}</h4>
                            {menu.menu_type && (
                              <Badge variant="outline" className="bg-indigo-50/50 text-indigo-700 border-indigo-200/60 text-[10px] uppercase tracking-wider font-bold">
                                {menu.menu_type}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                            {menu.description || "No description provided."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto border-t border-slate-100 bg-slate-50/50 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <Button variant="default" size="sm" className="h-10 px-4 rounded-xl font-semibold shadow-sm w-full bg-slate-900 hover:bg-slate-800 text-white" asChild>
                            <Link href={`/dashboard/items?menuId=${menu.id}&categoryId=all`}>
                              <Utensils className="mr-2 h-4 w-4 opacity-80" />
                              Manage Items
                            </Link>
                          </Button>
                          
                          <div className="flex items-center gap-1.5 shrink-0 border-l border-slate-200/60 pl-2 ml-1">
                            <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl bg-white hover:bg-slate-50 border-slate-200" title="Preview Menu" asChild>
                              <Link href={`/menu/${menu.id}`} target="_blank">
                                <Eye className="h-4 w-4 text-slate-500" />
                              </Link>
                            </Button>

                            <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl bg-white hover:bg-slate-50 border-slate-200" title="QR Codes" asChild>
                              <Link href={`/dashboard/qrcodes?menuId=${menu.id}`}>
                                <QrCode className="h-4 w-4 text-slate-500" />
                              </Link>
                            </Button>

                            {(() => {
                              let baseMenuUrl = `${baseUrl}/menu/${menu.id}`;
                              if (restaurant.slug && menu.slug) {
                                if (isLocalhost) {
                                  baseMenuUrl = `${baseUrl}/${restaurant.slug}/${menu.slug}`;
                                } else {
                                  baseMenuUrl = `${baseUrl.startsWith('https') ? 'https://' : 'http://'}${domainPrefix}.${rootDomain}/${restaurant.slug}/${menu.slug}`;
                                }
                              }
                              return <MenuShareModal baseMenuUrl={baseMenuUrl} menuName={menu.name} plan={restaurant.plan?.toLowerCase() || 'free'} />;
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-16 text-center">
            <div className="bg-white p-4 rounded-full shadow-sm border border-slate-100 mb-4">
              <MenuIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium tracking-tight text-slate-900">No menus created yet</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-[260px]">
              Get started by creating your first digital menu.
            </p>
            <div className="mt-6">
              <CreateMenuSheet createAction={createMenu} chefRecommendations={chefRecommendations} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
