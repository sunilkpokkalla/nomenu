"use client";

import { useState, useTransition } from "react";
import { Plus, ShieldAlert, ChevronDown, X } from "lucide-react";
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
  bulkCreateAction: (formData: FormData) => Promise<void>;
  locationZones: string[];
  menusList: { id: string; name: string; is_active: boolean }[];
  ManageLocationZonesModal: React.ReactNode;
  plan: string;
}

export function CreateQrSheet({ createAction, bulkCreateAction, locationZones, menusList, ManageLocationZonesModal, plan }: CreateQrSheetProps) {
    const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState("dine_in");
  const [isAddingNewZone, setIsAddingNewZone] = useState(false);
  const [selectedZone, setSelectedZone] = useState(locationZones[0] || "Main Dining");

  // Group menus by location_label
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedMenus = menusList.reduce((acc: Record<string, any[]>, m: any) => {
    const group = m.location_label || "General Menus";
    if (!acc[group]) acc[group] = [];
    acc[group].push(m);
    return acc;
  }, {});
  
  // Sort groups so "General Menus" is last, or just sort alphabetically
  const sortedGroups = Object.keys(groupedMenus).sort((a, b) => {
    if (a === "General Menus") return 1;
    if (b === "General Menus") return -1;
    return a.localeCompare(b);
  });

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
          <div className="flex flex-col">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-4 mt-4">
            <button type="button" onClick={() => setActiveTab("single")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'single' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Single QR</button>
            <button type="button" onClick={() => setActiveTab("bulk")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'bulk' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Bulk Generate</button>
          </div>

          <form action={(formData) => {
            startTransition(async () => {
              if (activeTab === "single") {
                await createAction(formData);
              } else {
                await bulkCreateAction(formData);
              }
              setIsOpen(false);
            });
          }} className="space-y-6 mt-4">

            <div className="space-y-2.5">
              <Label htmlFor="mode" className="text-slate-700 font-medium">Order Mode</Label>
              <select
                id="mode"
                name="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                required
              >
                <option value="dine_in">On-Premise (Table / Seat / Room)</option>
                <option value="pickup" disabled={plan !== 'enterprise'}>Takeaway (Enterprise Only)</option>
                <option value="reserve" disabled={plan !== 'enterprise'}>Priority Reserve (Enterprise Only)</option>
              </select>
            </div>

            {mode === "dine_in" && (
              <div className="space-y-2.5">
                <Label htmlFor="location_zone" className="text-slate-700 font-medium">Location Zone</Label>
                
                {!isAddingNewZone ? (
                  <div className="relative">
                    <select
                      id="location_zone"
                      name="location_zone"
                      value={selectedZone}
                      onChange={(e) => {
                        if (e.target.value === "ADD_NEW") {
                          setIsAddingNewZone(true);
                          setSelectedZone("");
                        } else {
                          setSelectedZone(e.target.value);
                        }
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm appearance-none cursor-pointer"
                      required
                    >
                      {locationZones.map((zone, idx) => (
                        <option key={idx} value={zone}>
                          {zone}
                        </option>
                      ))}
                      <option value="ADD_NEW" className="font-semibold text-indigo-600">
                        + Add New Location Zone
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      id="location_zone"
                      name="location_zone"
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      placeholder="e.g. Poolside, Beachfront, Patio"
                      className="rounded-xl px-3.5 py-2.5 shadow-sm border-slate-200 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 h-auto pr-10"
                      required
                      autoFocus
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsAddingNewZone(false);
                        setSelectedZone(locationZones[0] || "Main Dining");
                      }}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "single" ? (
              <div className="space-y-2.5">
                <Label htmlFor="label" className="text-slate-700 font-medium">
                  {mode === "dine_in" ? "Specific Location / Label" : "Label (e.g. Front Window)"}
                </Label>
                <Input 
                  id="label" 
                  name="label" 
                  placeholder="e.g. Table 12, Seat 4A, Cabana 3" 
                  required={activeTab === "single"}
                  className="rounded-xl px-3.5 py-2.5 shadow-sm border-slate-200 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 h-auto"
                />
              </div>
            ) : (
              <div className="space-y-4 border rounded-xl p-4 bg-slate-50 border-slate-100">
                <div className="space-y-2.5">
                  <Label htmlFor="prefix" className="text-slate-700 font-medium">Label Prefix</Label>
                  <Input 
                    id="prefix" 
                    name="prefix" 
                    placeholder="e.g. Table, Cabana, Booth" 
                    required={activeTab === "bulk"}
                    className="rounded-lg px-3 py-2 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <Label htmlFor="count" className="text-slate-700 font-medium">How many?</Label>
                    <Input 
                      id="count" 
                      name="count" 
                      type="number"
                      min="1"
                      max="100"
                      placeholder="e.g. 10" 
                      required={activeTab === "bulk"}
                      className="rounded-lg px-3 py-2 bg-white"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="start" className="text-slate-700 font-medium">Start Number</Label>
                    <Input 
                      id="start" 
                      name="start" 
                      type="number"
                      min="1"
                      defaultValue="1"
                      required={activeTab === "bulk"}
                      className="rounded-lg px-3 py-2 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2.5">
              <Label htmlFor="menuId" className="text-slate-700 font-medium">Link to Menu</Label>
              <select
                id="menuId"
                name="menuId"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                required
              >
                {sortedGroups.map((groupName) => (
                  <optgroup key={groupName} label={groupName} className="font-semibold text-slate-500">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {groupedMenus[groupName].map((m: any) => (
                      <option key={m.id} value={m.id} className="font-medium text-slate-900">
                        {m.name} {m.is_active ? "" : " (Draft)"}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            
            <Button type="submit" disabled={isPending} className="w-full rounded-xl h-11 font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all mt-6">
              {isPending ? "Generating..." : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {activeTab === "single" ? "Generate QR Code" : "Bulk Generate QR Codes"}
                </>
              )}
            </Button>
          </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
