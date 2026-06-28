import { createClient as createAdminClient } from "@supabase/supabase-js";
import { ImpersonateButton } from "./components/impersonate-button";
import { AdminSearch } from "./components/admin-search";
import { AdminPagination } from "./components/admin-pagination";
import { CopyButton } from "./components/copy-button";
import { formatDistanceToNow } from "date-fns";
import { Store, CreditCard, Users, ExternalLink, MapPin, Phone, Mail } from "lucide-react";
import { AdminMenuDropdown } from "./components/admin-menu-dropdown";

export const dynamic = 'force-dynamic';

export default async function AdminPage(
  props: {
    searchParams: Promise<{ q?: string; page?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // We use the admin client here to bypass RLS and fetch ALL restaurants
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  // Get totals (without pagination)
  const { data: allRestaurants, error: totalsError } = await adminSupabase
    .from("restaurants")
    .select("subscription_status");

  const activeSubscriptions = allRestaurants?.filter(r => r.subscription_status === 'active')?.length || 0;
  const totalRestaurants = allRestaurants?.length || 0;

  // Get paginated and filtered list
  let supabaseQuery = adminSupabase
    .from("restaurants")
    .select("*, menus(slug, name, is_active)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query) {
    // Search by name or slug
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,slug.ilike.%${query}%`);
  }

  const { data: restaurants, count, error } = await supabaseQuery;

  if (totalsError || error) {
    return <div className="text-red-500">Error loading restaurants: {(totalsError || error)?.message}</div>;
  }

  // Fetch emails for the displayed restaurants securely via Admin API
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

  return (
    <div className="space-y-8">
      {/* Metrics Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
            <Store className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-bold mb-1">Total Restaurants</p>
            <h2 className="text-3xl font-black text-slate-900">{totalRestaurants}</h2>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <CreditCard className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-bold mb-1">Active Subscriptions</p>
            <h2 className="text-3xl font-black text-slate-900">{activeSubscriptions}</h2>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-bold mb-1">System Health</p>
            <h2 className="text-lg font-bold text-emerald-600 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </h2>
          </div>
        </div>
      </div>

      {/* Fleet Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">Fleet Overview</h2>
          <AdminSearch />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="px-6 py-4">Restaurant</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Plan & Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {restaurants?.map((restaurant) => {
                const email = restaurant.owner_id ? emailsMap[restaurant.owner_id] : null;
                const domain = process.env.NEXT_PUBLIC_APP_URL?.replace("https://", "").replace("http://", "") || "nomenu.us";
                
                return (
                  <tr key={restaurant.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                          {restaurant.name}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono">
                            {domain}/{restaurant.slug}
                          </span>
                          {restaurant.created_at && (
                            <span>Joined {formatDistanceToNow(new Date(restaurant.created_at), { addSuffix: true })}</span>
                          )}
                        </div>
                        {restaurant.address && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[250px]">{restaurant.address}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2.5">
                        {email ? (
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <a href={`mailto:${email}`} className="hover:text-slate-900 transition-colors">{email}</a>
                            <CopyButton text={email} />
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">No Owner Email</span>
                        )}
                        {restaurant.phone ? (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span>{restaurant.phone}</span>
                            <CopyButton text={restaurant.phone} />
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">No Phone Number</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-start gap-2">
                        <span className="capitalize text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide">
                          {restaurant.plan || "Free"} Plan
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                          restaurant.subscription_status === 'active' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : restaurant.subscription_status === 'trialing'
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {restaurant.subscription_status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                          {restaurant.subscription_status || "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <AdminMenuDropdown restaurantSlug={restaurant.slug} menus={restaurant.menus as { slug: string; name: string; is_active: boolean }[]} />
                        {restaurant.owner_id && (
                          <ImpersonateButton userId={restaurant.owner_id} restaurantName={restaurant.name} />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {restaurants?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-neutral-500">
                    <div className="flex flex-col items-center gap-2">
                      <Store className="w-8 h-8 text-neutral-700" />
                      <p>{query ? `No restaurants found matching "${query}".` : "No restaurants found."}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {count !== null && count > 0 && (
          <AdminPagination total={count} pageSize={pageSize} />
        )}
      </div>
    </div>
  );
}
