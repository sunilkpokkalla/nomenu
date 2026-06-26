import { redirect } from "next/navigation";
import Link from "next/link";
import { Copy, DollarSign, Users, ExternalLink, Activity, LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { getAffiliatePayout } from "@/lib/affiliate";
import { ClientCopyButton } from "./client-copy-button";

export const dynamic = "force-dynamic";

export default async function PartnerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/partners/login?next=/partners/dashboard");
  }

  // Verify they are an affiliate
  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (!affiliate) {
    // If they aren't an affiliate, maybe they are a restaurant owner?
    redirect("/dashboard");
  }

  // Get referred restaurants
  const { data: referredRestaurants } = await supabase
    .from("restaurants")
    .select("id, name, created_at, plan, billing_cycle")
    .eq("referred_by_code", affiliate.referral_code);

  const restaurants = referredRestaurants || [];
  const totalReferred = restaurants.length;
  
  const pendingEarnings = restaurants.reduce((sum, rest) => sum + getAffiliatePayout(rest.plan, rest.billing_cycle), 0);

  const referralLink = `https://nomenu.us?ref=${affiliate.referral_code}`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans-vibrant flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-950 text-white py-4 px-6 sm:px-10 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-xl">NoMenu <span className="text-amber-500">Partners</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-300 hidden sm:inline-block">
            {affiliate.name}
          </span>
          <form action="/auth/signout" method="post">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 p-2 h-auto" type="submit">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign out</span>
            </Button>
          </form>
        </div>
      </header>

      <main className="flex-1 p-6 sm:p-10 max-w-6xl w-full mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Welcome back, {affiliate.name.split(" ")[0]}!
            </h1>
            <p className="text-slate-500 mt-2 font-medium max-w-xl leading-relaxed">
              Share your custom link with restaurant owners. When they create an annual account, you earn cash rewards up to $100 per restaurant.
            </p>
          </div>
        </div>

        {/* The Tracking Link Banner */}
        <div className="bg-amber-500 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="font-bold text-amber-100 uppercase tracking-wider text-xs mb-1">Your Tracking Link</p>
              <p className="text-xl sm:text-2xl font-bold font-mono tracking-tight">{referralLink}</p>
            </div>
            
            {/* The tracking link uses a client component to handle clipboard interaction */}
            <ClientCopyButton text={referralLink} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Restaurants Referred</p>
            </div>
            <p className="text-4xl font-black text-slate-900">{totalReferred}</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Earnings</p>
            </div>
            <p className="text-4xl font-black text-slate-900">${pendingEarnings}</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Activity className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Payout Status</p>
            </div>
            <p className="text-lg font-bold text-slate-900 mb-1">Via PayPal</p>
            <p className="text-sm font-medium text-slate-500 truncate">{affiliate.paypal_email || "Not set"}</p>
          </div>
        </div>

        {/* Recent Referrals List */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Referrals</h2>
          
          {restaurants.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {restaurants.map((rest) => {
                const payout = getAffiliatePayout(rest.plan, rest.billing_cycle);
                return (
                  <div key={rest.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{rest.name}</p>
                      <p className="text-sm text-slate-500 font-medium">Joined {rest.created_at ? new Date(rest.created_at).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      {payout > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                          +${payout} Earned
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-500 capitalize">
                          {rest.plan && rest.plan !== 'free' ? `${rest.plan} (Monthly)` : 'Free Plan'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500 font-medium">No restaurants referred yet.</p>
              <p className="text-sm text-slate-400 mt-1">Share your link to get started!</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
