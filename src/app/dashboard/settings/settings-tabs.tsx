"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SettingsTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: "General", href: "/dashboard/settings" },
    { name: "Team & Staff", href: "/dashboard/settings/team" },
  ];

  return (
    <div className="mb-6">
      <nav 
        className="bg-slate-100 p-1 rounded-xl h-auto inline-flex w-full sm:w-auto" 
        aria-label="Tabs"
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "rounded-lg py-1.5 px-4 font-semibold flex items-center gap-2 flex-1 sm:flex-none justify-center text-sm transition-all",
                isActive
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
