"use client";

import { useState } from "react";
import { generateImpersonationLink } from "../actions";
import { UserCircle, Loader2, AlertCircle, Copy, CheckCircle2 } from "lucide-react";

export function ImpersonateButton({ userId, restaurantName }: { userId: string, restaurantName: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const actionLink = await generateImpersonationLink(userId);
      setLink(actionLink);
    } catch (e: unknown) {
      setError((e as Error).message || "Failed to generate link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-md transition-colors disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCircle className="w-3.5 h-3.5" />}
        Impersonate
      </button>

      {link && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-lg w-full shadow-2xl relative">
            <h3 className="text-lg font-medium text-white mb-2">Impersonate: {restaurantName}</h3>
            <p className="text-sm text-neutral-400 mb-6">
              A temporary magic login link has been generated. 
              <br/><br/>
              <span className="text-amber-500 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                IMPORTANT: Do NOT click this normally or you will lose your Admin session.
              </span>
            </p>
            
            <div className="bg-black border border-neutral-800 rounded-lg p-3 flex items-center justify-between mb-6">
              <span className="text-xs text-neutral-300 font-mono truncate mr-4">
                {link}
              </span>
              <button 
                onClick={handleCopy}
                className="shrink-0 p-2 hover:bg-neutral-800 rounded-md transition-colors text-white"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <button 
                onClick={() => setLink(null)}
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Close
              </button>
              
              <a 
                href={link}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
                onClick={(e) => {
                  alert("Please Right-Click and open in Incognito/Private Window!");
                  e.preventDefault();
                }}
              >
                Right-Click → Open Incognito
              </a>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
          <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-300">&times;</button>
        </div>
      )}
    </>
  );
}
