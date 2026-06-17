"use client";

import { useState } from "react";
import { generateImpersonationLink } from "../actions";
import { UserCircle, Loader2, AlertCircle } from "lucide-react";

export function ImpersonateButton({ userId, restaurantName }: { userId: string, restaurantName: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAndRedirect = async () => {
    if (!confirm(`WARNING: You are about to log in as ${restaurantName}. This will replace your current Admin session. You will need to log back in as an Admin later.\n\nProceed?`)) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const actionLink = await generateImpersonationLink(userId, origin);
      // Immediately redirect the user to the magic link.
      // Supabase will log them in and redirect them to /dashboard
      window.location.href = actionLink;
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to generate link");
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleGenerateAndRedirect}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-md transition-colors disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCircle className="w-3.5 h-3.5" />}
        Impersonate
      </button>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3 z-50">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
          <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-300">&times;</button>
        </div>
      )}
    </>
  );
}
