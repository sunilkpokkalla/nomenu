"use client";

import { useState } from "react";
import { Settings2, Loader2, UtensilsCrossed, Receipt, MapPin, Eye, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  GLOBAL_MENU_TYPES,
  REGIONAL_MENU_TYPES,
  SPECIALTY_MENU_TYPES,
  getChefRecommendations
} from "@/lib/menu-type-options";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full h-11 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving Changes...
        </>
      ) : (
        "Save Menu Settings"
      )}
    </Button>
  );
}

// Define the shape of the menu we need based on the database columns
interface EditMenuProps {
  menu: {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    menu_type: string | null;
    tax_rate: number | null;
    service_charge: number | null;
    service_charge_type: string | null;
    location_label: string | null;
  };
  cuisineType?: string | null;
  editAction: (formData: FormData) => Promise<void>;
}

export function EditMenuModal({ menu, cuisineType, editAction }: EditMenuProps) {
  const [open, setOpen] = useState(false);
  const chefRecommendations = getChefRecommendations(cuisineType);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl bg-white hover:bg-slate-50 border-slate-200" title="Edit Settings">
          <Settings2 className="h-4 w-4 text-slate-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
          <DialogTitle className="text-xl font-bold flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-indigo-500" />
              Menu Settings
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-slate-200/50 -mr-2">
                <X className="h-4 w-4 text-slate-500" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm mt-1.5">
            Configure how this menu appears and functions for your guests.
          </DialogDescription>
        </DialogHeader>

        <form 
          action={async (formData) => {
            await editAction(formData);
            setOpen(false);
          }} 
          className="p-6 space-y-8 bg-white"
        >
          <input type="hidden" name="menuId" value={menu.id} />
          
          {/* Basic Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <UtensilsCrossed className="h-4 w-4 text-slate-400" />
              Basic Details
            </div>
            <div className="space-y-4 p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Menu Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={menu.name} 
                  required 
                  className="bg-white border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 h-10 shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="menuType" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Format / Type</Label>
                <select
                  id="menuType"
                  name="menuType"
                  defaultValue={menu.menu_type || ""}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 h-10 cursor-pointer shadow-sm"
                  required
                >
                  <option value="">Select Format...</option>
                  
                  {chefRecommendations.length > 0 && (
                    <optgroup label="👨‍🍳 Chef's Recommendations">
                      {chefRecommendations.map((c) => (
                        <option key={`rec-${c.value}`} value={c.value}>{c.label}</option>
                      ))}
                    </optgroup>
                  )}

                  <optgroup label="🌍 Global Formats">
                    {GLOBAL_MENU_TYPES.map((c) => (
                      <option key={`global-${c.value}`} value={c.value}>{c.label}</option>
                    ))}
                  </optgroup>

                  <optgroup label="🎌 Regional & Cultural Formats">
                    {REGIONAL_MENU_TYPES.map((c) => (
                      <option key={`regional-${c.value}`} value={c.value}>{c.label}</option>
                    ))}
                  </optgroup>

                  <optgroup label="✨ Specialty Formats">
                    {SPECIALTY_MENU_TYPES.map((c) => (
                      <option key={`specialty-${c.value}`} value={c.value}>{c.label}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Description <span className="text-slate-400 font-normal lowercase">(Optional)</span></Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="E.g., Our seasonal tasting menu featuring local ingredients." 
                  defaultValue={menu.description || ""}
                  className="resize-none bg-white border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Fees Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Receipt className="h-4 w-4 text-slate-400" />
              Taxes & Fees
            </div>
            <div className="grid gap-4 sm:grid-cols-2 p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <div className="space-y-1.5">
                <Label htmlFor="taxRate" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Tax Rate (%)</Label>
                <div className="relative">
                  <Input 
                    id="taxRate" 
                    name="taxRate" 
                    type="number" 
                    step="0.001" 
                    placeholder="8.875" 
                    defaultValue={menu.tax_rate ?? ""}
                    className="bg-white border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 h-10 shadow-sm pr-8"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 font-medium">%</div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="serviceCharge" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Service Charge</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="serviceCharge" 
                    name="serviceCharge" 
                    type="number" 
                    step="0.01" 
                    placeholder="18" 
                    defaultValue={menu.service_charge ?? ""}
                    className="flex-1 bg-white border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 h-10 shadow-sm"
                  />
                  <select
                    name="serviceChargeType"
                    defaultValue={menu.service_charge_type || "percentage"}
                    className="w-[72px] rounded-lg border border-slate-200 bg-slate-100 px-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-sm cursor-pointer"
                  >
                    <option value="percentage">%</option>
                    <option value="flat">Flat $</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Ordering Experience Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <MapPin className="h-4 w-4 text-slate-400" />
              Ordering Experience
            </div>
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5">
              <Label htmlFor="locationLabel" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Location Label</Label>
              <select
                id="locationLabel"
                name="locationLabel"
                defaultValue={menu.location_label || "Table"}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-10 cursor-pointer shadow-sm"
              >
                <option value="Table">Table (e.g., "Table 14")</option>
                <option value="Room">Room (e.g., "Room 201")</option>
                <option value="Seat">Seat (e.g., "Seat 4")</option>
                <option value="Spot">Spot (e.g., "Spot B")</option>
                <option value="Lane">Lane (e.g., "Lane 7")</option>
                <option value="None">None (Don't ask for location)</option>
              </select>
              <div className="flex items-start gap-1.5 mt-2">
                <Info className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  This determines what guests are prompted to enter when placing an order from this menu.
                </p>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-start gap-3">
            <div className="mt-0.5">
              <input 
                type="checkbox" 
                id="isActive"
                name="isActive" 
                value="true" 
                defaultChecked={menu.is_active} 
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 h-5 w-5 cursor-pointer bg-white" 
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="isActive" className="text-sm font-semibold text-slate-900 cursor-pointer">Menu is Active & Visible</Label>
              <p className="text-xs text-slate-600 leading-relaxed">
                When unchecked, this menu is hidden from your public page and guests cannot place orders.
              </p>
            </div>
            <Eye className={`h-5 w-5 ${menu.is_active ? 'text-indigo-500' : 'text-slate-400'}`} />
          </div>

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
