"use client";

import { useState } from "react";
import { Settings2, Loader2, UtensilsCrossed, Receipt, MapPin, Eye, Info, X, Sparkles, Globe } from "lucide-react";
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
import { SUPPORTED_LANGUAGES } from "@/lib/languages";
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
    allow_manual_payments: boolean | null;
    display_language: string | null;
  };
  cuisineType?: string | null;
  editAction: (formData: FormData) => Promise<void>;
  plan: string;
}

export function EditMenuModal({ menu, cuisineType, editAction, plan }: EditMenuProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(menu.description || "");
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const chefRecommendations = getChefRecommendations(cuisineType);

  const handleGenerateDescription = async () => {
    const nameInput = document.getElementById("name") as HTMLInputElement | null;
    const name = nameInput?.value || menu.name;
    
    if (!name) {
      alert("Please enter a Menu Name first!");
      return;
    }
    
    setIsGeneratingDesc(true);
    try {
      const res = await fetch("/api/menu/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type: 'menu' })
      });
      const data = await res.json();
      if (data.description) {
        setDescription(data.description);
      }
    } catch (error) {
      console.error("Failed to generate description:", error);
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl bg-white hover:bg-slate-50 border-slate-200" title="Edit Settings">
          <Settings2 className="h-4 w-4 text-slate-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 shadow-2xl rounded-2xl top-[5vh] translate-y-0 mb-[5vh]">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <DialogTitle className="text-xl font-bold flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-indigo-500" />
              Menu Settings
            </div>
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
              Menu Type & Basic Details
            </div>
            <div className="grid gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-100">

              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Menu Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="E.g., Dinner Menu" 
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Description <span className="text-slate-400 font-normal lowercase">(Optional)</span></Label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDesc}
                    className="text-[10px] text-purple-600 hover:text-purple-700 hover:underline font-bold uppercase tracking-wider flex items-center gap-1 disabled:opacity-50"
                  >
                    {isGeneratingDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    AI Writer
                  </button>
                </div>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="E.g., Our seasonal tasting menu featuring local ingredients." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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

          {/* Localization Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Globe className="h-4 w-4 text-slate-400" />
              Localization
            </div>
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5">
              <Label htmlFor="displayLanguage" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Display Language</Label>
              <select
                id="displayLanguage"
                name="displayLanguage"
                defaultValue={menu.display_language || "en"}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-10 cursor-pointer shadow-sm"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
              <div className="flex items-start gap-1.5 mt-2">
                <Info className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  The menu will automatically be translated and displayed in this language to all customers.
                </p>
              </div>
            </div>
          </div>

          {/* Toggles Section */}
          <div className="space-y-3">
            {/* Status Section */}
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-start gap-3">
              <div className="mt-0.5">
                <input 
                  type="checkbox" 
                  id={`isActive-${menu.id}`}
                  name="isActive" 
                  value="true" 
                  defaultChecked={menu.is_active} 
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 h-5 w-5 cursor-pointer bg-white" 
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor={`isActive-${menu.id}`} className="text-sm font-semibold text-slate-900 cursor-pointer">Menu is Active & Visible</Label>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When unchecked, this menu is hidden from your public page and guests cannot place orders.
                </p>
              </div>
            </div>

            {/* Enterprise Settings Section */}
            {plan === 'enterprise' && (
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-start gap-3">
                <div className="mt-0.5">
                  <input 
                    type="checkbox" 
                    id={`allowManualPayments-${menu.id}`} 
                    name="allowManualPayments" 
                    defaultChecked={menu.allow_manual_payments || false}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-slate-200 transition-colors peer-checked:bg-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-600 peer-focus:ring-offset-2 relative after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4"></div>
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor={`allowManualPayments-${menu.id}`} className="text-sm font-semibold text-slate-900 cursor-pointer">
                    Pay at Counter
                  </Label>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Allow customers to order without Stripe and pay later at the counter (e.g., Cash or POS).
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
