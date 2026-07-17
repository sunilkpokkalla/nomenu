"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SocialProofMarquee } from "@/components/SocialProofMarquee";
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
  ChevronRight,
  LayoutDashboard,
  MessageSquare,
  Heart,
  ShieldAlert,
  ChefHat,
  Timer,
  CircleDollarSign,
  Users,
  Utensils
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DualDeviceMockup } from "@/components/marketing/dual-device-mockup";
import { CompetitiveComparison } from "@/components/marketing/competitive-comparison";

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

function HeroLivePopups() {
  return (
    <>
      {/* Subtle Dynamic Mesh Background (Stays behind text) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-indigo-100/40 via-purple-50/20 to-amber-50/30 blur-[100px] rounded-full opacity-60" />
      </div>

      {/* Floating Toasts (Renders in front of text) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20 select-none hidden sm:block">
        {/* Toast 1: Payment (Top Left) */}
        <div className="absolute top-[12%] left-[4%] md:left-[10%] bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3 animate-float-slow opacity-0 shadow-emerald-500/5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[11px] font-bold text-slate-700">Ticket #104 <span className="text-emerald-600">marked Paid</span></p>
        </div>

        {/* Toast 2: Order (Lower Left) */}
        <div className="absolute top-[35%] left-[2%] md:left-[6%] bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3 animate-float-medium opacity-0 shadow-indigo-500/5" style={{ animationDelay: '1.5s' }}>
          <span className="text-sm">🔔</span>
          <p className="text-[11px] font-bold text-slate-700">New Order: <span className="text-indigo-600">Truffle Fries</span></p>
        </div>

        {/* Toast 3: Feedback (Top Right) */}
        <div className="absolute top-[12%] right-[4%] md:right-[10%] bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3 animate-float-fast opacity-0 shadow-amber-500/5" style={{ animationDelay: '3s' }}>
          <span className="text-sm">⭐️</span>
          <p className="text-[11px] font-bold text-slate-700">New <span className="text-amber-500">5-Star</span> Review!</p>
        </div>
        
        {/* Toast 4: Kitchen (Lower Right) */}
        <div className="absolute top-[42%] right-[2%] md:right-[6%] bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3 animate-float-slow opacity-0 shadow-slate-500/5" style={{ animationDelay: '4.5s' }}>
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <p className="text-[11px] font-bold text-slate-700">Live KDS: <span className="text-slate-500">New Order Syncing...</span></p>
        </div>
      </div>
    </>
  )
}

type TableData = { id: number; type: string; status: string; x: number; y: number };
function FloorTable({ table }: { table: TableData }) {
  const [currentStatus, setCurrentStatus] = useState(table.status);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let startDelay: NodeJS.Timeout;
    
    // Customer 1 path: Host to Table 1 (dur=4s, begin=1s)
    // Starts at 1s, reaches table at 5s. 
    // Repeats every 4 seconds. So it arrives at 5s, 9s, 13s...
    if (table.id === 1) {
      startDelay = setTimeout(() => {
        setCurrentStatus('ordering');
        interval = setInterval(() => {
          setCurrentStatus('available');
          setTimeout(() => setCurrentStatus('ordering'), 3000); // customer arrives again after 3s
        }, 4000);
      }, 5000);
    }
    
    // Customer 2 path: Host to Table 4 (dur=6s, begin=3s)
    // Starts at 3s, reaches table at 9s.
    // Repeats every 6 seconds. So it arrives at 9s, 15s, 21s...
    if (table.id === 4) {
      startDelay = setTimeout(() => {
        setCurrentStatus('ordering');
        interval = setInterval(() => {
          setCurrentStatus('available');
          setTimeout(() => setCurrentStatus('ordering'), 5000); // customer arrives again after 5s
        }, 6000);
      }, 9000);
    }

    return () => {
      clearTimeout(startDelay);
      if (interval) clearInterval(interval);
    };
  }, [table.id]);

  const isRect = table.type === 'rect';
  
  const colorMaps = {
    available: {
      chair: 'bg-emerald-200 border-emerald-300',
      tableBg: 'bg-emerald-50 border-emerald-300',
      innerBg: 'border-emerald-200',
      text: 'text-emerald-600',
      badge: 'bg-emerald-500',
      label: 'Available'
    },
    ordering: {
      chair: 'bg-red-300 border-red-400',
      tableBg: 'bg-red-50 border-red-300',
      innerBg: 'border-red-200',
      text: 'text-red-600',
      badge: 'bg-red-500',
      label: 'Ordering'
    },
    paid: {
      chair: 'bg-blue-200 border-blue-300',
      tableBg: 'bg-blue-50 border-blue-300',
      innerBg: 'border-blue-200',
      text: 'text-blue-600',
      badge: 'bg-blue-500',
      label: 'Paid / Leaving'
    },
    eating: {
      chair: 'bg-amber-200 border-amber-300',
      tableBg: 'bg-amber-50 border-amber-300',
      innerBg: 'border-amber-200',
      text: 'text-amber-600',
      badge: 'bg-amber-500',
      label: 'Eating'
    }
  };

  const colors = colorMaps[currentStatus as keyof typeof colorMaps];

  return (
    <div key={table.id} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30 scale-[0.5] md:scale-[0.55] transition-all duration-300" style={{ left: `${table.x}%`, top: `${table.y}%` }}>
      <div className="relative mb-3 mt-3">
        {/* Chairs */}
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${isRect ? 'w-10' : 'w-8'} h-3 rounded-t-full shadow-inner border transition-colors duration-300 ${colors.chair}`}></div>
        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 ${isRect ? 'w-10' : 'w-8'} h-3 rounded-b-full shadow-inner border transition-colors duration-300 ${colors.chair}`}></div>
        <div className={`absolute top-1/2 -left-3 -translate-y-1/2 w-3 ${isRect ? 'h-10' : 'h-8'} rounded-l-full shadow-inner border transition-colors duration-300 ${colors.chair}`}></div>
        <div className={`absolute top-1/2 -right-3 -translate-y-1/2 w-3 ${isRect ? 'h-10' : 'h-8'} rounded-r-full shadow-inner border transition-colors duration-300 ${colors.chair}`}></div>
        
        {/* Table Top */}
        <div className={`w-24 h-24 transition-colors duration-300 ${colors.tableBg} ${isRect ? 'rounded-2xl' : 'rounded-full'} shadow-lg border-4 flex items-center justify-center relative z-10`}>
          {currentStatus === 'ordering' && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md animate-bounce z-20">
              <Sparkles className="w-4 h-4" />
            </div>
          )}
          <div className={`w-12 h-12 ${isRect ? 'rounded-xl' : 'rounded-full'} border transition-colors duration-300 ${colors.innerBg} flex items-center justify-center bg-white/50`}>
            <span className={`font-bold transition-colors duration-300 ${colors.text} text-xl`}>{table.id < 10 ? `0${table.id}` : table.id}</span>
          </div>
        </div>
      </div>
      <span className={`text-[12px] text-white transition-colors duration-300 ${colors.badge} font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap`}>{colors.label}</span>
    </div>
  );
}

