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

  const isLocked = !restaurant.plan || restaurant.plan.toLowerCase() === "free";

  // If locked, we inject beautiful mock data to make the blurred background look like a busy restaurant
  let totalScans = 0;
  let scansToday = 0;
  let scansThisWeek = 0;
  let dailyScans = [] as { label: string; dateStr: string; count: number }[];
  let maxScanCount = 1;
  let iosCount = 0;
  let androidCount = 0;
  let desktopCount = 0;
  let iosPercent = 0;
  let androidPercent = 0;
  let desktopPercent = 0;
  let topCountries = [] as { country: string; count: number; percent: number }[];
  let qrPerformance = [] as { id: string; label: string | null; scan_count: number }[];

  if (isLocked) {
    totalScans = 1248;
    scansToday = 84;
    scansThisWeek = 412;
    
    dailyScans = [
      { label: "Mon", dateStr: "Oct 12", count: 45 },
      { label: "Tue", dateStr: "Oct 13", count: 32 },
      { label: "Wed", dateStr: "Oct 14", count: 58 },
      { label: "Thu", dateStr: "Oct 15", count: 40 },
      { label: "Fri", dateStr: "Oct 16", count: 95 },
      { label: "Sat", dateStr: "Oct 17", count: 112 },
      { label: "Sun", dateStr: "Oct 18", count: 84 },
    ];
    maxScanCount = 112;

    iosPercent = 64;
    androidPercent = 28;
    desktopPercent = 8;
    iosCount = Math.round(totalScans * 0.64);
    androidCount = Math.round(totalScans * 0.28);
    desktopCount = Math.round(totalScans * 0.08);

    topCountries = [
      { country: "United States", count: 998, percent: 80 },
      { country: "United Kingdom", count: 125, percent: 10 },
      { country: "Canada", count: 62, percent: 5 },
      { country: "Australia", count: 63, percent: 5 },
    ];

    qrPerformance = [
      { id: "mock1", label: "Table 1 (Window)", scan_count: 245 },
      { id: "mock2", label: "Table 4 (Booth)", scan_count: 182 },
      { id: "mock3", label: "Main Entrance", scan_count: 156 },
      { id: "mock4", label: "Bar Area - Left", scan_count: 98 },
      { id: "mock5", label: "Takeout Counter", scan_count: 76 },
    ];
  } else {
    totalScans = scansList.length;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    scansToday = scansList.filter((s) => s.scanned_at && new Date(s.scanned_at) >= startOfToday).length;

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    scansThisWeek = scansList.filter((s) => s.scanned_at && new Date(s.scanned_at) >= startOfWeek).length;

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      return d;
    }).reverse();

    dailyScans = last7Days.map((date) => {
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

    maxScanCount = Math.max(...dailyScans.map((d) => d.count), 1);

    iosCount = scansList.filter((s) => s.device_type === "iOS").length;
    androidCount = scansList.filter((s) => s.device_type === "Android").length;
    desktopCount = totalScans - iosCount - androidCount;

    iosPercent = totalScans > 0 ? Math.round((iosCount / totalScans) * 100) : 0;
    androidPercent = totalScans > 0 ? Math.round((androidCount / totalScans) * 100) : 0;
    desktopPercent = totalScans > 0 ? Math.round((desktopCount / totalScans) * 100) : 0;

    const countryCounts: Record<string, number> = {};
    scansList.forEach((s) => {
      const country = s.country || "Unknown";
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    topCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count, percent: totalScans > 0 ? Math.round((count / totalScans) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    qrPerformance = qrCodesList
      .map((qr) => {
        const qrScans = scansList.filter((s) => s.qr_code_id === qr.id).length;
        return {
          ...qr,
          scan_count: qrScans,
        };
      })
      .sort((a, b) => b.scan_count - a.scan_count)
      .slice(0, 5);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Analytics</h1>
        <p className="mt-1 text-slate-600">
          Monitor your restaurant&apos;s digital engagement, top tables, and guest traffic.
        </p>
      </div>

      {/* Locked Overlay Container */}
      <div className="relative">
        {isLocked && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/70 backdrop-blur-[2px] rounded-2xl border border-slate-100">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-sm sticky top-1/3">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Analytics Dashboard Locked</h3>
              <p className="mt-3 text-sm text-slate-500 mb-6 font-medium">
                Upgrade to the PRO Plan to monitor your restaurant's digital engagement, traffic trends, and table performance.
              </p>
              <a
                href="/dashboard/billing"
                className="inline-block w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-slate-800 transition shadow-md"
              >
                Upgrade to PRO Plan
              </a>
            </div>
          </div>
        )}

        <div className={isLocked ? "opacity-40 pointer-events-none select-none filter blur-[2px] transition-all" : ""}>
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
      </div>
    </div>
  );
}
