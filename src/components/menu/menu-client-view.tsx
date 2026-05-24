"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Leaf, 
  Flame, 
  Award, 
  Sparkles, 
  Wifi, 
  Phone, 
  MapPin, 
  Grid, 
  List, 
  X, 
  Info,
  Clock
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface Restaurant {
  id: string;
  name: string;
  cuisine_type: string | null;
  address: string | null;
  phone: string | null;
  wifi_password: string | null;
  primary_color: string | null;
  accent_color: string | null;
  theme_style: string | null;
  currency: string | null;
  plan?: string | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
}

interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  allergens?: string[] | null;
  calories?: number | null;
  cooking_time?: number | null;
}

interface MenuClientViewProps {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
}

export function MenuClientView({ restaurant, categories, items }: MenuClientViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [layoutMode, setLayoutMode] = useState<"list" | "grid">("list");
  
  // Dietary filters
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterGF, setFilterGF] = useState(false);
  const [filterSpicy, setFilterSpicy] = useState(false);

  // Selected item for details modal
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Amenities Modal
  const [showAmenities, setShowAmenities] = useState(false);

  const primaryColor = restaurant.primary_color || "#2563EB";
  let themeStyle = restaurant.theme_style || "bistro";
  const currencySymbol = restaurant.currency || "USD";

  const isFreePlan = !restaurant.plan || restaurant.plan.toLowerCase() === "free";
  const isProPlan = restaurant.plan?.toLowerCase() === "pro";

  // Downgrade theme if on Free plan and trying to use a Premium theme
  if (isFreePlan && themeStyle !== "minimalist") {
    themeStyle = "minimalist";
  }

  // References for categories to detect scroll position
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const categoryNavRef = useRef<HTMLDivElement>(null);

  // Setup theme-based CSS parameters
  const theme = {
    bistro: {
      bodyBg: "bg-[#FDFBF7]",
      cardBg: "bg-transparent border-0 shadow-none",
      cardHover: "hover:bg-[#F5F0E6]/60",
      titleFont: "font-serif text-[#1C1917]",
      bodyFont: "font-sans text-[#57534E] font-light",
      itemBorder: "border-[#D6D3D1]/40",
      accentBg: "bg-[#FDFBF7] text-[#1C1917] border border-[#D6D3D1]/50",
      pillActive: "bg-[#1C1917] text-[#FDFBF7] border-[#1C1917]",
      pillInactive: "bg-[#FDFBF7] text-[#57534E] border-[#D6D3D1]/60 hover:bg-[#F5F0E6]",
      categoryBar: "bg-[#FDFBF7]/95 border-b border-[#E7E5E4]",
      badgePopular: "bg-[#1C1917]/5 text-[#1C1917] border border-[#D6D3D1]/40",
      shellShadow: "shadow-2xl shadow-stone-900/10",
      fontFamilyClass: "font-serif",
      containerBg: "bg-[#F5F0E6]",
      searchBg: "bg-[#FDFBF7]",
      searchBorder: "border-[#D6D3D1]/60",
      searchText: "text-[#1C1917] placeholder-[#A8A29E]",
      searchFocus: "focus:ring-[#1C1917] focus:border-[#1C1917]",
      searchIcon: "text-[#78716C]",
      layoutSwitchBg: "bg-[#FDFBF7] border-[#D6D3D1]/40",
      layoutSwitchActive: "bg-[#1C1917] text-[#FDFBF7]",
      layoutSwitchInactive: "text-[#78716C] hover:text-[#1C1917]"
    },
    minimalist: {
      bodyBg: "bg-white",
      cardBg: "bg-white border border-zinc-150 rounded-none shadow-none",
      cardHover: "hover:bg-zinc-50/50 hover:border-zinc-355",
      titleFont: "font-sans-minimalist font-bold text-zinc-900 tracking-wider uppercase",
      bodyFont: "font-sans font-light text-zinc-400",
      itemBorder: "border-zinc-100",
      accentBg: "bg-zinc-50 text-zinc-900 border border-zinc-250 font-semibold tracking-wider text-[10px] rounded-none",
      pillActive: "bg-black text-white border-black rounded-none",
      pillInactive: "bg-white text-zinc-650 border-zinc-200 hover:bg-zinc-50 rounded-none",
      categoryBar: "bg-white/95 border-b border-zinc-150",
      badgePopular: "bg-black text-white border-black font-semibold rounded-none tracking-wider text-[8px] uppercase",
      shellShadow: "shadow-none",
      fontFamilyClass: "font-sans-minimalist",
      containerBg: "bg-zinc-50",
      searchBg: "bg-zinc-50",
      searchBorder: "border-zinc-200",
      searchText: "text-zinc-900 placeholder-zinc-400",
      searchFocus: "focus:ring-black focus:border-black",
      searchIcon: "text-zinc-400",
      layoutSwitchBg: "bg-zinc-50 border-zinc-200",
      layoutSwitchActive: "bg-black text-white",
      layoutSwitchInactive: "text-zinc-400 hover:text-black"
    },
    luxury: {
      bodyBg: "bg-[#0C0C0E]",
      cardBg: "bg-zinc-900/35 backdrop-blur-md border border-zinc-800/60 rounded-xl",
      cardHover: "hover:border-amber-500/40 hover:bg-zinc-900/50 shadow-[0_4px_20px_rgba(245,158,11,0.03)]",
      titleFont: "font-serif-luxury tracking-wide text-zinc-100",
      bodyFont: "font-sans text-zinc-400 font-light",
      itemBorder: "border-zinc-900/70",
      accentBg: "bg-amber-950/20 text-amber-400 border border-amber-900/30 font-semibold",
      pillActive: "bg-amber-500 text-black border-amber-500 font-bold",
      pillInactive: "bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800/80",
      categoryBar: "bg-[#0C0C0E]/95 border-b border-zinc-900/80",
      badgePopular: "bg-amber-950/40 text-amber-400 border border-amber-900/30 font-semibold",
      shellShadow: "shadow-2xl shadow-black/90",
      fontFamilyClass: "font-serif-luxury",
      containerBg: "bg-[#060608]",
      searchBg: "bg-zinc-900/80",
      searchBorder: "border-zinc-800/80",
      searchText: "text-zinc-200 placeholder-zinc-500",
      searchFocus: "focus:ring-amber-500 focus:border-amber-500",
      searchIcon: "text-zinc-500",
      layoutSwitchBg: "bg-zinc-950 border-zinc-800",
      layoutSwitchActive: "bg-amber-500 text-black",
      layoutSwitchInactive: "text-zinc-500 hover:text-zinc-200"
    },
    vibrant: {
      bodyBg: "bg-[#FEFCE8]",
      cardBg: "bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
      cardHover: "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all",
      titleFont: "font-sans-vibrant font-extrabold text-black",
      bodyFont: "font-sans-vibrant text-slate-700",
      itemBorder: "border-b-2 border-black/10",
      accentBg: "bg-rose-50 text-rose-700 border border-black font-extrabold rounded-full px-2",
      pillActive: "bg-[#FF5A5F] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-extrabold rounded-xl",
      pillInactive: "bg-white text-black border-2 border-black hover:bg-slate-50 font-bold rounded-xl",
      categoryBar: "bg-[#FEFCE8]/95 border-b-2 border-black",
      badgePopular: "bg-amber-300 text-black border-2 border-black font-black uppercase text-[8px] tracking-wide rounded-full px-2",
      shellShadow: "shadow-2xl shadow-black/10",
      fontFamilyClass: "font-sans-vibrant",
      containerBg: "bg-[#FEF3C7]",
      searchBg: "bg-white",
      searchBorder: "border-2 border-black",
      searchText: "text-black placeholder-slate-500",
      searchFocus: "focus:ring-[#FF5A5F] focus:border-[#FF5A5F]",
      searchIcon: "text-black",
      layoutSwitchBg: "bg-[#FEFCE8] border-2 border-black",
      layoutSwitchActive: "bg-[#FF5A5F] text-white",
      layoutSwitchInactive: "text-black hover:bg-slate-100"
    }
  }[themeStyle as "bistro" | "minimalist" | "luxury" | "vibrant"] || {
    bodyBg: "bg-slate-50",
    cardBg: "bg-white border shadow-sm rounded-xl",
    cardHover: "hover:shadow-md",
    titleFont: "font-sans text-slate-900",
    bodyFont: "font-sans text-slate-500",
    itemBorder: "border-b",
    accentBg: "bg-slate-100 text-slate-700 border",
    pillActive: "bg-blue-600 text-white",
    pillInactive: "bg-slate-100 text-slate-600",
    categoryBar: "bg-white border-b",
    badgePopular: "bg-amber-50 text-amber-700",
    shellShadow: "shadow-md",
    fontFamilyClass: "font-sans",
    containerBg: "bg-slate-100",
    searchBg: "bg-slate-50",
    searchBorder: "border-slate-200",
    searchText: "text-slate-800 placeholder-slate-400",
    searchFocus: "focus:ring-primary focus:border-primary",
    searchIcon: "text-slate-400",
    layoutSwitchBg: "bg-slate-100 border-slate-200",
    layoutSwitchActive: "bg-white text-slate-800 shadow-sm",
    layoutSwitchInactive: "text-slate-400 hover:text-slate-600"
  };

  // Set up active category scrolling highlights
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for sticky bar
      
      let currentCategory = "";
      for (const catId of Object.keys(categoryRefs.current)) {
        const el = categoryRefs.current[catId];
        if (el && el.offsetTop <= scrollPosition) {
          currentCategory = catId;
        }
      }
      
      if (currentCategory && currentCategory !== activeCategory) {
        setActiveCategory(currentCategory);
        // Center the active pill in the horizontal scrolling menu
        const activeNavEl = document.getElementById(`nav-pill-${currentCategory}`);
        if (activeNavEl && categoryNavRef.current) {
          const navContainer = categoryNavRef.current;
          const leftOffset = activeNavEl.offsetLeft - (navContainer.clientWidth / 2) + (activeNavEl.clientWidth / 2);
          navContainer.scrollTo({ left: leftOffset, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger initial run
    if (categories.length > 0) {
      setActiveCategory(categories[0].id);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory, categories]);

  // Smooth scroll handler to categories
  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = categoryRefs.current[catId];
    if (el) {
      const offset = el.offsetTop - 140; // Offset for banner header / sticky nav
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  // Filter items based on search and dietary preferences
  const filteredItems = items.filter((item) => {
    // Search filter
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
    if (!matchesSearch) return false;

    // Dietary filters
    if (filterVeg && !item.is_vegetarian) return false;
    if (filterVegan && !item.is_vegan) return false;
    if (filterGF && !item.is_gluten_free) return false;
    if (filterSpicy && !item.is_spicy) return false;

    return true;
  });


  // Get food initials for abstract beautiful gradient representations
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  // Abstract food image background colors
  const getRandomGradient = (name: string) => {
    const charCode = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    const hues = [12, 34, 142, 198, 260, 320, 45];
    const baseHue = hues[charCode % hues.length];
    return `linear-gradient(135deg, hsl(${baseHue}, 85%, 65%), hsl(${(baseHue + 40) % 360}, 85%, 45%))`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.containerBg} ${theme.fontFamilyClass}`}>
      <div className={`mx-auto max-w-md min-h-screen ${theme.bodyBg} ${theme.shellShadow} flex flex-col pb-28 relative`}>
        
        {/* Banner Section */}
        {themeStyle === "bistro" && (
          <div className="text-center relative bg-[#1C1917] overflow-hidden shrink-0 flex flex-col">
            <div className="pt-12 pb-10 px-6 z-10 space-y-1">
              <h1 className="text-4xl font-serif text-[#D4AF37] tracking-wider uppercase drop-shadow-md">{restaurant.name}</h1>
              <div className="flex items-center justify-center gap-4 mt-3">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#D4AF37]/60"></span>
                <span className="text-[11px] text-[#D4AF37] uppercase tracking-[0.3em] font-sans font-medium">
                  {restaurant.cuisine_type || "Menu"}
                </span>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#D4AF37]/60"></span>
              </div>
            </div>
            {/* The Hero Image Cover */}
            <div className="w-full h-[220px] relative border-t-2 border-[#D4AF37]/30 shadow-inner">
              <img src="https://images.unsplash.com/photo-1544025162-811114215b74?q=80&w=800&auto=format&fit=crop" alt="Hero Dish" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/30 to-transparent"></div>
            </div>
          </div>
        )}

        {themeStyle === "minimalist" && (
          <div className="pt-16 pb-8 px-8 text-left bg-white border-b border-zinc-150 shrink-0">
            <h1 className="text-3xl font-light tracking-tight text-black uppercase font-sans-minimalist">
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[10px] tracking-widest text-zinc-400 font-sans font-bold uppercase">
                {restaurant.cuisine_type || "Nordic Cuisine"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[9px] tracking-wide text-zinc-400 uppercase font-sans">
                Open Daily
              </span>
            </div>
          </div>
        )}

        {themeStyle === "luxury" && (
          <div className="pt-16 pb-10 px-8 text-center bg-black relative border-b border-zinc-900/60 overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>
            <h1 className="text-3xl font-bold tracking-[0.15em] uppercase bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 text-transparent bg-clip-text font-serif-luxury drop-shadow-lg">
              {restaurant.name}
            </h1>
            <p className="text-[10px] opacity-60 mt-2.5 tracking-[0.25em] uppercase text-zinc-400 font-sans font-medium">
              {restaurant.cuisine_type || "Fine Dining"}
            </p>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent mx-auto mt-4.5"></div>
          </div>
        )}

        {themeStyle === "vibrant" && (
          <div className="pt-12 pb-8 px-6 text-center border-b-4 border-black relative bg-[#FFD166] shrink-0">
            <div className="absolute top-2 left-2 w-4 h-4 bg-[#FF5A5F] rounded-full border-2 border-black"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#06D6A0] rounded-none border-2 border-black rotate-45"></div>
            
            <div className="text-center z-10 space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-black font-sans-vibrant uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                {restaurant.name}
              </h1>
              <span className="inline-block bg-black text-[#FEFCE8] text-xs font-black uppercase tracking-wider px-3 py-1 border-2 border-black rounded-lg transform -rotate-1">
                {restaurant.cuisine_type || "Diner Pop"}
              </span>
            </div>
          </div>
        )}

        {/* Contact Details Section */}
        {themeStyle === "bistro" && (
          <div className="px-6 py-5 z-20 shrink-0 bg-[#FDFBF7] border-b border-[#E7E5E4] shadow-sm text-center flex flex-col items-center gap-2.5">
            {restaurant.address && (
              <p className="font-sans text-[11px] uppercase tracking-widest text-[#78716C]">
                {restaurant.address}
              </p>
            )}
            <div className="flex justify-center items-center gap-8">
              {restaurant.phone && (
                <a href={`tel:${restaurant.phone}`} className="text-[11px] uppercase tracking-widest text-[#57534E] hover:text-[#1C1917] transition-colors font-medium">
                  {restaurant.phone}
                </a>
              )}
              {restaurant.wifi_password && (
                <button 
                  onClick={() => setShowAmenities(true)} 
                  className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold hover:opacity-80 transition cursor-pointer"
                >
                  <Wifi className="h-3.5 w-3.5 shrink-0" />
                  <span>WiFi</span>
                </button>
              )}
            </div>
          </div>
        )}

        {themeStyle === "minimalist" && (
          <div className="px-8 py-4 bg-white border-b border-zinc-150 space-y-2 text-xs text-zinc-500 shrink-0">
            {restaurant.address && (
              <div className="flex items-start gap-2.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">Loc:</span>
                <span className="leading-relaxed font-light">{restaurant.address}</span>
              </div>
            )}
            <div className="flex items-center gap-4 text-[11px] font-medium text-zinc-700">
              {restaurant.phone && (
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tel:</span>
                  <a href={`tel:${restaurant.phone}`} className="hover:underline">
                    {restaurant.phone}
                  </a>
                </div>
              )}
              {restaurant.wifi_password && (
                <button 
                  onClick={() => setShowAmenities(true)} 
                  className="flex items-center gap-1 hover:text-black transition cursor-pointer"
                >
                  <Wifi className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">WiFi Available</span>
                </button>
              )}
            </div>
          </div>
        )}

        {themeStyle === "luxury" && (
          <div className="px-8 py-3 text-center text-xs text-zinc-400 space-y-2 shrink-0">
            {restaurant.address && (
              <p className="font-light tracking-wide text-zinc-300 italic">
                📍 {restaurant.address}
              </p>
            )}
            <div className="flex justify-center gap-6 items-center text-[11px] font-medium text-zinc-400">
              {restaurant.phone && (
                <a href={`tel:${restaurant.phone}`} className="hover:text-amber-400 font-light tracking-wide transition">
                  📞 {restaurant.phone}
                </a>
              )}
              {restaurant.wifi_password && (
                <button 
                  onClick={() => setShowAmenities(true)} 
                  className="text-amber-400 hover:text-amber-300 font-semibold tracking-wide transition flex items-center gap-1 cursor-pointer"
                >
                  <Wifi className="h-3.5 w-3.5 shrink-0 text-amber-500/80" />
                  <span>Salon WiFi</span>
                </button>
              )}
            </div>
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-900 to-transparent mt-4"></div>
          </div>
        )}

        {themeStyle === "vibrant" && (
          <div className="px-4 -mt-5 z-20 shrink-0">
            <Card className="rounded-3xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#06D6A0]">
              <CardContent className="p-4 space-y-2 text-xs text-black font-bold">
                {restaurant.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-black shrink-0 mt-0.5" />
                    <span className="leading-tight">{restaurant.address}</span>
                  </div>
                )}
                <div className="flex justify-between items-center flex-wrap gap-2 pt-2 border-t-2 border-black">
                  {restaurant.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-black shrink-0" />
                      <a href={`tel:${restaurant.phone}`} className="hover:underline font-extrabold">
                        {restaurant.phone}
                      </a>
                    </div>
                  )}
                  {restaurant.wifi_password && (
                    <button 
                      onClick={() => setShowAmenities(true)} 
                      className="flex items-center gap-1 bg-[#FEFCE8] hover:bg-[#FEFCE8]/80 text-black border-2 border-black px-2 py-0.5 rounded-full text-[10px] font-black transition cursor-pointer"
                    >
                      <Wifi className="h-3 w-3 shrink-0" />
                      <span>WiFi Code</span>
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sticky Actions & Filter bar */}
        <div className={`sticky top-0 z-30 transition-colors ${theme.categoryBar} backdrop-blur-md shadow-sm py-3 px-4 space-y-3`}>
          {/* Search bar & Grid/List view toggle */}
          <div className="flex gap-2.5 items-center">
            <div className="relative flex-grow">
              <Search className={`absolute left-3 top-2.5 h-4 w-4 ${theme.searchIcon}`} />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 text-xs rounded-full border focus:outline-none focus:ring-1 transition-all ${theme.searchBg} ${theme.searchBorder} ${theme.searchText} ${theme.searchFocus}`}
                style={themeStyle !== "luxury" && themeStyle !== "vibrant" ? { "--tw-ring-color": primaryColor } as React.CSSProperties : {}}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute right-3 top-2.5 p-0.5 rounded-full hover:bg-slate-200/50"
                >
                  <X className="h-3.5 w-3.5 text-slate-400" />
                </button>
              )}
            </div>

            {/* Layout switch */}
            <div className={`flex rounded-full p-0.5 border ${theme.layoutSwitchBg}`}>
              <button
                onClick={() => setLayoutMode("list")}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  layoutMode === "list"
                    ? theme.layoutSwitchActive
                    : theme.layoutSwitchInactive
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setLayoutMode("grid")}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  layoutMode === "grid"
                    ? theme.layoutSwitchActive
                    : theme.layoutSwitchInactive
                }`}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Dietary filters horizontally scrollable */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 py-0.5">
            {[
              { id: "veg", label: "Vegetarian", icon: Leaf, state: filterVeg, setState: setFilterVeg },
              { id: "vegan", label: "Vegan", icon: Sparkles, state: filterVegan, setState: setFilterVegan },
              { id: "gf", label: "Gluten-Free", icon: Info, state: filterGF, setState: setFilterGF },
              { id: "spicy", label: "Spicy", icon: Flame, state: filterSpicy, setState: setFilterSpicy },
            ].map((diet) => {
              const Icon = diet.icon;
              const active = diet.state;
              return (
                <button
                  key={diet.id}
                  onClick={() => diet.setState(!diet.state)}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold border whitespace-nowrap transition-all cursor-pointer ${
                    active ? theme.pillActive : theme.pillInactive
                  }`}
                  style={active && themeStyle !== "luxury" && themeStyle !== "vibrant" ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                >
                  <Icon className="h-3 w-3 shrink-0" />
                  <span>{diet.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sticky Tab Category horizontal lists */}
          <div 
            ref={categoryNavRef} 
            className="flex gap-2 overflow-x-auto scrollbar-none border-t pt-2.5 pb-0.5"
          >
            {categories.map((cat) => {
              const active = cat.id === activeCategory;
              
              let tabClasses = "";
              if (active) {
                if (themeStyle === "luxury") {
                  tabClasses = "border-amber-400 text-amber-400 bg-amber-950/20 font-bold";
                } else if (themeStyle === "vibrant") {
                  tabClasses = "bg-[#06D6A0] text-black border-2 border-black font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
                } else if (themeStyle === "bistro") {
                  tabClasses = "bg-[#5C4033] text-[#FAF6F0] border-[#5C4033] font-bold";
                } else if (themeStyle === "minimalist") {
                  tabClasses = "bg-black text-white border-black font-bold";
                } else {
                  tabClasses = "text-white";
                }
              } else {
                if (themeStyle === "luxury") {
                  tabClasses = "border-transparent text-zinc-500 hover:text-zinc-300";
                } else if (themeStyle === "vibrant") {
                  tabClasses = "border-2 border-transparent text-black hover:bg-slate-100/50";
                } else if (themeStyle === "bistro") {
                  tabClasses = "border-transparent text-[#5C4033]/70 hover:text-[#5C4033]";
                } else if (themeStyle === "minimalist") {
                  tabClasses = "border-transparent text-zinc-400 hover:text-zinc-800";
                } else {
                  tabClasses = "border-transparent text-slate-600 hover:text-slate-800";
                }
              }

              return (
                <button
                  key={cat.id}
                  id={`nav-pill-${cat.id}`}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`inline-block rounded-full px-3.5 py-1 text-[11px] font-bold border transition-all whitespace-nowrap cursor-pointer ${tabClasses}`}
                  style={active && themeStyle !== "luxury" && themeStyle !== "vibrant" && themeStyle !== "bistro" && themeStyle !== "minimalist" ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu list contents */}
        <div className="px-4 py-6 space-y-10 flex-grow">
          {categories.length > 0 ? (
            categories.map((cat) => {
              // Get category items
              const categoryItems = filteredItems.filter((item) => item.category_id === cat.id);
              if (categoryItems.length === 0) return null;

              return (
                <section
                  key={cat.id}
                  id={`cat-${cat.id}`}
                  ref={(el) => {
                    categoryRefs.current[cat.id] = el;
                  }}
                  className="scroll-mt-40 space-y-4"
                >
                  {/* Category title details */}
                  <div className={themeStyle === "bistro" ? "text-center py-6 pb-2" : `border-l-4 pl-3.5 py-0.5 ${themeStyle === "luxury" ? "border-amber-500" : themeStyle === "vibrant" ? "border-black border-l-4" : ""}`} style={themeStyle !== "luxury" && themeStyle !== "vibrant" && themeStyle !== "bistro" ? { borderColor: primaryColor } : {}}>
                    <h2 className={`text-xl font-bold tracking-widest uppercase ${themeStyle === "bistro" ? "font-serif text-[#1C1917]" : theme.titleFont}`}>{cat.name}</h2>
                    {cat.description && (
                      <p className={`text-xs mt-1.5 font-light ${themeStyle === "bistro" ? "font-sans italic text-[#78716C]" : theme.bodyFont}`}>{cat.description}</p>
                    )}
                    {themeStyle === "bistro" && (
                      <div className="w-16 h-[1px] bg-[#D6D3D1] mx-auto mt-4"></div>
                    )}
                  </div>

                  {/* Layout grid vs list rendering */}
                  {layoutMode === "list" ? (
                    <div className="grid gap-3">
                      {categoryItems.map((item) => {
                        const price = `${currencySymbol === "EUR" ? "€" : currencySymbol === "GBP" ? "£" : "$"}${Number(item.price).toFixed(2)}`;
                        if (themeStyle === "bistro") {
                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className="group py-4 px-2 cursor-pointer transition-colors duration-150 hover:bg-[#F5F0E6]/60"
                            >
                              <div className="flex gap-0 items-start flex-col">
                                <div className="w-full flex items-baseline justify-between gap-2">
                                  <h3 className="font-serif font-bold text-[17px] text-[#1C1917] group-hover:text-[#D4AF37] transition-colors tracking-wide">
                                    {item.name}
                                  </h3>
                                  <span className="flex-grow border-b-[2px] border-dotted border-[#D6D3D1] mx-2 relative top-[-6px]"></span>
                                  <span className="font-sans font-bold text-[15px] text-[#1C1917] shrink-0">
                                    {price}
                                  </span>
                                </div>
                                
                                {item.description && (
                                  <p className="text-[12px] font-sans font-light text-[#78716C] mt-1.5 leading-relaxed line-clamp-2 max-w-[85%]">
                                    {item.description}
                                  </p>
                                )}
                                
                                <div className="flex flex-wrap gap-2 pt-2.5">
                                  {item.is_popular && (
                                    <span className="text-[9px] font-sans text-[#D4AF37] font-bold uppercase tracking-widest">
                                      ★ Chef's Special
                                    </span>
                                  )}
                                  {item.cooking_time && (
                                    <span className="text-[9px] font-sans text-[#78716C] border border-[#D6D3D1] px-1.5 py-0.5 uppercase tracking-widest rounded-sm flex items-center gap-1">
                                      <Clock className="h-2.5 w-2.5" /> {item.cooking_time}m
                                    </span>
                                  )}
                                  {item.is_vegetarian && (
                                    <span className="text-[9px] font-sans text-[#78716C] border border-[#D6D3D1] px-1.5 py-0.5 uppercase tracking-widest rounded-sm">
                                      V
                                    </span>
                                  )}
                                  {item.is_vegan && (
                                    <span className="text-[9px] font-sans text-[#78716C] border border-[#D6D3D1] px-1.5 py-0.5 uppercase tracking-widest rounded-sm">
                                      VG
                                    </span>
                                  )}
                                  {item.is_gluten_free && (
                                    <span className="text-[9px] font-sans text-[#78716C] border border-[#D6D3D1] px-1.5 py-0.5 uppercase tracking-widest rounded-sm">
                                      GF
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        if (themeStyle === "minimalist") {
                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className="group py-3 px-1 border-b border-zinc-200 cursor-pointer transition-colors duration-150 hover:bg-zinc-50/50"
                            >
                              <div className="flex gap-4 items-center">
                                {item.image_url && (
                                  <div className="h-14 w-14 rounded-none overflow-hidden border border-zinc-200 shrink-0 bg-zinc-50 relative flex items-center justify-center">
                                    <img 
                                      src={item.image_url} 
                                      alt={item.name} 
                                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                                    />
                                  </div>
                                )}
                                <div className="flex-grow min-w-0">
                                  <div className="flex items-baseline justify-between gap-1">
                                    <div className="flex items-baseline gap-1.5 flex-grow min-w-0">
                                      <h3 className="font-sans-minimalist font-bold text-xs uppercase tracking-wider text-zinc-900 group-hover:text-black transition-colors truncate">
                                        {item.name}
                                      </h3>
                                      {item.is_popular && (
                                        <span className="inline-flex items-center text-[7px] font-bold font-sans-minimalist tracking-widest text-zinc-400 uppercase shrink-0">
                                          ● POPULAR
                                        </span>
                                      )}
                                    </div>
                                    <span className="font-sans-minimalist font-light text-xs text-zinc-900 shrink-0">
                                      {price}
                                    </span>
                                  </div>
                                  {item.description && (
                                    <p className="text-[10px] font-sans font-light text-zinc-500 mt-1 leading-normal line-clamp-2">
                                      {item.description}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                                    {item.is_vegetarian && (
                                      <span className="text-[7px] font-mono text-zinc-450 uppercase">
                                        VEG
                                      </span>
                                    )}
                                    {item.is_vegan && (
                                      <span className="text-[7px] font-mono text-zinc-450 uppercase">
                                        VGN
                                      </span>
                                    )}
                                    {item.is_spicy && (
                                      <span className="text-[7px] font-mono text-rose-500 uppercase">
                                        SPICY
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        if (themeStyle === "luxury") {
                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className="group flex flex-col p-3.5 rounded-lg border border-zinc-900 hover:border-amber-500/25 bg-zinc-950/20 hover:bg-zinc-900/35 cursor-pointer transition-all duration-300"
                            >
                              <div className="flex gap-4 items-center">
                                {item.image_url && (
                                  <div className="h-16 w-16 rounded-lg overflow-hidden border border-zinc-800 shrink-0 bg-zinc-950 relative flex items-center justify-center shadow-lg">
                                    <img 
                                      src={item.image_url} 
                                      alt={item.name} 
                                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                                    />
                                  </div>
                                )}
                                <div className="flex-grow min-w-0">
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1 min-w-0">
                                      <div className="flex items-baseline gap-2 flex-wrap">
                                        <h3 className="font-serif-luxury font-medium text-sm tracking-wide text-zinc-100 group-hover:text-amber-400 transition-colors truncate">
                                          {item.name}
                                        </h3>
                                        {item.is_popular && (
                                          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.2 text-[8px] font-serif font-semibold tracking-wide uppercase shrink-0">
                                            Signature
                                          </span>
                                        )}
                                      </div>
                                      {item.description && (
                                        <p className="font-sans text-[11px] font-light leading-relaxed text-zinc-400 line-clamp-2">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    <span className="font-serif-luxury font-semibold text-sm bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 text-transparent bg-clip-text shrink-0">
                                      {price}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5 pt-2">
                                    {item.is_vegetarian && (
                                      <span className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 font-medium px-2 py-0.2 rounded-full text-[8px]">
                                        Veg
                                      </span>
                                    )}
                                    {item.is_vegan && (
                                      <span className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 font-medium px-2 py-0.2 rounded-full text-[8px]">
                                        Vegan
                                      </span>
                                    )}
                                    {item.is_gluten_free && (
                                      <span className="bg-amber-950/20 text-amber-400 border border-amber-900/30 font-medium px-2 py-0.2 rounded-full text-[8px]">
                                        Gluten-Free
                                      </span>
                                    )}
                                    {item.is_spicy && (
                                      <span className="bg-rose-950/20 text-rose-400 border border-rose-900/30 font-medium px-2 py-0.2 rounded-full text-[8px]">
                                        Spicy
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        if (themeStyle === "vibrant") {
                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className="group p-4 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                            >
                              <div className="flex gap-4 items-center">
                                {item.image_url && (
                                  <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-black shrink-0 bg-slate-100 relative flex items-center justify-center -rotate-2 group-hover:rotate-2 transition-transform duration-300">
                                    <img 
                                      src={item.image_url} 
                                      alt={item.name} 
                                      className="w-full h-full object-cover" 
                                    />
                                  </div>
                                )}
                                <div className="flex-grow min-w-0">
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1 min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <h3 className="font-sans-vibrant font-extrabold text-sm text-black truncate">
                                          {item.name}
                                        </h3>
                                        {item.is_popular && (
                                          <span className="bg-amber-300 text-black border border-black font-black uppercase text-[8px] tracking-wide rounded-md px-1.5 py-0.2 shrink-0">
                                            HOT
                                          </span>
                                        )}
                                      </div>
                                      {item.description && (
                                        <p className="font-sans text-[11px] text-slate-700 leading-normal line-clamp-2">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    <span className="font-sans-vibrant font-black text-sm bg-rose-500 text-white px-2 py-0.5 rounded-lg border-2 border-black rotate-1 shrink-0">
                                      {price}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5 pt-2">
                                    {item.is_vegetarian && (
                                      <span className="bg-[#06D6A0] text-black border border-black font-extrabold rounded-full px-2 py-0.2 text-[8px] uppercase">
                                        Veg
                                      </span>
                                    )}
                                    {item.is_vegan && (
                                      <span className="bg-[#06D6A0] text-black border border-black font-extrabold rounded-full px-2 py-0.2 text-[8px] uppercase">
                                        Vegan
                                      </span>
                                    )}
                                    {item.is_gluten_free && (
                                      <span className="bg-sky-400 text-black border border-black font-extrabold rounded-full px-2 py-0.2 text-[8px] uppercase">
                                        GF
                                      </span>
                                    )}
                                    {item.is_spicy && (
                                      <span className="bg-[#FF5A5F] text-white border border-black font-extrabold rounded-full px-2 py-0.2 text-[8px] uppercase">
                                        Spicy
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Default Fallback
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="group flex items-center justify-between gap-4 py-3.5 px-2 border-b cursor-pointer transition-colors duration-150 border-slate-100 hover:bg-slate-50/40"
                          >
                            <div className="flex gap-4 items-center flex-grow min-w-0">
                              {item.image_url && (
                                <div className="h-14 w-14 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50 relative flex items-center justify-center">
                                  <img 
                                    src={item.image_url} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                              )}
                              <div className="space-y-1 flex-grow min-w-0 pr-1">
                                <h3 className="font-bold text-sm text-slate-800 truncate" style={{ color: primaryColor }}>
                                  {item.name}
                                </h3>
                                <p className="text-[11px] leading-relaxed text-slate-500 line-clamp-2">{item.description}</p>
                              </div>
                            </div>
                            <span className="font-extrabold text-sm shrink-0">{price}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    // Grid Layout
                    <div className="grid grid-cols-2 gap-4">
                      {categoryItems.map((item) => {
                        const price = `${currencySymbol === "EUR" ? "€" : currencySymbol === "GBP" ? "£" : "$"}${Number(item.price).toFixed(2)}`;

                        if (themeStyle === "bistro") {
                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className="group bg-white border border-[#D9C4A9]/40 rounded-xl overflow-hidden cursor-pointer flex flex-col h-full shadow-[0_2px_8px_rgba(92,64,51,0.03)] hover:border-[#C4AE93] hover:shadow-[0_4px_12px_rgba(92,64,51,0.06)] transition-all duration-300"
                            >
                              <div className="h-28 w-full relative overflow-hidden bg-slate-100 shrink-0">
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div
                                    className="w-full h-full flex items-center justify-center text-amber-950 font-serif-bistro font-bold text-lg opacity-70 group-hover:scale-105 transition-transform duration-300"
                                    style={{ background: `linear-gradient(135deg, #FAF6F0, #EFEAE2)` }}
                                  >
                                    {getInitials(item.name)}
                                  </div>
                                )}
                                {item.is_popular && (
                                  <span className="absolute top-2 left-2 inline-flex items-center gap-0.5 rounded bg-amber-950 text-white px-1.5 py-0.5 text-[7px] font-bold font-serif-bistro tracking-wider shadow-sm uppercase">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <div className="p-3 flex flex-col justify-between flex-grow space-y-1">
                                <h4 className="font-serif-bistro font-bold text-xs text-amber-950 group-hover:text-amber-900 transition-colors line-clamp-1">
                                  {item.name}
                                </h4>
                                {item.description && (
                                  <p className="font-serif-bistro text-[10px] text-amber-900/60 italic leading-snug line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                                <div className="flex justify-between items-baseline pt-1">
                                  <div className="flex gap-0.5 flex-wrap">
                                    {item.is_vegetarian && <span className="text-[7px] font-bold text-[#5C4033] bg-[#FAF6F0] border border-[#D9C4A9]/40 px-1 rounded-sm uppercase">Veg</span>}
                                    {item.is_vegan && <span className="text-[7px] font-bold text-[#5C4033] bg-[#FAF6F0] border border-[#D9C4A9]/40 px-1 rounded-sm uppercase">Vgn</span>}
                                  </div>
                                  <span className="font-serif-bistro font-bold text-xs text-amber-950">
                                    {price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        if (themeStyle === "minimalist") {
                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className="group bg-white border border-zinc-200 rounded-none overflow-hidden cursor-pointer flex flex-col h-full hover:border-zinc-400 hover:bg-zinc-50/25 transition-all duration-300"
                            >
                              <div className="h-28 w-full relative overflow-hidden bg-zinc-50 shrink-0 border-b border-zinc-200">
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                  />
                                ) : (
                                  <div
                                    className="w-full h-full flex items-center justify-center text-zinc-400 font-sans-minimalist text-lg font-light tracking-widest group-hover:bg-zinc-100 transition-colors duration-300"
                                  >
                                    {getInitials(item.name)}
                                  </div>
                                )}
                                {item.is_popular && (
                                  <span className="absolute top-2 left-2 inline-flex items-center rounded bg-black text-white px-1.5 py-0.5 text-[7px] font-bold font-sans-minimalist tracking-widest uppercase">
                                    POP
                                  </span>
                                )}
                              </div>
                              <div className="p-3 flex flex-col justify-between flex-grow space-y-1.5">
                                <h4 className="font-sans-minimalist font-bold text-xs uppercase tracking-wider text-zinc-900 group-hover:text-black line-clamp-1">
                                  {item.name}
                                </h4>
                                {item.description && (
                                  <p className="font-sans font-light text-[10px] text-zinc-500 leading-normal line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                                <div className="flex justify-between items-baseline pt-1">
                                  <div className="flex gap-0.5">
                                    {item.is_vegetarian && <span className="text-[7px] font-mono uppercase text-zinc-450">VEG</span>}
                                  </div>
                                  <span className="font-sans-minimalist font-light text-xs text-zinc-900">
                                    {price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        if (themeStyle === "luxury") {
                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className="group bg-zinc-900/35 backdrop-blur-md border border-zinc-800/60 rounded-xl overflow-hidden cursor-pointer flex flex-col h-full hover:border-amber-500/40 hover:bg-zinc-900/50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_20px_rgba(245,158,11,0.05)] transition-all duration-300"
                            >
                              <div className="h-28 w-full relative overflow-hidden bg-[#0C0C0E] shrink-0 border-b border-zinc-900/60">
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                                  />
                                ) : (
                                  <div
                                    className="w-full h-full flex items-center justify-center text-amber-400 font-serif-luxury text-xl font-medium tracking-widest group-hover:scale-105 transition-transform duration-300 opacity-60 group-hover:opacity-80"
                                    style={{ background: `linear-gradient(135deg, #1C1917, #0C0C0E)` }}
                                  >
                                    {getInitials(item.name)}
                                  </div>
                                )}
                                {item.is_popular && (
                                  <span className="absolute top-2 left-2 inline-flex items-center gap-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 text-[7px] font-medium font-serif-luxury tracking-wide uppercase">
                                    Signature
                                  </span>
                                )}
                              </div>
                              <div className="p-3 flex flex-col justify-between flex-grow space-y-1.5">
                                <h4 className="font-serif-luxury font-medium text-xs tracking-wide text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                                  {item.name}
                                </h4>
                                {item.description && (
                                  <p className="font-sans font-light text-[10px] text-zinc-400 leading-relaxed line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                                <div className="flex justify-between items-baseline pt-1">
                                  <div className="flex gap-0.5">
                                    {item.is_vegetarian && <span className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 font-medium px-1.5 py-0.2 rounded-full text-[7px]">Veg</span>}
                                  </div>
                                  <span className="font-serif-luxury font-semibold text-xs bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 text-transparent bg-clip-text">
                                    {price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        if (themeStyle === "vibrant") {
                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className="group bg-white border-2 border-black rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
                            >
                              <div className="h-28 w-full relative overflow-hidden bg-slate-100 shrink-0 border-b-2 border-black">
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div
                                    className="w-full h-full flex items-center justify-center text-black font-sans-vibrant font-black text-2xl group-hover:scale-105 transition-transform duration-300"
                                    style={{ background: getRandomGradient(item.name) }}
                                  >
                                    {getInitials(item.name)}
                                  </div>
                                )}
                                {item.is_popular && (
                                  <span className="absolute top-2 left-2 inline-flex items-center gap-0.5 rounded bg-[#FFD166] text-black border border-black px-1.5 py-0.5 text-[7px] font-black tracking-wide uppercase">
                                    HOT
                                  </span>
                                )}
                              </div>
                              <div className="p-3 flex flex-col justify-between flex-grow space-y-1.5">
                                <h4 className="font-sans-vibrant font-extrabold text-xs text-black line-clamp-1">
                                  {item.name}
                                </h4>
                                {item.description && (
                                  <p className="font-sans text-[10px] text-slate-700 leading-snug line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                                <div className="flex justify-between items-baseline pt-1">
                                  <div className="flex gap-0.5">
                                    {item.is_vegetarian && <span className="bg-[#06D6A0] text-black border border-black font-extrabold rounded-full px-1.5 py-0.2 text-[7px] uppercase">Veg</span>}
                                  </div>
                                  <span className="font-sans-vibrant font-black text-xs bg-rose-500 text-white px-1.5 py-0.5 rounded-lg border-2 border-black rotate-1">
                                    {price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Fallback
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm cursor-pointer flex flex-col h-full hover:border-slate-300 transition-all duration-300"
                          >
                            <div className="h-28 w-full relative overflow-hidden bg-slate-100 shrink-0">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex items-center justify-center text-slate-400 text-lg font-bold opacity-75"
                                  style={{ background: `linear-gradient(135deg, #F8FAFC, #F1F5F9)` }}
                                >
                                  {getInitials(item.name)}
                                </div>
                              )}
                            </div>
                            <div className="p-3 flex flex-col justify-between flex-grow space-y-1">
                              <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{item.name}</h4>
                              {item.description && (
                                <p className="text-[10px] text-slate-550 leading-normal line-clamp-2">{item.description}</p>
                              )}
                              <div className="flex justify-between items-baseline pt-1">
                                <span className="text-xs font-extrabold">{price}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })
          ) : (
            <div className="text-center py-16">
              <p className="text-sm text-slate-500">No categories found.</p>
            </div>
          )}

          {/* No search results fallback */}
          {filteredItems.length === 0 && categories.length > 0 && (
            <div className="text-center py-16 space-y-2">
              <p className={`text-base font-bold ${themeStyle === "luxury" ? "text-zinc-400" : "text-slate-700"}`}>No matches found</p>
              <p className="text-xs text-slate-400">Try adjusting your filters or search terms.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterVeg(false);
                  setFilterVegan(false);
                  setFilterGF(false);
                  setFilterSpicy(false);
                }}
                className={`mt-4 px-4 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                  themeStyle === "luxury"
                    ? "border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                    : "border-slate-200 text-slate-650 hover:bg-slate-50"
                }`}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isProPlan && (
          <div className={`text-center py-6 pb-8 border-t text-[10px] tracking-[0.2em] font-sans ${themeStyle === "luxury" ? "bg-zinc-950/80 border-zinc-900/50 text-zinc-600" : themeStyle === "vibrant" ? "bg-[#FEFCE8] border-black text-slate-500" : themeStyle === "bistro" ? "bg-[#FDFBF7] border-[#E7E5E4] text-[#A8A29E]" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
            POWERED BY <span className={`font-bold ${themeStyle === "luxury" ? "text-zinc-500" : themeStyle === "vibrant" ? "text-black" : themeStyle === "bistro" ? "text-[#5C4033]" : "text-slate-550"}`}>NOMENU</span>
          </div>
        )}
      </div>

      {/* 1. Item Detail Slide-Up Drawer/Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            onClick={() => setSelectedItem(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          ></div>
          
          <div className={`relative w-full max-w-md bg-white rounded-t-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col transition-transform duration-300 transform translate-y-0 ${
            themeStyle === "luxury"
              ? "bg-[#0C0C0E] border-t border-zinc-850 text-zinc-100 font-serif-luxury" 
              : themeStyle === "vibrant"
              ? "bg-[#FEFCE8] border-t-4 border-x-4 border-black rounded-t-[32px] text-black font-sans-vibrant"
              : themeStyle === "bistro"
              ? "bg-[#FAF6F0] border-t border-[#D9C4A9] text-amber-950 font-serif-bistro"
              : "bg-white text-slate-900 font-sans-minimalist"
          }`}>
            
            {/* Header image/placeholder */}
            <div className={`h-56 w-full relative bg-slate-100 ${themeStyle === "vibrant" ? "border-b-4 border-black" : ""}`}>
              {selectedItem.image_url ? (
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white font-extrabold text-5xl tracking-widest opacity-80"
                  style={{ background: getRandomGradient(selectedItem.name) }}
                >
                  {getInitials(selectedItem.name)}
                </div>
              )}

              <button
                onClick={() => setSelectedItem(null)}
                className={`absolute top-4 right-4 p-2 rounded-full text-white backdrop-blur-sm transition-all ${
                  themeStyle === "vibrant" 
                    ? "bg-[#FF5A5F] hover:bg-[#FF5A5F]/80 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                    : "bg-black/50 hover:bg-black/75"
                } cursor-pointer`}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {selectedItem.is_popular && (
                <span className={`absolute bottom-4 left-4 inline-flex items-center gap-1 rounded px-2.5 py-1 text-[9px] font-extrabold shadow-md ${
                  themeStyle === "luxury"
                    ? "bg-amber-950/80 text-amber-400 border border-amber-900/40"
                    : themeStyle === "vibrant"
                    ? "bg-amber-300 text-black border-2 border-black font-black uppercase"
                    : themeStyle === "bistro"
                    ? "bg-amber-950 text-[#FAF6F0] font-serif"
                    : "bg-black text-white"
                }`}>
                  <Award className="h-3.5 w-3.5" /> BESTSELLER
                </span>
              )}
            </div>

            {/* Scrollable details */}
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className={`text-xl font-bold tracking-tight ${themeStyle === "luxury" ? "text-zinc-100" : "text-slate-900"}`}>
                    {selectedItem.name}
                  </h3>
                  
                  {/* Dietary Badge List */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedItem.is_vegetarian && (
                      <span className={`inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-[9px] font-bold ${
                        themeStyle === "luxury" 
                          ? "bg-emerald-950/20 text-emerald-400 border border-emerald-900/30" 
                          : themeStyle === "vibrant"
                          ? "bg-[#06D6A0] text-black border border-black font-extrabold"
                          : "bg-green-50 text-green-700 border border-green-200"
                      }`}>
                        <Leaf className="h-3 w-3" /> Vegetarian
                      </span>
                    )}
                    {selectedItem.is_vegan && (
                      <span className={`inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-[9px] font-bold ${
                        themeStyle === "luxury" 
                          ? "bg-emerald-950/20 text-emerald-400 border border-emerald-900/30" 
                          : themeStyle === "vibrant"
                          ? "bg-[#06D6A0] text-black border border-black font-extrabold"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        <Sparkles className="h-3 w-3" /> Vegan
                      </span>
                    )}
                    {selectedItem.is_gluten_free && (
                      <span className={`inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-[9px] font-bold ${
                        themeStyle === "luxury" 
                          ? "bg-amber-950/20 text-amber-400 border border-amber-900/30" 
                          : themeStyle === "vibrant"
                          ? "bg-sky-400 text-black border border-black font-extrabold"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}>
                        Gluten-Free
                      </span>
                    )}
                    {selectedItem.is_spicy && (
                      <span className={`inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-[9px] font-bold ${
                        themeStyle === "luxury" 
                          ? "bg-rose-950/20 text-rose-400 border border-rose-900/30" 
                          : themeStyle === "vibrant"
                          ? "bg-[#FF5A5F] text-white border border-black font-extrabold"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        <Flame className="h-3 w-3" /> Spicy
                      </span>
                    )}
                  </div>
                </div>

                <span className={`text-xl font-extrabold shrink-0 ${themeStyle === "luxury" ? "bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 text-transparent bg-clip-text font-serif" : themeStyle === "vibrant" ? "bg-rose-500 text-white border-2 border-black px-3 py-1 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-2" : themeStyle === "bistro" ? "text-amber-950 font-serif-bistro" : "text-slate-900"}`}>
                  {currencySymbol === "EUR" ? "€" : currencySymbol === "GBP" ? "£" : "$"}
                  {Number(selectedItem.price).toFixed(2)}
                </span>
              </div>

              {selectedItem.description && (
                <div className="space-y-1.5">
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${themeStyle === "luxury" ? "text-zinc-500" : "text-slate-400"}`}>Description</h4>
                  <p className={`text-sm leading-relaxed ${themeStyle === "luxury" ? "text-zinc-300 font-light" : themeStyle === "vibrant" ? "text-slate-800 font-semibold" : themeStyle === "bistro" ? "text-amber-900/80 italic" : "text-slate-650"}`}>
                    {selectedItem.description}
                  </p>
                </div>
              )}

              {/* Calories, Cooking Time & Allergens if available */}
              {(selectedItem.calories || selectedItem.cooking_time || (selectedItem.allergens && selectedItem.allergens.length > 0)) && (
                <div className={`grid gap-4 py-4 border-y ${themeStyle === "luxury" ? "border-zinc-900" : themeStyle === "vibrant" ? "border-black border-y-2" : "border-slate-100"}`}>
                  {selectedItem.calories && (
                    <div className="flex justify-between items-center text-xs">
                      <span className={`${themeStyle === "luxury" ? "text-zinc-500" : "text-slate-400"} font-medium`}>Energy Value</span>
                      <span className="font-bold">{selectedItem.calories} kcal</span>
                    </div>
                  )}

                  {selectedItem.cooking_time && (
                    <div className="flex justify-between items-center text-xs">
                      <span className={`${themeStyle === "luxury" ? "text-zinc-500" : "text-slate-400"} font-medium`}>Prep Time</span>
                      <span className="font-bold flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {selectedItem.cooking_time} mins
                      </span>
                    </div>
                  )}

                  {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                    <div className="space-y-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${themeStyle === "luxury" ? "text-zinc-500" : "text-slate-400"}`}>Allergens Warning</span>
                      <p className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                        themeStyle === "luxury" 
                          ? "text-rose-400 bg-rose-950/20 border-rose-900/30" 
                          : themeStyle === "vibrant"
                          ? "text-black bg-rose-100 border-2 border-black"
                          : "text-rose-600 bg-rose-50/50 border-rose-100/50"
                      }`}>
                        Contains: {selectedItem.allergens.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setSelectedItem(null)}
                className={`w-full py-3 rounded-full text-xs font-extrabold shadow-sm transition-all hover:shadow-md cursor-pointer ${
                  themeStyle === "vibrant" 
                    ? "bg-[#FFD166] text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                    : ""
                }`}
                style={themeStyle !== "vibrant" ? {
                  backgroundColor: themeStyle === "luxury" ? "#F59E0B" : themeStyle === "bistro" ? "#5C4033" : primaryColor,
                  color: themeStyle === "luxury" ? "#000" : "#fff"
                } : {}}
              >
                Back to Menu
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. WiFi Details Modal */}
      {showAmenities && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowAmenities(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          ></div>
          
          <div className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl z-10 text-center space-y-4 ${
            themeStyle === "luxury" 
              ? "bg-[#0C0C0E] border border-zinc-900 text-zinc-100 font-serif-luxury" 
              : themeStyle === "vibrant"
              ? "bg-[#FEFCE8] border-4 border-black rounded-[32px] text-black font-sans-vibrant"
              : themeStyle === "bistro"
              ? "bg-[#FAF6F0] border border-[#D9C4A9] text-amber-950 font-serif-bistro"
              : "bg-white text-slate-900"
          }`}>
            <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center ${
              themeStyle === "luxury" 
                ? "bg-amber-950/40 text-amber-400" 
                : themeStyle === "vibrant"
                ? "bg-[#06D6A0] border-2 border-black text-black"
                : "bg-primary/10 text-primary"
            }`} style={themeStyle !== "luxury" && themeStyle !== "vibrant" ? { color: primaryColor, backgroundColor: `${primaryColor}15` } : {}}>
              <Wifi className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className={`text-base font-bold ${themeStyle === "luxury" ? "text-zinc-100" : "text-slate-900"}`}>Guest Wi-Fi Access</h3>
              <p className="text-xs text-slate-400">Connect to our network and browse at high speed.</p>
            </div>

            <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 ${
              themeStyle === "luxury" 
                ? "bg-zinc-900/50 border-zinc-800" 
                : themeStyle === "vibrant"
                ? "bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                : "bg-slate-50 border-slate-100"
            }`}>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${themeStyle === "luxury" ? "text-zinc-500" : "text-slate-400"}`}>WiFi Password</span>
              <span className={`text-base font-extrabold tracking-wide ${themeStyle === "luxury" ? "text-amber-400" : "text-slate-800"}`}>
                {restaurant.wifi_password}
              </span>
            </div>

            <button
              onClick={() => setShowAmenities(false)}
              className={`px-6 py-2 text-xs font-semibold rounded-full border border-slate-200 hover:bg-slate-50 transition cursor-pointer ${
                themeStyle === "vibrant"
                  ? "border-2 border-black bg-[#FF5A5F] text-black font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "dark:border-zinc-850 dark:hover:bg-zinc-900"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
