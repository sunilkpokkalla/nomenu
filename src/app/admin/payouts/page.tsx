import { redirect } from "next/navigation";
import { CheckCircle2, DollarSign, Users } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { markAsPaid } from "./actions";
import { getAffiliatePayout } from "@/lib/affiliate";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ensure user is an admin
  const adminEmails = (process.env.ADMIN_EMAILS || "admin@nomenu.us").split(",");
  if (!user.email || !adminEmails.includes(user.email)) {
    redirect("/dashboard");
  }

  // Fetch all affiliates
  const { data: affiliates } = await supabase
    .from("affiliates")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch all referred restaurants
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, name, referred_by_code, created_at, plan, billing_cycle")
    .not("referred_by_code", "is", null);

  const affiliatesList = affiliates || [];
  const restaurantsList = restaurants || [];

  // Combine data
  const payoutsData = affiliatesList.map((affiliate) => {
    const referred = restaurantsList.filter(r => r.referred_by_code === affiliate.referral_code);
    
    // Calculate total earned using the tiered logic
    const totalEarned = referred.reduce((sum, rest) => sum + getAffiliatePayout(rest.plan, rest.billing_cycle), 0);
    
    const totalPaid = affiliate.total_paid_amount || 0;
    const pendingAmount = Math.max(0, totalEarned - totalPaid);

    return {
      ...affiliate,
      referredCount: referred.length,
      totalEarned,
      totalPaid,
      pendingAmount,
    };
  });

  const totalPendingGlobal = payoutsData.reduce((sum, item) => sum + item.pendingAmount, 0);

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-sans-vibrant">
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Affiliate Payouts</h1>
        <p className="mt-1 text-slate-500 font-medium">Manage pending cash bounties for influencers and agencies.</p>
      </div>

      {/* Global Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Pending</p>
          </div>
          <p className="text-4xl font-black text-amber-600">${totalPendingGlobal}</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Affiliates</p>
          </div>
          <p className="text-4xl font-black text-slate-900">{affiliatesList.length}</p>
        </div>
      </div>

      {/* Affiliates List */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-700">Affiliate</th>
                <th className="px-6 py-4 font-bold text-slate-700">Referrals</th>
                <th className="px-6 py-4 font-bold text-slate-700">Payout Email</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-right">Pending Amount</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payoutsData.length > 0 ? (
                payoutsData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500 font-medium">Code: {item.referral_code}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                        {item.referredCount} Restaurants
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {item.paypal_email || "Not provided"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.pendingAmount > 0 ? (
                        <span className="text-lg font-black text-amber-600">${item.pendingAmount}</span>
                      ) : (
                        <span className="text-slate-400 font-bold">$0</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.pendingAmount > 0 ? (
                        <form action={markAsPaid}>
                          <input type="hidden" name="affiliateId" value={item.id} />
                          <input type="hidden" name="amount" value={item.pendingAmount} />
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            Mark Paid
                          </Button>
                        </form>
                      ) : (
                        <span className="inline-flex items-center text-xs font-bold text-emerald-600 uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-0">
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                        <Users className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">No affiliates found</h3>
                      <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                        You don't have any active affiliates yet. Once partners are approved and start referring restaurants, they will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
