"use client";

import { useState } from "react";
import { Loader2, ExternalLink, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SquareConnectButton({ isConnected }: { isConnected: boolean }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    // Redirect to our API route which will bounce the user to Square's OAuth page
    window.location.href = "/api/integrations/square/connect";
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Square? Your menus will stop syncing automatically.")) return;
    
    setIsLoading(true);
    // Hit the disconnect API route which will clear the token and redirect back
    window.location.href = "/api/integrations/square/disconnect";
  };

  if (isConnected) {
    return (
      <Button 
        variant="destructive" 
        onClick={handleDisconnect} 
        disabled={isLoading}
        className="font-bold text-xs"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Unplug className="mr-2 h-4 w-4" />}
        Disconnect Square
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
