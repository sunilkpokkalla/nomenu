"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export function ConnectBankButton({ isAlreadyConnected }: { isAlreadyConnected?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);

    // Open a blank window synchronously to bypass aggressive popup blockers
    const newWindow = window.open("about:blank", "_blank");

    try {
      const returnPath = window.location.pathname;
      const res = await fetch(`/api/stripe/connect?returnPath=${encodeURIComponent(returnPath)}`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.url) {
        // Redirect the newly opened tab to Stripe
        if (newWindow) {
          newWindow.location.href = data.url;
        } else {
          // Fallback if popup was blocked completely
          window.location.href = data.url;
        }
      } else {
        if (newWindow) newWindow.close();
        throw new Error(data.error || "Failed to generate connect link");
      }
    } catch (err: unknown) {
      console.error(err);
      if (newWindow) newWindow.close();
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className={`group inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold text-white shadow-sm transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 ${isAlreadyConnected ? 'bg-slate-900 hover:bg-slate-800' : 'bg-[#635BFF] hover:bg-[#4B45D6]'}`}
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAlreadyConnected ? "View Stripe Dashboard" : "Connect with Stripe")}
        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
