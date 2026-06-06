"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, QrCode, HelpCircle } from "lucide-react";
import { navItems } from "@/components/dashboard/sidebar";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export function MobileNav({ plan = "Free" }: { plan?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const planLevels: Record<string, number> = {
    free: 0,
    pro: 1,
    elite: 2,
    enterprise: 3,
  };
  const userLevel = planLevels[plan.toLowerCase()] ?? 0;

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <QrCode className="h-4 w-4" />
          </span>
          <span className="font-bold">NoMenu</span>
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation"
          className="rounded-lg border p-2 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 w-3/4 max-w-xs bg-white p-6 shadow-xl flex flex-col overflow-y-auto animate-in slide-in-from-right-full duration-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
                  <QrCode className="h-4 w-4" />
                </div>
                <span className="font-bold text-lg">NoMenu</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-2">
              <div className="px-1 mb-2">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Main Menu</p>
              </div>
              
              {navItems.map((item) => {
                const Icon = item.icon;
                const requiredLevel = item.badge === "ENT." ? 3 : item.badge === "ELITE" ? 2 : item.badge === "PRO" ? 1 : 0;
                const isLocked = userLevel < requiredLevel;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (!isLocked) setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-colors duration-200 ease-in-out hover:bg-slate-100 ${
                      pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href))
                        ? "bg-slate-100 text-primary"
                        : isLocked 
                          ? "opacity-60 grayscale hover:text-slate-600 text-slate-500" 
                          : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </div>
                    {item.badge && (
                      <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm border ${
                        isLocked 
                          ? "bg-slate-100 text-slate-400 border-slate-200" 
                          : "bg-indigo-50 text-indigo-600 border-indigo-100/50"
                      }`}>
                        {isLocked ? "🔒 " : ""}{item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <Link
                href="/dashboard/manual"
                onClick={() => setIsOpen(false)}
                className="w-full mt-4 flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-colors duration-200 ease-in-out hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 bg-slate-50"
              >
                <div className="flex items-center gap-3.5">
                  <HelpCircle className="h-4 w-4" />
                  User Manual
                </div>
              </Link>
            </nav>

            <div className="mt-8">
              <form action={logout}>
                <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                  <span className="flex items-center gap-3">
                    <span className="h-4 w-4" />
                    Log Out
                  </span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
