"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function SubscriptionButton({ 
  planId, 
  planName, 
  isElite 
}: { 
  planId: string; 
  planName: string; 
  isElite: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stripe/subscription-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to initiate checkout");
      }
    } catch (error: unknown) {
      console.error(error);
      alert(`Checkout failed: ${(error as Error).message || "Unknown error occurred"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`w-full py-4 rounded-xl text-sm font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2
        ${isElite 
          ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10 hover:bg-black hover:scale-[1.02]" 
          : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
        }
        ${loading ? "opacity-70 pointer-events-none" : ""}
      `}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? "Redirecting..." : `Upgrade to ${planName}`}
    </button>
  );
}

export function PortalButton() {
  const [loading, setLoading] = useState(false);

  const handlePortal = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stripe/create-portal", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to open portal");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to open billing portal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePortal} 
      disabled={loading}
      className="flex items-center justify-center gap-2 text-sm font-bold bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-xl shadow-sm hover:bg-slate-50 transition-all hover:scale-[1.02]"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? "Loading..." : "Manage Subscription"}
    </button>
  );
}
