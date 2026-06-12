"use client";

import React from "react";
import { MenuThemeProps } from "../types";

export function BrasserieTheme({ restaurant, categories, items }: MenuThemeProps) {
  return (
    <div className="min-h-screen bg-[#FAFAED] flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-serif text-slate-800 mb-4">{restaurant.name}</h1>
        <p className="text-slate-500 italic">Brasserie Theme Construction in Progress</p>
      </div>
    </div>
  );
}
