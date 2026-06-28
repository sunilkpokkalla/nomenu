"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Clock,
  Utensils,
  Banknote,
  LifeBuoy,
  BookOpen,
  Plug,
  Gift,
} from "lucide-react";

import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/rbac";

export const getNavItems = (role: UserRole) => {
  const items = [
    // Overview
    { href: "/dashboard", label: "Dashboard", icon: Home, roles: ["owner", "manager"] as UserRole[] },
    
    // Menu Content
    { href: "/dashboard/menus", label: "My Menus", icon: Menu, roles: ["owner", "manager"] as UserRole[] },
    { href: "/dashboard/items", label: "Menu Items", icon: Utensils, roles: ["owner", "manager"] as UserRole[] },
    { href: "/dashboard/customize", label: "Customize", icon: Palette, badge: "PRO", roles: ["owner", "manager"] as UserRole[] },
    
    // Distribution
    { href: "/dashboard/qrcodes", label: "QR Codes", icon: QrCode, roles: ["owner", "manager"] as UserRole[] },
    
    // Operations & Insights
    { href: "/dashboard/orders", label: "Dine-In Orders", icon: ShoppingBag, badge: "ELITE", roles: ["owner", "manager", "kitchen", "waitstaff"] as UserRole[] },
    { href: "/dashboard/takeaway", label: "Pickup & Reserve", icon: Clock, badge: "ENT.", roles: ["owner", "manager", "waitstaff"] as UserRole[] },
    { href: "/dashboard/payouts", label: "Payouts", icon: Banknote, badge: "ENT.", roles: ["owner"] as UserRole[] },
    { href: "/dashboard/feedback", label: "Feedback", icon: MessageSquare, badge: "PRO", roles: ["owner", "manager"] as UserRole[] },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, badge: "PRO", roles: ["owner", "manager"] as UserRole[] },
    
    // Account
    { href: "/dashboard/integrations", label: "Integrations", icon: Plug, badge: "PRO", roles: ["owner"] as UserRole[] },
    { href: "/dashboard/referrals", label: "Refer & Earn", icon: Gift, roles: ["owner"] as UserRole[] },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["owner"] as UserRole[] },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard, roles: ["owner"] as UserRole[] },
  ];

  return items.filter(item => item.roles.includes(role));
};

export function Sidebar({ plan = "Free", role = "owner" }: { plan?: string, role?: UserRole }) {
  const pathname = usePathname();
  
  const planLevels: Record<string, number> = {
    free: 0,
    pro: 1,
    elite: 2,
    enterprise: 3,
  };
  const userLevel = planLevels[plan.toLowerCase()] ?? 0;

  const allowedNavItems = getNavItems(role);

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
        {allowedNavItems.map((item) => {
          const Icon = item.icon;
          const requiredLevel = (item.badge === "ENT." || item.badge === "ENTERPRISE") ? 3 : item.badge === "ELITE" ? 2 : item.badge === "PRO" ? 1 : 0;
          const isLocked = userLevel < requiredLevel;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ease-in-out hover:bg-slate-100 active:scale-[0.98] ${
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
              {isLocked && item.badge && (
                <span className="rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm border bg-slate-100 text-slate-400 border-slate-200">
                  🔒 {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
