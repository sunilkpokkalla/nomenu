"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CUISINE_GROUPS } from "@/lib/cuisine-options";

interface CuisineSelectProps {
  defaultValue?: string;
  hasCustomLegacyValue?: boolean;
}

export function CuisineSelect({ defaultValue = "", hasCustomLegacyValue = false }: CuisineSelectProps) {
  const allValues = CUISINE_GROUPS.flatMap((g) => g.options.map((o) => o.value));
  const isPredefined = allValues.includes(defaultValue) || defaultValue === "";
  
  const [selectedValue, setSelectedValue] = useState(
    hasCustomLegacyValue || !isPredefined ? "other" : defaultValue
  );
  
  const [customValue, setCustomValue] = useState(
    hasCustomLegacyValue || !isPredefined ? defaultValue : ""
  );

  return (
    <div className="space-y-3">
      <select
        id="cuisineSelect"
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
        }}
        className="w-full rounded-xl border border-slate-200 focus:border-primary focus:ring-primary h-11 text-sm bg-slate-50/50 px-3 outline-none cursor-pointer"
      >
        <option value="">Select Cuisine / Style...</option>
        {CUISINE_GROUPS.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </optgroup>
        ))}
        <option value="other">✍️ Other / Custom Style...</option>
      </select>

      {/* Hidden input field that actually contains the final value submitted to the action */}
      <input
        type="hidden"
        name="cuisineType"
        value={selectedValue === "other" ? customValue : selectedValue}
      />

      {/* Show custom text field if 'other' is selected */}
      {selectedValue === "other" && (
        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <Label htmlFor="customCuisineInput" className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
            Type Custom Cuisine / Style
          </Label>
          <Input
            id="customCuisineInput"
            type="text"
            placeholder="e.g. Mediterranean Fusion, Artisan Bakery"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary h-10 text-sm bg-slate-50/50"
            required={selectedValue === "other"}
          />
        </div>
      )}
    </div>
  );
}
