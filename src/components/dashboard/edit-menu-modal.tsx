"use client";

import { useState } from "react";
import { Settings2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        "Save Settings"
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
        <Button variant="outline" size="sm" className="h-8">
          <Settings2 className="mr-2 h-4 w-4" />
          Edit Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Menu Settings</DialogTitle>
          <DialogDescription>
            Update the tax rate, service charge, and public details for this menu.
          </DialogDescription>
        </DialogHeader>

        <form 
          action={async (formData) => {
            await editAction(formData);
            setOpen(false);
          }} 
          className="space-y-4 py-4"
        >
          <input type="hidden" name="menuId" value={menu.id} />
          
          <div className="space-y-2">
            <Label htmlFor="name">Menu Name</Label>
            <Input id="name" name="name" defaultValue={menu.name} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="menuType">Menu Format / Type</Label>
            <select
              id="menuType"
              name="menuType"
              defaultValue={menu.menu_type || ""}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10 cursor-pointer"
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

              <optgroup label="🎌 Regional & Cultural Formats">
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

          <div className="space-y-2 border-t pt-3">
            <Label htmlFor="description">Menu Description (Optional)</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="A brief description of this menu shown to guests" 
              defaultValue={menu.description || ""}
              className="resize-none"
            />
          </div>

          <div className="grid gap-4 grid-cols-2 border-t pt-3">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input 
                id="taxRate" 
                name="taxRate" 
                type="number" 
                step="0.001" 
                placeholder="e.g. 8.875" 
                defaultValue={menu.tax_rate ?? ""}
              />
              <p className="text-[10px] text-muted-foreground">Ex: 8.875 for NY</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serviceCharge">Service Charge</Label>
              <div className="flex space-x-2">
                <Input 
                  id="serviceCharge" 
                  name="serviceCharge" 
                  type="number" 
                  step="0.01" 
                  placeholder="e.g. 18" 
                  defaultValue={menu.service_charge ?? ""}
                  className="flex-1"
                />
                <select
                  name="serviceChargeType"
                  defaultValue={menu.service_charge_type || "percentage"}
                  className="w-20 rounded-lg border border-input bg-background px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="percentage">%</option>
                  <option value="flat">Flat $</option>
                </select>
              </div>
              <p className="text-[10px] text-muted-foreground">Auto-gratuity/fee</p>
            </div>
          </div>

          <div className="space-y-2 border-t pt-3">
            <Label htmlFor="locationLabel">Location Label</Label>
            <select
              id="locationLabel"
              name="locationLabel"
              defaultValue={menu.location_label || "Table"}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="Table">Table (e.g., "Table 14")</option>
              <option value="Room">Room (e.g., "Room 201")</option>
              <option value="Seat">Seat (e.g., "Seat 4")</option>
              <option value="Spot">Spot (e.g., "Spot B")</option>
              <option value="Lane">Lane (e.g., "Lane 7")</option>
              <option value="None">None (Don't ask for location)</option>
            </select>
            <p className="text-xs text-muted-foreground">What guests enter when ordering</p>
          </div>

          <div className="space-y-2 border-t pt-3">
             <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                name="isActive" 
                value="true" 
                defaultChecked={menu.is_active} 
                className="rounded text-primary focus:ring-primary h-4 w-4" 
              />
              <span className="text-sm font-medium">Menu is Active</span>
            </label>
            <p className="text-xs text-muted-foreground ml-6">
              Inactive menus cannot be viewed by guests.
            </p>
          </div>

          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
