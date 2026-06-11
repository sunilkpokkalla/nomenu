"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MenuDescriptionField } from "@/components/dashboard/menu-description-field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  GLOBAL_MENU_TYPES,
  REGIONAL_MENU_TYPES,
  SPECIALTY_MENU_TYPES,
} from "@/lib/menu-type-options";

interface CreateMenuSheetProps {
  createAction: (formData: FormData) => Promise<void>;
  chefRecommendations: { value: string; label: string }[];
}

export function CreateMenuSheet({ createAction, chefRecommendations }: CreateMenuSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="font-semibold shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Menu
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold tracking-tight text-slate-900">Create Menu</SheetTitle>
          <SheetDescription>
            Add a new digital menu to your restaurant dashboard.
          </SheetDescription>
        </SheetHeader>

        <form action={async (formData) => {
          await createAction(formData);
          setIsOpen(false);
        }} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Menu Name</Label>
            <Input id="name" name="name" placeholder="e.g. Lunch Specials, Wine List" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="menuType" className="text-sm font-medium">Menu Format / Type</Label>
            <select
              id="menuType"
              name="menuType"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-10 cursor-pointer"
              required
            >
              <option value="">Select Format...</option>
              
              {chefRecommendations.length > 0 && (
                <optgroup label="👨‍🍳 Chef's Recommendations for your Cuisine">
                  {chefRecommendations.map((c) => (
                    <option key={`rec-${c.value}`} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </optgroup>
              )}

              <optgroup label="🌍 Global Formats">
                {GLOBAL_MENU_TYPES.map((c) => (
                  <option key={`global-${c.value}`} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </optgroup>

              <optgroup label="📍 Regional Formats">
                {REGIONAL_MENU_TYPES.map((c) => (
                  <option key={`regional-${c.value}`} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </optgroup>

              <optgroup label="✨ Specialty Formats">
                {SPECIALTY_MENU_TYPES.map((c) => (
                  <option key={`specialty-${c.value}`} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationLabel">Guest Location Type</Label>
            <select
              id="locationLabel"
              name="locationLabel"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-10 cursor-pointer"
            >
              <option value="Table">Table (Restaurant, Cafe, Bar)</option>
              <option value="Room">Room (In-Room Dining)</option>
              <option value="Cabana">Cabana (Poolside, Beach Club)</option>
              <option value="Sunbed">Sunbed (Resorts)</option>
              <option value="Seat">Seat (Theaters, Stadiums)</option>
              <option value="Lane">Lane (Bowling Alleys)</option>
            </select>
          </div>

          <MenuDescriptionField />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input id="taxRate" name="taxRate" type="number" step="0.01" min="0" placeholder="e.g. 8.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceCharge">Service Fee</Label>
              <Input id="serviceCharge" name="serviceCharge" type="number" step="0.01" min="0" placeholder="e.g. 10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceChargeType">Service Fee Type</Label>
            <select
              id="serviceChargeType"
              name="serviceChargeType"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-10 cursor-pointer"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount ($)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isActive">Status</Label>
            <select
              id="isActive"
              name="isActive"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-10 cursor-pointer"
            >
              <option value="true">Active (Visible when scanned)</option>
              <option value="false">Inactive (Draft mode)</option>
            </select>
          </div>

          <Button type="submit" className="w-full font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            Create Menu
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
