"use client";

import { useState } from "react";
import { Loader2, Palette, Save, Wifi } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    // Menu specific
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await action(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  // Dynamic theme class definitions for preview matching public menu styles
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
    }
  }[themeStyle as "bistro" | "minimalist" | "luxury" | "vibrant"] || {
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
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" /> Branding & Theme
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your guest-facing digital menu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {type === "menu" && (
              <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
                <div className="space-y-0.5">
                  <Label className="text-base">Override Global Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Use a custom design specifically for this menu.
                  </p>
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
  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
</label>
              </div>
            )}

            <div className={type === "menu" && !useCustomDesign ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
            {successMessage && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errorMessage}
              </div>
            )}

            {/* Color Selectors */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="primaryColorPicker"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 p-1 border cursor-pointer rounded-lg"
                  />
                  <Input
                    type="text"
                    id="primaryColor"
                    name="primaryColor"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#2563EB"
                    className="flex-1"
                    maxLength={7}
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400">Used for headers, banners, and button active states.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="accentColorPicker"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-12 h-10 p-1 border cursor-pointer rounded-lg"
                  />
                  <Input
                    type="text"
                    id="accentColor"
                    name="accentColor"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    placeholder="#F59E0B"
                    className="flex-1"
                    maxLength={7}
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400">Used for highlights, tags, badges, and accents.</p>
              </div>
            </div>

            <hr />

            {/* Theme Presets Selection */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-slate-800">Menu Layout Template</Label>
                <p className="text-[11px] text-slate-500">Select a structural theme matching your restaurant vibe.</p>
              </div>
              
              <input type="hidden" name="themeStyle" value={themeStyle} />

              <div className="grid gap-3 grid-cols-2">
                {[
                  {
                    id: "bistro",
                    name: "Bistro Classic",
                    description: "Clean, warm cafe styling",
                    emoji: "☕",
                    isPremium: true
                  },
                  {
                    id: "minimalist",
                    name: "Minimalist (Free)",
                    description: "Ultra clean line listing",
                    emoji: "🍽️",
                    isPremium: false
                  },
                  {
                    id: "luxury",
                    name: "Lumina Premium",
                    description: "High-end cinematic dark gold",
                    emoji: "✨",
                    isPremium: true
                  },
                  {
                    id: "vibrant",
                    name: "Vibrant Diner",
                    description: "Neo-brutalism bold cards",
                    emoji: "🍔",
                    isPremium: true
                  },
                  {
                    id: "omakase",
                    name: "Omakase",
                    description: "Zen Minimalist Dark",
                    emoji: "🍣",
                    isPremium: true
                  },
                  {
                    id: "brutalist",
                    name: "Brutalist",
                    description: "Raw oversized typography",
                    emoji: "🖤",
                    isPremium: true
                  },
                  {
                    id: "retro",
                    name: "Y2K Retro",
                    description: "Windows 98 arcade style",
                    emoji: "👾",
                    isPremium: true
                  },
                  {
                    id: "speakeasy",
                    name: "Speakeasy",
                    description: "Dark jazz club gold",
                    emoji: "🍸",
                    isPremium: true
                  },
                  {
                    id: "cyberpunk",
                    name: "Cyberpunk",
                    description: "Neon glitch matrix",
                    emoji: "🦾",
                    isPremium: true
                  },
                  {
                    id: "boutique",
                    name: "Boutique Cafe",
                    description: "Soft girl dreamcore",
                    emoji: "🎀",
                    isPremium: true
                  },
                  {
                    id: "botanical",
                    name: "Botanical",
                    description: "Earthy minimal floral",
                    emoji: "🌿",
                    isPremium: true
                  },
                  {
                    id: "molecular",
                    name: "Laboratory",
                    description: "Clinical experimental data",
                    emoji: "🧬",
                    isPremium: true
                  }
                ].map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setThemeStyle(theme.id)}
                    className={`flex flex-col text-left p-3 rounded-xl border-2 transition-all relative overflow-hidden cursor-pointer ${
                      themeStyle === theme.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {theme.isPremium && (
                      <span className="absolute top-0 right-0 bg-amber-500 text-black text-[7px] font-extrabold px-1.5 py-0.5 rounded-bl uppercase tracking-wider scale-90 origin-top-right">
                        PRO
                      </span>
                    )}
                    <span className="text-xl mb-1">{theme.emoji}</span>
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {theme.name}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight mt-0.5">{theme.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <hr />

            {/* Amenities Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-1.5 text-slate-700">
                <Wifi className="h-4 w-4 text-slate-400" /> Dining Room Amenities
              </h3>
              <div className="space-y-2">
                <Label htmlFor="wifiPassword">Guest WiFi Password</Label>
                <Input
                  type="text"
                  id="wifiPassword"
                  name="wifiPassword"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="e.g. bistro-guest-2026"
                />
                <p className="text-xs text-slate-500">
                  Leave blank to hide. If provided, guests will see this WiFi password displayed directly on the digital menu page.
                </p>
              </div>
            </div>

            </div>
            {/* Gating Logic warning alert & premium upgrade CTA */}
            {themeStyle !== "minimalist" && (!entity.plan || entity.plan.toLowerCase() === "free") ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-2 flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-700 shrink-0">
                    <Save className="h-4 w-4 animate-pulse text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1">
                      Premium Theme Locked
                    </h4>
                    <p className="text-[10px] text-amber-800/90 leading-relaxed mt-1">
                      This template is a Growth/Pro feature. Upgrade your plan to apply this design template on your live digital menu. You can continue to preview it here!
                    </p>
                  </div>
                </div>
                
                <Button 
                  type="button"
                  onClick={() => window.location.href = "/dashboard/billing"}
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-extrabold shadow-md border-0 py-5 text-xs tracking-wider uppercase"
                >
                  Save Locked: Upgrade to Unlock Theme
                </Button>
              </div>
            ) : (
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Branding
                  </>
                )}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Live Preview Console */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <Label className="font-semibold text-slate-700 text-sm">Live Mobile Preview</Label>
          <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Interactive
          </span>
        </div>

        {/* Guest View Frame */}
        <div className={`mx-auto max-w-[340px] w-full border-8 border-slate-900 rounded-[32px] overflow-hidden shadow-2xl min-h-[520px] flex flex-col relative aspect-[9/16] transition-all duration-300 ${previewTheme.frameBg} ${previewTheme.fontClass}`}>
          {/* Cover Header Banner */}
          {themeStyle === "bistro" ? (
            <div className="text-center relative bg-[#1C1917] overflow-hidden shrink-0 flex flex-col">
              <div className="pt-6 pb-4 px-4 z-10 space-y-0.5">
                <h1 className="text-xl font-serif text-[#D4AF37] tracking-wider uppercase drop-shadow-md">{entity.name}</h1>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#D4AF37]/60"></span>
                  <span className="text-[7px] text-[#D4AF37] uppercase tracking-[0.3em] font-sans font-medium">
                    {entity.cuisine_type || "Menu"}
                  </span>
                  <span className="h-px w-6 bg-gradient-to-l from-transparent to-[#D4AF37]/60"></span>
                </div>
              </div>
              <div className="w-full h-[80px] relative border-t border-[#D4AF37]/30 shadow-inner">
                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400&auto=format&fit=crop" alt="Hero Dish" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/50 to-transparent"></div>
              </div>
            </div>
          ) : themeStyle === "luxury" ? (
            <div className="pt-6 pb-4 px-4 text-center bg-black">
              <h1 className="text-lg font-bold tracking-widest uppercase text-amber-400 font-serif">{entity.name}</h1>
              <p className="text-[8px] opacity-60 mt-0.5 tracking-wider uppercase text-zinc-400">
                {entity.cuisine_type || "Fine Dining"}
              </p>
              <div className="w-12 h-0.5 bg-amber-500/40 mx-auto mt-2.5"></div>
            </div>
          ) : themeStyle === "vibrant" ? (
            <div className="pt-8 pb-6 px-4 text-center border-b-2 border-black relative bg-[#FFD166] shrink-0">
              <div className="text-center z-10 space-y-1">
                <h1 className="text-xl font-black tracking-tight text-black font-sans uppercase drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                  {entity.name}
                </h1>
                <span className="inline-block bg-black text-[#FEFCE8] text-[8px] font-black uppercase tracking-wider px-2 py-0.5 border border-black rounded-md transform -rotate-1">
                  {entity.cuisine_type || "Diner Pop"}
                </span>
              </div>
            </div>
          ) : themeStyle === "omakase" ? (
            <div className="pt-10 pb-6 px-4 text-center bg-[#0F0F0F] text-[#E0E0E0] shrink-0">
              <h1 className="text-xl tracking-[0.2em] font-light uppercase text-white mb-2">{entity.name}</h1>
              <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-[#4A4A4A] to-transparent mx-auto"></div>
              <p className="mt-2 text-[6px] tracking-[0.2em] text-[#888888] uppercase">{entity.cuisine_type || "Tasting Menu"}</p>
            </div>
          ) : themeStyle === "brutalist" ? (
            <div className="p-4 border-b-4 border-black bg-white text-black shrink-0 font-mono">
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-none break-words">{entity.name}</h1>
              <div className="mt-4 border-t-2 border-black pt-2 flex justify-between">
                <p className="text-[8px] font-bold uppercase bg-black text-white px-1 py-0.5">{entity.cuisine_type || "MENU"}</p>
              </div>
            </div>
          ) : themeStyle === "retro" ? (
            <div className="p-2 border-b-2 border-black bg-[#C0C0C0] text-black shrink-0 font-mono">
              <div className="bg-[#000080] text-white px-1 py-0.5 text-[8px] flex justify-between font-bold mb-2">
                <span>{entity.name}.exe</span>
                <span>X</span>
              </div>
              <h1 className="text-xl font-black uppercase text-[#FF00FF]">{entity.name}</h1>
            </div>
          ) : themeStyle === "speakeasy" ? (
            <div className="pt-8 pb-4 px-4 text-center bg-[#0A0A0A] border-b border-[#D4AF37]/20 shrink-0 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
              <h1 className="text-xl tracking-[0.2em] uppercase text-[#F3E5AB] font-light mb-2">{entity.name}</h1>
              <div className="flex items-center justify-center gap-2 w-full max-w-[150px] mx-auto opacity-60">
                <div className="h-px bg-[#D4AF37] flex-1"></div>
                <p className="text-[6px] tracking-[0.3em] uppercase text-[#D4AF37]">{entity.cuisine_type || "Provisions"}</p>
                <div className="h-px bg-[#D4AF37] flex-1"></div>
              </div>
            </div>
          ) : (
            <div
              className="h-24 w-full relative flex items-end justify-center p-3 text-white transition-all duration-300"
              style={{
                background: previewTheme.headerGradient,
              }}
            >
              <div className="text-center z-10">
                <h1 className="text-sm font-bold tracking-tight">{entity.name}</h1>
                <p className="text-[9px] opacity-90 font-medium tracking-wide uppercase">
                  {entity.cuisine_type || "Fine Dining"}
                </p>
              </div>
            </div>
          )}

          {/* Overlapping Info Card */}
          {themeStyle === "bistro" ? (
            <div className="px-4 py-2 z-20 shrink-0 bg-[#FDFBF7] border-b border-[#E7E5E4] shadow-sm text-center flex flex-col items-center gap-1">
              <p className="font-sans text-[8px] uppercase tracking-widest text-[#78716C]">
                📍 {entity.address}
              </p>
              <div className="flex justify-center items-center gap-4 text-[8px] uppercase tracking-widest text-[#57534E] font-medium">
                <span>📞 {entity.phone}</span>
                {wifiPassword && <span className="text-[#D4AF37] font-bold">📶 WiFi: {wifiPassword}</span>}
              </div>
            </div>
          ) : themeStyle === "luxury" || themeStyle === "minimalist" || themeStyle === "vibrant" ? (
            <div className="px-4 py-1 text-center text-[8px] text-zinc-500 space-y-0.5 mt-2">
              <p>📍 {entity.address}</p>
              <div className="flex justify-center gap-3">
                <span>📞 {entity.phone}</span>
                {wifiPassword && <span className="text-amber-500/70">📶 WiFi: {wifiPassword}</span>}
              </div>
            </div>
          ) : themeStyle === "omakase" ? (
            <div className="bg-[#0F0F0F] text-[#666666] text-[7px] tracking-[0.1em] text-center p-2 uppercase">
               📍 {entity.address} | 📞 {entity.phone}
            </div>
          ) : themeStyle === "brutalist" ? (
            <div className="bg-yellow-300 border-b-4 border-black text-black text-[9px] font-bold uppercase p-2 flex justify-between font-mono">
               <span>{entity.address}</span> <span>{entity.phone}</span>
            </div>
          ) : themeStyle === "retro" ? (
            <div className="bg-[#C0C0C0] border-b-[2px] border-r-[2px] border-b-black border-r-black border-t-[2px] border-l-[2px] border-t-white border-l-white text-black text-[8px] font-mono p-1 m-2">
              <div className="border border-inset border-gray-500 bg-white p-1">
                {entity.address}
              </div>
            </div>
          ) : themeStyle === "speakeasy" ? (
            <div className="bg-[#0A0A0A] border-b border-[#D4AF37]/20 text-[#D4AF37]/60 text-[7px] tracking-[0.2em] font-serif p-2 text-center">
              A SECRET LOCATION
            </div>
          ) : (
            <div className="px-3 -mt-3 z-10">
              <div className={`${previewTheme.cardBg} space-y-1 text-[9px] ${previewTheme.textSecondary}`}>
                <p className="line-clamp-1">📍 {entity.address}</p>
                <div className="flex justify-between text-[8px] font-semibold">
                  <span>📞 {entity.phone}</span>
                  {wifiPassword && (
                    <span style={{ color: primaryColor }}>
                      📶 WiFi: {wifiPassword}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Dietary Filters */}
          <div className={`py-2 flex gap-1.5 overflow-x-auto px-3 mt-3 scrollbar-none border-b ${themeStyle === "luxury" ? "border-zinc-900 bg-zinc-950/40" : themeStyle === "vibrant" ? "bg-white border-black border-b-2" : "bg-white"}`}>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold transition-all flex items-center gap-1 ${themeStyle === "vibrant" ? "border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black" : themeStyle === "luxury" ? "text-amber-400 border border-amber-400/50" : "text-white"}`}
              style={themeStyle !== "luxury" && themeStyle !== "vibrant" ? { backgroundColor: primaryColor, borderColor: primaryColor } : { backgroundColor: themeStyle === "vibrant" ? "#06D6A0" : "rgba(245,158,11,0.2)" }}
            >
              🌿 Vegetarian
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold flex items-center gap-1 ${themeStyle === "luxury" ? "text-zinc-400 bg-zinc-900" : themeStyle === "vibrant" ? "text-black border-2 border-transparent hover:bg-slate-100" : "text-slate-600 bg-slate-100"}`}>
              🌱 Vegan
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold flex items-center gap-1 ${themeStyle === "luxury" ? "text-zinc-400 bg-zinc-900" : themeStyle === "vibrant" ? "text-black border-2 border-transparent hover:bg-slate-100" : "text-slate-600 bg-slate-100"}`}>
              🌾 GF
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold flex items-center gap-1 ${themeStyle === "luxury" ? "text-zinc-400 bg-zinc-900" : themeStyle === "vibrant" ? "text-black border-2 border-transparent hover:bg-slate-100" : "text-slate-600 bg-slate-100"}`}>
              🌶️ Spicy
            </span>
          </div>

          {/* Category Tabs */}
          <div className={`py-2 flex gap-1.5 overflow-x-auto px-3 mt-3 scrollbar-none border-b ${themeStyle === "luxury" ? "border-zinc-900 bg-zinc-950/40" : themeStyle === "vibrant" ? "bg-white border-black border-b-2" : themeStyle === "omakase" ? "bg-[#0F0F0F] border-[#222]" : themeStyle === "brutalist" ? "bg-white border-black border-b-4" : themeStyle === "retro" ? "bg-[#C0C0C0] border-gray-500" : themeStyle === "speakeasy" ? "bg-[#0A0A0A] border-[#D4AF37]/20" : themeStyle === "cyberpunk" ? "bg-[#050510] border-[#0ff]/50" : themeStyle === "boutique" ? "bg-[#FFF0F5] border-[#FFB6C1]" : themeStyle === "botanical" ? "bg-[#FDFBF7] border-[#EAE3D2]" : themeStyle === "molecular" ? "bg-white border-[#1a1f2e] border-b-2" : "bg-white"}`}>
            <span 
              className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold transition-all ${themeStyle === "vibrant" ? "border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black" : themeStyle === "luxury" ? "text-amber-400 border border-amber-400/50" : themeStyle === "omakase" ? "text-white tracking-widest" : themeStyle === "brutalist" ? "text-white bg-black border-r-2 border-black rounded-none" : themeStyle === "retro" ? "text-black bg-[#C0C0C0] border-[1px] border-outset border-t-white border-l-white border-r-black border-b-black rounded-none" : themeStyle === "speakeasy" ? "text-[#F3E5AB] border-b border-[#F3E5AB] rounded-none tracking-[0.2em] font-serif uppercase" : themeStyle === "cyberpunk" ? "text-[#0ff] border border-[#0ff] bg-[#0ff]/10 rounded-none uppercase" : themeStyle === "boutique" ? "text-white bg-[#DDA0DD] shadow-sm" : themeStyle === "botanical" ? "text-[#3E5739] border-b-2 border-[#3E5739] rounded-none uppercase font-serif" : themeStyle === "molecular" ? "text-white bg-[#1a1f2e] border border-[#1a1f2e] rounded-none uppercase" : "text-white"}`}
              style={themeStyle !== "luxury" && themeStyle !== "vibrant" && themeStyle !== "omakase" && themeStyle !== "brutalist" && themeStyle !== "retro" && themeStyle !== "speakeasy" && themeStyle !== "cyberpunk" && themeStyle !== "boutique" && themeStyle !== "botanical" && themeStyle !== "molecular" ? { backgroundColor: primaryColor, borderColor: primaryColor } : { backgroundColor: themeStyle === "vibrant" ? "#06D6A0" : themeStyle === "omakase" ? "transparent" : themeStyle === "brutalist" ? "#000" : themeStyle === "speakeasy" ? "transparent" : themeStyle === "retro" ? "#C0C0C0" : themeStyle === "cyberpunk" ? "transparent" : themeStyle === "boutique" ? "#DDA0DD" : themeStyle === "botanical" ? "transparent" : themeStyle === "molecular" ? "#1a1f2e" : "rgba(245,158,11,0.2)" }}
            >
              APPETIZERS
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${themeStyle === "luxury" ? "text-zinc-400 bg-zinc-900" : themeStyle === "vibrant" ? "text-black border-2 border-transparent hover:bg-slate-100" : themeStyle === "omakase" ? "text-[#666] tracking-widest" : themeStyle === "brutalist" ? "text-black rounded-none" : themeStyle === "retro" ? "text-gray-600 border-[1px] border-outset border-t-white border-l-white border-r-gray-500 border-b-gray-500 rounded-none bg-[#C0C0C0]" : themeStyle === "speakeasy" ? "text-[#D4AF37]/50 rounded-none tracking-[0.2em] font-serif uppercase" : themeStyle === "cyberpunk" ? "text-[#f0f]/50 border border-[#f0f]/30 rounded-none" : themeStyle === "boutique" ? "text-[#D8BFD8] bg-[#FFF0F5]/50 border border-white" : themeStyle === "botanical" ? "text-[#8A9A86] rounded-none uppercase font-serif" : themeStyle === "molecular" ? "text-[#1a1f2e] border border-[#1a1f2e] rounded-none uppercase bg-white" : "text-slate-600 bg-slate-100"}`}>
              MAINS
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${themeStyle === "luxury" ? "text-zinc-400 bg-zinc-900" : themeStyle === "vibrant" ? "text-black border-2 border-transparent hover:bg-slate-100" : themeStyle === "omakase" ? "text-[#666] tracking-widest" : themeStyle === "brutalist" ? "text-black rounded-none" : themeStyle === "retro" ? "text-gray-600 border-[1px] border-outset border-t-white border-l-white border-r-gray-500 border-b-gray-500 rounded-none bg-[#C0C0C0]" : themeStyle === "speakeasy" ? "text-[#D4AF37]/50 rounded-none tracking-[0.2em] font-serif uppercase" : themeStyle === "cyberpunk" ? "text-[#f0f]/50 border border-[#f0f]/30 rounded-none" : themeStyle === "boutique" ? "text-[#D8BFD8] bg-[#FFF0F5]/50 border border-white" : themeStyle === "botanical" ? "text-[#8A9A86] rounded-none uppercase font-serif" : themeStyle === "molecular" ? "text-[#1a1f2e] border border-[#1a1f2e] rounded-none uppercase bg-white" : "text-slate-600 bg-slate-100"}`}>
              DESSERTS
            </span>
          </div>

          {/* Menu Items List */}
          <div className={`p-3 space-y-3 flex-grow overflow-y-auto scrollbar-hide ${themeStyle === "luxury" ? "bg-[#0C0C0E]" : themeStyle === "vibrant" ? "bg-[#FEF3C7]" : themeStyle === "omakase" ? "bg-[#0F0F0F]" : themeStyle === "brutalist" ? "bg-white" : themeStyle === "retro" ? "bg-[#C0C0C0]" : themeStyle === "speakeasy" ? "bg-[#0A0A0A]" : themeStyle === "cyberpunk" ? "bg-[#050510]" : themeStyle === "boutique" ? "bg-[#FFF0F5]" : themeStyle === "botanical" ? "bg-[#FDFBF7]" : themeStyle === "molecular" ? "bg-[#F0F2F5]" : "bg-slate-50/50"}`}>
            {[
              { name: "French Onion Soup", desc: "Classic beef broth, caramelized onions, gruyere.", price: "$12.00", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop", tags: ["POPULAR"] },
              { name: "Escargots de Bourgogne", desc: "Baked in garlic, parsley & herb butter.", price: "$15.00", img: "https://images.unsplash.com/photo-1481070555726-e2fe83477d56?q=80&w=400&auto=format&fit=crop", tags: ["VEG"] },
              { name: "Steak Frites", desc: "Prime ribeye, truffle fries, peppercorn sauce.", price: "$32.00", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=400&auto=format&fit=crop", tags: ["POPULAR"] },
              { name: "Truffle Risotto", desc: "Arborio rice, wild mushrooms, parmesan.", price: "$24.00", img: "https://images.unsplash.com/photo-1633964913295-ceb4382688ce?q=80&w=400&auto=format&fit=crop", tags: ["VEG", "GF"] },
              { name: "Lobster Bisque", desc: "Rich cream, cognac, chives.", price: "$18.00", img: "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?q=80&w=400&auto=format&fit=crop", tags: [] },
              { name: "Seared Scallops", desc: "Cauliflower purée, brown butter capers.", price: "$28.00", img: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?q=80&w=400&auto=format&fit=crop", tags: ["GF"] },
              { name: "Duck Confit", desc: "Crispy leg, braised lentils, orange glaze.", price: "$30.00", img: "https://images.unsplash.com/photo-1627286400578-8314bb3f0111?q=80&w=400&auto=format&fit=crop", tags: [] },
              { name: "Burrata Salad", desc: "Heirloom tomatoes, balsamic glaze, basil.", price: "$16.00", img: "https://images.unsplash.com/photo-1608897013039-887f214b985c?q=80&w=400&auto=format&fit=crop", tags: ["VEG"] },
              { name: "Chocolate Lava Cake", desc: "Warm ganache center, vanilla bean ice cream.", price: "$10.00", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=400&auto=format&fit=crop", tags: ["POPULAR"] },
              { name: "Crème Brûlée", desc: "Madagascar vanilla, caramelized sugar crust.", price: "$9.00", img: "https://images.unsplash.com/photo-1472555794301-77353b152fb7?q=80&w=400&auto=format&fit=crop", tags: [] }
            ].map((item, idx) => (
              <div key={idx} className={`flex gap-3 p-2 rounded-lg ${themeStyle === "luxury" ? "bg-zinc-900/40 border border-zinc-800/50" : themeStyle === "vibrant" ? "bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl" : themeStyle === "omakase" ? "bg-transparent rounded-none" : themeStyle === "brutalist" ? "border-4 border-black bg-white rounded-none flex-col" : themeStyle === "retro" ? "border-[2px] border-outset border-gray-300 bg-[#E0E0E0] rounded-none flex-col" : themeStyle === "speakeasy" ? "bg-transparent rounded-none flex-col gap-1 border-b border-dotted border-[#D4AF37]/30 pb-4" : themeStyle === "cyberpunk" ? "bg-[#001] border border-[#0ff]/30 rounded-none flex-col gap-1" : themeStyle === "boutique" ? "bg-white/70 rounded-2xl border border-white shadow-sm flex-col" : themeStyle === "botanical" ? "bg-transparent border-b border-[#EAE3D2] rounded-none flex-col gap-1 pb-3" : themeStyle === "molecular" ? "bg-white border border-[#1a1f2e] rounded-none flex-col shadow-[2px_2px_0px_0px_rgba(26,31,46,1)]" : "bg-white shadow-sm border border-slate-100"}`}>
                <div className={`shrink-0 overflow-hidden ${themeStyle === "bistro" ? "w-14 h-14 rounded" : themeStyle === "luxury" ? "w-14 h-14 rounded-md opacity-80" : themeStyle === "vibrant" ? "w-16 h-16 rounded-lg border-2 border-black rotate-[1deg]" : themeStyle === "omakase" ? "w-14 h-14 rounded-none grayscale" : themeStyle === "brutalist" ? "w-full h-24 grayscale contrast-150 border-2 border-black" : themeStyle === "retro" ? "hidden" : themeStyle === "speakeasy" ? "hidden" : themeStyle === "cyberpunk" ? "hidden" : themeStyle === "boutique" ? "w-full h-20 rounded-xl" : themeStyle === "botanical" ? "w-full h-20 rounded-t-[2rem]" : themeStyle === "molecular" ? "hidden" : "w-12 h-12 rounded-md"}`}>
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className={`flex ${themeStyle === "speakeasy" ? "justify-between items-baseline gap-2" : "justify-between items-start"}`}>
                    <h4 className={`text-[10px] font-bold ${themeStyle === "luxury" ? "text-zinc-100" : themeStyle === "vibrant" ? "text-black font-black uppercase" : themeStyle === "omakase" ? "text-white uppercase tracking-widest font-light" : themeStyle === "brutalist" ? "text-black font-black text-xs uppercase" : themeStyle === "retro" ? "text-black text-sm font-bold font-mono" : themeStyle === "speakeasy" ? "text-[#F3E5AB] tracking-wider font-serif" : themeStyle === "botanical" ? "text-[#2C3B29] font-serif font-medium" : themeStyle === "molecular" ? "text-[#1a1f2e] font-mono font-bold uppercase" : "text-slate-800"}`}>{item.name}</h4>
                    {themeStyle === "speakeasy" && <div className="flex-1 border-b border-dotted border-[#D4AF37]/30 mx-1"></div>}
                    
                    <div className="flex items-center gap-1">
                      {themeStyle !== "speakeasy" && themeStyle !== "retro" && item.tags.map(tag => (
                        <span 
                          key={tag}
                          className="text-[6px] font-extrabold px-1 rounded text-white tracking-widest"
                          style={tag === "POPULAR" ? { backgroundColor: accentColor, borderColor: accentColor } : { backgroundColor: primaryColor, borderColor: primaryColor }}
                        >
                          {tag}
                        </span>
                      ))}
                      {themeStyle === "speakeasy" && (
                        <span className="text-[10px] text-[#D4AF37] font-serif shrink-0">{item.price}</span>
                      )}
                      {themeStyle === "retro" && (
                        <span className="text-[10px] font-bold text-[#000080] font-mono shrink-0">{item.price}</span>
                      )}
                    </div>
                  </div>
                  <p className={`text-[8px] leading-tight ${themeStyle === "luxury" ? "text-zinc-400" : themeStyle === "vibrant" ? "text-slate-700 font-medium" : themeStyle === "omakase" ? "text-[#777] font-light" : themeStyle === "brutalist" ? "text-black font-bold uppercase" : themeStyle === "retro" ? "text-gray-700 font-mono" : themeStyle === "speakeasy" ? "text-[#D4AF37]/60 font-serif italic" : "text-slate-500"}`}>{item.desc}</p>
                </div>
                {themeStyle !== "speakeasy" && themeStyle !== "retro" && (
                  <span className={`text-[10px] font-extrabold shrink-0 ${themeStyle === "luxury" ? "text-amber-400 font-serif mt-0.5" : themeStyle === "vibrant" ? "bg-rose-500 text-white border border-black px-1.5 py-0.5 rounded rotate-2 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] self-start mt-0.5" : themeStyle === "omakase" ? "text-[#888] tracking-widest font-light" : themeStyle === "brutalist" ? "bg-black text-white px-1.5 py-0.5 text-xs font-black self-start" : "text-slate-900 self-start mt-0.5"}`}>{item.price}</span>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className={`text-center py-2.5 border-t text-[8px] text-slate-400 bg-slate-50/50 ${themeStyle === "luxury" ? "bg-zinc-950/80 border-zinc-900 text-zinc-600" : themeStyle === "bistro" ? "bg-[#FDFBF7] border-[#E7E5E4] text-[#A8A29E]" : themeStyle === "retro" ? "bg-[#C0C0C0] border-gray-500 text-gray-600 font-mono" : themeStyle === "speakeasy" ? "bg-[#0A0A0A] border-[#D4AF37]/20 text-[#D4AF37]/40 tracking-widest font-serif" : "bg-slate-50/50"}`}>
            POWERED BY <span className={`font-bold ${themeStyle === "luxury" ? "text-zinc-500" : themeStyle === "bistro" ? "text-[#5C4033]" : themeStyle === "retro" ? "text-black" : themeStyle === "speakeasy" ? "text-[#D4AF37]" : "text-slate-500"}`}>NOMENU</span>
          </div>
        </div>
      </div>
    </div>
  );
}
