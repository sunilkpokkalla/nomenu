"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function SubscriptionButton({ 
  planId, 
  planName, 
  isElite,
  isAnnual = false
}: { 
  planId: string; 
  planName: string; 
  isElite: boolean;
  isAnnual?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // Trigger Meta Pixel InitiateCheckout event
      if (typeof window !== 'undefined' && ('fbq' in window)) {
        // @ts-expect-error - fbq is injected dynamically by Meta Pixel
        window.fbq('track', 'InitiateCheckout', {
          content_name: planName,
        });
      }

      const res = await fetch("/api/stripe/subscription-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          isAnnual
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to initialize checkout.");
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to checkout. Please try again.");
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
      {loading ? "Preparing Checkout..." : (isElite && isAnnual) ? "Get Started" : `Upgrade to ${planName}`}
    </button>
  );
}

export function PortalButton({ 
  text = "Manage Subscription", 
  variant = "default",
  isElite = false
}: { 
  text?: string; 
  variant?: "default" | "card";
  isElite?: boolean;
} = {}) {
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

  if (variant === "card") {
    return (
      <button
        onClick={handlePortal}
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
        {loading ? "Redirecting..." : text}
      </button>
    );
  }

  return (
    <button 
      onClick={handlePortal} 
      disabled={loading}
      className="flex items-center justify-center gap-2 text-sm font-bold bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-xl shadow-sm hover:bg-slate-50 transition-all hover:scale-[1.02]"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? "Loading..." : text}
    </button>
  );
}
