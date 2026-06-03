"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function MenuError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Client-side menu error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6 font-sans">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-rose-100 text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-2 shadow-inner">
          <AlertCircle className="w-10 h-10" />
        </div>
        
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Oops, something went wrong!</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            We encountered an unexpected error while loading the menu.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left overflow-hidden">
          <p className="text-xs font-mono text-slate-600 break-words">
            {error.message || "Unknown client-side exception"}
          </p>
        </div>

        <button
          onClick={() => reset()}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg active:scale-[0.98]"
        >
          <RotateCcw className="w-5 h-5" />
          Try Again
        </button>
      </div>
    </div>
  );
}
