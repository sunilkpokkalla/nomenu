"use client";

import { useState } from "react";
import { generateImpersonationOtp } from "../impersonate-action";
import { UserCircle, Loader2, AlertCircle, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ImpersonateButton({ userId, restaurantName }: { userId: string, restaurantName: string }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImpersonate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await generateImpersonationOtp(userId);
      
      if (!res.success || !res.email || !res.otp) {
        throw new Error(res.error || "Failed to generate link");
      }

      const { email, otp } = res;

      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: otp,
        type: 'magiclink'
      });

      if (verifyError) throw verifyError;

      // Successfully logged in locally, redirect to dashboard
      window.location.href = '/dashboard';
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to generate link");
      setIsLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-md transition-colors disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCircle className="w-3.5 h-3.5" />}
        Impersonate
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-left">
              <div className="flex items-center gap-4 text-amber-500 mb-4">
                <div className="bg-amber-500/10 p-3 rounded-full">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">Impersonation Warning</h3>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed whitespace-normal">
                You are about to securely log in as <strong className="text-white">{restaurantName}</strong>.
              </p>
              <div className="mt-4 bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                 <p className="text-neutral-400 text-xs leading-relaxed whitespace-normal">
                  This action will <span className="text-amber-400 font-medium">replace your current Admin session</span> in this browser tab. You will need to log back in as a Super Admin later if you wish to return here.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-neutral-950 border-t border-neutral-800">
              <button
                onClick={() => setShowModal(false)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImpersonate}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Yes, Impersonate
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3 z-50 text-left">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm whitespace-normal">{error}</span>
          <button onClick={() => setError(null)} className="ml-2 shrink-0 text-red-400 hover:text-red-300">&times;</button>
        </div>
      )}
    </>
  );
}
