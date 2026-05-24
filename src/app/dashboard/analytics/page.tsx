import { BarChart3, Calendar, Globe, QrCode, Smartphone } from "lucide-react";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function AnalyticsPage() {
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

  // Fetch scans, QR codes, and menus
  const { data: scans } = await supabase
    .from("menu_scans")
    .select("*")
    .eq("restaurant_id", restaurant.id);

  const { data: qrCodes } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("restaurant_id", restaurant.id);

  const scansList = scans || [];
  const qrCodesList = qrCodes || [];

  // 1. Calculate general stats
  const totalScans = scansList.length;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const scansToday = scansList.filter((s) => s.scanned_at && new Date(s.scanned_at) >= startOfToday).length;

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  const scansThisWeek = scansList.filter((s) => s.scanned_at && new Date(s.scanned_at) >= startOfWeek).length;

  // 2. Weekly scan breakdown for chart (past 7 days)
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse();

  const dailyScans = last7Days.map((date) => {
    const count = scansList.filter((s) => {
      if (!s.scanned_at) return false;
      const scanDate = new Date(s.scanned_at);
      scanDate.setHours(0, 0, 0, 0);
      return scanDate.getTime() === date.getTime();
    }).length;
    return {
      label: weekdays[date.getDay()],
      dateStr: date.toLocaleDateString([], { month: "short", day: "numeric" }),
      count,
    };
  });

  const maxScanCount = Math.max(...dailyScans.map((d) => d.count), 1); // Avoid division by zero

  // 3. Device Type stats
  const iosCount = scansList.filter((s) => s.device_type === "iOS").length;
  const androidCount = scansList.filter((s) => s.device_type === "Android").length;
  const desktopCount = totalScans - iosCount - androidCount;

  const iosPercent = totalScans > 0 ? Math.round((iosCount / totalScans) * 100) : 0;
  const androidPercent = totalScans > 0 ? Math.round((androidCount / totalScans) * 100) : 0;
  const desktopPercent = totalScans > 0 ? Math.round((desktopCount / totalScans) * 100) : 0;

  // 4. Country breakdown
  const countryCounts: Record<string, number> = {};
  scansList.forEach((s) => {
    const country = s.country || "Unknown";
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });

  const topCountries = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count, percent: totalScans > 0 ? Math.round((count / totalScans) * 100) : 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  // 5. QR Code performance list
  const qrPerformance = qrCodesList
    .map((qr) => {
      const qrScans = scansList.filter((s) => s.qr_code_id === qr.id).length;
      return {
        ...qr,
        scan_count: qrScans,
      };
    })
    .sort((a, b) => b.scan_count - a.scan_count)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Analytics</h1>
        <p className="mt-1 text-slate-600">
          Monitor your restaurant&apos;s digital engagement, top tables, and guest traffic.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold">{totalScans}</p>
            <p className="text-sm font-medium text-slate-500">Total scans recorded</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold">{scansToday}</p>
            <p className="text-sm font-medium text-slate-500">Scanned today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold">{scansThisWeek}</p>
            <p className="text-sm font-medium text-slate-500">Scanned past 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] mb-6">
        {/* Weekly Traffic Chart */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Visitor Activity</CardTitle>
            <CardDescription>Digital menu scans over the past 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end pt-4 min-h-[300px]">
            {totalScans > 0 ? (
              <div className="space-y-4">
                {/* SVG/CSS Custom bar chart */}
                <div className="flex items-end justify-between h-48 gap-3 pt-6 border-b pb-2">
                  {dailyScans.map((d) => {
                    const heightPercent = Math.max(10, Math.round((d.count / maxScanCount) * 100));
                    return (
                      <div key={d.dateStr} className="flex-1 flex flex-col items-center group relative">
                        {/* Tooltip */}
                        <span className="absolute -top-8 scale-0 transition-all rounded bg-slate-900 px-2 py-1 text-xs text-white group-hover:scale-100 font-bold z-10">
                          {d.count} scan{d.count !== 1 ? "s" : ""}
                        </span>
                        {/* Bar */}
                        <div
                          className="w-full bg-gradient-to-t from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-t-md transition-all duration-500 shadow-sm"
                          style={{ height: `${heightPercent}%` }}
                        />
                        {/* Label */}
                        <span className="mt-2 text-xs font-semibold text-slate-500">{d.label}</span>
                        <span className="text-[10px] text-slate-400">{d.dateStr}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed bg-slate-50/50 text-sm text-slate-500">
                No scans recorded yet. Generate and scan a QR code to see metrics.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device breakdown & Location details */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Demographics & Tech</CardTitle>
            <CardDescription>Visitor hardware and geographic statistics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            {(!restaurant.plan || restaurant.plan.toLowerCase() === "free") && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-b-xl border-t border-slate-100">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 text-center max-w-[280px]">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900">Advanced Analytics Locked</h3>
                  <p className="mt-2 text-xs text-slate-500 mb-4">
                    Unlock detailed device breakdown and geographical visitor insights with the Growth plan.
                  </p>
                  <a
                    href="/dashboard/billing"
                    className="inline-block w-full bg-slate-900 text-white font-bold py-2 rounded-lg text-xs hover:bg-slate-800 transition"
                  >
                    Upgrade to Growth
                  </a>
                </div>
              </div>
            )}
            
            {/* Device breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-1.5 text-slate-700">
                  <Smartphone className="h-4 w-4 text-slate-400" /> Devices
                </h4>
                <span className="text-xs text-slate-400">{totalScans} scans</span>
              </div>
              {totalScans > 0 ? (
                <div className="space-y-3.5">
                  <div className="h-4 flex w-full rounded-full overflow-hidden bg-slate-100">
                    <div className="bg-primary transition-all" style={{ width: `${iosPercent}%` }} />
                    <div className="bg-emerald-500 transition-all" style={{ width: `${androidPercent}%` }} />
                    <div className="bg-slate-400 transition-all" style={{ width: `${desktopPercent}%` }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="font-semibold text-slate-800 flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-primary inline-block" /> iOS ({iosPercent}%)
                      </p>
                      <p className="text-[10px] text-slate-500 pl-3">{iosCount} scans</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Android ({androidPercent}%)
                      </p>
                      <p className="text-[10px] text-slate-500 pl-3">{androidCount} scans</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-slate-400 inline-block" /> Other ({desktopPercent}%)
                      </p>
                      <p className="text-[10px] text-slate-500 pl-3">{desktopCount} scans</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No device records yet.</p>
              )}
            </div>

            <hr />

            {/* Country breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-1.5 text-slate-700">
                <Globe className="h-4 w-4 text-slate-400" /> Geographic breakdown
              </h4>
              {totalScans > 0 ? (
                <div className="space-y-3">
                  {topCountries.map((c) => (
                    <div key={c.country} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700">{c.country}</span>
                        <span className="text-slate-500">{c.count} scans ({c.percent}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-primary/70 h-full rounded-full" style={{ width: `${c.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No geographic data yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Tables / QR codes */}
      <Card>
        <CardHeader>
          <CardTitle>Top QR Codes & Tables</CardTitle>
          <CardDescription>QR codes generating the highest guest traffic.</CardDescription>
        </CardHeader>
        <CardContent>
          {qrPerformance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pl-2 font-semibold">Table/QR Label</th>
                    <th className="pb-3 font-semibold">Scan Count</th>
                    <th className="pb-3 font-semibold text-right pr-2">Relative Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {qrPerformance.map((qr) => {
                    const relativePercent = totalScans > 0 ? Math.round((qr.scan_count / totalScans) * 100) : 0;
                    return (
                      <tr key={qr.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 pl-2 font-medium text-slate-800 flex items-center gap-2">
                          <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <QrCode className="h-4 w-4" />
                          </span>
                          {qr.label}
                        </td>
                        <td className="py-4 font-bold text-slate-900">{qr.scan_count} scans</td>
                        <td className="py-4 text-right pr-2">
                          <div className="inline-flex items-center gap-2 w-48 text-left">
                            <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="bg-primary h-full rounded-full" style={{ width: `${relativePercent}%` }} />
                            </div>
                            <span className="text-xs text-slate-400 w-8 font-semibold">{relativePercent}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-44 items-center justify-center rounded-lg border border-dashed bg-slate-50/50 text-sm text-slate-500">
              No active QR codes generated scan logs yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
