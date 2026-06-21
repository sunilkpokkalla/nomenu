"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { sendMarketingEmailAction } from "../actions";

export function MarketingButton() {
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count?: number; message?: string } | null>(null);

  const handleSend = async () => {
    const confirmSend = window.confirm("Are you sure you want to email ALL free tier users?");
    if (!confirmSend) return;

    setIsSending(true);
    setResult(null);

    try {
      const res = await sendMarketingEmailAction();
      setResult(res);
    } catch (err: unknown) {
      setResult({ success: false, message: err instanceof Error ? err.message : "Failed to send emails" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div>
        <h3 className="text-lg font-medium text-indigo-400 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Marketing Blast
        </h3>
        <p className="text-sm text-neutral-400 mt-1">
          Send an email to all active Free Tier users to encourage them to upgrade and unlock premium features.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {result && (
          <div className={`text-sm flex items-center gap-1.5 font-medium ${result.success ? "text-emerald-400" : "text-red-400"}`}>
            {result.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {result.message}
          </div>
        )}
        
        <button
          onClick={handleSend}
          disabled={isSending}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send to Free Tier
            </>
          )}
        </button>
      </div>
    </div>
  );
}
