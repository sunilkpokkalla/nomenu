import { redirect } from "next/navigation";
import { Copy, Gift, Users, Activity, Sparkles, CheckCircle2, Clock } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { ClientCopyButton } from "./client-copy-button";
import { ConnectBankButton } from "../payouts/connect-bank-button";

export const dynamic = "force-dynamic";

export default async function ReferralsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name, slug, plan, subscription_status, stripe_account_id")
    .eq("owner_id", user.id)
    .single();

  if (!restaurant) {
    redirect("/dashboard");
  }

  const isActive = restaurant.plan !== "free";
  const hasStripeConnect = !!restaurant.stripe_account_id;

  // Get referred restaurants (for the signups count)
  const { data: referredRestaurants } = await supabase
    .from("restaurants")
    .select("id, name, created_at, plan, billing_cycle")
    .eq("referred_by_code", restaurant.slug || "");

  const restaurants = referredRestaurants || [];
  const totalReferred = restaurants.length;

  // Get ACTUAL payouts from the database
  const { data: payouts } = await supabase
    .from("affiliate_payouts")
    .select("*, restaurants:referred_restaurant_id(name)")
    .eq("referrer_code", restaurant.slug || "")
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allPayouts: any[] = payouts || [];
  
  // Calculate earnings
  const now = new Date();
  
  let pendingHold = 0;
  let availableToWithdraw = 0;
  let totalWithdrawn = 0;

  allPayouts.forEach(payout => {
    if (payout.status === "paid" || payout.status === "credited") {
      totalWithdrawn += payout.amount;
    } else if (payout.status === "pending") {
      const clearsAt = payout.clears_at ? new Date(payout.clears_at) : null;
      if (clearsAt && clearsAt <= now) {
        availableToWithdraw += payout.amount;
      } else {
        pendingHold += payout.amount;
      }
    }
  });

  const referralLink = `https://nomenu.us?ref=${restaurant.slug}`;

  return (
    <div className="px-6 py-10 lg:px-10 bg-slate-50 min-h-screen font-sans-vibrant space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/50 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Partner Program
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Refer & Earn
          </h1>
          <p className="mt-2 text-slate-500 font-medium max-w-xl leading-relaxed">
            Invite other restaurant owners to NoMenu using your unique link. You'll earn up to $100 for every restaurant that activates an annual account.
          </p>
        </div>
      </div>

      {/* The Tracking Link Banner */}
      {!isActive ? (
        <div className="bg-white text-slate-900 border border-amber-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold mb-2">Active Subscription Required</h2>
          <p className="text-slate-500 max-w-lg mb-6">
            You must have an active paid subscription to NoMenu to participate in the Refer & Earn program. Upgrade your account to generate your tracking link.
          </p>
        </div>
      ) : (
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-xs mb-1">Your Tracking Link</p>
              <p className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-primary-foreground select-all">{referralLink}</p>
            </div>
            
            <ClientCopyButton text={referralLink} />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Available Balance</p>
          </div>
          <p className="text-4xl font-black text-slate-900">${availableToWithdraw}</p>
        </div>
        
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending (60-day hold)</p>
          </div>
          <p className="text-4xl font-black text-slate-900">${pendingHold}</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
              <Activity className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Payout Account</p>
          </div>
          {hasStripeConnect ? (
            <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-xl w-fit">
              <CheckCircle2 className="w-5 h-5" /> Stripe Connected
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-3 font-medium leading-relaxed">Connect your bank securely via Stripe to receive payouts.</p>
              <ConnectBankButton isAlreadyConnected={false} />
            </>
          )}
        </div>
      </div>

      {/* Recent Payouts List */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Earnings History</h2>
        
        {allPayouts.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {allPayouts.map((payout) => {
              const clearsAt = payout.clears_at ? new Date(payout.clears_at) : null;
              const isCleared = clearsAt ? clearsAt <= now : false;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const restName = (payout.restaurants as any)?.name || "Unknown Restaurant";
              
              return (
                <div key={payout.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-900">{restName} Conversion</p>
                    <p className="text-sm text-slate-500 font-medium">Earned {new Date(payout.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-left sm:text-right flex flex-col items-start sm:items-end gap-1">
                    <span className="font-black text-slate-900">${payout.amount}</span>
                    
                    {payout.status === "paid" || payout.status === "credited" ? (
                      <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                        Paid out
                      </span>
                    ) : isCleared ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        Available to withdraw
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                        Pending (clears {clearsAt ? clearsAt.toLocaleDateString() : 'Unknown'})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-center px-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
              <Gift className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-800">No earnings yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[34ch] leading-relaxed">
              When a restaurant signs up with your link and activates a paid plan, your earnings will appear here.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
