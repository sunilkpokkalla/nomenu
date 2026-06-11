"use client";

import { useState } from "react";
import { Plus, X, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateLocationZones } from "@/app/dashboard/actions";

interface ManageLocationZonesModalProps {
  restaurantId: string;
  initialZones: string[];
}

export function ManageLocationZonesModal({ restaurantId, initialZones }: ManageLocationZonesModalProps) {
  const [open, setOpen] = useState(false);
  // Ensure we always have at least "Main Dining" if array is empty
  const defaultZones = initialZones && initialZones.length > 0 ? initialZones : ["Main Dining"];
  const [zones, setZones] = useState<string[]>(defaultZones);
  const [newZone, setNewZone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddZone = () => {
    const trimmed = newZone.trim();
    if (!trimmed) return;
    if (zones.includes(trimmed)) {
      setNewZone("");
      return;
    }
    setZones([...zones, trimmed]);
    setNewZone("");
  };

  const handleRemoveZone = (zoneToRemove: string) => {
    setZones(zones.filter(z => z !== zoneToRemove));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateLocationZones(restaurantId, zones);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save location zones.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (val) {
        setZones(initialZones && initialZones.length > 0 ? initialZones : ["Main Dining"]);
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-full border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm hover:bg-slate-50 transition-all font-medium text-slate-700">
          <MapPin className="h-3.5 w-3.5 text-indigo-500" />
          Manage Zones
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] border border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden p-0">
        <div className="px-6 pt-8 pb-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Manage Zones</DialogTitle>
            <DialogDescription className="text-slate-500 text-sm mt-1.5 leading-relaxed">
              Organize your QR codes by areas (e.g. Patio, VIP Lounge) for clean analytics and fast filtering.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-5">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="e.g. Rooftop, Main Bar" 
                value={newZone}
                onChange={(e) => setNewZone(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddZone();
                  }
                }}
                className="h-11 rounded-xl border-slate-200 bg-white/50 shadow-sm focus-visible:ring-indigo-500/50"
              />
              <Button type="button" onClick={handleAddZone} size="icon" className="h-11 w-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex-shrink-0">
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            <div className="rounded-2xl border border-slate-200/60 p-2 max-h-[260px] overflow-y-auto bg-slate-50/50 shadow-inner">
              {zones.length === 0 && (
                <div className="text-sm text-slate-400 font-medium text-center py-6">
                  No zones configured yet.
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                {zones.map((zone, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white border border-slate-100 px-3.5 py-2.5 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all hover:border-slate-200">
                    <span className="text-sm font-medium text-slate-700">{zone}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => handleRemoveZone(zone)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-medium text-slate-600 hover:text-slate-900">Cancel</Button>
          <Button onClick={handleSave} disabled={isLoading || zones.length === 0} className="rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all px-6">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Zones
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
