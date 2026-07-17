"use client";

import React, { useState, useEffect } from "react";
import { Star, Clock } from "lucide-react";
import dynamic from "next/dynamic";

const NoirTheme = dynamic(() => import("./themes/NoirTheme").then(mod => mod.NoirTheme));
const BrasserieTheme = dynamic(() => import("./themes/BrasserieTheme").then(mod => mod.BrasserieTheme));
const BentoTheme = dynamic(() => import("./themes/BentoTheme").then(mod => mod.BentoTheme));
const ZenTheme = dynamic(() => import("./themes/ZenTheme").then(mod => mod.ZenTheme));
const ClassicTheme = dynamic(() => import("./themes/ClassicTheme").then(mod => mod.ClassicTheme));
const OmakaseTheme = dynamic(() => import("./themes/OmakaseTheme").then(mod => mod.OmakaseTheme));
const ResortTheme = dynamic(() => import("./themes/ResortTheme").then(mod => mod.ResortTheme));
const BistroTheme = dynamic(() => import("./themes/BistroTheme").then(mod => mod.BistroTheme));
const LoungeTheme = dynamic(() => import("./themes/LoungeTheme").then(mod => mod.LoungeTheme));
const PopDinerTheme = dynamic(() => import("./themes/PopDinerTheme").then(mod => mod.PopDinerTheme));
const EditorialTheme = dynamic(() => import("./themes/EditorialTheme").then(mod => mod.EditorialTheme));
const BoutiqueTheme = dynamic(() => import("./themes/BoutiqueTheme").then(mod => mod.BoutiqueTheme));
const BotanicalTheme = dynamic(() => import("./themes/BotanicalTheme").then(mod => mod.BotanicalTheme));
const MinimalistTheme = dynamic(() => import("./themes/MinimalistTheme").then(mod => mod.MinimalistTheme));
const LuxuryTheme = dynamic(() => import("./themes/LuxuryTheme").then(mod => mod.LuxuryTheme));
const VibrantTheme = dynamic(() => import("./themes/VibrantTheme").then(mod => mod.VibrantTheme));


















import { Restaurant, Category, MenuItem, MenuThemeProps as MenuClientViewProps } from "./types";

