"use client";

import React from "react";
import { ClassicTheme } from "./themes/ClassicTheme";
import { OmakaseTheme } from "./themes/OmakaseTheme";
import { BrutalistTheme } from "./themes/BrutalistTheme";
import { RetroTheme } from "./themes/RetroTheme";
import { SpeakeasyTheme } from "./themes/SpeakeasyTheme";
import { CyberpunkTheme } from "./themes/CyberpunkTheme";
import { BoutiqueTheme } from "./themes/BoutiqueTheme";

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
    case "omakase":
      return <OmakaseTheme {...props} />;
    case "brutalist":
      return <BrutalistTheme {...props} />;
    case "retro":
      return <RetroTheme {...props} />;
    case "speakeasy":
      return <SpeakeasyTheme {...props} />;
    case "cyberpunk":
      return <CyberpunkTheme {...props} />;
    case "boutique":
      return <BoutiqueTheme {...props} />;
    case "bistro":
    case "minimalist":
    case "luxury":
    case "vibrant":
    default:
      // Fallback to the classic monolithic theme file for the original 4 themes
      return <ClassicTheme {...props} />;
  }
}
