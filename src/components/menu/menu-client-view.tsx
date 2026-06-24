"use client";

import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { NoirTheme } from "./themes/NoirTheme";
import { BrasserieTheme } from "./themes/BrasserieTheme";
import { BentoTheme } from "./themes/BentoTheme";
import { ZenTheme } from "./themes/ZenTheme";
import { ClassicTheme } from "./themes/ClassicTheme";
import { OmakaseTheme } from "./themes/OmakaseTheme";
import { ResortTheme } from "./themes/ResortTheme";
import { BistroTheme } from "./themes/BistroTheme";
import { LoungeTheme } from "./themes/LoungeTheme";
import { PopDinerTheme } from "./themes/PopDinerTheme";
import { EditorialTheme } from "./themes/EditorialTheme";
import { BoutiqueTheme } from "./themes/BoutiqueTheme";
import { BotanicalTheme } from "./themes/BotanicalTheme";

import { Restaurant, Category, MenuItem, MenuThemeProps as MenuClientViewProps } from "./types";

export function MenuClientView(props: MenuClientViewProps) {
  const { restaurant } = props;
  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const isFreePlan = currentPlan === "free";
  
  let themeStyle = restaurant.theme_style || "bistro";
  // Downgrade theme if on Free plan and trying to use a Premium theme
  if (isFreePlan && themeStyle !== "minimalist") {
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

  const renderTheme = () => {
    switch (themeStyle) {
      case "noir": return <NoirTheme {...props} />;
      case "brasserie": return <BrasserieTheme {...props} />;
      case "bentopop": return <BentoTheme {...props} />;
      case "zen": return <ZenTheme {...props} />;
      case "omakase": return <OmakaseTheme {...props} />;
      case "resort": return <ResortTheme {...props} />;
      case "bistro": return <BistroTheme {...props} />;
      case "lounge": return <LoungeTheme {...props} />;
      case "popdiner": return <PopDinerTheme {...props} />;
      case "editorial": return <EditorialTheme {...props} />;
      case "boutique": return <BoutiqueTheme {...props} />;
      case "botanical": return <BotanicalTheme {...props} />;
      case "minimalist":
      case "luxury":
      case "vibrant":
      default: return <ClassicTheme {...props} />;
    }
  };

  return (
    <>
      {savedLoyaltyCardId && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-10 duration-500 fade-in">
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
