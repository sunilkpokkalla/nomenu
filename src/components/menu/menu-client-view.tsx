"use client";

import React from "react";
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

  // Route to the appropriate Theme Component
  switch (themeStyle) {
    case "noir":
      return <NoirTheme {...props} />;
    case "brasserie":
      return <BrasserieTheme {...props} />;
    case "bentopop":
      return <BentoTheme {...props} />;
    case "zen":
      return <ZenTheme {...props} />;
    case "omakase":
      return <OmakaseTheme {...props} />;
    case "resort":
      return <ResortTheme {...props} />;
    case "bistro":
      return <BistroTheme {...props} />;
    case "lounge":
      return <LoungeTheme {...props} />;
    case "popdiner":
      return <PopDinerTheme {...props} />;
    case "editorial":
      return <EditorialTheme {...props} />;
    case "boutique":
      return <BoutiqueTheme {...props} />;
    case "botanical":
      return <BotanicalTheme {...props} />;
    case "minimalist":
    case "luxury":
    case "vibrant":
    default:
      // Fallback to the classic monolithic theme file for the original 4 themes
      return <ClassicTheme {...props} />;
  }
}
