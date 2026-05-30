import { ExternalLink, Plus, QrCode, Trash2, ShieldAlert } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createQrCode, deleteQrCode } from "@/app/dashboard/actions";
import { CopyButton, DownloadButton } from "@/components/dashboard/qr-actions";
import { QrDesignerModal } from "@/components/dashboard/qr-designer-modal";
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
  if (count <= 4) return "grid-cols-1 md:grid-cols-2";
  if (count <= 8) return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";
  return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4";
};

export default async function QrCodesPage(
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

  const qrCodesList = qrCodes || [];

  // Determine site URL on the server
  const host = (await headers()).get("host") || "localhost:3000";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">QR Codes</h1>
          <p className="mt-1 text-slate-600">
            Generate and manage custom QR codes for your tables, bar, or take-away stand.
          </p>
        </div>
      </div>

      {searchParams.message ? (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {searchParams.message}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        {/* QR Codes Grid */}
        <div className="space-y-10">
          {qrCodesList.length > 0 ? (
            Object.entries(
              qrCodesList.reduce((acc, qr) => {
                const targetMenu = menusList.find((m) => m.id === qr.menu_id);
                const locationType = targetMenu?.location_label || "Table";
                if (!acc[locationType]) acc[locationType] = [];
                acc[locationType].push(qr);
                return acc;
              }, {} as Record<string, typeof qrCodesList>)
            ).map(([locationType, qrs]) => (
              <div key={locationType} className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-slate-400" />
                  {locationType}s
                </h3>
                <div className={`grid gap-6 ${getGridClass(qrs.length)}`}>
                  {qrs.map((qr) => {
                const targetMenu = menusList.find((m) => m.id === qr.menu_id);
                const publicUrl = `${baseUrl}/menu/${qr.menu_id}?qr=${qr.id}`;
                const qrImageApiUrl = `/api/qr?data=${encodeURIComponent(publicUrl)}`;

                return (
                  <Card key={qr.id} className="overflow-hidden flex flex-col">
                    <CardHeader className="pb-3 border-b bg-slate-50/50">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-lg">{qr.label}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Menu: {targetMenu ? targetMenu.name : "Unknown Menu"}
                          </p>
                        </div>
                        <Badge variant="secondary" className="whitespace-nowrap">
                          {qr.scan_count || 0} scans
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-6 flex-grow">
                      <a
                        href={qrImageApiUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="relative aspect-square w-full max-w-[12rem] mx-auto rounded-xl border bg-white p-3 shadow-inner hover:opacity-90 transition-opacity cursor-pointer group"
                        title="Click to open full size QR image"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrImageApiUrl}
                          alt={`QR Code for ${qr.label}`}
                          className="h-full w-full object-contain"
                        />
                        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <ExternalLink className="h-5 w-5 text-slate-700 bg-white/80 p-1 rounded-md shadow-sm" />
                        </div>
                      </a>

                      <div className="w-full mt-6 space-y-2">
                        <div className="flex gap-2">
                          <CopyButton text={publicUrl} />
                          <DownloadButton qrImageUrl={qrImageApiUrl} label={qr.label || "QR Code"} />
                        </div>
                        <div className="flex">
                          <QrDesignerModal
                            qr={qr}
                            restaurant={restaurant}
                            qrImageApiUrl={qrImageApiUrl}
                          />
                        </div>

                        <div className="flex items-center justify-between border-t pt-3">
                          <a
                            href={publicUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-slate-400 font-mono truncate max-w-[200px] hover:underline"
                          >
                            {publicUrl}
                          </a>
                          <DeleteConfirmForm
                            action={deleteQrCode}
                            confirmMessage={`Are you sure you want to delete QR code for "${qr.label}"?`}
                            name="qrCodeId"
                            value={qr.id}
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
                    </CardContent>
                  </Card>
                );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-white p-12 text-center shadow-sm">
              <QrCode className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No QR codes yet</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-sm">
                Set up your dining tables by generating a custom QR code on the right.
              </p>
            </div>
          )}
        </div>

        {/* Add QR Code Form */}
        <div>
          <Card className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
            <CardHeader>
              <CardTitle>Generate QR Code</CardTitle>
              <CardDescription>
                Link a new physical table or scan spot to one of your active menus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {menusList.length === 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <ShieldAlert className="inline mr-2 h-4 w-4 text-amber-600" />
                  Please create a menu first before generating QR codes.
                  <Button className="mt-2 w-full" variant="outline" asChild>
                    <Link href="/dashboard/menus">Create Menu</Link>
                  </Button>
                </div>
              ) : (
                <form action={createQrCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="label">Location Number/Name</Label>
                    <Input id="label" name="label" placeholder="e.g. 12, 204, Patio Booth" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="menuId">Link to Menu</Label>
                    <select
                      id="menuId"
                      name="menuId"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      required
                    >
                      {menusList.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} {m.is_active ? "" : "(Draft)"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" className="w-full">
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
