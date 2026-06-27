"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SettingsTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: "General", href: "/dashboard/settings" },
    { name: "Team & Staff", href: "/dashboard/settings/team" },
  ];

  return (
    <div className="border-b border-slate-200">
      <nav className="-mb-px flex gap-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                whitespace-nowrap border-b-2 py-3 px-1 text-sm font-semibold transition-colors
                ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }
              `}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
