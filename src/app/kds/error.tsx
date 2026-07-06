"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function KDSErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if configured
    console.error("KDS Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Display Disconnected</h2>
        <p className="text-slate-400 mb-8">
          The Kitchen Display System encountered an unexpected issue and temporarily stopped working. Your orders are safely backed up in the cloud.
        </p>

        <button
          onClick={() => {
            // Attempt to recover by trying to re-render the segment
            reset();
          }}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl font-medium transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Reconnect & Refresh
        </button>
      </div>
    </div>
  );
}
