import { Building2, Save } from "lucide-react";
import { redirect } from "next/navigation";

import { updateRestaurantSettings } from "@/app/dashboard/actions";
import { CuisineSelect } from "@/components/dashboard/cuisine-select";
import { CURRENCY_OPTIONS } from "@/lib/currency-options";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";


const COMMON_TIMEZONES = [
  { tz: "Pacific/Midway", label: "(UTC-11:00) Midway Island, Samoa" },
  { tz: "Pacific/Honolulu", label: "(UTC-10:00) Hawaii" },
  { tz: "America/Anchorage", label: "(UTC-09:00) Alaska" },
  { tz: "America/Los_Angeles", label: "(UTC-08:00) Pacific Time (US & Canada)" },
  { tz: "America/Denver", label: "(UTC-07:00) Mountain Time (US & Canada)" },
  { tz: "America/Chicago", label: "(UTC-06:00) Central Time (US & Canada)" },
  { tz: "America/New_York", label: "(UTC-05:00) Eastern Time (US & Canada)" },
  { tz: "America/Caracas", label: "(UTC-04:00) Caracas, La Paz" },
  { tz: "America/Buenos_Aires", label: "(UTC-03:00) Buenos Aires, Brazil" },
  { tz: "Atlantic/South_Georgia", label: "(UTC-02:00) Mid-Atlantic" },
  { tz: "Atlantic/Azores", label: "(UTC-01:00) Azores, Cape Verde" },
  { tz: "UTC", label: "(UTC+00:00) Coordinated Universal Time" },
  { tz: "Europe/London", label: "(UTC+00:00) London, Edinburgh (UK)" },
  { tz: "Europe/Paris", label: "(UTC+01:00) Central European Time (Paris, Berlin)" },
  { tz: "Europe/Athens", label: "(UTC+02:00) Eastern European Time (Athens, Cairo)" },
  { tz: "Europe/Moscow", label: "(UTC+03:00) Moscow, St. Petersburg" },
  { tz: "Asia/Dubai", label: "(UTC+04:00) Abu Dhabi, Muscat, Dubai" },
  { tz: "Asia/Karachi", label: "(UTC+05:00) Islamabad, Karachi" },
  { tz: "Asia/Kolkata", label: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi (India)" },
  { tz: "Asia/Dhaka", label: "(UTC+06:00) Astana, Dhaka (Bangladesh)" },
  { tz: "Asia/Bangkok", label: "(UTC+07:00) Bangkok, Hanoi, Jakarta" },
  { tz: "Asia/Hong_Kong", label: "(UTC+08:00) Beijing, Hong Kong, Singapore" },
  { tz: "Asia/Tokyo", label: "(UTC+09:00) Osaka, Sapporo, Tokyo (Japan)" },
  { tz: "Australia/Sydney", label: "(UTC+10:00) Canberra, Melbourne, Sydney" },
  { tz: "Asia/Magadan", label: "(UTC+11:00) Magadan, Solomon Is., New Caledonia" },
  { tz: "Pacific/Auckland", label: "(UTC+12:00) Auckland, Wellington (New Zealand)" },
];

export default async function SettingsPage(
  props: {
    searchParams: Promise<{ message?: string; success?: string }>;
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

  const hasCustomLegacyCurrency = restaurant.currency && !CURRENCY_OPTIONS.some((c) => c.code === restaurant.currency);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Settings</h1>
        <p className="mt-1 text-slate-600">
          Manage your restaurant profile, address details, and regional currency settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Restaurant Profile
          </CardTitle>
          <CardDescription>
            This information is shown on your public digital menu and printed QR codes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateRestaurantSettings} className="space-y-6">
            {searchParams.success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {searchParams.success}
              </div>
            )}
            {searchParams.message && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {searchParams.message}
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name</Label>
                <Input id="name" name="name" defaultValue={restaurant.name} placeholder="Le Bistrot Parisien" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cuisineSelect">Cuisine / Service Style</Label>
                <CuisineSelect defaultValue={restaurant.cuisine_type || ""} />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" defaultValue={restaurant.phone || ""} placeholder="e.g. +33 1 45 55 12 34" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency Code</Label>
                <select
                  id="currency"
                  name="currency"
                  defaultValue={restaurant.currency || "USD"}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-10 cursor-pointer"
                  required
                >
                  {hasCustomLegacyCurrency && (
                    <option value={restaurant.currency!}>
                      {restaurant.currency} (Custom)
                    </option>
                  )}
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address">Physical Address</Label>
                <Textarea id="address" name="address" defaultValue={restaurant.address || ""} placeholder="75 Rue de l'Université, Paris, France" rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  name="timezone"
                  defaultValue={restaurant.timezone || "UTC"}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-10 cursor-pointer"
                >
                  {COMMON_TIMEZONES.map(({ tz, label }) => (
                    <option key={tz} value={tz}>
                      {label}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground">Used for analytics and feedback timestamps.</p>
              </div>
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
