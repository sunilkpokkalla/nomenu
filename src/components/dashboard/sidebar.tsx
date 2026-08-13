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
  Plug,
  Gift,
  Wallet,
} from "lucide-react";

import { UserRole } from "@/lib/rbac";

export const getNavItems = (role: UserRole) => {
  const items = [
    // Overview
    { href: "/dashboard", label: "Dashboard", icon: Home, roles: ["owner", "manager"] as UserRole[] },
    
    // Menu Content
    { href: "/dashboard/menus", label: "My Menus", icon: Menu, roles: ["owner", "manager"] as UserRole[] },
    { href: "/dashboard/items", label: "Menu Items", icon: Utensils, roles: ["owner", "manager"] as UserRole[] },
    { href: "/dashboard/customize", label: "Customize", icon: Palette, badge: "PRO", openToAll: true, roles: ["owner", "manager"] as UserRole[] },
    
    // Distribution
    { href: "/dashboard/qrcodes", label: "QR Codes", icon: QrCode, roles: ["owner", "manager"] as UserRole[] },
    
    // Operations & Insights
    { href: "/dashboard/cashier", label: "Front of House", icon: Wallet, badge: "PRO", roles: ["owner", "manager", "waitstaff", "kitchen_waitstaff"] as UserRole[] },
    { href: "/dashboard/orders", label: "Priority Dine-In", icon: ShoppingBag, badge: "ELITE", roles: ["owner", "manager", "waitstaff", "kitchen", "kitchen_waitstaff"] as UserRole[] },
    { href: "/dashboard/takeaway", label: "Takeaway", icon: ShoppingBag, badge: "ENT.", roles: ["owner", "manager", "waitstaff", "kitchen", "kitchen_waitstaff"] as UserRole[] },
    { href: "/dashboard/reservations", label: "Priority Reserves", icon: Clock, badge: "ENT.", roles: ["owner", "manager", "waitstaff", "kitchen", "kitchen_waitstaff"] as UserRole[] },
    { href: "/dashboard/payouts", label: "Payouts", icon: Banknote, badge: "ELITE", roles: ["owner"] as UserRole[] },
    { href: "/dashboard/feedback", label: "Feedback", icon: MessageSquare, badge: "PRO", openToAll: true, roles: ["owner", "manager"] as UserRole[] },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, badge: "PRO", roles: ["owner", "manager"] as UserRole[] },
    
    // Account
    { href: "/dashboard/integrations", label: "Integrations", icon: Plug, badge: "PRO", roles: ["owner"] as UserRole[] },
    { href: "/dashboard/referrals", label: "Refer & Earn", icon: Gift, badge: "PRO", roles: ["owner"] as UserRole[] },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["owner"] as UserRole[] },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard, roles: ["owner"] as UserRole[] },
  ];

  return items.filter(item => item.roles.includes(role));
};

export function Sidebar({ plan = "Free", role = "owner", createdAt }: { plan?: string, role?: UserRole, createdAt?: string | null }) {
  const pathname = usePathname();
  
  const planLevels: Record<string, number> = {
    free: 0,
    pro: 1,
    elite: 2,
    enterprise: 3,
  };
  const userLevel = planLevels[plan.toLowerCase()] ?? 0;

  const isTrial = createdAt ? new Date(createdAt).getTime() + 24 * 60 * 60 * 1000 > Date.now() : false;

  const allowedNavItems = getNavItems(role);

  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-200/50 bg-[#fafafa] px-4 py-6 lg:flex lg:flex-col">
      <Link href="/dashboard" className="mb-6 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
          <QrCode className="h-4.5 w-4.5" strokeWidth={2.0} />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-slate-950 font-display">NoMenu</p>
          <p className="text-[10px] text-slate-400 font-mono">Restaurant console</p>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1.5 mt-6">
        <div className="px-3 mb-2">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">Main Menu</p>
        </div>
        {allowedNavItems.map((item) => {
          const Icon = item.icon;
          const requiredLevel = (item.badge === "ENT." || item.badge === "ENTERPRISE") ? 3 : item.badge === "ELITE" ? 2 : item.badge === "PRO" ? 1 : 0;
          const isLocked = !isTrial && userLevel < requiredLevel && !item.openToAll;
          const isOpenPreview = !isTrial && userLevel < requiredLevel && !!item.openToAll;

          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ease-in-out active:scale-[0.98] ${
                isActive
                  ? "bg-slate-950 text-white shadow-sm"
                  : isLocked
                    ? "opacity-60 grayscale hover:text-slate-950 text-slate-500"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-900/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" strokeWidth={isActive ? 2.0 : 1.5} />
                <span>{item.label}</span>
              </div>
              {isLocked && item.badge && (
                <span className="rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide bg-slate-100 text-slate-450 border border-slate-200/60 whitespace-nowrap shrink-0 font-mono">
                  {item.badge}
                </span>
              )}
              {isTrial && userLevel < requiredLevel && item.badge && (
                <span className="rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200/50 animate-pulse whitespace-nowrap shrink-0 font-mono">
                  {item.badge}
                </span>
              )}
              {isOpenPreview && item.badge && (
                <span className="rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap shrink-0 font-mono">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
