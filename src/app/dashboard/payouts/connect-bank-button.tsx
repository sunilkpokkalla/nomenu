"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export function ConnectBankButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to generate connect link");
      }
    } catch (err: unknown) {
      console.error(err);
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
        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#635BFF] px-8 py-4 text-sm font-bold text-white shadow-sm hover:bg-[#4B45D6] transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Connect with Stripe"}
        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
