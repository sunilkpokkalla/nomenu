"use client";

import { useState } from "react";
import { Search, Loader2, Copy, Check } from "lucide-react";
import { scrapeEmailAction } from "../scraper-actions";

export function EmailScraper() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ emails?: string[]; error?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setResult(null);
    setCopied(false);
    
    try {
      const res = await scrapeEmailAction(url);
      setResult(res);
    } catch (err: unknown) {
      setResult({ error: "Failed to run scraper" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.emails && result.emails.length > 0) {
      navigator.clipboard.writeText(result.emails.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
        <Search className="w-5 h-5 text-indigo-600" />
        Website Lead Scraper
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        Paste a restaurant's website URL to automatically find public email addresses for outbound campaigns.
      </p>

      <form onSubmit={handleScrape} className="flex gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g. https://bobsburgers.com"
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Scrape Emails
        </button>
      </form>

      {result && (
        <div className={`mt-6 p-4 rounded-lg border ${result.error || (result.emails && result.emails.length === 0) ? 'bg-red-50 border-red-100 text-red-800' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
          {result.error ? (
            <p className="font-medium text-sm">{result.error}</p>
          ) : result.emails && result.emails.length === 0 ? (
            <p className="font-medium text-sm">No emails found on this website.</p>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">Found {result.emails?.length} email(s):</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-900 rounded-md transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy All"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.emails?.map((email, idx) => (
                  <span key={idx} className="bg-white px-3 py-1 rounded-md shadow-sm border border-emerald-100 font-mono text-xs">
                    {email}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
