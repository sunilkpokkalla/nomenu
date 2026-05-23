import Link from "next/link";
import {
  BarChart3,
  CreditCard,
  Home,
  Menu,
  Palette,
  QrCode,
  Settings,
  Utensils,
} from "lucide-react";

import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/menus", label: "My Menus", icon: Menu },
  { href: "/dashboard/items", label: "Menu Items", icon: Utensils },
  { href: "/dashboard/qrcodes", label: "QR Codes", icon: QrCode },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/customize", label: "Customize", icon: Palette },
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

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logout}>
        <Button variant="outline" className="w-full">
          Sign out
        </Button>
      </form>
    </aside>
  );
}
