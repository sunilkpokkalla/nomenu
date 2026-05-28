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
                    name: "Lumina Premium",
                    description: "High-end cinematic gold",
                    emoji: "✨",
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
                    name: "Luxury Dark",
                    description: "Gold text & glassmorphism",
                    emoji: "✨",
                    isPremium: true
                  },
                  {
                    id: "vibrant",
                    name: "Vibrant Diner",
                    description: "Neo-brutalism bold cards",
                    emoji: "🍔",
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
                <img src="https://images.unsplash.com/photo-1544025162-811114215b74?q=80&w=400&auto=format&fit=crop" alt="Hero Dish" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/50 to-transparent"></div>
              </div>
            </div>
          ) : themeStyle === "luxury" ? (
            <div className="pt-6 pb-4 px-4 text-center">
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

          {/* Sticky Tab Filters */}
          <div className={`py-2 flex gap-1.5 overflow-x-auto px-3 mt-3 scrollbar-none border-b ${themeStyle === "luxury" ? "border-zinc-900 bg-zinc-950/40" : themeStyle === "vibrant" ? "bg-white border-black border-b-2" : "bg-white"}`}>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold transition-all ${themeStyle === "vibrant" ? "border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black" : themeStyle === "luxury" ? "text-amber-400 border border-amber-400/50" : "text-white"}`}
              style={themeStyle !== "luxury" && themeStyle !== "vibrant" ? { backgroundColor: primaryColor, borderColor: primaryColor } : { backgroundColor: themeStyle === "vibrant" ? "#06D6A0" : "rgba(245,158,11,0.2)" }}
            >
              Appetizers
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${themeStyle === "luxury" ? "text-zinc-400 bg-zinc-900" : themeStyle === "vibrant" ? "text-black border-2 border-transparent hover:bg-slate-100" : "text-slate-600 bg-slate-100"}`}>
              Mains
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${themeStyle === "luxury" ? "text-zinc-400 bg-zinc-900" : themeStyle === "vibrant" ? "text-black border-2 border-transparent hover:bg-slate-100" : "text-slate-600 bg-slate-100"}`}>
              Desserts
            </span>
          </div>

          {/* Simulated Items */}
          <div className="p-3 space-y-3 flex-grow overflow-y-auto">
            <div className={`flex justify-between items-center pb-2 border-b gap-3 ${previewTheme.itemBorder}`}>
              <div className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 ${themeStyle === "vibrant" ? "border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]" : "border border-slate-200"}`}>
                <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?w=100&h=100&fit=crop" alt="Soup" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-0.5 flex-grow">
                <div className="flex items-center gap-1.5">
                  <h4 className={`text-[10px] font-bold ${themeStyle === "luxury" ? "text-zinc-100" : themeStyle === "vibrant" ? "text-black font-black" : "text-slate-800"}`}>French Onion Soup</h4>
                  <span
                    className={`text-[7px] font-extrabold px-1 rounded ${themeStyle === "luxury" ? "bg-amber-950/40 text-amber-400 border border-amber-900/30" : themeStyle === "vibrant" ? "bg-amber-300 text-black border border-black" : "text-white"}`}
                    style={themeStyle !== "luxury" && themeStyle !== "vibrant" ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                  >
                    POPULAR
                  </span>
                </div>
                <p className={`text-[8px] line-clamp-1 ${previewTheme.textSecondary}`}>Rich beef broth with caramelized onions.</p>
              </div>
              <span className={`text-[10px] font-extrabold shrink-0 ${themeStyle === "luxury" ? "text-amber-400 font-serif" : themeStyle === "vibrant" ? "bg-rose-500 text-white border border-black px-1.5 py-0.5 rounded rotate-2 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" : "text-slate-900"}`}>$12.00</span>
            </div>

            <div className={`flex justify-between items-center pb-2 border-b gap-3 ${previewTheme.itemBorder}`}>
              <div className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 ${themeStyle === "vibrant" ? "border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-[2deg]" : "border border-slate-200"}`}>
                <img src="https://images.unsplash.com/photo-1599813580521-820712a4df03?w=100&h=100&fit=crop" alt="Escargots" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-0.5 flex-grow">
                <div className="flex items-center gap-1.5">
                  <h4 className={`text-[10px] font-bold ${themeStyle === "luxury" ? "text-zinc-100" : themeStyle === "vibrant" ? "text-black font-black" : "text-slate-800"}`}>Escargots de Bourgogne</h4>
                </div>
                <p className={`text-[8px] line-clamp-1 ${previewTheme.textSecondary}`}>Baked in garlic, parsley & herb butter.</p>
                <span className={`inline-block border rounded px-1 text-[7px] font-bold ${themeStyle === "vibrant" ? "bg-[#06D6A0] text-black border-black" : previewTheme.accentBg}`}>
                  VEG
                </span>
              </div>
              <span className={`text-[10px] font-extrabold shrink-0 ${themeStyle === "luxury" ? "text-amber-400 font-serif" : themeStyle === "vibrant" ? "bg-rose-500 text-white border border-black px-1.5 py-0.5 rounded rotate-2 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" : "text-slate-900"}`}>$15.00</span>
            </div>
          </div>

          {/* Footer */}
          <div className={`text-center py-2.5 border-t text-[8px] text-slate-400 bg-slate-50/50 ${themeStyle === "luxury" ? "bg-zinc-950/80 border-zinc-900 text-zinc-600" : themeStyle === "bistro" ? "bg-[#FDFBF7] border-[#E7E5E4] text-[#A8A29E]" : "bg-slate-50/50"}`}>
            POWERED BY <span className={`font-bold ${themeStyle === "luxury" ? "text-zinc-500" : themeStyle === "bistro" ? "text-[#5C4033]" : "text-slate-500"}`}>NOMENU</span>
          </div>
        </div>
      </div>
    </div>
  );
}
