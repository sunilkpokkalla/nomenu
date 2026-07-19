import { redirect } from "next/navigation";
import Link from "next/link";
import { Link2, Plug, CheckCircle2, ChevronRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getActiveRestaurant } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SquareConnectButton } from "@/components/dashboard/square-connect-button";

export default async function IntegrationsPage(
  props: {
    searchParams: Promise<{ message?: string; success?: string; error?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const restaurant = await getActiveRestaurant(supabase, user.id);

  if (!restaurant) {
    redirect("/dashboard?message=Please%20set%20up%20your%20restaurant%20first");
  }

  const isStripeConnected = !!restaurant.stripe_account_id;
  const isSquareConnected = !!restaurant.square_merchant_id;
  const isPro = restaurant.plan?.toLowerCase() === "pro";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-3">
          <Plug className="h-8 w-8 text-indigo-600" />
          Integrations
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Connect your favorite Point of Sale and payment systems to automatically sync your menus and manage your money.
        </p>
      </div>

      {searchParams.success && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          {searchParams.success}
        </div>
      )}
      {(searchParams.message || searchParams.error) && (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {searchParams.message || searchParams.error}
        </div>
      )}

      <div className="grid gap-6">
        {/* SQUARE POS INTEGRATION */}
        <Card className="overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col justify-center items-center text-center">
              <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
                {/* Square Logo SVG */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#000000"/>
                  <rect x="7" y="7" width="10" height="10" rx="1" fill="#FFFFFF"/>
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Square POS</h3>
              <p className="text-sm text-slate-500 mt-1">Point of Sale & Catalog</p>
            </div>
            
            <div className="md:w-2/3 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900">Menu Synchronization</h4>
                  {isSquareConnected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 uppercase tracking-wide">
                      <CheckCircle2 className="h-3 w-3" /> Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 ring-1 ring-inset ring-slate-500/20 uppercase tracking-wide">
                      Not Connected
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Automatically import your categories, menu items, and prices directly from your Square cash register. Changes in Square will automatically sync to your digital menu.
                </p>
              </div>
              
              <div className="flex items-center justify-end border-t border-slate-100 pt-4 gap-4">
                {!restaurant.plan || restaurant.plan.toLowerCase() === "free" ? (
                  <>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      Requires Pro Plan
                    </span>
                    <Button variant="outline" className="font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50" asChild>
                      <Link href="/dashboard/billing">Upgrade Plan</Link>
                    </Button>
                  </>
                ) : (
                  <SquareConnectButton isConnected={isSquareConnected} />
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* STRIPE INTEGRATION */}
        <Card className="overflow-hidden border-slate-200 shadow-sm opacity-90">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col justify-center items-center text-center">
              <div className="h-16 w-16 bg-[#635BFF] rounded-2xl shadow-sm flex items-center justify-center mb-4">
                <span className="text-white font-black text-2xl">S</span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center justify-center gap-2">
                Stripe Connect
                {isPro && (
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-black text-indigo-700 uppercase tracking-widest ring-1 ring-inset ring-indigo-600/20">
                    Elite
                  </span>
                )}
              </h3>
              <p className="text-sm text-slate-500 mt-1">Payments & Payouts</p>
            </div>
            
            <div className="md:w-2/3 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900">Payment Processing</h4>
                  {isStripeConnected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 uppercase tracking-wide">
                      <CheckCircle2 className="h-3 w-3" /> Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 ring-1 ring-inset ring-slate-500/20 uppercase tracking-wide">
                      Not Connected
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Connect your bank account to receive payouts from customer orders. Stripe securely processes all credit card transactions on your digital menu.
                </p>
              </div>
              
              <div className="flex items-center justify-end border-t border-slate-100 pt-4 gap-4">
                {isPro && (
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Requires Elite Plan</span>
                )}
                <Button variant="outline" className={`font-bold ${isPro ? 'text-slate-400 opacity-50' : 'text-slate-600'}`} disabled={isPro} asChild={!isPro}>
                  {isPro ? (
                    <span className="inline-flex items-center justify-center">
                      Manage in Payouts <ChevronRight className="ml-1 h-4 w-4" />
                    </span>
                  ) : (
                    <Link href="/dashboard/payouts">
                      Manage in Payouts <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
