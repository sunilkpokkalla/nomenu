import { createClient as createAdminClient } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Mail, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function AdminBillingPage() {
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  // Fetch only past_due or canceled subscriptions
  const { data: restaurants, error } = await adminSupabase
    .from("restaurants")
    .select("*")
    .in("subscription_status", ["past_due", "canceled"])
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="text-red-500 p-8">Error loading billing data: {error.message}</div>;
  }

  const ownerIds = [...new Set(restaurants?.map(r => r.owner_id).filter(Boolean) as string[])];
  const userResponses = await Promise.all(
    ownerIds.map(id => adminSupabase.auth.admin.getUserById(id))
  );
  
  const emailsMap = userResponses.reduce((acc, res) => {
    if (res.data?.user?.id && res.data.user.email) {
      acc[res.data.user.id] = res.data.user.email;
    }
    return acc;
  }, {} as Record<string, string>);

  const pastDue = restaurants?.filter(r => r.subscription_status === 'past_due') || [];
  const canceled = restaurants?.filter(r => r.subscription_status === 'canceled') || [];

  return (
    <div className="space-y-8 font-sans-vibrant">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Billing Alerts</h1>
          <p className="mt-1 text-slate-500 font-medium">Monitor failed payments and churned accounts for revenue recovery.</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-2 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <span className="font-bold text-rose-700">{pastDue.length} Past Due Accounts</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Restaurant</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {restaurants?.map((restaurant) => {
                const email = restaurant.owner_id ? emailsMap[restaurant.owner_id] : null;
                const isPastDue = restaurant.subscription_status === 'past_due';

                return (
                  <tr key={restaurant.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      {isPastDue ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-50 text-amber-600 border border-amber-200">
                          <AlertCircle className="w-3 h-3" />
                          Past Due
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-rose-50 text-rose-600 border border-rose-200">
                          <XCircle className="w-3 h-3" />
                          Canceled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">{restaurant.name}</p>
                      {email && <p className="text-xs text-slate-500">{email}</p>}
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-slate-700 capitalize">{restaurant.plan || "Pro"}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {email && (
                        <a href={`mailto:${email}?subject=Urgent: Action required for your NoMenu subscription`}>
                          <Button size="sm" variant="outline" className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                            <Mail className="w-4 h-4 mr-2" />
                            Email Owner
                          </Button>
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
              {restaurants?.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-0">
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100">
                        <AlertTriangle className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Zero Billing Issues</h3>
                      <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                        All active subscriptions are currently in good standing!
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
