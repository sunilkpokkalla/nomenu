import { 
  ArrowRight, 
  QrCode, 
  Utensils, 
  Plus, 
  Activity, 
  Globe, 
  Smartphone, 
  ChevronRight, 
  Sparkles, 
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createRestaurant } from "@/app/dashboard/actions";
import { CuisineSelect } from "@/components/dashboard/cuisine-select";
import { CURRENCY_OPTIONS } from "@/lib/currency-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { formatTimezone } from "@/lib/date-utils";

import { TIMEZONE_OPTIONS } from "@/lib/timezone-options";

export default async function DashboardPage(
  props: {
    searchParams: Promise<{ message?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  if (!hasSupabaseEnv()) {
    return null;
  }

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
    return (
      <div className="mx-auto min-h-[100dvh] grid lg:grid-cols-[1.2fr_1fr] bg-slate-50 font-sans-vibrant">
        {/* Left Column - Editorial onboarding */}
        <div className="relative hidden lg:flex flex-col justify-between p-16 lg:p-20 bg-slate-950 text-white overflow-hidden">
          {/* Background Gradient Decorative blobs */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e293b,transparent_75%)] opacity-50 pointer-events-none" />
          <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -top-48 -right-48 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Brand Header */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-md">
              <QrCode className="h-4.5 w-4.5" strokeWidth={1.5} />
            </div>
            <span className="font-bold tracking-tight text-xl">NoMenu</span>
          </div>

          {/* Main Onboarding pitch */}
          <div className="relative z-10 space-y-6 my-auto max-w-[45ch]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" strokeWidth={1.5} /> Restaurant Profile
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-sans-vibrant">
              Create a digital menu guests will love.
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              Initialize your restaurant profile to generate QR codes, coordinate custom menus, and track scan analytics instantly.
            </p>
          </div>

          {/* Setup steps overview */}
          <div className="relative z-10 space-y-4 max-w-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Console Roadmap</p>
            <div className="grid gap-3">
              {[
                { num: "1", title: "Create Profile", desc: "Enter cuisine details, currency settings, and location info.", active: true },
                { num: "2", title: "Build Menus & Items", desc: "Design layout categories, food details, and pricing structures.", active: false },
                { num: "3", title: "Print Branded QRs", desc: "Download ready-to-display tables tents, cards, and custom prints.", active: false },
              ].map((step) => (
                <div 
                  key={step.num} 
                  className={`flex items-start gap-4 rounded-xl border p-4 transition-all duration-300 ${
                    step.active 
                      ? "border-primary/20 bg-primary/5 text-white" 
                      : "border-white/5 bg-white/[0.02] text-slate-400"
                  }`}
                >
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    step.active ? "bg-primary text-white" : "bg-white/15 text-slate-400"
                  }`}>
                    {step.num}
                  </div>
                  <div className="space-y-1">
                    <p className={`font-semibold text-sm ${step.active ? "text-white" : "text-slate-300"}`}>{step.title}</p>
                    <p className="text-xs text-slate-400 leading-normal">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Profile setup form */}
        <div className="flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
              {/* Mobile-only brand identifier */}
              <div className="flex lg:hidden items-center gap-2.5 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                  <QrCode className="h-4.5 w-4.5" strokeWidth={1.5} />
                </div>
                <span className="font-bold text-lg">NoMenu</span>
              </div>
              
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans-vibrant">
                Setup your restaurant
              </h2>
              <p className="text-sm text-slate-500">
                This creates your master restaurant console profile record in the database.
              </p>
            </div>

            {searchParams.message && !searchParams.message.toLowerCase().includes('first') ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {searchParams.message}
              </div>
            ) : null}

            <form action={createRestaurant} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Restaurant Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="e.g. Bella Italia" 
                  required 
                  className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary h-11 text-sm bg-slate-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cuisineSelect" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Cuisine / Service Style</Label>
                <CuisineSelect />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Contact Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    placeholder="e.g. +1 (555) 123-4567" 
                    className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary h-11 text-sm bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="currency" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Currency</Label>
                  <select
                    id="currency"
                    name="currency"
                    defaultValue="USD"
                    className="w-full rounded-xl border border-slate-200 focus:border-primary focus:ring-primary h-11 text-sm bg-slate-50/50 px-3 outline-none cursor-pointer"
                    required
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="timezone" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Timezone</Label>
                <select
                  id="timezone"
                  name="timezone"
                  defaultValue="America/New_York"
                  className="w-full rounded-xl border border-slate-200 focus:border-primary focus:ring-primary h-11 text-sm bg-slate-50/50 px-3 outline-none cursor-pointer"
                  required
                >
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <option key={tz.code} value={tz.code}>
                      {tz.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Street Address</Label>
                <Textarea 
                  id="address" 
                  name="address" 
                  placeholder="e.g. 123 Gourmet Way, San Francisco, CA" 
                  rows={3}
                  className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary text-sm bg-slate-50/50 resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-xl bg-slate-950 hover:bg-slate-900 text-white h-12 text-sm font-semibold tracking-wide shadow-md transition-all duration-300 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
              >
                Save Restaurant Profile
                <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 1. Fetch data for restaurant console
  const { data: scans } = await supabase
    .from("menu_scans")
    .select("*")
    .eq("restaurant_id", restaurant.id);

  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurant.id);

  const { data: qrCodes } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("restaurant_id", restaurant.id);

  const { data: menus } = await supabase
    .from("menus")
    .select("*")
    .eq("restaurant_id", restaurant.id);

  const scansList = scans || [];
  const itemsList = menuItems || [];
  const qrCodesList = qrCodes || [];
  const menusList = menus || [];

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Stats Calculations
  const scansToday = scansList.filter((s) => s.scanned_at && new Date(s.scanned_at) >= startOfToday).length;
  const scansThisMonth = scansList.filter((s) => s.scanned_at && new Date(s.scanned_at) >= startOfMonth).length;
  const activeItemsCount = itemsList.filter((item) => item.is_available).length;
  const qrCodesCount = qrCodesList.length;

  // Generate 7-day Scan Chart history
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse();

  const dailyScans = last7Days.map((day) => {
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    const count = scansList.filter((s) => {
      if (!s.scanned_at) return false;
      const scanDate = new Date(s.scanned_at);
      return scanDate >= day && scanDate < nextDay;
    }).length;
    return {
      dayName: day.toLocaleDateString([], { weekday: "short" }),
      count,
    };
  });

  const hasRealScans = scansList.length > 0;

  // Custom mock database points if no scans recorded yet (prevent empty graphs)
  const chartData = hasRealScans 
    ? dailyScans 
    : [
        { dayName: "Mon", count: 4 },
        { dayName: "Tue", count: 12 },
        { dayName: "Wed", count: 8 },
        { dayName: "Thu", count: 22 },
        { dayName: "Fri", count: 14 },
        { dayName: "Sat", count: 30 },
        { dayName: "Sun", count: 18 }
      ];

  const maxVal = Math.max(...chartData.map(d => d.count), 5);

  // Calculate SVG plot nodes inside 500x120 viewport
  const svgPoints = chartData.map((d, i) => {
    const x = 15 + (i / 6) * 470;
    const y = 15 + 90 - (d.count / maxVal) * 90;
    return { x, y };
  });

  const linePath = svgPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${svgPoints[6].x.toFixed(1)} 110 L ${svgPoints[0].x.toFixed(1)} 110 Z`;

  // Active Menu Configuration
  const activeMenu = menusList.find((m) => m.is_active) || menusList[0];

  // Top 5 scans log
  const recentScans = [...scansList]
    .sort((a, b) => {
      const timeA = a.scanned_at ? new Date(a.scanned_at).getTime() : 0;
      const timeB = b.scanned_at ? new Date(b.scanned_at).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 5);

  const planName = restaurant.plan ?? "free";
  const isPremiumPlan = planName !== "free";

  return (
    <div className="px-6 py-10 lg:px-10 bg-slate-50/50 min-h-[100dvh] font-sans-vibrant">
      {/* Header bar layout */}
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <div className="mb-2.5 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
              isPremiumPlan 
                ? "bg-amber-100 text-amber-800 border border-amber-200/50" 
                : "bg-slate-100 text-slate-700 border border-slate-200/50"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isPremiumPlan ? "bg-amber-500 animate-pulse" : "bg-slate-400"}`} />
              {planName} plan
            </span>
            {restaurant.cuisine_type ? (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200/50 uppercase tracking-wide">
                {restaurant.cuisine_type}
              </span>
            ) : null}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {restaurant.name}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">
            Manage your digital menus, print branded QR codes, and view real-time visitor analytics.
          </p>
        </div>

        <Button 
          asChild 
          className="rounded-xl bg-slate-950 hover:bg-slate-900 text-white h-11 text-sm font-semibold tracking-wide shadow-sm transition-all duration-300 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
        >
          <Link href="/dashboard/items">
            <Plus className="mr-2 h-4.5 w-4.5" strokeWidth={1.5} />
            Add Menu Item
          </Link>
        </Button>
      </div>

      {/* Asymmetric Bento Grid Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Card 1 (Col span 2): Scan Analytics Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scans & Visitors</p>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">Scan Activity</h2>
            </div>
            
            {/* Quick Metrics display */}
            <div className="flex items-center gap-6 divide-x divide-slate-100">
              <div className="text-left">
                <span className="text-xs font-semibold text-slate-400 block leading-tight">Today</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight">{scansToday}</span>
              </div>
              <div className="pl-6 text-left">
                <span className="text-xs font-semibold text-slate-400 block leading-tight">This Month</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight">{scansThisMonth}</span>
              </div>
              <div className="pl-6 text-left">
                <span className="text-xs font-semibold text-slate-400 block leading-tight">Total</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight">{scansList.length}</span>
              </div>
            </div>
          </div>

          {/* SVG Sparkline Graph container */}
          <div className="relative w-full bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
            {!hasRealScans ? (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wide select-none">
                <Activity className="h-3 w-3 animate-pulse" strokeWidth={1.5} />
                Demo Data Mode
              </div>
            ) : null}

            <div className="h-44 w-full">
              <svg viewBox="0 0 500 120" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.00" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="0" y1="15" x2="500" y2="15" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="105" x2="500" y2="105" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

                {/* Sparkline Gradient fill */}
                <path d={areaPath} fill="url(#chartGradient)" />

                {/* Sparkline Stroke line */}
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="url(#lineGradient)" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* Plot circles */}
                {svgPoints.map((p, idx) => (
                  <circle 
                    key={idx} 
                    cx={p.x} 
                    cy={p.y} 
                    r="4" 
                    fill="white" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="2" 
                  />
                ))}
              </svg>
            </div>
            
            {/* X-Axis labels */}
            <div className="flex justify-between items-center px-1.5 mt-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              {chartData.map((d, idx) => (
                <span key={idx}>{d.dayName}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2 (Col span 1): Digital Menu Status */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Active Menu</p>
            <h2 className="text-lg font-bold text-slate-900">Menu Overview</h2>
            
            {activeMenu ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-xs font-semibold text-slate-400">Current active menu</p>
                  <p className="font-bold text-slate-800 mt-1 truncate">{activeMenu.name}</p>
                  {activeMenu.description ? (
                    <p className="text-xs text-slate-500 mt-1 truncate leading-relaxed">{activeMenu.description}</p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Active availability</span>
                    <span className="font-mono">{activeItemsCount} / {itemsList.length} items</span>
                  </div>
                  {/* CSS progress bar */}
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${itemsList.length > 0 ? (activeItemsCount / itemsList.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-5 text-center">
                <Utensils className="h-6 w-6 text-slate-400 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-xs font-semibold text-slate-500">No menus created yet</p>
                <Link href="/dashboard/menus" className="text-xs font-bold text-primary hover:underline mt-1 inline-block">
                  Create your first menu &rarr;
                </Link>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">QR Codes</span>
                <span className="text-lg font-bold text-slate-900 font-mono block mt-0.5">{qrCodesCount}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Items</span>
                <span className="text-lg font-bold text-slate-900 font-mono block mt-0.5">{itemsList.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 (Col span 2): Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]">
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Real-time Stream</p>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">Recent Scans</h2>
          </div>

          {recentScans.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentScans.map((scan) => {
                const qr = qrCodesList.find((q) => q.id === scan.qr_code_id);
                const isMobile = scan.device_type?.toLowerCase().includes("mobile") ?? true;
                
                return (
                  <div key={scan.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 transition-colors duration-150 hover:bg-slate-50/30 rounded-xl px-2 -mx-2">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                        {isMobile ? (
                          <Smartphone className="h-4.5 w-4.5" strokeWidth={1.5} />
                        ) : (
                          <Globe className="h-4.5 w-4.5" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">
                          {qr ? qr.label : "General Menu Scan"}
                        </p>
                        <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                          Device: {scan.device_type || "Mobile"} • Region: {scan.country || "Local Network"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 font-mono">
                        {scan.scanned_at
                          ? formatTimezone(scan.scanned_at, restaurant.timezone, "h:mm a")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-center px-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                <Activity className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-bold text-slate-800">No activity recorded yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[34ch] leading-relaxed">
                Configure a custom QR code and display it on table stands to start tracking diner scan data.
              </p>
            </div>
          )}
        </div>

        {/* Card 4 (Col span 1): Quick Console actions */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Console shortcuts</p>
            <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          </div>

          <div className="grid gap-3.5 mt-6">
            <Link 
              href="/dashboard/qrcodes" 
              className="flex items-center justify-between border border-slate-100 rounded-2xl p-4 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200/60 transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <QrCode className="h-4.5 w-4.5" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 text-sm">QR Code Brands</p>
                  <p className="text-slate-400 text-[11px] font-medium leading-none mt-0.5">Manage & print templates</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" strokeWidth={1.5} />
            </Link>

            <Link 
              href={activeMenu ? `/menu/${activeMenu.id}` : "/dashboard/menus"} 
              target={activeMenu ? "_blank" : undefined}
              className="flex items-center justify-between border border-slate-100 rounded-2xl p-4 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200/60 transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <ExternalLink className="h-4.5 w-4.5" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 text-sm">Preview Live Menu</p>
                  <p className="text-slate-400 text-[11px] font-medium leading-none mt-0.5">Inspect guest rendering</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" strokeWidth={1.5} />
            </Link>

            <Link 
              href="/dashboard/menus" 
              className="flex items-center justify-between border border-slate-100 rounded-2xl p-4 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200/60 transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Utensils className="h-4.5 w-4.5" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 text-sm">Manage Menus</p>
                  <p className="text-slate-400 text-[11px] font-medium leading-none mt-0.5">Edit layouts & structures</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" strokeWidth={1.5} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
