import { ExternalLink, Plus, QrCode, Trash2, ShieldAlert, MapPin, Grid2x2, BedDouble, Coffee, Wine, Sun, Car, Building, Armchair, Utensils } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createQrCode, bulkCreateQrCodes, syncQrCodesFromFloorPlan, deleteQrCode } from "@/app/dashboard/actions";
import { CopyButton, DownloadButton } from "@/components/dashboard/qr-actions";
import { QrDesignerModal } from "@/components/dashboard/qr-designer-modal";
import { DeleteConfirmForm } from "@/components/dashboard/delete-confirm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateQrSheet } from "@/components/dashboard/create-qr-sheet";
import { ManageLocationZonesModal } from "@/components/dashboard/manage-location-zones-modal";
import { QrCategoryFilter } from "@/components/dashboard/qr-category-filter";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";

const getLocationIcon = (format: string) => {
  const normalized = format.toLowerCase();
  if (normalized.includes("room") || normalized.includes("hotel") || normalized.includes("suite")) return BedDouble;
  if (normalized.includes("table") || normalized.includes("dining") || normalized.includes("restaurant")) return Utensils;
  if (normalized.includes("bar") || normalized.includes("drink") || normalized.includes("wine")) return Wine;
  if (normalized.includes("cafe") || normalized.includes("coffee") || normalized.includes("lounge")) return Coffee;
  if (normalized.includes("pool") || normalized.includes("patio") || normalized.includes("outdoor") || normalized.includes("beach") || normalized.includes("cabana")) return Sun;
  if (normalized.includes("lobby") || normalized.includes("building")) return Building;
  if (normalized.includes("drive") || normalized.includes("car") || normalized.includes("curb")) return Car;
  if (normalized.includes("seating") || normalized.includes("waiting") || normalized.includes("chair")) return Armchair;
  return MapPin;
};

const getGridClass = (count: number) => {
  if (count <= 2) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  if (count <= 4) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
  return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";
};

import { QrCodesClient } from "@/components/dashboard/qr-codes-client";
import { getActiveRestaurant, UserRole } from "@/lib/rbac";

export default async function QrCodesPage(
  props: {
    searchParams: Promise<{ message?: string; menuId?: string; category?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const menuIdFilter = searchParams.menuId;
  const categoryFilter = searchParams.category;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const restaurant = await getActiveRestaurant(supabase, user.id);

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

  // Fetch QR Codes
  const { data: qrCodes } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false });

  let qrCodesList = qrCodes || [];
  
  if (menuIdFilter) {
    qrCodesList = qrCodesList.filter((qr) => qr.menu_id === menuIdFilter);
  }

  // Derive unique categories from the current list (location_zone + modes)
  const uniqueCategories = Array.from(new Set(qrCodesList.map(qr => {
    let locationType = qr.location_zone || "Main Dining";
    if (qr.mode === "pickup") locationType = "Takeaway";
    if (qr.mode === "reserve") locationType = "Priority Reserve";
    return locationType;
  }))).sort();

  if (categoryFilter) {
    qrCodesList = qrCodesList.filter((qr) => {
      let locationType = qr.location_zone || "Main Dining";
      if (qr.mode === "pickup") locationType = "Takeaway";
      if (qr.mode === "reserve") locationType = "Priority Reserve";
      return locationType === categoryFilter;
    });
  }

  // Determine site URL on the server
  const host = (await headers()).get("host") || "localhost:3000";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const baseUrl = process.env.NODE_ENV === 'development' ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`);
  const rootDomain = baseUrl.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locationZones: string[] = (restaurant as any).location_zones || ["Main Dining"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-3">
            QR Codes
            {menuIdFilter && (
              <Badge variant="outline" className="text-sm font-normal bg-indigo-50 text-indigo-700 border-indigo-200">
                Filtered
              </Badge>
            )}
          </h1>
          <p className="mt-1 text-slate-600">
            Generate and manage custom QR codes for your tables, bar, or take-away stand.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(menuIdFilter || categoryFilter) && (
            <Button variant="outline" asChild>
              <Link href="/dashboard/qrcodes">Clear Filters</Link>
            </Button>
          )}
          <QrCategoryFilter categories={uniqueCategories} />
          <CreateQrSheet 
            createAction={createQrCode} 
            bulkCreateAction={bulkCreateQrCodes}
            syncAction={syncQrCodesFromFloorPlan}
            locationZones={locationZones} 
            menusList={menusList} 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            plan={(restaurant as any).plan?.toLowerCase() || 'free'}
            ManageLocationZonesModal={
              <ManageLocationZonesModal 
                key="manage-zones-header"
                restaurantId={restaurant.id} 
                initialZones={locationZones} 
              />
            }
          />
        </div>
      </div>

      {searchParams.message && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {searchParams.message}
        </div>
      )}

      {/* QR Codes Grid wrapped in Client Component */}
      <QrCodesClient 
        qrCodesList={qrCodesList}
        menusList={menusList}
        restaurant={restaurant}
        baseUrl={baseUrl}
        rootDomain={rootDomain}
        getLocationIconStr="icon"
      />
    </div>
  );
}
