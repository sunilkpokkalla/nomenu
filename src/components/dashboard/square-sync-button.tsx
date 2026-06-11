"use client";

import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SquareSyncButton({ targetMenuId, isConnected }: { targetMenuId: string, isConnected: boolean }) {
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isConnected) return null;

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/integrations/square/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetMenuId }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || "Failed to sync with Square");
      } else {
        alert(data.message || "Successfully synced with Square!");
        window.location.reload(); // Reload to show new items
      }
    } catch (error) {
      alert("Network error while syncing with Square");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleSync} 
      disabled={isSyncing}
      className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
      title="Sync catalog from Square POS"
    >
      {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
      <span className="hidden sm:inline">Sync Square</span>
    </Button>
  );
}
