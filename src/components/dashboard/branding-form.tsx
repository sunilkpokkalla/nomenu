"use client";

import { useState } from "react";
import { Loader2, Palette, Save, Wifi, Lock, Sparkles, Crown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ImageUploader } from "@/components/dashboard/image-uploader";

interface BrandingFormProps {
  entity: {
    id: string;
    name: string;
    cuisine_type?: string | null;
    primary_color?: string | null;
    accent_color?: string | null;
    theme_style?: string | null;
    wifi_password?: string | null;
    plan?: string | null;
    address?: string | null;
    phone?: string | null;
    use_custom_design?: boolean | null;
  };
  type: "restaurant" | "menu";
  action: (formData: FormData) => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
}

export function BrandingForm({ entity, type, action, successMessage, errorMessage }: BrandingFormProps) {
  const [useCustomDesign, setUseCustomDesign] = useState(type === "menu" ? (entity.use_custom_design || false) : true);
  const [primaryColor, setPrimaryColor] = useState(entity.primary_color || "#2563EB");
  const [accentColor, setAccentColor] = useState(entity.accent_color || "#F59E0B");
  const [themeStyle, setThemeStyle] = useState(entity.theme_style || "minimalist");
  const [wifiPassword, setWifiPassword] = useState(entity.wifi_password || "");
  const [isPending, setIsPending] = useState(false);

  const userPlan = (entity.plan || "free").trim().toLowerCase();
  const isPro = ["pro", "elite", "enterprise"].includes(userPlan);
  const isElite = ["elite", "enterprise"].includes(userPlan);

  const freeThemes = ["minimalist", "botanical"];
  const proThemes = ["vibrant", "zen", "bistro", "brasserie", "omakase", "bentopop"];
  const requiresPro = !freeThemes.includes(themeStyle);
  const requiresElite = !freeThemes.includes(themeStyle) && !proThemes.includes(themeStyle);

  let isLocked = false;
  let lockMessage = "";
  let upgradeTarget = "";
  let lockTitle = "";

  if (!isElite && requiresElite) {
    isLocked = true;
    lockTitle = "Elite Theme Locked";
    lockMessage = `The ${themeStyle} template is an exclusive Elite feature. Upgrade your plan to apply this ultra-premium design.`;
    upgradeTarget = "Upgrade to Elite";
  } else if (!isPro && requiresPro) {
    isLocked = true;
    lockTitle = "Pro Theme Locked";
    lockMessage = `The ${themeStyle} template is a Pro feature. Upgrade your plan to apply this premium design.`;
    upgradeTarget = "Upgrade to Pro";
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await action(formData);
    } catch (err: unknown) {
      const error = err as Error & { digest?: string };
      if (error?.message === 'NEXT_REDIRECT' || error?.digest?.startsWith('NEXT_REDIRECT')) {
        throw err;
      }
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  const previewTheme = {
    bistro: {
      frameBg: "bg-[#FDFBF7]",
      textPrimary: "text-[#1C1917] font-serif font-bold",
      textSecondary: "text-[#57534E] font-sans text-[8px]",
      cardBg: "bg-transparent border-0 shadow-none p-2",
      itemBorder: "border-[#D6D3D1]/40",
      accentBg: "bg-[#FDFBF7] text-[#1C1917] border border-[#D6D3D1]/50",
      headerGradient: "",
      fontClass: "font-serif"
    },
    minimalist: {
      frameBg: "bg-white",
      textPrimary: "text-black font-sans font-bold tracking-tight",
      textSecondary: "text-zinc-500 font-sans text-[8px]",
      cardBg: "bg-white border-b border-zinc-150 rounded-none shadow-none p-2.5",
      itemBorder: "border-zinc-100",
      accentBg: "bg-zinc-100 text-zinc-900 font-semibold tracking-wider text-[7px] rounded-none border border-zinc-350",
      headerGradient: `linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.75)), linear-gradient(180deg, ${primaryColor}, ${primaryColor})`,
      fontClass: "font-sans"
    },
    luxury: {
      frameBg: "bg-[#0C0C0E]",
      textPrimary: "text-zinc-100 font-serif tracking-wide font-medium",
      textSecondary: "text-zinc-400 font-sans text-[8px]",
      cardBg: "bg-zinc-900/35 backdrop-blur-md border border-zinc-800/60 rounded-xl p-3.5 shadow-xl shadow-black/30",
      itemBorder: "border-b border-zinc-900/50",
      accentBg: "bg-amber-950/20 text-amber-400 border border-amber-900/30 font-semibold",
      headerGradient: `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.85)), linear-gradient(135deg, #1C1917, #09090B)`,
      fontClass: "font-serif"
    },
    vibrant: {
      frameBg: "bg-[#FEF2F2]",
      textPrimary: "text-black font-sans font-bold",
      textSecondary: "text-slate-600 font-sans text-[8px]",
      cardBg: "bg-white border-2 border-black rounded-2xl p-3.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
      itemBorder: "border-b-2 border-black/10",
      accentBg: "bg-rose-50 text-rose-700 border border-black font-extrabold rounded-full px-1.5",
      headerGradient: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.75)), linear-gradient(135deg, ${accentColor}, ${primaryColor})`,
      fontClass: "font-sans"
    },
    botanical: {
      frameBg: "bg-[#F9FBE7]",
      textPrimary: "text-[#33691E] font-serif",
      textSecondary: "text-[#558B2F] font-sans text-[8px]",
      cardBg: "bg-white border border-[#DCEDC8] rounded-3xl p-3 shadow-sm",
      itemBorder: "border-b border-[#DCEDC8]/50",
      accentBg: "bg-[#F1F8E9] text-[#33691E] border border-[#DCEDC8] rounded-full",
      headerGradient: "",
      fontClass: "font-serif"
    },
    cyberneon: {
      frameBg: "bg-[#09090B]",
      textPrimary: "text-[#00FF41] font-mono",
      textSecondary: "text-[#008F11] font-mono text-[8px]",
      cardBg: "bg-[#18181B] border-l-2 border-[#00FF41] rounded-none p-3 shadow-[0_0_15px_rgba(0,255,65,0.15)]",
      itemBorder: "border-b border-[#27272A]",
      accentBg: "bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 font-bold",
      headerGradient: "",
      fontClass: "font-mono tracking-tighter"
    },
    zen: {
      frameBg: "bg-white",
      textPrimary: "text-zinc-900 font-sans tracking-wide",
      textSecondary: "text-zinc-400 font-sans text-[8px]",
      cardBg: "bg-white border-0 shadow-none p-0",
      itemBorder: "border-0",
      accentBg: "bg-transparent text-zinc-900",
      headerGradient: "",
      fontClass: "font-sans"
    },
    bentopop: {
      frameBg: "bg-[#F0FDF4]",
      textPrimary: "text-black font-sans font-black",
      textSecondary: "text-slate-600 font-sans text-[8px] font-bold",
      cardBg: "bg-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-none p-3",
      itemBorder: "border-b-4 border-black",
      accentBg: "bg-[#EF476F] text-white border-2 border-black font-black",
      headerGradient: "",
      fontClass: "font-sans"
    },
    noir: {
      frameBg: "bg-[#0A0A0A]",
      textPrimary: "text-zinc-200 font-serif",
      textSecondary: "text-zinc-500 font-sans text-[8px]",
      cardBg: "bg-[#0A0A0A] border-0 shadow-none p-2",
      itemBorder: "border-b border-zinc-800",
      accentBg: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
      headerGradient: "",
      fontClass: "font-serif"
    },
    brasserie: {
      frameBg: "bg-[#FAFAED]",
      textPrimary: "text-[#1C1917] font-serif",
      textSecondary: "text-[#57534E] font-sans text-[8px]",
      cardBg: "bg-white border border-[#E7E5E4] shadow-sm rounded-xl p-3",
      itemBorder: "border-b border-[#E7E5E4]",
      accentBg: "bg-[#1C1917] text-white",
      headerGradient: "",
      fontClass: "font-serif"
    }
  }[themeStyle as "bistro" | "minimalist" | "luxury" | "vibrant" | "botanical" | "cyberneon" | "zen" | "bentopop" | "noir" | "brasserie"] || {
    frameBg: "bg-slate-50",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-500",
    cardBg: "bg-white border shadow-sm p-3",
    itemBorder: "border-b",
    accentBg: "bg-amber-50 text-amber-700 border border-amber-200",
    headerGradient: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
    fontClass: "font-sans"
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start max-w-[1400px] mx-auto w-full">
      {/* LEFT: SETTINGS PANEL */}
      <div className="flex-1 w-full space-y-8">
        
        {/* Header Intro */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Visual Identity</h1>
          <p className="text-slate-500 font-medium">Design the digital experience your guests see when they scan the QR code.</p>
        </div>

        <form id="branding-settings-form" onSubmit={handleSubmit} className="space-y-10">
          
          {type === "menu" && (
            <div className="bg-slate-100 p-6 rounded-3xl flex items-center justify-between border border-slate-200/60">
              <div>
                <Label className="text-base font-bold text-slate-900">Custom Menu Styling</Label>
                <p className="text-sm text-slate-500 mt-1">Detach this menu from your global restaurant branding.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="use_custom_design" 
                  value="true" 
                  className="sr-only peer"
                  checked={useCustomDesign}
                  onChange={(e) => setUseCustomDesign(e.target.checked)}
                />
                <div className="w-14 h-8 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-slate-900 shadow-inner"></div>
              </label>
            </div>
          )}

          <div className={type === "menu" && !useCustomDesign ? "opacity-40 pointer-events-none transition-all duration-300 grayscale" : "transition-all duration-300"}>
            
            {/* Logo Upload Removed by user request */}

            {/* Color Palette */}
            {["minimalist", "vibrant", "botanical"].includes(themeStyle) ? (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-5 border-b border-slate-100 pb-3">Brand Colors</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  
                  <div className="flex-1 flex items-center gap-3 p-2.5 pl-3 rounded-2xl bg-white border border-slate-200 transition-all hover:border-slate-300 hover:shadow-sm">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-inner ring-1 ring-black/5 flex-shrink-0 cursor-pointer">
                      <input type="color" id="primaryColorPicker" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Primary Color</Label>
                      <Input type="text" name="primaryColor" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} maxLength={7} required className="border-0 bg-transparent text-sm font-mono tracking-wider shadow-none p-0 h-auto focus-visible:ring-0 text-slate-900 uppercase" />
                    </div>
                  </div>

                  <div className="flex-1 flex items-center gap-3 p-2.5 pl-3 rounded-2xl bg-white border border-slate-200 transition-all hover:border-slate-300 hover:shadow-sm">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-inner ring-1 ring-black/5 flex-shrink-0 cursor-pointer">
                      <input type="color" id="accentColorPicker" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Accent Color</Label>
                      <Input type="text" name="accentColor" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} maxLength={7} required className="border-0 bg-transparent text-sm font-mono tracking-wider shadow-none p-0 h-auto focus-visible:ring-0 text-slate-900 uppercase" />
                    </div>
                  </div>

                </div>
              </section>
            ) : (
              <>
                <input type="hidden" name="primaryColor" value={primaryColor} />
                <input type="hidden" name="accentColor" value={accentColor} />
              </>
            )}

            {/* Layout Themes */}
            <section className="mt-2">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-100 pb-3">Layout Themes</h2>
              <input type="hidden" name="themeStyle" value={themeStyle} />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  // FREE TIER
                  { id: "minimalist", name: "Classic Minimalist", desc: "Clean & Simple", icon: "🍽️", badge: null },
                  { id: "botanical", name: "Botanical", desc: "Organic Cafe", icon: "🌿", badge: null },
                  
                  // PRO TIER
                  { id: "vibrant", name: "Vibrant", desc: "Neo-brutalism", icon: "🍔", badge: "PRO" },
                  { id: "zen", name: "Zen Minimalist", desc: "Pure Whitespace", icon: "🍵", badge: "PRO" },
                  { id: "bistro", name: "Bistro", desc: "Classic Serif", icon: "🍷", badge: "PRO" },
                  { id: "brasserie", name: "Brasserie", desc: "Warm & Natural", icon: "🍷", badge: "PRO" },
                  { id: "omakase", name: "Omakase", desc: "Zen Dark Mode", icon: "🍣", badge: "PRO" },
                  { id: "bentopop", name: "Bento Pop", desc: "Vibrant Grid", icon: "🍱", badge: "PRO" },
                  
                  // ELITE TIER
                  { id: "cyberneon", name: "Cyber Neon", desc: "Tech Nightlife", icon: "👾", badge: "ELITE" },
                  { id: "noir", name: "Noir Editorial", desc: "Luxury Dark Mode", icon: "🍸", badge: "ELITE" },
                  { id: "luxury", name: "Lumina", desc: "Gold Cinematic", icon: "✨", badge: "ELITE" },
                  { id: "resort", name: "Oasis", desc: "Beach Club", icon: "🌊", badge: "ELITE" },
                  { id: "popdiner", name: "Pop Diner", desc: "Street Art", icon: "⚡", badge: "ELITE" },
                  { id: "editorial", name: "Editorial", desc: "Magazine Style", icon: "📖", badge: "ELITE" },
                  { id: "lounge", name: "Velvet", desc: "Hotel Lounge", icon: "🍸", badge: "ELITE" }
                ].map((theme) => {
                  const isActive = themeStyle === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setThemeStyle(theme.id)}
                      className={`relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 hover:scale-[1.02] border-2 ${
                        isActive 
                          ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/20" 
                          : "border-slate-100 bg-white hover:border-slate-200 text-slate-900 shadow-sm"
                      }`}
                    >
                      {theme.badge && (
                        <span className={`absolute top-0 right-0 px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-xl rounded-tr-2xl ${
                          theme.badge === 'PRO' 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-sm'
                        }`}>
                          {theme.badge}
                        </span>
                      )}
                      <span className="text-3xl mb-3 drop-shadow-sm">{theme.icon}</span>
                      <span className="text-sm font-bold tracking-tight">{theme.name}</span>
                      <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>{theme.desc}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Advanced UI Adjustments */}
            <section className="mt-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Wifi className="h-4 w-4" /> Amenities
              </h2>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <Label htmlFor="wifiPassword" className="text-sm font-bold text-slate-900">Guest WiFi Password</Label>
                <Input
                  type="text"
                  id="wifiPassword"
                  name="wifiPassword"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="e.g. bistro-guest-2026"
                  className="mt-3 bg-white border-slate-200 h-12 rounded-xl focus-visible:ring-slate-900 text-slate-900"
                />
                <p className="text-xs text-slate-500 mt-3 font-medium">
                  If provided, this prints clearly on the guest-facing digital menu interface.
                </p>
              </div>
            </section>

            {successMessage && (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm text-emerald-800 font-medium">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-8 rounded-2xl border border-destructive/20 bg-destructive/10 px-6 py-4 text-sm text-destructive font-medium">
                {errorMessage}
              </div>
            )}

          </div>
        </form>
      </div>

      {/* RIGHT: STICKY PREVIEW */}
      <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-8 pb-12">
        <div className="flex justify-between items-center px-2 mb-4">
          <Label className="font-bold text-slate-900 text-sm tracking-tight">Live Mobile Preview</Label>
          <span className="text-[9px] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-bold uppercase tracking-[0.1em]">
            Interactive
          </span>
        </div>

        {/* Guest View Frame */}
        <div className={`mx-auto w-full max-w-[380px] border-[10px] border-slate-900 rounded-[40px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] min-h-[640px] flex flex-col relative aspect-[9/16] transition-all duration-500 ${previewTheme.frameBg} ${previewTheme.fontClass}`}>
          {/* Cover Header Banner */}
          {themeStyle === "noir" ? (
            <div className="pt-16 pb-8 px-6 text-center bg-[#0A0A0A] text-[#E0E0E0] shrink-0 border-b border-[#333]">
              <h1 className="text-4xl font-serif text-white tracking-widest uppercase mb-4">{entity.name}</h1>
              <p className="text-[10px] tracking-[0.3em] uppercase text-amber-500 font-semibold">{entity.cuisine_type || "Fine Dining"}</p>
            </div>
          ) : themeStyle === "brasserie" ? (
            <div className="pt-12 pb-8 px-4 text-center bg-[#FAFAED] text-[#1C1917] shrink-0 border-b border-[#E7E5E4]">
              <h1 className="text-3xl font-serif text-slate-800 mb-2">{entity.name}</h1>
              <p className="text-[10px] tracking-[0.2em] uppercase text-slate-500 font-medium">{entity.cuisine_type || "Brasserie"}</p>
            </div>
          ) : themeStyle === "bentopop" ? (
            <div className="pt-10 pb-8 px-4 text-center bg-[#FFD166] border-b-4 border-black shrink-0 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#EF476F] rounded-full border-4 border-black"></div>
              <h1 className="text-3xl font-black text-black leading-none drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-tight relative z-10 mb-2">{entity.name}</h1>
              <span className="inline-block bg-white text-black text-[9px] font-black uppercase tracking-wider px-2 py-1 border-2 border-black rounded-full relative z-10">{entity.cuisine_type || "Street Food"}</span>
            </div>
          ) : themeStyle === "zen" ? (
            <div className="pt-16 pb-12 px-6 text-center bg-white shrink-0 border-b border-zinc-100">
              <h1 className="text-2xl font-sans tracking-[0.2em] uppercase text-zinc-900 mb-4">{entity.name}</h1>
              <div className="w-8 h-px bg-zinc-300 mx-auto mb-4"></div>
              <p className="text-[9px] tracking-[0.2em] uppercase text-zinc-400">{entity.cuisine_type || "Zen"}</p>
            </div>
          ) : themeStyle === "bistro" ? (
            <div className="text-center relative bg-[#1C1917] overflow-hidden shrink-0 flex flex-col">
              <div className="pt-8 pb-5 px-4 z-10 space-y-1">
                <h1 className="text-2xl font-serif text-[#D4AF37] tracking-wider uppercase drop-shadow-md">{entity.name}</h1>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#D4AF37]/60"></span>
                  <span className="text-[8px] text-[#D4AF37] uppercase tracking-[0.3em] font-sans font-medium">
                    {entity.cuisine_type || "Menu"}
                  </span>
                  <span className="h-px w-6 bg-gradient-to-l from-transparent to-[#D4AF37]/60"></span>
                </div>
              </div>
              <div className="w-full h-[90px] relative border-t border-[#D4AF37]/30 shadow-inner">
                <Image src="/images/library/ghee-karam-dosa.jpg" alt="Hero Dish" className="w-full h-full object-cover" fill />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/50 to-transparent"></div>
              </div>
            </div>
          ) : themeStyle === "lounge" ? (
            <div className="pt-12 pb-8 px-4 text-center bg-[#0A0A0A] text-[#E0E0E0] shrink-0 border-b border-[#D4AF37]/20 relative">
              <div className="absolute top-0 left-0 w-full h-full bg-[#D4AF37]/5 blur-xl pointer-events-none"></div>
              <h1 className="text-3xl font-black tracking-tighter uppercase text-white mb-1 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] relative z-10">{entity.name}</h1>
              <p className="text-[8px] tracking-[0.2em] text-[#D4AF37] uppercase font-bold relative z-10">{entity.cuisine_type || "Lounge"}</p>
            </div>
          ) : themeStyle === "resort" ? (
            <div className="pt-12 pb-8 px-4 text-center bg-[#F0F8FF] text-[#003366] shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB]/30 to-transparent"></div>
              <h1 className="text-3xl font-black tracking-tighter uppercase text-[#003366] mb-1 relative z-10">{entity.name}</h1>
              <p className="text-[8px] tracking-[0.2em] text-[#006994] uppercase font-bold relative z-10">{entity.cuisine_type || "Oasis Resort"}</p>
            </div>
          ) : themeStyle === "luxury" ? (
            <div className="pt-8 pb-6 px-4 text-center bg-black">
              <h1 className="text-xl font-bold tracking-widest uppercase text-amber-400 font-serif">{entity.name}</h1>
              <p className="text-[9px] opacity-60 mt-1 tracking-wider uppercase text-zinc-400">
                {entity.cuisine_type || "Fine Dining"}
              </p>
              <div className="w-12 h-0.5 bg-amber-500/40 mx-auto mt-3"></div>
            </div>
          ) : themeStyle === "vibrant" ? (
            <div className="pt-10 pb-8 px-4 text-center border-b-4 border-black relative bg-[#FFD166] shrink-0">
              <div className="text-center z-10 flex flex-col items-center space-y-1">
                <h1 className="text-2xl font-black tracking-tight text-black font-sans uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  {entity.name}
                </h1>
                <span className="inline-block bg-black text-[#FEFCE8] text-[9px] font-black uppercase tracking-wider px-2 py-1 border border-black rounded-md transform -rotate-2">
                  {entity.cuisine_type || "Diner Pop"}
                </span>
              </div>
            </div>
          ) : themeStyle === "omakase" ? (
            <div className="pt-12 pb-8 px-4 text-center bg-[#0F0F0F] text-[#E0E0E0] shrink-0">
              <h1 className="text-2xl tracking-[0.2em] font-light uppercase text-white mb-3">{entity.name}</h1>
              <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-[#4A4A4A] to-transparent mx-auto"></div>
              <p className="mt-3 text-[7px] tracking-[0.2em] text-[#888888] uppercase">{entity.cuisine_type || "Tasting Menu"}</p>
            </div>
          ) : themeStyle === "popdiner" ? (
            <div className="pt-10 pb-6 px-4 text-center bg-[#FAFAFA] border-b border-[#E5E5E5] shrink-0">
              <h1 className="text-3xl font-serif font-black text-[#1A1A1A] tracking-tight mb-4">{entity.name}</h1>
              <div className="flex overflow-x-auto gap-4 border-b border-[#E5E5E5] pb-2 px-2 scrollbar-hide justify-center">
                <span className="text-[10px] font-medium tracking-widest uppercase text-[#8B1E28] border-b border-[#8B1E28] pb-1">Starters</span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-[#999999]">Mains</span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-[#999999]">Drinks</span>
              </div>
            </div>
          ) : themeStyle === "editorial" ? (
            <div className="pt-12 pb-8 px-6 text-center bg-[#F9F8F6] border-b border-[#E2DFD8] shrink-0">
              <h1 className="text-3xl font-serif font-light text-[#1A1918] mb-2">{entity.name}</h1>
              <p className="text-[7px] tracking-[0.25em] uppercase text-[#8C8881]">{entity.cuisine_type || "Editorial"}</p>
            </div>
          ) : themeStyle === "botanical" ? (
            <div className="pt-16 pb-12 px-6 text-center bg-[#F1F8E9] border-b border-[#DCEDC8] shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DCEDC8] rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
              <h1 className="text-3xl font-serif text-[#33691E] tracking-tight mb-2 relative z-10">{entity.name}</h1>
              <p className="text-[9px] tracking-[0.2em] uppercase text-[#689F38] relative z-10">{entity.cuisine_type || "Botanical"}</p>
            </div>
          ) : themeStyle === "cyberneon" ? (
            <div className="pt-12 pb-8 px-4 text-center bg-[#09090B] border-b-2 border-[#00FF41] shrink-0 relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#00FF41] shadow-[0_0_15px_#00FF41]"></div>
              <h1 className="text-3xl font-mono font-bold tracking-tighter uppercase text-[#00FF41] drop-shadow-[0_0_8px_rgba(0,255,65,0.6)] mb-2">{entity.name}</h1>
              <p className="text-[8px] tracking-[0.3em] uppercase text-[#008F11]">{entity.cuisine_type || "Cybernetics"}</p>
            </div>
          ) : (
            <div
              className="h-28 w-full relative flex flex-col items-center justify-end p-4 text-white transition-all duration-300"
              style={{
                background: previewTheme.headerGradient,
              }}
            >
              <div className="text-center z-10">
                <h1 className="text-base font-bold tracking-tight">{entity.name}</h1>
                <p className="text-[10px] opacity-90 font-medium tracking-wide uppercase mt-0.5">
                  {entity.cuisine_type || "Fine Dining"}
                </p>
              </div>
            </div>
          )}

          {/* Overlapping Info Card */}
          {themeStyle === "bistro" ? (
            <div className="px-5 py-3 z-20 shrink-0 bg-[#FDFBF7] border-b border-[#E7E5E4] shadow-sm text-center flex flex-col items-center gap-1.5">
              <p className="font-sans text-[9px] uppercase tracking-widest text-[#78716C]">
                📍 {entity.address || "123 Bistro Lane, Paris"}
              </p>
              <div className="flex justify-center items-center gap-4 text-[9px] uppercase tracking-widest text-[#57534E] font-medium mt-1">
                <span>📞 {entity.phone || "555-0100"}</span>
                {wifiPassword && <span className="text-[#D4AF37] font-bold">📶 {wifiPassword}</span>}
              </div>
            </div>
          ) : themeStyle === "lounge" ? (
            <div className="px-5 py-3 z-20 shrink-0 bg-black/60 backdrop-blur-md border-b border-white/5 shadow-sm text-center flex flex-col items-center gap-1">
              <p className="text-[9px] text-[#D4AF37]/60 tracking-widest uppercase">📍 {entity.address || "123 Lounge Ave"}</p>
            </div>
          ) : themeStyle === "resort" ? (
            <div className="px-5 py-3 z-20 shrink-0 bg-white/80 backdrop-blur-md border-b border-[#87CEEB]/30 shadow-sm text-center flex flex-col items-center gap-1">
              <p className="text-[9px] text-[#006994] font-bold tracking-wider uppercase">📍 {entity.address || "123 Beach Blvd"}</p>
            </div>
          ) : themeStyle === "luxury" || themeStyle === "minimalist" || themeStyle === "vibrant" ? (
            <div className="px-5 py-2 text-center text-[9px] text-zinc-500 space-y-1 mt-3">
              <p className="tracking-wide">📍 {entity.address || "123 Minimalist St."}</p>
              <div className="flex justify-center gap-4">
                <span>📞 {entity.phone || "555-0100"}</span>
                {wifiPassword && <span className="text-amber-500/80 font-medium">📶 {wifiPassword}</span>}
              </div>
            </div>
          ) : themeStyle === "omakase" ? (
            <div className="bg-[#0F0F0F] text-[#666666] text-[8px] tracking-[0.1em] text-center p-3 uppercase border-b border-[#222]">
               📍 {entity.address || "123 Zen Ave"} | 📞 {entity.phone || "555-0100"}
            </div>
          ) : themeStyle === "popdiner" ? (
            <div className="px-5 py-3 z-20 shrink-0 bg-[#FFD166] border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,0.1)] text-center flex flex-col items-center gap-1">
              <p className="text-[8px] text-black font-bold uppercase tracking-widest">📍 {entity.address || "123 Pop St."}</p>
            </div>
          ) : themeStyle === "editorial" ? (
            <div className="px-5 py-3 z-20 shrink-0 bg-[#F9F8F6] border-b border-[#E2DFD8] text-center flex flex-col items-center gap-1">
              <p className="text-[7px] text-[#5C5A56] tracking-widest uppercase">📍 {entity.address || "123 Editorial Ave"}</p>
            </div>
          ) : themeStyle === "botanical" ? (
            <div className="px-5 py-4 z-20 shrink-0 bg-white shadow-sm border-b border-[#DCEDC8] text-center flex flex-col items-center gap-1.5 rounded-b-3xl -mt-4 relative mx-2">
              <p className="text-[8px] text-[#689F38] tracking-widest uppercase">📍 {entity.address || "123 Eden Path"}</p>
            </div>
          ) : themeStyle === "cyberneon" ? (
            <div className="px-5 py-2 z-20 shrink-0 bg-[#18181B] border-y border-[#00FF41]/30 text-center flex flex-col items-center gap-1 font-mono">
              <p className="text-[7px] text-[#008F11] tracking-widest uppercase">LOC // {entity.address || "SECTOR 7G"}</p>
            </div>
          ) : (
            <div className="px-4 -mt-4 z-10">
              <div className={`${previewTheme.cardBg} space-y-1.5 text-[10px] ${previewTheme.textSecondary} shadow-lg rounded-xl`}>
                <p className="line-clamp-1 font-medium">📍 {entity.address || "123 Main St."}</p>
                <div className="flex justify-between text-[9px] font-bold">
                  <span>📞 {entity.phone || "555-0100"}</span>
                  {wifiPassword && (
                    <span style={{ color: primaryColor }}>
                      📶 {wifiPassword}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Menu Items List */}
          <div className={`p-4 space-y-4 flex-grow overflow-y-auto scrollbar-hide mt-2 ${themeStyle === "luxury" ? "bg-[#0C0C0E]" : themeStyle === "vibrant" ? "bg-[#FEF3C7]" : themeStyle === "omakase" ? "bg-[#0F0F0F]" : themeStyle === "popdiner" ? "bg-[#FAFAFA] p-5 gap-6" : themeStyle === "editorial" ? "bg-[#F9F8F6] p-5 gap-8" : themeStyle === "lounge" ? "bg-[#0A0A0A]" : themeStyle === "resort" ? "bg-[#F0F8FF]" : themeStyle === "botanical" ? "bg-[#F9FBE7]" : themeStyle === "cyberneon" ? "bg-[#09090B]" : themeStyle === "bentopop" ? "bg-[#F0FDF4] p-5 gap-6" : themeStyle === "noir" ? "bg-[#0A0A0A] p-6 gap-8" : themeStyle === "brasserie" ? "bg-[#FAFAED] p-5 gap-6" : themeStyle === "zen" ? "bg-white p-6 gap-8" : themeStyle === "bistro" ? "bg-[#FDFBF7] p-4 gap-4" : "bg-slate-50/50"}`}>
            {[
              { name: "Masala Dosa", desc: "Crispy rice crepe filled with spiced potatoes.", price: "$12.00", img: "/images/library/masala-dosa.jpg", tags: ["POPULAR"] },
              { name: "Ghee Karam Idly", desc: "Soft steamed rice cakes tossed in fiery podi.", price: "$10.00", img: "/images/library/ghee-karam-idly.jpg", tags: ["POPULAR"] },
              { name: "Chicken Dosa", desc: "Crispy crepe stuffed with spicy chicken tikka.", price: "$14.00", img: "/images/library/chicken-dosa.jpg", tags: ["GF"] }
            ].map((item, idx) => (
              <div key={idx} className={`flex gap-3.5 p-2.5 rounded-xl ${themeStyle === "luxury" ? "bg-zinc-900/40 border border-zinc-800/50" : themeStyle === "vibrant" ? "bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-2xl" : themeStyle === "omakase" ? "bg-transparent rounded-none border-b border-[#222] pb-4" : themeStyle === "popdiner" ? "bg-white border-0 flex-col p-0 pb-4 gap-0 group" : themeStyle === "editorial" ? "bg-transparent rounded-none flex-col gap-3 pb-6 border-b border-[#E2DFD8]" : themeStyle === "lounge" ? "bg-[#141414] border border-white/5 rounded-2xl shadow-xl flex-col pb-3" : themeStyle === "resort" ? "bg-white rounded-2xl shadow-md flex-col pb-3" : themeStyle === "botanical" ? "bg-white border border-[#DCEDC8] rounded-3xl p-3" : themeStyle === "cyberneon" ? "bg-[#18181B] border-l-2 border-[#00FF41] rounded-none shadow-[0_0_15px_rgba(0,255,65,0.05)]" : themeStyle === "zen" ? "bg-transparent rounded-none border-0 flex-col gap-4 p-0" : themeStyle === "bentopop" ? "bg-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-none flex-col p-0 gap-0" : themeStyle === "noir" ? "bg-transparent flex-col gap-3 p-0" : themeStyle === "brasserie" ? "bg-transparent border-b border-[#E7E5E4] rounded-none flex-row p-0 pb-5" : themeStyle === "bistro" ? "bg-transparent border-t border-[#E7E5E4]/60 rounded-none p-3 pt-4 items-center flex-col text-center" : "bg-white shadow-sm border border-slate-100"}`}>
                <div className={`shrink-0 overflow-hidden relative ${themeStyle === "bistro" ? "w-16 h-16 rounded" : themeStyle === "luxury" ? "w-16 h-16 rounded-md opacity-80" : themeStyle === "vibrant" ? "w-20 h-20 rounded-xl border-2 border-black rotate-[2deg]" : themeStyle === "omakase" ? "w-16 h-16 rounded-none grayscale" : themeStyle === "popdiner" ? "w-full aspect-[4/3] bg-[#F5F5F5]" : themeStyle === "editorial" ? "w-full h-32 bg-[#E2DFD8] rounded-none" : themeStyle === "lounge" ? "w-full h-32 rounded-t-xl" : themeStyle === "resort" ? "w-full h-32 rounded-t-xl" : themeStyle === "botanical" ? "w-16 h-16 rounded-full border-2 border-[#F1F8E9]" : themeStyle === "cyberneon" ? "w-16 h-16 rounded-none border border-[#00FF41]/30 grayscale contrast-125" : themeStyle === "zen" ? "w-full aspect-square grayscale-[20%] rounded-none" : themeStyle === "bentopop" ? "w-full aspect-square border-b-4 border-black rounded-none" : themeStyle === "noir" ? "w-full aspect-[4/3] rounded-sm opacity-80" : themeStyle === "brasserie" ? "w-20 h-20 rounded-md" : "w-14 h-14 rounded-lg"}`}>
                  <Image src={item.img} alt={item.name} className="w-full h-full object-cover" fill />
                </div>
                <div className={`flex-1 space-y-1.5 ${themeStyle === "lounge" || themeStyle === "resort" ? "px-3" : themeStyle === "bentopop" ? "p-3 flex-col flex-grow" : themeStyle === "zen" || themeStyle === "noir" ? "flex-col w-full" : ""}`}>
                  <div className={`flex ${themeStyle === "bentopop" ? "justify-between items-start gap-2" : themeStyle === "popdiner" ? "justify-between items-baseline gap-4 mt-3 px-4" : themeStyle === "noir" || themeStyle === "bistro" ? "justify-between items-baseline gap-4" : themeStyle === "zen" ? "flex-col gap-1" : "justify-between items-start"}`}>
                    <h4 className={`text-xs font-bold leading-tight ${themeStyle === "luxury" ? "text-zinc-100 font-serif" : themeStyle === "vibrant" ? "text-black font-black uppercase tracking-tight" : themeStyle === "omakase" ? "text-white uppercase tracking-widest font-light" : themeStyle === "popdiner" ? "text-[#121212] font-serif text-lg leading-tight" : themeStyle === "editorial" ? "text-[#1A1918] font-serif text-lg" : themeStyle === "lounge" ? "text-white" : themeStyle === "resort" ? "text-[#003366] font-black" : themeStyle === "botanical" ? "text-[#33691E] font-serif" : themeStyle === "cyberneon" ? "text-[#00FF41] font-mono tracking-tight" : themeStyle === "zen" ? "font-light text-lg tracking-wide text-zinc-900" : themeStyle === "bentopop" ? "font-black text-sm text-black uppercase leading-tight" : themeStyle === "noir" ? "font-serif text-lg text-zinc-200 tracking-wide" : themeStyle === "brasserie" ? "font-serif text-slate-800 text-sm" : themeStyle === "bistro" ? "font-serif text-[#1C1917] font-bold text-sm" : "text-slate-800"}`}>{item.name}</h4>
                    {themeStyle === "popdiner" && (
                      <span className="text-[#121212] font-light text-xs">{item.price}</span>
                    )}
                  </div>
                  <p className={`text-[9px] leading-snug ${themeStyle === "luxury" ? "text-zinc-400 font-serif" : themeStyle === "vibrant" ? "text-slate-700 font-medium" : themeStyle === "omakase" ? "text-[#777] font-light tracking-wide" : themeStyle === "popdiner" ? "text-[#666666] font-light text-xs" : themeStyle === "editorial" ? "text-[#5C5A56] font-serif" : themeStyle === "lounge" ? "text-white/50" : themeStyle === "resort" ? "text-[#006994]" : themeStyle === "botanical" ? "text-[#558B2F]" : themeStyle === "cyberneon" ? "text-[#008F11] font-mono" : themeStyle === "zen" ? "text-[10px] font-light text-zinc-400 leading-relaxed" : themeStyle === "bentopop" ? "text-[8px] font-bold text-slate-600 leading-snug mt-2" : themeStyle === "noir" ? "text-[9px] font-light text-zinc-500 leading-relaxed" : themeStyle === "brasserie" ? "text-[9px] text-[#78716C] font-serif leading-relaxed" : themeStyle === "bistro" ? "text-[9px] text-[#57534E] leading-relaxed italic" : "text-slate-500"}`}>{item.desc}</p>
                </div>
                {themeStyle !== "popdiner" && (
                  <span className={`text-[11px] font-extrabold shrink-0 ${themeStyle === "luxury" ? "text-amber-400 font-serif mt-0.5" : themeStyle === "vibrant" ? "bg-rose-500 text-white border-2 border-black px-2 py-0.5 rounded-lg rotate-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] self-start mt-1" : themeStyle === "omakase" ? "text-[#888] tracking-widest font-light" : themeStyle === "editorial" ? "text-[#1A1918] font-serif" : themeStyle === "lounge" ? "text-[#D4AF37] ml-3 pb-1" : themeStyle === "resort" ? "text-[#003366] ml-3 pb-1" : themeStyle === "botanical" ? "text-[#33691E] font-serif" : themeStyle === "cyberneon" ? "text-[#00FF41] font-mono bg-[#00FF41]/10 border border-[#00FF41]/30 px-1 py-0.5 h-fit mt-0.5" : themeStyle === "zen" ? "font-medium text-xs text-zinc-500 tracking-wider -order-1 mb-2" : themeStyle === "bentopop" ? "font-black text-sm text-[#EF476F]" : themeStyle === "noir" ? "font-sans text-[10px] text-amber-500 tracking-wider" : themeStyle === "brasserie" ? "font-medium text-sm text-[#854d0e]" : themeStyle === "bistro" ? "text-[#D4AF37] text-[10px] font-medium" : "text-slate-900 self-start mt-0.5"}`}>{item.price}</span>
                )}
              </div>
            ))}
          </div>

          {/* Removed blocking overlay from here so users can preview the theme */}
        </div>

        {/* Action / Upgrade Button */}
        <div className="mt-8">
          {isLocked ? (
            <Button 
              type="button" 
              onClick={() => window.location.href = "/dashboard/billing"}
              className={`w-full shadow-xl py-7 text-base font-black tracking-wide rounded-2xl transition-all hover:-translate-y-0.5 ${
                lockTitle.includes("Elite") 
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-amber-500/20" 
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20"
              }`}
            >
              {lockTitle.includes("Elite") ? <Crown className="mr-3 h-5 w-5" /> : <Lock className="mr-3 h-5 w-5" />}
              {upgradeTarget.toUpperCase()} TO APPLY THEME
            </Button>
          ) : (
            <Button form="branding-settings-form" type="submit" className="w-full shadow-xl py-7 text-base font-black tracking-wide bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all hover:-translate-y-0.5" disabled={isPending}>
              {isPending ? (
                <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> SAVING DESIGN...</>
              ) : (
                <><Save className="mr-3 h-5 w-5" /> SAVE BRAND & THEME</>
              )}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
