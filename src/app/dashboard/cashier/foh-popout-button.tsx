"use client";

import { ExternalLink } from "lucide-react";

export function FohPopoutButton() {
  return (
    <button
      onClick={() => window.open('/foh', 'FOH', 'width=1280,height=800,menubar=no,toolbar=no')}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
    >
      <ExternalLink className="w-4 h-4" />
      Pop-out FOH
    </button>
  );
}
