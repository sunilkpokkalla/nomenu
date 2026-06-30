"use client";

import { ExternalLink, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuType {
  slug: string;
  name: string;
  is_active: boolean;
}

export function AdminMenuDropdown({
  restaurantSlug,
  menus,
}: {
  restaurantSlug: string;
  menus: MenuType[] | null;
}) {
  const activeMenus = (menus || []).filter((m) => m.is_active && m.slug);

  if (activeMenus.length <= 1) {
    // If 0 or 1 active menu, just link to the root which auto-redirects or shows empty
    return (
      <a
        href={`/${restaurantSlug}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-md transition-colors shadow-sm"
        title="View Live Menu"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        View Menu
      </a>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-md transition-colors shadow-sm outline-none">
        <ExternalLink className="w-3.5 h-3.5" />
        View Menus
        <ChevronDown className="w-3 h-3 ml-0.5 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white border-slate-200 text-slate-700 shadow-lg rounded-xl p-1">
        <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Active Menus ({activeMenus.length})
        </div>
        {activeMenus.map((menu) => (
          <DropdownMenuItem key={menu.slug} asChild>
            <a
              href={`/${restaurantSlug}/${menu.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center cursor-pointer text-xs focus:bg-slate-100 focus:text-slate-900 rounded-md"
            >
              {menu.name}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
