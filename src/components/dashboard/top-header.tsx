"use client";

import Link from "next/link";
import { HelpCircle, LogOut, LifeBuoy } from "lucide-react";
import { logout } from "@/app/auth/actions";

export function TopHeader() {
  return (
    <div className="hidden lg:flex w-full h-16 border-b border-slate-200/40 bg-white/75 backdrop-blur-md items-center justify-end px-8 sticky top-0 z-20 gap-4">
      <Link
        href="/dashboard/support"
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/40 bg-transparent px-4 py-2 rounded-xl font-medium transition-colors border border-indigo-200/40 shadow-[0_2px_6px_rgba(0,0,0,0.01)] text-xs uppercase tracking-wider font-mono active:scale-[0.98]"
      >
        <LifeBuoy className="w-4 h-4" strokeWidth={2.0} />
        Support
      </Link>

      <Link
        href="/dashboard/manual"
        className="flex items-center gap-2 text-slate-655 hover:text-slate-950 hover:bg-slate-50 bg-white px-4 py-2 rounded-xl font-medium transition-colors border border-slate-200/50 shadow-[0_2px_6px_rgba(0,0,0,0.01)] text-xs uppercase tracking-wider font-mono active:scale-[0.98]"
      >
        <HelpCircle className="w-4 h-4" strokeWidth={2.0} />
        User Manual
      </Link>

      <div className="h-5 w-px bg-slate-200/60 mx-1"></div>

      <form action={logout}>
        <button type="submit" className="flex items-center gap-2 text-slate-500 hover:text-slate-950 px-4 py-2 text-[13px] font-medium transition-colors active:scale-[0.98]">
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          Sign out
        </button>
      </form>
    </div>
  );
}
