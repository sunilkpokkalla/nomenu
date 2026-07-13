"use client";

import { ExternalLink } from "lucide-react";

export function FeedbackPopoutButton() {
  return (
    <button
      onClick={() => window.open('/live-feedback', '_blank')}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
    >
      <ExternalLink className="w-4 h-4" />
      Pop-out Feedback
    </button>
  );
}
