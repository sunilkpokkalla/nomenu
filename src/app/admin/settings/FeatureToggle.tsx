"use client";

import { Switch } from "@/components/ui/switch";
import { toggleFeatureFlag } from "./actions";
import { useTransition } from "react";

export function FeatureToggle({ restaurantId, flagName, isEnabled }: { restaurantId: string, flagName: string, isEnabled: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    startTransition(() => {
      toggleFeatureFlag(restaurantId, flagName, checked);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch 
        checked={isEnabled} 
        onCheckedChange={handleToggle} 
        disabled={isPending}
      />
      <span className="text-sm font-medium text-slate-700">{flagName}</span>
    </div>
  );
}
