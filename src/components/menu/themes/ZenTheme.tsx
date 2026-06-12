"use client";

import React from "react";
import { MenuThemeProps } from "../types";

export function ZenTheme({ restaurant, categories, items }: MenuThemeProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-sans tracking-[0.2em] uppercase text-zinc-900 mb-4">{restaurant.name}</h1>
        <p className="text-zinc-400 font-light tracking-wider">Zen Theme Construction in Progress</p>
      </div>
    </div>
  );
}
