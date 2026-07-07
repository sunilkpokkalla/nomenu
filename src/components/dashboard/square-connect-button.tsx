"use client";

import { useState } from "react";
import { Loader2, ExternalLink, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SquareConnectButton({ isConnected }: { isConnected: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    // Redirect to our API route which will bounce the user to Square's OAuth page
    window.location.href = "/api/integrations/square/connect";
  };

  const handleDisconnect = async () => {
    if (confirmDisconnect) {
      setIsLoading(true);
      window.location.href = "/api/integrations/square/disconnect";
    } else {
      setConfirmDisconnect(true);
      setTimeout(() => setConfirmDisconnect(false), 4000);
    }
  };

  if (isConnected) {
    return (
      <Button 
        variant="destructive" 
        onClick={handleDisconnect} 
        disabled={isLoading}
        className={`font-bold text-xs ${confirmDisconnect ? 'bg-rose-700 hover:bg-rose-800' : ''}`}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (!confirmDisconnect && <Unplug className="mr-2 h-4 w-4" />)}
        {confirmDisconnect ? "Sure? This stops syncing menus." : "Disconnect Square"}
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleConnect} 
      disabled={isLoading}
      className="bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-sm text-xs"
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />}
      Connect Square Account
    </Button>
  );
}
