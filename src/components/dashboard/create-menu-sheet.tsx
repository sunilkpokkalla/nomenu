"use client";

import { useState } from "react";
import { Plus, UtensilsCrossed, MapPin, Receipt, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  plan: string;
}

export function CreateMenuSheet({ createAction, chefRecommendations, plan }: CreateMenuSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="rounded-xl bg-slate-950 hover:bg-slate-900 text-white h-11 px-4 text-sm font-semibold tracking-wide shadow-sm transition-all duration-300 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]">
          <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} />
          Add Menu
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <form action={async (formData) => {
          if (isSubmitting) return;
          setIsSubmitting(true);
          try {
            await createAction(formData);
            setIsOpen(false);
          } finally {
            setIsSubmitting(false);
          }
        }} className="flex flex-col h-full max-h-screen">
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <SheetHeader className="mb-2">
              <SheetTitle className="text-2xl font-bold tracking-tight text-slate-900">Create Menu</SheetTitle>
              <SheetDescription>
                Add a new digital menu to your restaurant dashboard.
              </SheetDescription>
            </SheetHeader>
          
          {/* Basic Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <UtensilsCrossed className="h-4 w-4 text-slate-400" />
              Menu Type & Basic Details
            </div>
            <div className="space-y-4 p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Menu Name</Label>
                <Input id="name" name="name" placeholder="e.g. Lunch Specials, Wine List" required className="bg-white border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 h-10 shadow-sm" />
              </div>
          
              <div className="space-y-1.5">
                <Label htmlFor="menuType" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Format / Type</Label>
                <select
                  id="menuType"
                  name="menuType"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-10 cursor-pointer shadow-sm"
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
              <MenuDescriptionField />
            </div>
          </div>

          {/* Ordering Experience */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <MapPin className="h-4 w-4 text-slate-400" />
              Ordering Experience
            </div>
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5">
              <Label htmlFor="locationLabel" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Guest Location Type</Label>
              <select
                id="locationLabel"
                name="locationLabel"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-10 cursor-pointer shadow-sm"
              >
                <option value="Table">Table (Restaurant, Cafe, Bar)</option>
                <option value="Room">Room (In-Room Dining)</option>
                <option value="Cabana">Cabana (Poolside, Beach Club)</option>
                <option value="Sunbed">Sunbed (Resorts)</option>
                <option value="Seat">Seat (Theaters, Stadiums)</option>
                <option value="Lane">Lane (Bowling Alleys)</option>
                <option value="None">None (Don't ask for location)</option>
              </select>
            </div>
          </div>

          {/* Taxes & Fees */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Receipt className="h-4 w-4 text-slate-400" />
              Taxes & Fees
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <div className="space-y-1.5">
                <Label htmlFor="taxRate" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Tax Rate (%)</Label>
                <div className="flex space-x-2">
                  <Input id="taxRate" name="taxRate" type="number" step="0.001" min="0" placeholder="8.875" className="flex-1 bg-white border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 h-10 shadow-sm" />
                  <div className="w-[72px] flex items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-sm font-medium text-slate-600 shadow-sm select-none">%</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="serviceCharge" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Service Fee</Label>
                <div className="flex space-x-2">
                  <Input id="serviceCharge" name="serviceCharge" type="number" step="0.01" min="0" placeholder="18" className="flex-1 bg-white border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 h-10 shadow-sm" />
                  <select
                    id="serviceChargeType"
                    name="serviceChargeType"
                    className="w-[72px] rounded-lg border border-slate-200 bg-slate-100 px-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-sm cursor-pointer"
                  >
                    <option value="percentage">%</option>
                    <option value="flat">Flat $</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-start gap-3">
            <div className="mt-0.5 flex items-center h-5">
              <Switch 
                id="isActive" 
                name="isActive" 
                value="true" 
                defaultChecked={true} 
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="isActive" className="text-sm font-semibold text-slate-900 cursor-pointer">Menu is Active & Visible</Label>
              <p className="text-xs text-slate-600 leading-relaxed">
                When unchecked, this menu is hidden from your public page and guests cannot place orders.
              </p>
            </div>
            <Eye className="h-5 w-5 text-indigo-500" />
          </div>

          {/* Enterprise Settings */}
          {plan === 'enterprise' && (
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-start gap-3">
              <div className="mt-0.5 flex items-center h-5">
                <Switch 
                  id="allowManualPayments" 
                  name="allowManualPayments" 
                  defaultChecked={false}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="allowManualPayments" className="text-sm font-semibold text-slate-900 cursor-pointer">Pay at Counter</Label>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Allow customers to order without Stripe and pay later at the counter (e.g., Cash or POS). 
                </p>
              </div>
            </div>
          )}

          </div>
          <div className="p-4 border-t border-slate-100 bg-white mt-auto shrink-0 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
            <Button disabled={isSubmitting} type="submit" className="w-full h-11 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              {isSubmitting ? "Creating Menu..." : "Create Menu"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
