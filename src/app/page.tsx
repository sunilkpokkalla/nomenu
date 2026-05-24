"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  ArrowRight, 
  QrCode, 
  Menu, 
  X, 
  Sparkles, 
  Palette, 
  Printer, 
  Wifi, 
  Smartphone, 
  Check, 
  CheckCircle2, 
  Layers, 
  TrendingUp,
  Flame,
  Zap,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const THEME_PREVIEWS = [
  {
    id: "portrait",
    name: "Classic Table Tent",
    description: "Perfect for acrylic table stands. Displays custom primary branding colors, dynamic headlines, and guest WiFi credentials at the bottom.",
    tag: "Most Popular",
    color: "from-blue-600 to-indigo-700",
    features: ["Custom brand colors", "Double border accent", "Direct table badge details", "WiFi network summary block"]
  },
  {
    id: "instagram",
    name: "Instagram Square (1:1)",
    description: "Optimized for social sharing or square table decals. Features beautiful rich gradient backgrounds, glassmorphic card overlays, and restaurant branding.",
    tag: "Social Ready",
    color: "from-amber-500 to-rose-600",
    features: ["Curated gradient presets", "Glassmorphism drop shadow card", "Monogram avatar logo", "Compact scan subtext"]
  },
  {
    id: "minimalist",
    name: "Minimalist Classic",
    description: "An elegant, clean design tailored for high-end dining and modern bistros. High-contrast typography and subtle hairline borders focus purely on class.",
    tag: "Elegant & Crisp",
    color: "from-slate-900 to-slate-950",
    features: ["Elegant Georgia serif typeface", "Double hairline border styling", "Minimalist divider dots", "High-contrast printable vector style"]
  }
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("portrait");

  const activeThemeData = THEME_PREVIEWS.find(t => t.id === activeTheme) || THEME_PREVIEWS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-600 selection:text-white relative overflow-x-hidden font-sans-vibrant">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none -z-10" />
      <div className="absolute top-[20%] -left-48 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] -right-48 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* FLOATING GLASSMORPHIC NAVIGATION BAR */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
        <div className="w-full rounded-full border border-slate-200/50 bg-white/70 backdrop-blur-md px-6 py-3.5 flex items-center justify-between shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                <QrCode className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-950">
                NoMenu
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-500">
              <a href="#features" className="hover:text-slate-900 transition-colors duration-200">Features</a>
              <a href="#themes" className="hover:text-slate-900 transition-colors duration-200">QR Templates</a>
              <a href="#pricing" className="hover:text-slate-900 transition-colors duration-200">Pricing</a>
              <a href="#how-it-works" className="hover:text-slate-900 transition-colors duration-200">How it Works</a>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="font-bold text-xs uppercase tracking-wider text-slate-500 hover:text-slate-950">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm" className="font-bold text-xs uppercase tracking-wider bg-slate-950 hover:bg-slate-900 text-white rounded-full px-5 py-5 shadow-sm active:scale-[0.98] transition-all duration-300">
              <Link href="/signup">Create Free Menu</Link>
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 border border-slate-200 bg-white/95 backdrop-blur-lg rounded-3xl p-6 space-y-4 shadow-xl animate-in fade-in slide-in-from-top duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
            <nav className="flex flex-col gap-3 text-sm font-bold text-slate-650">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-slate-55 transition-colors">Features</a>
              <a href="#themes" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-slate-55 transition-colors">QR Templates</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-slate-55 transition-colors">Pricing</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-slate-55 transition-colors">How it Works</a>
            </nav>
            <hr className="border-slate-100" />
            <div className="flex flex-col gap-2.5">
              <Button asChild variant="outline" className="w-full font-bold rounded-xl h-11">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
              </Button>
              <Button asChild className="w-full font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-xl h-11">
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Get Started Free</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-150 bg-indigo-50/50 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-indigo-600 mb-8 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 fill-indigo-500/10" strokeWidth={1.5} />
            <span>Interactive Designer Canvas & Presets</span>
          </div>

          {/* Main Headings */}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl md:text-7xl leading-[1.05] max-w-5xl mx-auto">
            Your digital menu. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 font-serif-luxury italic font-medium capitalize">
              one brand-aligned scan away.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base sm:text-lg text-slate-500 leading-relaxed font-medium">
            Ditch generic, boring black-and-white QR code prints. Create custom restaurant menus, tweak brand colors, embed logos, and download gorgeous high-resolution print-ready cards.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row max-w-md mx-auto sm:max-w-none px-4">
            <Button asChild size="lg" className="rounded-full bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm px-6 py-6 shadow-lg shadow-slate-950/10 active:scale-[0.98] transition-all duration-300 group">
              <Link href="/signup" className="flex items-center gap-3">
                Create Free Menu
                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-[1px] transition-transform duration-300">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </Button>
          </div>

          {/* Double-Bezel Mockup Display with Z-Axis Cascade */}
          <div className="mt-20 md:mt-24 relative mx-auto max-w-4xl">
            {/* Outer Bezel */}
            <div className="rounded-[2.2rem] border border-slate-200/50 bg-slate-100/80 p-2.5 shadow-2xl shadow-slate-900/5 transition-transform duration-500 hover:scale-[1.005]">
              {/* Inner Core */}
              <div className="bg-white rounded-[calc(2.2rem-0.625rem)] overflow-hidden border border-slate-200/40 relative aspect-video shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-preview.png"
                  alt="NoMenu premium smartphone menu mockup and QR code cards on a table"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Float Badge 1 (Scan statistics) - Hidden on mobile */}
            <div className="absolute -top-6 -left-6 z-10 hidden md:flex items-center gap-3 rounded-2xl border border-slate-200/40 bg-white/90 backdrop-blur-md p-3.5 shadow-xl shadow-slate-900/5 animate-bounce-slow">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <TrendingUp className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">Daily Activity</p>
                <p className="text-sm font-black text-slate-900 mt-1 leading-none">+342 Scans Today</p>
              </div>
            </div>

            {/* Float Badge 2 (Live Badge indicator) - Hidden on mobile */}
            <div className="absolute -bottom-6 -right-6 z-10 hidden md:flex items-center gap-3 rounded-2xl border border-slate-200/40 bg-white/90 backdrop-blur-md p-3.5 shadow-xl shadow-slate-900/5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                <QrCode className="h-5 w-5 animate-pulse" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">Status</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <p className="text-sm font-black text-slate-900 leading-none">Live Console</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ASYMMETRIC BENTO GRID FEATURES SECTION */}
      <section id="features" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-left max-w-3xl mb-20 space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-indigo-400 flex items-center gap-2">
              <Flame className="h-4 w-4 fill-indigo-400/10" strokeWidth={1.5} /> Professional Platform Tools
            </h2>
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white leading-tight">
              A comprehensive toolkit built to showcase your kitchen.
            </h3>
            <p className="text-slate-400 max-w-2xl font-medium">
              A seamless digital experience constructed for restaurants, pop-ups, and bistros. Zero installation required, optimized for instantaneous browser load.
            </p>
          </div>

          {/* Asymmetric Bento Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Bento Card 1 (Col span 2): Custom brand colors */}
            <div className="md:col-span-2 group rounded-[2rem] border border-slate-800 bg-slate-950 p-2 transition-all duration-300 hover:border-slate-700">
              <div className="bg-slate-900/50 rounded-[calc(2rem-0.5rem)] p-6 lg:p-10 flex flex-col justify-between h-full min-h-[320px]">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3 max-w-md">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Palette className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <h4 className="font-extrabold text-xl text-white">Custom Brand Color Presets</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      Configure custom color palettes or gradients. Reflect your physical restaurant atmosphere directly inside the browser viewport.
                    </p>
                  </div>

                  {/* Visual preview widget inside card */}
                  <div className="flex gap-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shrink-0 self-start">
                    {["bg-blue-600", "bg-rose-500", "bg-amber-500", "bg-emerald-600", "bg-slate-950 border border-white/20"].map((color, idx) => (
                      <div key={idx} className={`w-8 h-8 rounded-full ${color} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}>
                        {idx === 0 && <Check className="h-4 w-4 text-white" strokeWidth={2.5} />}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 flex gap-6 text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-indigo-400" /> Palette Hex pickers</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-indigo-400" /> Gradient presets</div>
                </div>
              </div>
            </div>

            {/* Bento Card 2 (Col span 1): Zero App Mobile View */}
            <div className="group rounded-[2rem] border border-slate-800 bg-slate-950 p-2 transition-all duration-300 hover:border-slate-700">
              <div className="bg-slate-900/50 rounded-[calc(2rem-0.5rem)] p-6 lg:p-8 flex flex-col justify-between h-full min-h-[320px]">
                <div className="space-y-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    <Smartphone className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-extrabold text-xl text-white">Instant Responsive View</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Render menus instantly in mobile browsers without downloads. Guests scan, filters update, and orders flow.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800 mt-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Performance</span>
                  <span className="text-xs font-bold text-white mt-1 block">99/100 Core Web Vitals Rating</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3 (Col span 1): Guest WiFi */}
            <div className="group rounded-[2rem] border border-slate-800 bg-slate-950 p-2 transition-all duration-300 hover:border-slate-700">
              <div className="bg-slate-900/50 rounded-[calc(2rem-0.5rem)] p-6 lg:p-8 flex flex-col justify-between h-full min-h-[320px]">
                <div className="space-y-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Wifi className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-extrabold text-xl text-white">Automatic WiFi Details</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Incorporate SSID & credentials onto the QR card base, giving diners immediate access without service disruptions.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800 mt-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Integration</span>
                  <span className="text-xs font-bold text-white mt-1 block">Printed credentials summary card</span>
                </div>
              </div>
            </div>

            {/* Bento Card 4 (Col span 2): Print-ready custom QRs */}
            <div className="md:col-span-2 group rounded-[2rem] border border-slate-800 bg-slate-950 p-2 transition-all duration-300 hover:border-slate-700">
              <div className="bg-slate-900/50 rounded-[calc(2rem-0.5rem)] p-6 lg:p-10 flex flex-col justify-between h-full min-h-[320px]">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3 max-w-md">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Printer className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <h4 className="font-extrabold text-xl text-white">High-DPI Print Downloads</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      Select layout sizes, configure table stand tents, or download beautiful high-contrast Instagram-ready squares at 2x resolution.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-3 shrink-0 self-start text-xs font-semibold text-slate-300">
                    <QrCode className="h-4 w-4 text-emerald-450" />
                    <span>2X PNG & PDF Export</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-6 text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-450" /> Crop marks ready</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-450" /> Standard tent cut outlines</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TEMPLATE STYLES SHOWCASE */}
      <section id="themes" className="py-24 bg-slate-50 border-y border-slate-200/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Description Column */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-indigo-600 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5" /> High-DPI Canvas Templates
              </span>
              <h3 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl leading-tight">
                Designed for high quality table print.
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Unlock layouts custom made for physical placement. Pick a canvas preset, tweak tags, and download vectors immediately.
              </p>

              {/* Selector Tabs */}
              <div className="space-y-3.5">
                {THEME_PREVIEWS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTheme(t.id)}
                    className={`w-full text-left p-4 rounded-[1.2rem] border transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      activeTheme === t.id
                        ? "border-slate-300 bg-white shadow-md shadow-slate-900/5 ring-1 ring-slate-250/20"
                        : "border-slate-200 bg-transparent hover:border-slate-350 hover:bg-white/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
                          {t.name}
                          {activeTheme === t.id && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-950 text-white font-extrabold uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-550 font-medium line-clamp-1">{t.description}</p>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${activeTheme === t.id ? "text-slate-950 translate-x-1" : ""}`} strokeWidth={1.5} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Display Preview Box (Double Bezel structure) */}
            <div className="lg:col-span-7 rounded-[2.2rem] border border-slate-200/50 bg-slate-100/50 p-2.5 shadow-xl shadow-slate-250/50">
              <div className="bg-white rounded-[calc(2.2rem-0.625rem)] border border-slate-200/40 p-8 lg:p-12 flex flex-col justify-center items-center min-h-[460px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl" />
                
                <div className="mb-6">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Live Designer Canvas Preview</span>
                </div>

                {activeTheme === "portrait" && (
                  <div className="w-60 h-[340px] rounded-[1.8rem] flex flex-col bg-white border border-slate-200/80 shadow-lg relative overflow-hidden transition-all duration-500 scale-105">
                    <div className="h-3 w-full bg-indigo-650"></div>
                    <div className="p-5 flex flex-grow flex-col items-center justify-between">
                      <div className="flex flex-col items-center text-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-indigo-650 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
                          L
                        </div>
                        <h4 className="font-extrabold text-xs text-slate-900 mt-1 leading-none">Lumina Bistro</h4>
                        <div className="w-8 h-0.5 bg-amber-500 mt-1"></div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[9px] font-extrabold text-slate-800 uppercase tracking-wider leading-none">Scan to View Menu</span>
                        <div className="border border-slate-100 p-2 rounded-2xl bg-slate-50/50">
                          <QrCode className="h-20 w-20 text-slate-800" strokeWidth={1.5} />
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1 w-full">
                        <span className="text-[8px] font-extrabold text-white px-3 py-0.5 rounded-full bg-indigo-650 uppercase tracking-widest leading-none">
                          Table 5
                        </span>
                        <span className="text-[7px] text-slate-400 mt-1 font-semibold">Camera scan • No app required</span>
                        
                        <div className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-1.5 text-center mt-2">
                          <p className="text-[7.5px] font-extrabold text-slate-655 leading-none">📶 Connect Guest WiFi</p>
                          <p className="text-[7px] text-slate-450 mt-0.5 font-semibold">Password: LuminaGuest</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTheme === "instagram" && (
                  <div className="w-64 h-64 rounded-[1.8rem] flex flex-col items-center justify-between p-4 shadow-lg bg-gradient-to-tr from-amber-500 to-rose-600 text-white relative overflow-hidden transition-all duration-500 scale-105">
                    <div className="bg-white rounded-[calc(1.8rem-0.5rem)] w-full h-full flex flex-col items-center justify-between p-4 text-slate-850">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center text-[10px] shadow-sm">
                          L
                        </div>
                        <h4 className="font-extrabold text-[11px] text-slate-900 leading-none">{activeThemeData.name}</h4>
                        <span className="text-[7px] uppercase font-extrabold text-slate-450 tracking-wider">Scan to view</span>
                      </div>

                      <QrCode className="w-24 h-24 text-slate-800" strokeWidth={1.5} />

                      <div className="flex flex-col items-center gap-1 w-full">
                        <span className="font-black text-[10px] text-slate-700 tracking-wider">TABLE 5</span>
                        <div className="bg-slate-100 px-2.5 py-0.5 rounded-full text-[7.5px] font-extrabold text-slate-550">
                          📶 WiFi: LuminaGuest
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTheme === "minimalist" && (
                  <div className="w-56 h-[320px] rounded-2xl bg-white border-2 border-slate-900 p-1.5 shadow-lg transition-all duration-500 scale-105">
                    <div className="border border-slate-900 rounded-[calc(1.8rem-0.75rem)] w-full h-full p-4 flex flex-col items-center justify-between font-serif text-slate-900">
                      <div className="text-center flex flex-col items-center gap-0.5">
                        <h4 className="italic text-sm font-normal tracking-wide">Lumina Bistro</h4>
                        <span className="text-[7px] text-slate-400 tracking-widest font-sans font-bold leading-none">• • •</span>
                      </div>

                      <QrCode className="w-24 h-24 text-slate-900" strokeWidth={1.5} />

                      <div className="flex flex-col items-center gap-1 text-center w-full">
                        <span className="text-[9.5px] font-bold leading-tight font-sans">Scan for Menu</span>
                        <span className="text-[8px] font-extrabold tracking-widest uppercase leading-none font-sans mt-0.5">TABLE 5</span>
                        <span className="text-[7px] text-slate-400 italic">Please scan to browse</span>
                        <div className="text-[7px] text-slate-700 tracking-wide mt-2 border-t pt-1.5 w-full text-center font-sans">
                          📶 WiFi Network | Pass: LuminaGuest
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Theme features grid */}
                <div className="mt-10 grid grid-cols-2 gap-3.5 w-full max-w-md">
                  {activeThemeData.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="truncate font-semibold text-slate-750">{feat}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-indigo-600 flex items-center justify-center gap-2">
              <Layers className="h-4 w-4 text-indigo-500" strokeWidth={1.5} /> Structured Setup
            </h2>
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-950">
              Get up and running in under 10 minutes.
            </h3>
            <p className="text-slate-500 font-medium">
              Create your profile, populate your dishes, select a design, and print cards directly from your console.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            
            {/* Step 1 */}
            <div className="group rounded-[2.2rem] border border-slate-200/50 bg-slate-50 p-2 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50">
              <div className="bg-white rounded-[calc(2.2rem-0.5rem)] p-8 relative flex flex-col justify-between h-full min-h-[240px] text-left border border-slate-200/20">
                <span className="absolute top-4 right-6 text-6xl font-black text-slate-100 select-none leading-none">01</span>
                <div>
                  <div className="h-10 w-10 bg-indigo-500/10 text-indigo-650 border border-indigo-500/20 rounded-xl flex items-center justify-center font-bold mb-5">
                    1
                  </div>
                  <h4 className="font-extrabold text-lg text-slate-950">Set Up Your Brand</h4>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed font-medium">
                    Configure restaurant properties, primary color layouts, currency variables, and guest WiFi options.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group rounded-[2.2rem] border border-slate-200/50 bg-slate-50 p-2 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50">
              <div className="bg-white rounded-[calc(2.2rem-0.5rem)] p-8 relative flex flex-col justify-between h-full min-h-[240px] text-left border border-slate-200/20">
                <span className="absolute top-4 right-6 text-6xl font-black text-slate-100 select-none leading-none">02</span>
                <div>
                  <div className="h-10 w-10 bg-indigo-500/10 text-indigo-650 border border-indigo-500/20 rounded-xl flex items-center justify-center font-bold mb-5">
                    2
                  </div>
                  <h4 className="font-extrabold text-lg text-slate-950">Add Menu Items</h4>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed font-medium">
                    Add menu sections (Starters, Mains, Mocktails) and upload items, pricing details, and visual descriptions.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group rounded-[2.2rem] border border-slate-200/50 bg-slate-50 p-2 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50">
              <div className="bg-white rounded-[calc(2.2rem-0.5rem)] p-8 relative flex flex-col justify-between h-full min-h-[240px] text-left border border-slate-200/20">
                <span className="absolute top-4 right-6 text-6xl font-black text-slate-100 select-none leading-none">03</span>
                <div>
                  <div className="h-10 w-10 bg-indigo-500/10 text-indigo-650 border border-indigo-500/20 rounded-xl flex items-center justify-center font-bold mb-5">
                    3
                  </div>
                  <h4 className="font-extrabold text-lg text-slate-950">Download & Print</h4>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed font-medium">
                    Select a layout format, tweak parameters, and print immediately or download high-res vectors.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-indigo-400 flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4" /> Honest Pricing
            </h2>
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              Simple plans for any business scale.
            </h3>
            <p className="text-slate-400 font-medium">
              Start completely free and customize with premium designer features as you grow.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto items-stretch">
            
            {/* Free Starter */}
            <div className="rounded-[2.2rem] border border-slate-800 bg-slate-950 p-2.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div className="bg-slate-900/50 rounded-[calc(2.2rem-0.625rem)] p-8 flex flex-col h-full justify-between">
                <div className="space-y-5">
                  <span className="text-xs uppercase font-extrabold tracking-[0.15em] text-slate-500">Free Tier</span>
                  <h4 className="text-3xl font-black">Free Starter</h4>
                  <p className="text-sm text-slate-400 font-medium">Perfect for testing digital menus or starting new businesses.</p>
                  <div className="pt-4 flex items-baseline">
                    <span className="text-5xl font-black">$0</span>
                    <span className="text-xs text-slate-500 font-extrabold ml-1 uppercase tracking-wider">/ month</span>
                  </div>
                  
                  <hr className="border-slate-800" />
                  
                  <ul className="space-y-3 text-sm text-slate-350 font-medium">
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400" /> 1 Active Digital Menu
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400" /> Up to 20 Menu Items
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400" /> 3 Generated QR Codes
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400" /> Standard Guest View
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400" /> Basic scan statistics
                    </li>
                  </ul>
                </div>

                <div className="mt-10 pt-4">
                  <Button asChild variant="outline" className="w-full bg-transparent border-slate-800 hover:bg-slate-900 text-white rounded-full font-extrabold h-12 text-xs uppercase tracking-wider active:scale-[0.98] transition-all">
                    <Link href="/signup">Create Free Account</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Growth Plan */}
            <div className="rounded-[2.2rem] border-2 border-indigo-650 bg-slate-950 p-2.5 flex flex-col justify-between relative shadow-2xl shadow-indigo-650/5 hover:border-indigo-500 transition-colors">
              <div className="absolute top-0 right-10 -translate-y-1/2 rounded-full bg-indigo-650 px-4 py-1 text-[9px] font-black uppercase tracking-wider text-white flex items-center gap-1 shadow-md">
                <Zap className="h-3 w-3 fill-white" /> Popular
              </div>

              <div className="bg-slate-900/50 rounded-[calc(2.2rem-0.625rem)] p-8 flex flex-col h-full justify-between">
                <div className="space-y-5">
                  <span className="text-xs uppercase font-extrabold tracking-[0.15em] text-indigo-400">Growth Experience</span>
                  <h4 className="text-3xl font-black text-white">Growth Plan</h4>
                  <p className="text-sm text-slate-400 font-medium">Ideal for growing full-service restaurants.</p>
                  <div className="pt-4 flex items-baseline">
                    <span className="text-5xl font-black text-white">$29</span>
                    <span className="text-xs text-slate-500 font-extrabold ml-1 uppercase tracking-wider">/ month</span>
                  </div>

                  <hr className="border-slate-800" />

                  <ul className="space-y-3 text-sm text-slate-300 font-medium">
                    <li className="flex items-center gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-455" strokeWidth={3} /> <strong>Unlimited</strong> Digital Menus
                    </li>
                    <li className="flex items-center gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-455" strokeWidth={3} /> <strong>Unlimited</strong> Items & QRs
                    </li>
                    <li className="flex items-center gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-455" strokeWidth={3} /> <strong>Full Theme Customization</strong>
                    </li>
                    <li className="flex items-center gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-455" strokeWidth={3} /> Brand logo & custom colors
                    </li>
                    <li className="flex items-center gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-455" strokeWidth={3} /> Detailed Scan Analytics
                    </li>
                    <li className="flex items-center gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-455" strokeWidth={3} /> Priority Customer Support
                    </li>
                  </ul>
                </div>

                <div className="mt-10 pt-4">
                  <Button asChild className="w-full bg-indigo-650 hover:bg-indigo-600 text-white rounded-full font-extrabold h-12 text-xs uppercase tracking-wider shadow-lg shadow-indigo-650/15 active:scale-[0.98] transition-all">
                    <Link href="/signup">Get Growth Plan</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Pro Premium */}
            <div className="rounded-[2.2rem] border border-slate-800 bg-slate-950 p-2.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div className="bg-slate-900/50 rounded-[calc(2.2rem-0.625rem)] p-8 flex flex-col h-full justify-between">
                <div className="space-y-5">
                  <span className="text-xs uppercase font-extrabold tracking-[0.15em] text-slate-500">Premium Venue</span>
                  <h4 className="text-3xl font-black text-white">Pro Premium Plan</h4>
                  <p className="text-sm text-slate-400 font-medium">Designed for premium venues and multi-location groups.</p>
                  <div className="pt-4 flex items-baseline">
                    <span className="text-5xl font-black text-white">$79</span>
                    <span className="text-xs text-slate-500 font-extrabold ml-1 uppercase tracking-wider">/ month</span>
                  </div>

                  <hr className="border-slate-800" />

                  <ul className="space-y-3 text-sm text-slate-300 font-medium">
                    <li className="flex items-center gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400" /> Everything in Growth Plan
                    </li>
                    <li className="flex items-center gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400" /> Multi-Location Profiles
                    </li>
                    <li className="flex items-center gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400" /> White-labeled Branding
                    </li>
                    <li className="flex items-center gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400" /> Stripe Table-side Payments (Beta)
                    </li>
                    <li className="flex items-center gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400" /> 24/7 Dedicated Account Manager
                    </li>
                  </ul>
                </div>

                <div className="mt-10 pt-4">
                  <Button asChild variant="outline" className="w-full bg-transparent border-slate-800 hover:bg-slate-900 text-white rounded-full font-extrabold h-12 text-xs uppercase tracking-wider active:scale-[0.98] transition-all">
                    <Link href="/signup">Get Pro Premium</Link>
                  </Button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-500 py-16 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white">
                <QrCode className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                NoMenu
              </span>
            </div>

            {/* Copyright */}
            <p className="text-xs text-slate-650 font-medium">
              &copy; {new Date().getFullYear()} AmBrightTech LLC. All rights reserved. Crafted for premium dining.
            </p>

            {/* Terms Links */}
            <div className="flex gap-5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">Terms</Link>
              <a href="mailto:support@ambrighttech.com" className="hover:text-white transition-colors duration-200">Support</a>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}
