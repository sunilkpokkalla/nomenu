"use client";

import { useState } from "react";
import { Plus, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CreateQrSheetProps {
  createAction: (formData: FormData) => Promise<void>;
  locationZones: string[];
  menusList: { id: string; name: string; is_active: boolean }[];
  ManageLocationZonesModal: React.ReactNode;
}

export function CreateQrSheet({ createAction, locationZones, menusList, ManageLocationZonesModal }: CreateQrSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="font-semibold shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Generate QR Code
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl font-bold tracking-tight text-slate-900">Generate QR</SheetTitle>
              <SheetDescription>
                Create a new physical touchpoint.
              </SheetDescription>
            </div>
            {ManageLocationZonesModal}
          </div>
        </SheetHeader>

        {menusList.length === 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 shadow-sm mt-4">
            <ShieldAlert className="inline mr-2 h-5 w-5 text-amber-600 mb-1" />
            <span className="font-medium">Missing Menu</span>
            <p className="mt-1 text-amber-700/80">Please create a menu first before generating QR codes.</p>
            <Button className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white border-0 shadow-sm" asChild>
              <Link href="/dashboard/menus">Create Menu</Link>
            </Button>
          </div>
        ) : (
          <form action={async (formData) => {
            await createAction(formData);
            setIsOpen(false);
          }} className="space-y-6 mt-4">
            <div className="space-y-2.5">
              <Label htmlFor="location_zone" className="text-slate-700 font-medium">Location Zone</Label>
              <select
                id="location_zone"
                name="location_zone"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                required
              >
                {locationZones.map((zone, idx) => (
                  <option key={idx} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="label" className="text-slate-700 font-medium">Table Number / Label</Label>
              <Input 
                id="label" 
                name="label" 
                placeholder="e.g. 12, 204, Booth 4" 
                required 
                className="rounded-xl px-3.5 py-2.5 shadow-sm border-slate-200 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 h-auto"
              />
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="menuId" className="text-slate-700 font-medium">Link to Menu</Label>
              <select
                id="menuId"
                name="menuId"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                required
              >
                {menusList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.is_active ? "" : " (Draft)"}
                  </option>
                ))}
              </select>
            </div>
            
            <Button type="submit" className="w-full rounded-xl h-11 font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all mt-6">
              <Plus className="mr-2 h-4 w-4" />
              Generate QR Code
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
