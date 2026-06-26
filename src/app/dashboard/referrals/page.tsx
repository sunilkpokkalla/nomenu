import { redirect } from "next/navigation";
import { Copy, Gift, Users, Activity, Sparkles } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAffiliatePayout } from "@/lib/affiliate";
import { updatePaypalEmail } from "./actions";
import { ClientCopyButton } from "./client-copy-button";

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
    .select("id, name, slug, subscription_status, paypal_email")
    .eq("owner_id", user.id)
    .single();

  if (!restaurant) {
    redirect("/dashboard");
  }

  const isActive = restaurant.subscription_status === "active";

  // Get referred restaurants
  const { data: referredRestaurants } = await supabase
    .from("restaurants")
    .select("id, name, created_at, plan, billing_cycle")
    .eq("referred_by_code", restaurant.slug || "");

  const restaurants = referredRestaurants || [];
  const totalReferred = restaurants.length;
  const pendingEarnings = restaurants.reduce((sum, rest) => sum + getAffiliatePayout(rest.plan, rest.billing_cycle), 0);

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
            Invite other restaurant owners to NoMenu using your unique link. You'll earn up to $100 in account credit for every restaurant that activates an annual account.
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
              <Gift className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Credits Earned</p>
          </div>
          <p className="text-4xl font-black text-slate-900">${pendingEarnings}</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
              <Activity className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">How to redeem</p>
          </div>
          <p className="text-sm font-medium text-slate-500 leading-relaxed mt-2">
            Credits automatically apply to your next renewal. Or, cash out via PayPal after 3 months!
          </p>
          <form action={updatePaypalEmail} className="mt-4">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">PayPal Email</p>
            <div className="flex gap-2">
              <Input 
                name="paypalEmail" 
                placeholder="you@paypal.com" 
                defaultValue={restaurant.paypal_email || ""}
                className="h-9 bg-slate-50 text-sm"
              />
              <Button type="submit" size="sm" className="h-9">Save</Button>
            </div>
          </form>
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
                        +${payout} Credit
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
          <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-center px-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-800">No referrals yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[34ch] leading-relaxed">
              Share your link with colleagues in the industry to earn your first account credit.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
