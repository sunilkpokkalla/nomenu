import Link from "next/link";
import {
  BarChart3,
  CreditCard,
  Home,
  Menu,
  Palette,
  MessageSquare,
  QrCode,
  Settings,
  ShoppingBag,
  Utensils,
  Banknote,
} from "lucide-react";

import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/menus", label: "My Menus", icon: Menu },
  { href: "/dashboard/items", label: "Menu Items", icon: Utensils },
  { href: "/dashboard/qrcodes", label: "QR Codes", icon: QrCode },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag, badge: "ELITE" },
  { href: "/dashboard/feedback", label: "Feedback", icon: MessageSquare, badge: "PRO" },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, badge: "PRO" },
  { href: "/dashboard/customize", label: "Customize", icon: Palette, badge: "PRO" },
  { href: "/dashboard/payouts", label: "Payouts", icon: Banknote, badge: "ENT." },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r bg-white px-4 py-5 lg:flex lg:flex-col">
      <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
          <QrCode className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold leading-tight">NoMenu</p>
          <p className="text-xs text-muted-foreground">Restaurant console</p>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-2 mt-6">
        <div className="px-3 mb-2">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Main Menu</p>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-slate-550 transition-all duration-200 ease-in-out hover:bg-slate-100/80 hover:text-slate-950 hover:translate-x-1"
            >
              <div className="flex items-center gap-3.5">
                <Icon className="h-4 w-4" />
                {item.label}
              </div>
              {item.badge && (
                <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-indigo-600 shadow-sm border border-indigo-100/50">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-slate-100">
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 font-semibold rounded-xl">
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