export function MenuClientView(props: MenuClientViewProps) {
  const { restaurant } = props;
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationsMap, setTranslationsMap] = useState<{ categories: Record<string, Record<string, string>>, items: Record<string, Record<string, string>> }>({ categories: {}, items: {} });
  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const isFreePlan = currentPlan === "free";
  
  let themeStyle = restaurant.theme_style || "bistro";
  // Downgrade theme if on Free plan and trying to use a Premium theme
  if (isFreePlan && themeStyle !== "minimalist" && themeStyle !== "botanical") {
    themeStyle = "minimalist";
  }

  const [savedLoyaltyCardId, setSavedLoyaltyCardId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedCards = JSON.parse(localStorage.getItem('nomenu_loyalty_cards') || '{}');
      if (storedCards[restaurant.id]) {
        setSavedLoyaltyCardId(storedCards[restaurant.id]);
      }
    } catch (e) {
      console.error("Error reading loyalty cards from local storage", e);
    }
  }, [restaurant.id]);

  useEffect(() => {
    async function fetchTranslations() {
      if (!props.displayLanguage || props.displayLanguage === "en") return;
      
      const lang = props.displayLanguage;
      
      // Check if all categories and items already have translations for this language
      const missingCategory = props.categories.find(c => {
        const trans = c.translations as Record<string, Record<string, string>>;
        return !trans || !trans[lang] || !trans[lang].name;
      });
      const missingItem = props.items.find(i => {
        const trans = i.translations as Record<string, Record<string, string>>;
        return !trans || !trans[lang] || !trans[lang].name;
      });

      if (!missingCategory && !missingItem) {
        // Build the local map since everything is already translated
        const localMap = { categories: {} as Record<string, Record<string, string>>, items: {} as Record<string, Record<string, string>> };
        props.categories.forEach(c => {
          if (c.translations?.[lang]) localMap.categories[c.id] = c.translations[lang];
        });
        props.items.forEach(i => {
          if (i.translations?.[lang]) localMap.items[i.id] = i.translations[lang];
        });
        setTranslationsMap(localMap);
        return; // Skip API call entirely
      }

      setIsTranslating(true);
      try {
        // We pass menuId to translate API to handle menu-specific logic in the backend
        const res = await fetch("/api/menu/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ restaurantId: restaurant.id, menuId: props.menuId, languageCode: props.displayLanguage })
        });
        const data = await res.json();
        if (data.translations) {
          setTranslationsMap(data.translations);
        }
      } catch (e) {
        console.error("Translation failed", e);
      } finally {
        setIsTranslating(false);
      }
    }
    
    fetchTranslations();
  }, [props.displayLanguage, props.menuId, restaurant.id, props.categories, props.items]);

  const getTranslatedProps = () => {
    if (!props.displayLanguage || props.displayLanguage === "en") return props;

    const tCategories = props.categories.map(c => {
      const t = translationsMap.categories[c.id];
      return t ? { ...c, name: t.name } : c;
    });

    const tItems = props.items.map(i => {
      const t = translationsMap.items[i.id];
      return t ? { ...i, name: t.name, description: t.description || i.description } : i;
    });

    return { ...props, categories: tCategories, items: tItems };
  };

  const renderTheme = () => {
    const tProps = getTranslatedProps();
    switch (themeStyle) {
      case "noir": return <NoirTheme {...tProps} />;
      case "brasserie": return <BrasserieTheme {...tProps} />;
      case "bentopop": return <BentoTheme {...tProps} />;
      case "zen": return <ZenTheme {...tProps} />;
      case "omakase": return <OmakaseTheme {...tProps} />;
      case "resort": return <ResortTheme {...tProps} />;
      case "bistro": return <BistroTheme {...tProps} />;
      case "lounge": return <LoungeTheme {...tProps} />;
      case "popdiner": return <PopDinerTheme {...tProps} />;
      case "editorial": return <EditorialTheme {...tProps} />;
      case "boutique": return <BoutiqueTheme {...tProps} />;
      case "botanical": return <BotanicalTheme {...tProps} />;
      case "minimalist": return <MinimalistTheme {...tProps} />;
      case "luxury": return <LuxuryTheme {...tProps} />;
      case "vibrant": return <VibrantTheme {...tProps} />;
      default: return <ClassicTheme {...tProps} />;
    }
  };

  return (
    <>
      {restaurant.wait_time_status === "busy" && (
        <div className="bg-amber-500 text-white px-4 py-2 text-center text-sm font-semibold flex items-center justify-center gap-2 sticky top-0 z-[100]">
          <Clock className="w-4 h-4" />
          <span>Estimated Wait Time: 25-35 minutes</span>
        </div>
      )}
      {restaurant.wait_time_status === "slammed" && (
        <div className="bg-rose-600 text-white px-4 py-2 text-center text-sm font-semibold flex items-center justify-center gap-2 sticky top-0 z-[100]">
          <Clock className="w-4 h-4" />
          <span>Kitchen is very busy. Expect delays (45+ mins).</span>
        </div>
      )}

      {savedLoyaltyCardId && (
        <div className={`fixed left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-top-10 duration-500 fade-in ${
          restaurant.wait_time_status && restaurant.wait_time_status !== "normal" ? "top-[60px]" : "top-4"
        }`}>
          <a
            href={`/loyalty/${savedLoyaltyCardId}`}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 rounded-full shadow-2xl border border-amber-300 hover:scale-105 transition-transform"
          >
            <Star className="w-4 h-4 text-white fill-white" />
            <span className="text-white font-bold text-xs uppercase tracking-wider">My VIP Card</span>
          </a>
        </div>
      )}



      {renderTheme()}
    </>
  );
}
