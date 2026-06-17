import { createClient as createAdminClient } from "@supabase/supabase-js";
import { ImpersonateButton } from "./components/impersonate-button";
import { formatDistanceToNow } from "date-fns";
import { Store, CreditCard, Users, Search } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // We use the admin client here to bypass RLS and fetch ALL restaurants
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  const { data: restaurants, error } = await adminSupabase
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="text-red-500">Error loading restaurants: {error.message}</div>;
  }

  const activeSubscriptions = restaurants?.filter(r => r.subscription_status === 'active')?.length || 0;
  const totalRestaurants = restaurants?.length || 0;

  return (
    <div className="space-y-8">
      {/* Metrics Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex items-start gap-4">
          <div className="bg-blue-500/10 p-3 rounded-lg">
            <Store className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-neutral-400 font-medium mb-1">Total Restaurants</p>
            <h2 className="text-3xl font-semibold text-white">{totalRestaurants}</h2>
          </div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex items-start gap-4">
          <div className="bg-emerald-500/10 p-3 rounded-lg">
            <CreditCard className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-neutral-400 font-medium mb-1">Active Subscriptions</p>
            <h2 className="text-3xl font-semibold text-white">{activeSubscriptions}</h2>
          </div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex items-start gap-4">
          <div className="bg-purple-500/10 p-3 rounded-lg">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-neutral-400 font-medium mb-1">System Health</p>
            <h2 className="text-lg font-medium text-emerald-400 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </h2>
          </div>
        </div>
      </div>

      {/* Fleet Data Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-lg font-medium text-white">Fleet Overview</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search (Coming soon)..." 
              disabled
              className="bg-black border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 w-64"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/50 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Restaurant</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {restaurants?.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-neutral-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                        {restaurant.name}
                      </span>
                      <span className="text-neutral-500 text-xs">nomenu.us/{restaurant.slug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-neutral-300 bg-neutral-800 px-2.5 py-1 rounded-md text-xs">
                      {restaurant.plan || "Free"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      restaurant.subscription_status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : restaurant.subscription_status === 'trialing'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {restaurant.subscription_status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      {restaurant.subscription_status || "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    {restaurant.created_at ? formatDistanceToNow(new Date(restaurant.created_at), { addSuffix: true }) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {restaurant.owner_id ? (
                      <ImpersonateButton userId={restaurant.owner_id} restaurantName={restaurant.name} />
                    ) : (
                      <span className="text-xs text-neutral-600">No Owner</span>
                    )}
                  </td>
                </tr>
              ))}
              {restaurants?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    No restaurants found.
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
