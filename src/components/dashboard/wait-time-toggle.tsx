"use client";

import { useState, useTransition } from "react";
import { updateRestaurantWaitTime } from "@/app/dashboard/actions";
import { Clock, Loader2 } from "lucide-react";

export function WaitTimeToggle({ restaurantId, initialStatus = "normal" }: { restaurantId: string, initialStatus?: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(initialStatus);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    startTransition(async () => {
      const res = await updateRestaurantWaitTime(restaurantId, newStatus);
      if (!res.success) {
        setStatus(status); // Revert on failure
        alert("Failed to update wait time: " + res.error);
      }
    });
  };

  return (
    <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 pl-2 text-slate-500">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
        <span className="text-sm font-semibold whitespace-nowrap hidden sm:inline-block">Wait Time:</span>
      </div>
      
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => handleStatusChange("normal")}
          disabled={isPending}
          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all active:scale-95 duration-200 ${
            status === "normal" 
              ? "bg-white text-emerald-600 shadow-md ring-1 ring-black/5" 
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          Normal (10-15m)
        </button>
        <button
          onClick={() => handleStatusChange("busy")}
          disabled={isPending}
          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all active:scale-95 duration-200 ${
            status === "busy" 
              ? "bg-white text-amber-600 shadow-md ring-1 ring-black/5" 
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          Busy (25-35m)
        </button>
        <button
          onClick={() => handleStatusChange("slammed")}
          disabled={isPending}
          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all active:scale-95 duration-200 ${
            status === "slammed" 
              ? "bg-white text-rose-600 shadow-md ring-1 ring-black/5" 
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          Slammed (45m+)
        </button>
      </div>
    </div>
  );
}
