"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global crash caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-sans">
          <div className="bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-rose-900/50 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="w-10 h-10" />
            </div>
            
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">System Error</h2>
              <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                A critical application error occurred. We've automatically logged the issue.
              </p>
            </div>

            <button
              onClick={() => reset()}
              className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors shadow-lg active:scale-[0.98]"
            >
              <RefreshCcw className="w-5 h-5" />
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