export default function LandingPage() {
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
              <a href="#loyalty" className="hover:text-amber-500 text-amber-600 transition-colors duration-200">Loyalty</a>
              <a href="#how-it-works" className="hover:text-slate-900 transition-colors duration-200">How it Works</a>
              <a href="#compare" className="hover:text-slate-900 transition-colors duration-200">Compare</a>
              <a href="#pricing" className="hover:text-slate-900 transition-colors duration-200">Pricing</a>
              <Link href="/partners" className="hover:text-indigo-600 transition-colors duration-200 text-indigo-500">Partners</Link>
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
              <a href="#loyalty" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors">Loyalty</a>
              <a href="#themes" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-slate-55 transition-colors">QR Templates</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-slate-55 transition-colors">Pricing</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-slate-55 transition-colors">How it Works</a>
              <Link href="/partners" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">Partners</Link>
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
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-36 overflow-hidden">
        <HeroLivePopups />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-150 bg-indigo-50/50 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-indigo-600 mb-8 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 fill-indigo-500/10" strokeWidth={1.5} />
            <span>The Complete Restaurant Operating System</span>
          </div>

          {/* Main Headings */}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl md:text-7xl leading-[1.05] max-w-5xl mx-auto">
            Run your entire restaurant. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 font-serif-luxury italic font-medium capitalize">
              from one single scan.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base sm:text-lg text-slate-500 leading-relaxed font-medium">
            The powerful, all-in-one ordering system built for independent cafes, food trucks, and pop-ups. <strong className="text-slate-800">Zero proprietary hardware. No multi-year contracts.</strong> Bring your own iPad, print a QR code, and start taking orders in 10 minutes.
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
                <DualDeviceMockup />
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

      {/* BUILT FOR INDEPENDENTS BANNER */}
      <section className="relative z-30 -mt-12 sm:-mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-[2.5rem] bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-indigo-500/5 p-8 md:p-12 relative overflow-hidden">
          {/* Subtle gradient glow inside the card */}
          <div className="absolute top-0 left-1/4 w-96 h-full bg-gradient-to-r from-indigo-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div className="text-center md:text-left flex flex-col items-center md:items-start group">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 shadow-sm group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                <Smartphone className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Bring Your Own Device</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">No expensive, clunky hardware required. Run your FOH Cashier and Kitchen Display System perfectly on any cheap iPad or Android tablet.</p>
            </div>
            
            <div className="text-center md:text-left flex flex-col items-center md:items-start group">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-sm group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">No Lock-In Contracts</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Stop signing 3-year agreements. We don't lock you in. Start for free, upgrade when you need to, and cancel anytime with no penalties.</p>
            </div>
            
            <div className="text-center md:text-left flex flex-col items-center md:items-start group">
              <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-6 shadow-sm group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                <Palette className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Premium Aesthetics</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Your food looks beautiful, your menu should too. Ditch the generic, corporate spreadsheets and use our premium, high-converting digital themes.</p>
            </div>
          </div>
        </div>
      </section>

      <SocialProofMarquee />

      {/* DIRECT-TO-KITCHEN FLOWCHART SECTION */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/40 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-emerald-600 flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 fill-emerald-500/10" strokeWidth={1.5} /> Serverless Efficiency
            </h2>
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-950 leading-tight">
              Direct to Kitchen. <span className="text-emerald-500">Zero Bottlenecks.</span>
            </h3>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
              Eliminate the middleman. Your guests order from their phone, and the ticket instantly appears on your Kitchen Display System.
            </p>
          </div>

          {/* Flowchart Visual */}
          <div className="relative max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-slate-200/60 p-8 md:p-12 shadow-xl shadow-slate-900/5 mb-16 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
              
              {/* Node 1: Customer */}
              <div className="flex flex-col items-center text-center w-48 relative z-20">
                <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-200 shadow-sm flex items-center justify-center mb-4 relative z-10">
                  <Smartphone className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="font-extrabold text-slate-900">1. Customer Scans</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">No waiting for a server to take the order.</p>
              </div>

              {/* Connecting Pipeline */}
              <div className="flex-1 flex items-center justify-center relative min-h-[40px] md:min-h-0 w-full md:w-auto">
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-slate-100 rounded-full -translate-y-1/2" />
                
                {/* Mobile vertical line */}
                <div className="md:hidden absolute top-0 bottom-0 left-1/2 w-1 bg-slate-100 rounded-full -translate-x-1/2" />
                
                {/* Animated beam */}
                <div className="hidden md:block absolute top-1/2 left-0 h-1 w-24 bg-gradient-to-r from-transparent via-emerald-400 to-emerald-500 rounded-full -translate-y-1/2 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-scan-horizontal" />
                
                {/* Mobile animated beam */}
                <div className="md:hidden absolute top-0 left-1/2 w-1 h-24 bg-gradient-to-b from-transparent via-emerald-400 to-emerald-500 rounded-full -translate-x-1/2 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-scan-vertical" />

                {/* Bypassing Badge */}
                <div className="relative z-20 bg-white border border-rose-200/50 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
                  <X className="w-3.5 h-3.5 text-rose-500" strokeWidth={3} />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Bypassing Waitstaff</span>
                </div>
              </div>

              {/* Node 2: Kitchen */}
              <div className="flex flex-col items-center text-center w-48 relative z-20">
                <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm flex items-center justify-center mb-4 relative z-10">
                  <ChefHat className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="font-extrabold text-slate-900">2. Kitchen Display</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Ticket appears instantly, perfectly formatted.</p>
              </div>

            </div>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm text-center md:text-left flex flex-col items-center md:items-start">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                <CircleDollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">Slash Labor Costs</h4>
              <p className="text-sm text-slate-500 font-medium">Run your dining room with fewer servers while maintaining incredibly fast and accurate service.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm text-center md:text-left flex flex-col items-center md:items-start">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">Zero Order Errors</h4>
              <p className="text-sm text-slate-500 font-medium">Guests input their own modifiers and allergies. No more miscommunications or lost paper tickets.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm text-center md:text-left flex flex-col items-center md:items-start">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                <Timer className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">Faster Table Turns</h4>
              <p className="text-sm text-slate-500 font-medium">Guests don't wait to order and don't wait to pay. Turn tables up to 20% faster during peak rush hours.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm text-center md:text-left flex flex-col items-center md:items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">Live FOH Table Sync</h4>
              <p className="text-sm text-slate-500 font-medium">Front of house sees exactly which tables are seated, ordered, and waiting. Perfect organization, zero chaos.</p>
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
            
            {/* Bento Card 1 (Col span 2): Premium KDS */}
            <div className="md:col-span-2 group rounded-[2rem] border border-slate-800 bg-slate-950 p-2 transition-all duration-300 hover:border-slate-700">
              <div className="bg-slate-900/50 rounded-[calc(2rem-0.5rem)] p-6 lg:p-10 flex flex-col justify-between h-full min-h-[320px]">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3 max-w-md">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <LayoutDashboard className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <h4 className="font-extrabold text-xl text-white">Smart Kitchen Display System</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      Manage high-volume service with our real-time Drag & Drop KDS. Track preparation times, automatically advance order states, and keep the front-of-house perfectly synced with the kitchen.
                    </p>
                  </div>

                  {/* Visual preview widget inside card */}
                  <div className="flex flex-col gap-2 bg-slate-950/80 border border-slate-800 rounded-xl p-3 shrink-0 self-start w-48">
                    <div className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] uppercase font-bold py-1.5 px-2 rounded-lg flex items-center justify-between">
                      <span>Preparing</span> <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    </div>
                    <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] uppercase font-bold py-1.5 px-2 rounded-lg flex items-center justify-between">
                      <span>Ready</span> <CheckCircle2 className="h-3 w-3" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex gap-6 text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-indigo-400" /> Live Sync</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-indigo-400" /> Drag & Drop Flow</div>
                </div>
              </div>
            </div>

            {/* Bento Card 2 (Col span 1): AI Retention */}
            <div className="group rounded-[2rem] border border-slate-800 bg-slate-950 p-2 transition-all duration-300 hover:border-rose-900/50 hover:bg-rose-950/10">
              <div className="bg-slate-900/50 rounded-[calc(2rem-0.5rem)] p-6 lg:p-8 flex flex-col justify-between h-full min-h-[320px]">
                <div className="space-y-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <ShieldAlert className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-extrabold text-xl text-white">AI Retention Engine</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Intercept 1-3 star reviews before they hit Yelp. The AI instantly generates tailored, day-specific win-back offers to save angry customers.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800 mt-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500 block">Intercept</span>
                  <span className="text-xs font-bold text-white mt-1 block">50+ Win-Back Strategies</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3 (Col span 1): Loyalty Engine */}
            <div className="group rounded-[2rem] border border-slate-800 bg-slate-950 p-2 transition-all duration-300 hover:border-emerald-900/50 hover:bg-emerald-950/10">
              <div className="bg-slate-900/50 rounded-[calc(2rem-0.5rem)] p-6 lg:p-8 flex flex-col justify-between h-full min-h-[320px]">
                <div className="space-y-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Heart className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-extrabold text-xl text-white">VIP Loyalty Engine</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Turn happy diners into raving regulars. Get instant suggestions on how to reward 4-5 star reviewers based on the exact day of the week.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800 mt-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500 block">Convert</span>
                  <span className="text-xs font-bold text-white mt-1 block">100+ VIP Experiences</span>
                </div>
              </div>
            </div>

            {/* Bento Card 4 (Col span 2): Print-ready custom QRs */}
            <div className="md:col-span-2 group rounded-[2rem] border border-slate-800 bg-slate-950 p-2 transition-all duration-300 hover:border-slate-700">
              <div className="bg-slate-900/50 rounded-[calc(2rem-0.5rem)] p-6 lg:p-10 flex flex-col justify-between h-full min-h-[320px]">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3 max-w-md">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-900 border border-slate-200">
                      <QrCode className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <h4 className="font-extrabold text-xl text-white">Custom Brand QR Menus</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      Build fully customized digital menus. Print beautiful, high-res table tents with automatic guest WiFi credentials and logo integrations. No apps required for diners.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-3 shrink-0 self-start text-xs font-semibold text-slate-300">
                    <Palette className="h-4 w-4 text-slate-400" />
                    <span>Brand Colors & PDF Export</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-6 text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-slate-400" /> Zero App Required</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-slate-400" /> Fast Page Loads</div>
                </div>
              </div>
            </div>

            {/* Bento Card 5 (Col span 2): AI Menu Builder */}
            <div className="md:col-span-2 group rounded-[2rem] border border-slate-800 bg-slate-950 p-2 transition-all duration-300 hover:border-violet-900/50 hover:bg-violet-950/10">
              <div className="bg-slate-900/50 rounded-[calc(2rem-0.5rem)] p-6 lg:p-10 flex flex-col justify-between h-full min-h-[320px]">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3 max-w-md">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      <Sparkles className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <h4 className="font-extrabold text-xl text-white">AI Magic Auto-Builder</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      Paste a PDF or text list of your dishes, and our AI will automatically build your entire menu. It instantly generates hyper-appetizing descriptions and stunning studio-quality AI food photos for every item.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 bg-slate-950 border border-slate-800 rounded-xl p-3 shrink-0 self-start text-xs font-semibold text-violet-300">
                     <span className="flex items-center gap-2"><Sparkles className="h-3 w-3" /> Magic Import</span>
                     <span className="flex items-center gap-2"><Sparkles className="h-3 w-3" /> AI Writer</span>
                     <span className="flex items-center gap-2"><Sparkles className="h-3 w-3" /> AI Image Gen</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-6 text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-violet-400" /> 500+ Chef Library Items</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-violet-400" /> Hyper-realistic Photos</div>
                </div>
              </div>
            </div>

            {/* Bento Card 6 (Col span 1): POS Sync */}
            <div className="group rounded-[2rem] border border-slate-800 bg-slate-950 p-2 transition-all duration-300 hover:border-blue-900/50 hover:bg-blue-950/10">
              <div className="bg-slate-900/50 rounded-[calc(2rem-0.5rem)] p-6 lg:p-8 flex flex-col justify-between h-full min-h-[320px]">
                <div className="space-y-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Wifi className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-extrabold text-xl text-white">Square POS Sync</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Automatically sync your NoMenu items, prices, and stock status directly with your Square POS. Never update two systems again.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800 mt-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500 block">Integration</span>
                  <span className="text-xs font-bold text-white mt-1 block">Live 2-Way Sync</span>
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

      {/* LOYALTY & RETENTION SECTION */}
      <section id="loyalty" className="py-24 bg-white relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10 -translate-y-1/2" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            
            {/* Left: Interactive Visual Mockup */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative rounded-[2.5rem] bg-gradient-to-tr from-indigo-100 to-indigo-50 p-3 shadow-2xl shadow-indigo-500/10 border border-indigo-200/50">
                
                {/* Mobile Phone Mockup (The Customer View) */}
                <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200/50 shadow-inner flex flex-col relative aspect-[9/16] max-h-[600px]">
                  
                  {/* Phone Header */}
                  <div className="bg-slate-900 text-white p-6 pb-8 text-center rounded-b-3xl shadow-sm z-10 relative">
                    <div className="w-12 h-12 bg-white/10 rounded-full mx-auto flex items-center justify-center mb-3">
                      <span className="font-serif italic text-xl font-bold">LB</span>
                    </div>
                    <h4 className="text-xl font-bold font-serif italic mb-1">Lumina Bistro</h4>
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">VIP Member</span>
                  </div>

                  {/* Loyalty Card UI */}
                  <div className="flex-1 p-6 flex flex-col pt-8 bg-slate-50 relative -mt-4 z-0">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-slate-800 text-sm">Your Rewards</span>
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-xs">5/10 Stamps</span>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="aspect-square rounded-full bg-indigo-50 border-2 border-indigo-500 flex items-center justify-center relative">
                            <Heart className="w-4 h-4 text-indigo-500 fill-indigo-500 animate-pulse" />
                            <div className="absolute inset-0 border-2 border-indigo-400 rounded-full animate-ping opacity-20"></div>
                          </div>
                        ))}
                        {[6, 7, 8, 9].map(i => (
                          <div key={i} className="aspect-square rounded-full bg-slate-50 border-2 border-slate-200 border-dashed flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                          </div>
                        ))}
                        <div className="aspect-square rounded-full bg-amber-50 border-2 border-amber-200 border-dashed flex items-center justify-center relative overflow-hidden">
                          <span className="text-lg">🎁</span>
                        </div>
                      </div>
                      <p className="text-xs text-center text-slate-500 font-medium mt-4">5 more visits to unlock: <strong className="text-amber-600">Free Dessert!</strong></p>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200/50 rounded-2xl p-4 text-center mt-auto">
                      <QrCode className="w-20 h-20 mx-auto text-indigo-700 mb-2" />
                      <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Show to claim stamp</p>
                    </div>
                  </div>
                </div>

                {/* Overlapping Staff Scanner Tablet Mockup */}
                <div className="absolute -bottom-8 -right-8 w-[280px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 transform rotate-[-2deg] animate-float-slow hidden md:block">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shadow-inner">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Staff Terminal</p>
                        <p className="text-xs font-bold text-slate-800">Check-In</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200/50 px-2 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Ready</span>
                    </div>
                  </div>
                  <div className="aspect-video bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center shadow-inner border-[6px] border-slate-800">
                    {/* Camera viewfinder frame */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-t-[3px] border-l-[3px] border-green-500 rounded-tl-sm opacity-80"></div>
                    <div className="absolute top-3 right-3 w-4 h-4 border-t-[3px] border-r-[3px] border-green-500 rounded-tr-sm opacity-80"></div>
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-[3px] border-l-[3px] border-green-500 rounded-bl-sm opacity-80"></div>
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-[3px] border-r-[3px] border-green-500 rounded-br-sm opacity-80"></div>
                    
                    {/* Scanner laser effect */}
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-green-400 shadow-[0_0_15px_4px_rgba(74,222,128,0.7)] animate-[scan_2s_ease-in-out_infinite]" />
                    <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase opacity-60">Align QR Code</span>
                  </div>
                  <Button size="sm" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 shadow-md shadow-indigo-600/20">Award 1 Stamp</Button>
                </div>

              </div>
            </div>

            {/* Right: Copy & Content */}
            <div className="lg:col-span-1 space-y-6">
              <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-indigo-600 flex items-center gap-2">
                <Heart className="h-3.5 w-3.5" /> Retention & Marketing
              </span>
              <h3 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl leading-tight">
                Turn casual visitors into <span className="text-indigo-600">VIP regulars.</span>
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed text-lg">
                Ditch the flimsy paper punch cards. Launch a beautiful digital loyalty program that lives right in your customers' phone browsers—no app downloads required.
              </p>

              <div className="space-y-5 pt-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">Zero-Friction Signups</h4>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Guests scan a table QR code and instantly see their digital loyalty card. They never have to download a bulky app or remember a password.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">1-Tap Staff Scanner</h4>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Your staff uses our secure built-in QR scanner to instantly issue stamps. Fraud-proof and incredibly fast at the checkout counter.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">AI Win-Back System</h4>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Privately catch negative reviews before they go public. Automatically offer custom discounts to unhappy guests to win them back.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button asChild size="lg" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all">
                  <Link href="/signup">Start your Loyalty Program</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-y border-slate-200/40 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.2em] text-indigo-600 flex items-center justify-center gap-2">
              <Layers className="h-4 w-4 text-indigo-500" strokeWidth={1.5} /> Structured Setup
            </h2>
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-950 leading-tight">
              Get up and running in under 10 minutes.
            </h3>
            <p className="text-slate-500 font-medium text-lg">
              Create your profile, populate your dishes, select a design, and print cards directly from your console.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting Timeline Line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-gradient-to-r from-indigo-100 via-indigo-500 to-indigo-100 rounded-full opacity-30 z-0" />
            <div className="hidden md:block absolute top-12 left-[10%] right-[50%] h-1 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] z-0 animate-pulse" />

            <div className="grid gap-8 md:grid-cols-3 relative z-10">
              
              {/* Step 1 */}
              <div className="group relative">
                {/* Node */}
                <div className="mx-auto w-24 h-24 rounded-[2rem] bg-white border border-indigo-100 shadow-xl shadow-indigo-500/5 flex items-center justify-center mb-8 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                  <div className="absolute inset-0 bg-indigo-50 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="text-4xl font-black text-indigo-600 relative z-20">1</span>
                </div>
                
                {/* Card */}
                <div className="bg-white rounded-[2rem] p-8 text-center border border-slate-200/60 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-500/5 group-hover:border-indigo-100 h-auto md:h-[220px]">
                  <h4 className="font-extrabold text-xl text-slate-950 mb-3 group-hover:text-indigo-600 transition-colors">Set Up Your Brand</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Configure restaurant properties, primary color layouts, currency variables, and guest WiFi options.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative md:mt-12">
                {/* Node */}
                <div className="mx-auto w-24 h-24 rounded-[2rem] bg-white border border-indigo-100 shadow-xl shadow-indigo-500/5 flex items-center justify-center mb-8 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                  <div className="absolute inset-0 bg-indigo-50 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="text-4xl font-black text-indigo-600 relative z-20">2</span>
                </div>
                
                {/* Card */}
                <div className="bg-white rounded-[2rem] p-8 text-center border border-slate-200/60 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-500/5 group-hover:border-indigo-100 h-auto md:h-[220px]">
                  <h4 className="font-extrabold text-xl text-slate-950 mb-3 group-hover:text-indigo-600 transition-colors">Add Menu Items</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Add menu sections (Starters, Mains, Mocktails) and upload items, pricing details, and visual descriptions.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative md:mt-24">
                {/* Node */}
                <div className="mx-auto w-24 h-24 rounded-[2rem] bg-white border border-indigo-100 shadow-xl shadow-indigo-500/5 flex items-center justify-center mb-8 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                  <div className="absolute inset-0 bg-indigo-50 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="text-4xl font-black text-indigo-600 relative z-20">3</span>
                </div>
                
                {/* Card */}
                <div className="bg-white rounded-[2rem] p-8 text-center border border-slate-200/60 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-500/5 group-hover:border-indigo-100 h-auto md:h-[220px]">
                  <h4 className="font-extrabold text-xl text-slate-950 mb-3 group-hover:text-indigo-600 transition-colors">Download & Print</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Select a layout format, tweak parameters, and print immediately or download high-res vectors.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* RESTAURANT NETWORK SYNC VISUAL (FLOOR PLAN) */}
      <section className="py-24 bg-slate-50 relative overflow-hidden border-y border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        
        <style>{`
          @keyframes order-dash {
            to { stroke-dashoffset: -40; }
          }
          .animate-order-dash {
            animation: order-dash 1.5s linear infinite;
          }
          .animate-slow-dash {
            animation: order-dash 3s linear infinite;
          }
          .pulse-ring {
            animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(1.5); opacity: 0; }
          }
        `}</style>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900">Your Entire Restaurant, Synced.</h2>
            <p className="text-lg text-slate-500 font-medium">Watch Nomenu connect your front-of-house, kitchen, and guests in real-time. No missing tickets, no confused servers.</p>
          </div>

          {/* Floorplan Container */}
          <div className="relative max-w-7xl mx-auto w-full aspect-[1/1] md:aspect-[21/9] bg-white border border-slate-200/80 rounded-[3rem] shadow-2xl overflow-hidden">
            
            {/* SVG Lines */}
            <svg viewBox="0 0 1200 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-10 pointer-events-none hidden md:block">
              
              {/* Walkins to Host (Grey subtle) */}
              <path id="pathWalkin1" d="M 60 150 C 120 150, 150 250, 220 250" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <path d="M 60 150 C 120 150, 150 250, 220 250" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8 12" className="animate-slow-dash" />

              <path id="pathWalkin3" d="M 60 350 C 120 350, 150 250, 220 250" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <path d="M 60 350 C 120 350, 150 250, 220 250" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8 12" className="animate-slow-dash" />

              {/* Host to Available Table 1 (Green Seating Path) */}
              <path id="pathHostToTable1" d="M 220 250 C 280 250, 320 150, 420 150" fill="none" stroke="#dcfce7" strokeWidth="3" />
              <path d="M 220 250 C 280 250, 320 150, 420 150" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="8 12" className="animate-slow-dash opacity-60" />

              {/* Host to Available Table 4 (Green Seating Path) */}
              <path id="pathHostToTable4" d="M 220 250 C 280 250, 320 350, 420 350" fill="none" stroke="#dcfce7" strokeWidth="3" />
              <path d="M 220 250 C 280 250, 320 350, 420 350" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="8 12" className="animate-slow-dash opacity-60" />

              {/* Order from Ordering Table 2 to KDS (Red Order Path) */}
              <path d="M 600 150 C 750 150, 850 250, 1000 250" fill="none" stroke="#fee2e2" strokeWidth="4" />
              <path d="M 600 150 C 750 150, 850 250, 1000 250" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="10 15" className="animate-order-dash shadow-[0_0_10px_rgba(239,68,68,0.5)]" />

              {/* Kitchen Delivery to Eating Table 3 (Amber Delivery Path) */}
              <path id="pathRunner1" d="M 1000 250 C 900 250, 850 150, 780 150" fill="none" stroke="#fef3c7" strokeWidth="3" />
              <path d="M 1000 250 C 900 250, 850 150, 780 150" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 12" className="animate-slow-dash" />

              {/* Kitchen Delivery to Eating Table 6 (Amber Delivery Path) */}
              <path id="pathRunner2" d="M 1000 250 C 900 250, 850 350, 780 350" fill="none" stroke="#fef3c7" strokeWidth="3" />
              <path d="M 1000 250 C 900 250, 850 350, 780 350" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 12" className="animate-slow-dash" />

              {/* Table Paid 5 to Host (Blue Path) */}
              <path id="pathPaid" d="M 600 350 C 450 350, 350 250, 220 250" fill="none" stroke="#e0e7ff" strokeWidth="3" />
              <path d="M 600 350 C 450 350, 350 250, 220 250" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="8 12" className="animate-slow-dash opacity-60" />

              {/* TRAVERSING ICONS VIA ANIMATEMOTION */}
              
              {/* Customer 1 (Walkin) */}
              <g>
                <circle r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
                <g transform="translate(-8, -8) scale(0.65)" stroke="#64748b" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </g>
                <animateMotion dur="6s" repeatCount="indefinite">
                  <mpath href="#pathWalkin1" />
                </animateMotion>
              </g>

              {/* Customer 2 (Walkin) */}
              <g>
                <circle r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
                <g transform="translate(-8, -8) scale(0.65)" stroke="#64748b" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </g>
                <animateMotion dur="5s" repeatCount="indefinite" begin="2s">
                  <mpath href="#pathWalkin3" />
                </animateMotion>
              </g>

              {/* Customer Being Seated (Host to Table 1) */}
              <g>
                <circle r="14" fill="#ffffff" stroke="#86efac" strokeWidth="2" />
                <g transform="translate(-8, -8) scale(0.65)" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </g>
                <animateMotion dur="4s" repeatCount="indefinite" begin="1s">
                  <mpath href="#pathHostToTable1" />
                </animateMotion>
              </g>

              {/* Customer Being Seated (Host to Table 4) */}
              <g>
                <circle r="14" fill="#ffffff" stroke="#86efac" strokeWidth="2" />
                <g transform="translate(-8, -8) scale(0.65)" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </g>
                <animateMotion dur="6s" repeatCount="indefinite" begin="3s">
                  <mpath href="#pathHostToTable4" />
                </animateMotion>
              </g>

              {/* Food Runner 1 (Kitchen to Table 3) */}
              <g>
                <circle r="16" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                <g transform="translate(-8, -8) scale(0.65)" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                </g>
                <animateMotion dur="3s" repeatCount="indefinite">
                  <mpath href="#pathRunner1" />
                </animateMotion>
              </g>

              {/* Food Runner 2 (Kitchen to Table 5) */}
              <g>
                <circle r="16" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                <g transform="translate(-8, -8) scale(0.65)" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                </g>
                <animateMotion dur="4.5s" repeatCount="indefinite" begin="1.5s">
                  <mpath href="#pathRunner2" />
                </animateMotion>
              </g>

              {/* Payment Traversing ($ icon from Table 4 to Host) */}
              <g>
                <circle r="14" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                <g transform="translate(-8, -8) scale(0.65)" stroke="#2563eb" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </g>
                <animateMotion dur="5s" repeatCount="indefinite">
                  <mpath href="#pathPaid" />
                </animateMotion>
              </g>

            </svg>

            {/* Walkins HTML nodes moved to SVG animateMotion */}

            {/* NODE: FOH Host System */}
            <div className="absolute left-[20%] md:left-[16.6%] top-[40%] md:top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-200 flex items-center justify-center mb-2 relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-2xl pulse-ring"></div>
                <Layers className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 relative z-10" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs md:text-sm text-center leading-tight bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm whitespace-nowrap">FOH Host</h4>
              <span className="text-[7px] md:text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-wider hidden md:block">Assigning Tables</span>
            </div>

            {/* THE RESTAURANT FLOOR (6 TABLES IN PERFECT 3x2 GRID) */}
            {[
              { id: 1, type: 'rect', status: 'available', x: 35, y: 30 },
              { id: 2, type: 'circle', status: 'ordering', x: 50, y: 30 },
              { id: 3, type: 'rect', status: 'eating', x: 65, y: 30 },
              { id: 4, type: 'circle', status: 'available', x: 35, y: 70 },
              { id: 5, type: 'rect', status: 'paid', x: 50, y: 70 },
              { id: 6, type: 'circle', status: 'eating', x: 65, y: 70 },
            ].map((table) => (
              <FloorTable key={table.id} table={table} />
            ))}

            {/* Runner HTML node moved to SVG animateMotion */}

            {/* NODE: Kitchen / KDS */}
            <div className="absolute left-[50%] md:left-[87.5%] top-[88%] md:top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30 scale-75 md:scale-100">
              <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/30 border-4 border-slate-800 flex items-center justify-center mb-2 md:mb-3">
                <ChefHat className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs md:text-sm text-center leading-tight bg-white px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-md border border-slate-200 whitespace-nowrap">Kitchen (KDS)</h4>
              <span className="text-[8px] md:text-[10px] text-slate-500 font-bold mt-1 md:mt-2 uppercase tracking-wider hidden md:block">Receiving Orders</span>
            </div>

          </div>
        </div>
      </section>

      <CompetitiveComparison />

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

          <div className="grid gap-4 lg:grid-cols-4 max-w-7xl mx-auto items-stretch">
            
            {/* Free Plan */}
            <div className="rounded-[2.2rem] border border-slate-800 bg-slate-950 p-2.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div className="bg-slate-900/50 rounded-[calc(2.2rem-0.625rem)] p-6 lg:p-8 flex flex-col h-full justify-between">
                <div className="space-y-5">
                  <span className="text-[10px] uppercase font-extrabold tracking-[0.15em] text-slate-500">Basic</span>
                  <h4 className="text-2xl lg:text-3xl font-black">Free Plan</h4>
                  <p className="text-xs text-slate-400 font-medium">Perfect for testing or small pop-up menus.</p>
                  <div className="pt-2 flex items-baseline">
                    <span className="text-4xl lg:text-5xl font-black">$0</span>
                    <span className="text-[10px] text-slate-500 font-extrabold ml-1 uppercase tracking-wider">/ month</span>
                  </div>
                  
                  <hr className="border-slate-800" />
                  
                  <ul className="space-y-3 text-xs text-slate-350 font-medium">
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> 1 Active Digital Menu
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Up to 30 Menu Items
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> 1 Free Magic AI Credit
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> 1 Generated QR Code
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Standard Guest View
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Button asChild variant="outline" className="w-full bg-transparent border-slate-800 hover:bg-slate-900 text-white rounded-full font-extrabold h-10 text-[10px] lg:text-xs uppercase tracking-wider active:scale-[0.98] transition-all">
                    <Link href="/signup">Start Free</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="rounded-[2.2rem] border border-slate-800 bg-slate-950 p-2.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div className="bg-slate-900/50 rounded-[calc(2.2rem-0.625rem)] p-6 lg:p-8 flex flex-col h-full justify-between">
                <div className="space-y-5">
                  <span className="text-[10px] uppercase font-extrabold tracking-[0.15em] text-slate-500">Growth</span>
                  <h4 className="text-2xl lg:text-3xl font-black">Pro Plan</h4>
                  <p className="text-xs text-slate-400 font-medium">Unlimited flexibility for high-volume venues.</p>
                  <div className="pt-2 flex items-baseline">
                    <span className="text-4xl lg:text-5xl font-black">$35</span>
                    <span className="text-[10px] text-slate-500 font-extrabold ml-1 uppercase tracking-wider">/ month</span>
                  </div>
                  
                  <hr className="border-slate-800" />
                  
                  <ul className="space-y-3 text-xs text-slate-350 font-medium">
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Unlimited Menus & Items
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Table Management & Floor Plan
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Full Front of House Ops (Any Device)
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Digital Waitlist System
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Instant AI Multi-Language Translation
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Team & Staff Management (RBAC)
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> 25 Magic AI Credits / month
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Private Customer Feedback System
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Detailed Scan Analytics
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Button asChild variant="outline" className="w-full bg-transparent border-slate-800 hover:bg-slate-900 text-white rounded-full font-extrabold h-10 text-[10px] lg:text-xs uppercase tracking-wider active:scale-[0.98] transition-all">
                    <Link href="/signup">Start Pro</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Elite Plan */}
            <div className="rounded-[2.2rem] border-2 border-indigo-650 bg-slate-950 p-2.5 flex flex-col justify-between relative shadow-2xl shadow-indigo-650/5 hover:border-indigo-500 transition-colors">
              <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-indigo-650 px-3 py-1 text-[8px] font-black uppercase tracking-wider text-white flex items-center gap-1 shadow-md">
                <Zap className="h-3 w-3 fill-white" /> Popular
              </div>

              <div className="bg-slate-900/50 rounded-[calc(2.2rem-0.625rem)] p-6 lg:p-8 flex flex-col h-full justify-between">
                <div className="space-y-5">
                  <span className="text-[10px] uppercase font-extrabold tracking-[0.15em] text-indigo-400">Professional</span>
                  <h4 className="text-2xl lg:text-3xl font-black text-white">Elite Plan</h4>
                  <p className="text-xs text-slate-400 font-medium">Real-time ordering for premium venues and groups.</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-indigo-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-300 border border-indigo-500/30">
                    <Sparkles className="h-3 w-3" /> 14-Day Free Trial (Annual)
                  </div>
                  <div className="pt-2 flex items-baseline">
                    <span className="text-4xl lg:text-5xl font-black text-white">$79</span>
                    <span className="text-[10px] text-slate-500 font-extrabold ml-1 uppercase tracking-wider">/ month</span>
                  </div>

                  <hr className="border-slate-800" />

                  <ul className="space-y-3 text-xs text-slate-350 font-medium">
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" strokeWidth={3} /> Everything in Pro
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Fully Integrated POS & Ordering
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Active Tabs & Tab Management
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Pay at Counter & Tab Settling
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Real-Time Live Orders Dashboard
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Interactive Digital Shopping Cart
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> 50 Magic AI Credits / month
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> All 8+ Premium Elite Themes
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> White-labeled Branding
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Button asChild className="w-full bg-indigo-650 hover:bg-indigo-600 text-white rounded-full font-extrabold h-10 text-[10px] lg:text-xs uppercase tracking-wider shadow-lg shadow-indigo-650/15 active:scale-[0.98] transition-all">
                    <Link href="/signup">Start 14-Day Trial</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-[2.2rem] border border-slate-800 bg-slate-950 p-2.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div className="bg-slate-900/50 rounded-[calc(2.2rem-0.625rem)] p-6 lg:p-8 flex flex-col h-full justify-between">
                <div className="space-y-5">
                  <span className="text-[10px] uppercase font-extrabold tracking-[0.15em] text-slate-500">Premium</span>
                  <h4 className="text-2xl lg:text-3xl font-black text-white">Enterprise Plan</h4>
                  <p className="text-xs text-slate-400 font-medium">Full commerce suite with direct payouts.</p>
                  <div className="pt-2 flex items-baseline">
                    <span className="text-4xl lg:text-5xl font-black text-white">$119</span>
                    <span className="text-[10px] text-slate-500 font-extrabold ml-1 uppercase tracking-wider">/ month</span>
                  </div>

                  <hr className="border-slate-800" />

                  <ul className="space-y-3 text-xs text-slate-300 font-medium">
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" strokeWidth={3} /> <strong>Everything in Elite</strong>
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" strokeWidth={3} /> <strong>Partner Agency Integrations</strong>
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" strokeWidth={3} /> <strong>75 Magic AI Credits / month</strong>
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" strokeWidth={3} /> <strong>Dine-in, Takeaway & Priority Reserve</strong>
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" strokeWidth={3} /> <strong>Multiple Kitchen Displays (KDS)</strong>
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" strokeWidth={3} /> <strong>Intelligent Order Capacity Pacing</strong>
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" strokeWidth={3} /> <strong>Order & Pay via Apple Pay / Credit Card</strong>
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" strokeWidth={3} /> <strong>Direct Bank Payouts (Stripe Connect)</strong>
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> 0% Platform Fee (First Year on Annual Plan)
                    </li>
                    <li className="flex items-start gap-2.5 text-white">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Dedicated Account Manager
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Button asChild variant="outline" className="w-full bg-transparent border-slate-800 hover:bg-slate-900 text-white rounded-full font-extrabold h-10 text-[10px] lg:text-xs uppercase tracking-wider active:scale-[0.98] transition-all">
                    <Link href="/signup">Contact Us</Link>
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
              <Link href="/partners" className="hover:text-white transition-colors duration-200">Partners</Link>
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
