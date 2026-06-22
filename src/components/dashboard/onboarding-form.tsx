"use client";

import { useState } from "react";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CuisineSelect } from "@/components/dashboard/cuisine-select";
import { CURRENCY_OPTIONS } from "@/lib/currency-options";
import { TIMEZONE_OPTIONS } from "@/lib/timezone-options";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { createRestaurant } from "@/app/dashboard/actions";

export function OnboardingForm() {
  const [accentColor, setAccentColor] = useState("#F59E0B");

  return (
    <form action={createRestaurant} className="space-y-5">
      {/* Hidden inputs to send state to server action */}
      <input type="hidden" name="accentColor" value={accentColor} />

      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Restaurant Name</Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="e.g. Bella Italia" 
          required 
          className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary h-11 text-sm bg-slate-50/50"
        />
      </div>

      <div>
        <div className="space-y-1.5">
          <Label htmlFor="accentColorPicker" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Brand Color</Label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2 h-[72px]">
            <input 
              type="color" 
              id="accentColorPicker"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded-lg border-0 p-0 bg-transparent"
            />
            <div className="flex-1">
               <p className="text-xs font-bold text-slate-700">Accent Hue</p>
               <p className="text-[10px] text-slate-400 font-mono">{accentColor.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cuisineSelect" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Cuisine / Service Style</Label>
        <CuisineSelect />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Contact Phone</Label>
          <Input 
            id="phone" 
            name="phone" 
            type="tel" 
            placeholder="e.g. +1 (555) 123-4567" 
            className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary h-11 text-sm bg-slate-50/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="currency" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Currency</Label>
          <select
            id="currency"
            name="currency"
            defaultValue="USD"
            className="w-full rounded-xl border border-slate-200 focus:border-primary focus:ring-primary h-11 text-sm bg-slate-50/50 px-3 outline-none cursor-pointer"
            required
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="timezone" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Timezone</Label>
        <select
          id="timezone"
          name="timezone"
          defaultValue="America/New_York"
          className="w-full rounded-xl border border-slate-200 focus:border-primary focus:ring-primary h-11 text-sm bg-slate-50/50 px-3 outline-none cursor-pointer"
          required
        >
          {TIMEZONE_OPTIONS.map((tz) => (
            <option key={tz.code} value={tz.code}>
              {tz.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Street Address</Label>
        <Textarea 
          id="address" 
          name="address" 
          placeholder="e.g. 123 Gourmet Way, San Francisco, CA" 
          rows={3}
          className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary text-sm bg-slate-50/50 resize-none"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full rounded-xl bg-slate-950 hover:bg-slate-900 text-white h-12 text-sm font-semibold tracking-wide shadow-md transition-all duration-300 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
      >
        Save Restaurant Profile
        <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
      </Button>
    </form>
  );
}
