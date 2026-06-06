"use client";

import Link from "next/link";
import { HelpCircle } from "lucide-react";

export function TopHeader() {
  return (
    <div className="hidden lg:flex w-full h-16 border-b border-slate-200 bg-white items-center justify-end px-8 sticky top-0 z-20">
      <Link
        href="/dashboard/manual"
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl font-bold transition-colors border border-slate-200 shadow-sm text-sm"
      >
        <HelpCircle className="w-4 h-4" />
        User Manual
      </Link>
    </div>
  );
}
