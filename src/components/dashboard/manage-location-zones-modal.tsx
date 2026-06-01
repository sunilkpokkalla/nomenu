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
        <Button variant="outline" size="sm" className="gap-2">
          <MapPin className="h-4 w-4" />
          Manage Zones
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Location Zones</DialogTitle>
          <DialogDescription>
            Add or remove zones (e.g. Patio, Bar) to organize your QR codes cleanly without typos.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="e.g. Rooftop, VIP Lounge" 
              value={newZone}
              onChange={(e) => setNewZone(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddZone();
                }
              }}
            />
            <Button type="button" onClick={handleAddZone} size="icon" variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="border rounded-md p-3 space-y-2 max-h-[250px] overflow-y-auto bg-slate-50">
            {zones.length === 0 && (
              <div className="text-sm text-slate-500 text-center py-2">
                No zones added. Add at least one zone above.
              </div>
            )}
            {zones.map((zone, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white border px-3 py-2 rounded-md shadow-sm">
                <span className="text-sm font-medium">{zone}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-slate-400 hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveZone(zone)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isLoading || zones.length === 0}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Zones
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
