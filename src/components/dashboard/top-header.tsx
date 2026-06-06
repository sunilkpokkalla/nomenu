"use client";

import Link from "next/link";
import { HelpCircle, LogOut, LifeBuoy } from "lucide-react";
import { logout } from "@/app/auth/actions";

export function TopHeader() {
  return (
    <div className="hidden lg:flex w-full h-16 border-b border-slate-200 bg-white items-center justify-end px-8 sticky top-0 z-20 gap-4">
      <Link
        href="/dashboard/support"
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl font-bold transition-colors border border-indigo-100 shadow-sm text-sm"
      >
        <LifeBuoy className="w-4 h-4" />
        Support
      </Link>

      <Link
        href="/dashboard/manual"
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl font-bold transition-colors border border-slate-200 shadow-sm text-sm"
      >
        <HelpCircle className="w-4 h-4" />
        User Manual
      </Link>

      <div className="h-6 w-px bg-slate-200 mx-2"></div>

      <form action={logout}>
        <button type="submit" className="flex items-center gap-2 text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 px-4 py-2 rounded-xl font-bold transition-colors border border-transparent hover:border-red-100 text-sm">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </form>
    </div>
  );
}
