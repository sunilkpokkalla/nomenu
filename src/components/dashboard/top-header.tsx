"use client";

import Link from "next/link";
import { HelpCircle, LogOut, LifeBuoy } from "lucide-react";
import { logout } from "@/app/auth/actions";

export function TopHeader() {
  return (
    <div className="hidden lg:flex w-full h-16 border-b border-amber-900/10 bg-[#fdfbf7]/80 backdrop-blur-md items-center justify-end px-8 sticky top-0 z-20 gap-4 shadow-[0_1px_5px_rgba(0,0,0,0.01)]">
      <Link
        href="/dashboard/support"
        className="flex items-center gap-2 text-indigo-600 hover:text-white hover:bg-indigo-600 bg-indigo-50/50 px-4 py-2 rounded-xl font-semibold transition-all duration-300 border border-indigo-200/60 shadow-[0_2px_6px_rgba(0,0,0,0.02)] text-xs uppercase tracking-wider font-mono active:scale-[0.97]"
      >
        <LifeBuoy className="w-4 h-4 transition-transform duration-300 hover:rotate-45" strokeWidth={2.0} />
        Support
      </Link>

      <Link
        href="/dashboard/manual"
        className="flex items-center gap-2 text-indigo-950 hover:text-indigo-600 hover:bg-indigo-50/20 bg-white/60 px-4 py-2 rounded-xl font-semibold transition-all duration-300 border border-amber-900/10 shadow-[0_2px_6px_rgba(0,0,0,0.02)] text-xs uppercase tracking-wider font-mono active:scale-[0.97]"
      >
        <HelpCircle className="w-4 h-4" strokeWidth={2.0} />
        User Manual
      </Link>

      <div className="h-5 w-px bg-amber-900/15 mx-1"></div>

      <form action={logout}>
        <button type="submit" className="flex items-center gap-2 text-slate-500 hover:text-indigo-950 hover:translate-x-0.5 px-4 py-2 text-[13px] font-semibold transition-all duration-300 active:scale-[0.97]">
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          Sign out
        </button>
      </form>
    </div>
  );
}
