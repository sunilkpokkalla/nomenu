import { createClient as createAdminClient } from "@supabase/supabase-js";
import { DollarSign, Store, CreditCard, Activity, ArrowUpRight, TrendingUp } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  // Fetch all restaurants to calculate metrics
  const { data: allRestaurants, error } = await adminSupabase
    .from("restaurants")
    .select("subscription_status, plan, created_at");

  if (error) {
    return <div className="text-red-500 p-8">Error loading dashboard: {error.message}</div>;
  }

  const restaurants = allRestaurants || [];
  
  const totalRestaurants = restaurants.length;
  const activeSubscriptions = restaurants.filter(r => r.subscription_status === 'active').length;
  const trialSubscriptions = restaurants.filter(r => r.subscription_status === 'trialing').length;
  const pastDueSubscriptions = restaurants.filter(r => r.subscription_status === 'past_due').length;
  const canceledSubscriptions = restaurants.filter(r => r.subscription_status === 'canceled').length;

  // Approximate MRR (Assuming Pro is $49/mo, Enterprise is $199/mo)
  const estimatedMRR = restaurants.filter(r => r.subscription_status === 'active').reduce((total, r) => {
    if (r.plan === 'enterprise') return total + 199;
    return total + 49;
  }, 0);

  // Calculate this month's growth
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const newThisMonth = restaurants.filter(r => new Date(r.created_at) >= startOfMonth).length;

  return (
    <div className="space-y-8 font-sans-vibrant">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Global Dashboard</h1>
        <p className="mt-1 text-slate-500 font-medium">Platform overview and high-level SaaS metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Estimated MRR */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Estimated MRR</p>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-4xl font-black text-slate-900">${estimatedMRR.toLocaleString()}</p>
          </div>
        </div>

        {/* Total Restaurants */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Store className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Tenants</p>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-4xl font-black text-slate-900">{totalRestaurants}</p>
            <span className="flex items-center text-sm font-bold text-emerald-600 mb-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{newThisMonth} this month
            </span>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <CreditCard className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Subs</p>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-4xl font-black text-slate-900">{activeSubscriptions}</p>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Activity className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">System Health</p>
          </div>
          <div className="flex flex-col gap-1">
             <h2 className="text-xl font-black text-emerald-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </h2>
          </div>
        </div>

      </div>

      {/* Subscription Breakdown */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Subscription Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm font-bold text-slate-500 mb-1">Active</p>
            <p className="text-2xl font-black text-emerald-600">{activeSubscriptions}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm font-bold text-slate-500 mb-1">Trialing</p>
            <p className="text-2xl font-black text-blue-600">{trialSubscriptions}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm font-bold text-slate-500 mb-1">Past Due</p>
            <p className="text-2xl font-black text-amber-600">{pastDueSubscriptions}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm font-bold text-slate-500 mb-1">Canceled</p>
            <p className="text-2xl font-black text-rose-600">{canceledSubscriptions}</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
