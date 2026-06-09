import { ExternalLink, Plus, QrCode, Trash2, ShieldAlert, MapPin, Grid2x2 } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createQrCode, deleteQrCode } from "@/app/dashboard/actions";
import { CopyButton, DownloadButton } from "@/components/dashboard/qr-actions";
import { QrDesignerModal } from "@/components/dashboard/qr-designer-modal";
import { ManageLocationZonesModal } from "@/components/dashboard/manage-location-zones-modal";
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
import { createClient } from "@/lib/supabase/server";

const getGridClass = (count: number) => {
  if (count <= 4) return "grid-cols-1 sm:grid-cols-2";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
};

export default async function QrCodesPage(
  props: {
    searchParams: Promise<{ message?: string; menuId?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const menuIdFilter = searchParams.menuId;
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

  // Determine site URL on the server
  const host = (await headers()).get("host") || "localhost:3000";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const baseUrl = process.env.NODE_ENV === 'development' ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`);
  const rootDomain = baseUrl.replace(/^https?:\/\//, "").split("/")[0];

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
        {menuIdFilter && (
          <Button variant="outline" asChild>
            <Link href="/dashboard/qrcodes">Clear Filter</Link>
          </Button>
        )}
      </div>

      {searchParams.message ? (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {searchParams.message}
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* QR Codes Grid */}
        <div className="space-y-12">
          {qrCodesList.length > 0 ? (
            Object.entries(
              qrCodesList.reduce((acc, qr) => {
                const locationType = qr.location_zone || "Main Dining";
                if (!acc[locationType]) acc[locationType] = [];
                acc[locationType].push(qr);
                return acc;
              }, {} as Record<string, typeof qrCodesList>)
            ).map(([locationType, qrs]) => (
              <div key={locationType} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-white border shadow-sm rounded-full p-2.5">
                    <MapPin className="w-4 h-4 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-medium tracking-tight text-slate-900">{locationType}</h3>
                  <div className="h-px bg-gradient-to-r from-slate-200 to-transparent flex-1 ml-4" />
                </div>
                
                <div className={`grid gap-5 ${getGridClass(qrs.length)}`}>
                  {qrs.map((qr) => {
                const targetMenu = menusList.find((m) => m.id === qr.menu_id);
                
                // Tier-Based URL Construction
                const plan = restaurant.plan?.toLowerCase() || 'free';
                const domainPrefix = ['elite', 'enterprise'].includes(plan) ? 'order' : 'menu';
                
                let publicUrl = `${baseUrl}/menu/${qr.menu_id}?qr=${qr.id}`;
                if (restaurant.slug && targetMenu?.slug) {
                  const isLocalhost = rootDomain.includes('localhost') || rootDomain.includes('127.0.0.1');
                  if (isLocalhost) {
                    publicUrl = `${baseUrl}/${restaurant.slug}/${targetMenu.slug}?qr=${qr.id}`;
                  } else {
                    publicUrl = `${baseUrl.startsWith('https') ? 'https://' : 'http://'}${domainPrefix}.${rootDomain}/${restaurant.slug}/${targetMenu.slug}?qr=${qr.id}`;
                  }
                }
                
                const qrImageApiUrl = `/api/qr?data=${encodeURIComponent(publicUrl)}`;
                
                return (
                  <Card key={qr.id} className="flex flex-col bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden">
                    <div className="flex flex-col items-center text-center p-6 pb-0">
                      <h3 className="text-xl font-bold text-slate-900">{qr.label}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Menu: {targetMenu ? targetMenu.name : "Unknown"}
                      </p>
                      <span className="mt-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {qr.scan_count || 0} scans
                      </span>
                    </div>

                    <div className="px-6 py-5">
                      <div className="w-full border-t border-slate-100 mb-5" />
                      
                      <a
                        href={qrImageApiUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block aspect-square w-full max-w-[11rem] mx-auto rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_0_15px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow cursor-pointer"
                        title="Click to open full size QR image"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrImageApiUrl}
                          alt={`QR Code for ${qr.label}`}
                          className="h-full w-full object-contain rounded-lg"
                        />
                      </a>

                      <div className="w-full border-t border-slate-100 mt-5" />
                    </div>

                    <div className="flex items-center justify-center gap-3 pb-6 px-6">
                      <CopyButton text={publicUrl} iconOnly />
                      <DownloadButton qrImageUrl={qrImageApiUrl} label={qr.label || "QR Code"} iconOnly />
                      <QrDesignerModal 
                        qr={{
                          id: qr.id,
                          label: `${qr.location_zone || "Main Dining"} • ${qr.label}`,
                          scan_count: qr.scan_count || 0,
                          menu_id: qr.menu_id,
                        }} 
                        restaurant={restaurant} 
                        qrImageApiUrl={qrImageApiUrl} 
                        iconOnly 
                      />
                      <div className="w-px h-5 bg-slate-200 mx-1" />
                      <DeleteConfirmForm
                        action={deleteQrCode}
                        confirmMessage={`Are you sure you want to delete QR code for "${qr.label}"?`}
                        name="qrCodeId"
                        value={qr.id}
                      >
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                          title="Delete QR Code"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DeleteConfirmForm>
                    </div>
                  </Card>
                );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-16 text-center">
              <div className="bg-white p-4 rounded-full shadow-sm border border-slate-100 mb-4">
                <Grid2x2 className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium tracking-tight text-slate-900">
                {menuIdFilter ? "No QR codes linked to this menu" : "No QR codes yet"}
              </h3>
              <p className="mt-2 text-sm text-slate-500 max-w-[260px]">
                Create your first QR code on the right to start digitizing your tables.
              </p>
            </div>
          )}
        </div>

        {/* Add QR Code Form */}
        <div>
          <Card className="sticky top-6 rounded-2xl border-0 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 pt-6 px-6 border-b border-slate-50 bg-white">
              <div className="space-y-1.5">
                <CardTitle className="text-xl font-semibold tracking-tight">Generate QR Code</CardTitle>
                <CardDescription className="text-sm">
                  Create a new physical touchpoint.
                </CardDescription>
              </div>
              <ManageLocationZonesModal restaurantId={restaurant.id} initialZones={locationZones} />
            </CardHeader>
            <CardContent className="p-6 bg-slate-50/30">
              {menusList.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 shadow-sm">
                  <ShieldAlert className="inline mr-2 h-5 w-5 text-amber-600 mb-1" />
                  <span className="font-medium">Missing Menu</span>
                  <p className="mt-1 text-amber-700/80">Please create a menu first before generating QR codes.</p>
                  <Button className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white border-0 shadow-sm" asChild>
                    <Link href="/dashboard/menus">Create Menu</Link>
                  </Button>
                </div>
              ) : (
                <form action={createQrCode} className="space-y-5">
                  <div className="space-y-2.5">
                    <Label htmlFor="location_zone" className="text-slate-700 font-medium">Location Zone</Label>
                    <select
                      id="location_zone"
                      name="location_zone"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                      required
                    >
                      {locationZones.map((zone, idx) => (
                        <option key={idx} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="label" className="text-slate-700 font-medium">Table Number / Label</Label>
                    <Input 
                      id="label" 
                      name="label" 
                      placeholder="e.g. 12, 204, Booth 4" 
                      required 
                      className="rounded-xl px-3.5 py-2.5 shadow-sm border-slate-200 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 h-auto"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="menuId" className="text-slate-700 font-medium">Link to Menu</Label>
                    <select
                      id="menuId"
                      name="menuId"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                      required
                    >
                      {menusList.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} {m.is_active ? "" : " (Draft)"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" className="w-full rounded-xl h-11 font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all mt-6">
                    <Plus className="mr-2 h-4 w-4" />
                    Generate QR Code
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
