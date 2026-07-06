"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function OrdersErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if configured
    console.error("Orders Dashboard Error Caught:", error);
  }, [error]);

  return (
    <div className="h-full min-h-[500px] w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Display Disconnected</h2>
        <p className="text-slate-500 mb-8">
          The Orders Dashboard encountered an unexpected issue. Your orders are safely backed up in the cloud, but the display needs to be reloaded.
        </p>

        <button
          onClick={() => {
            // Attempt to recover by trying to re-render the segment
            reset();
          }}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-medium transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Reload Dashboard
        </button>
      </div>
    </div>
  );
}
