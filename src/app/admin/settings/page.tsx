import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Settings2 } from "lucide-react";
import { FeatureToggle } from "./FeatureToggle";
import { AdminSearch } from "../components/admin-search";

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage(
  props: {
    searchParams: Promise<{ q?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  let supabaseQuery = adminSupabase
    .from("restaurants")
    .select("id, name, slug, feature_flags")
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,slug.ilike.%${query}%`);
  }

  const { data: restaurants, error } = await supabaseQuery;

  if (error) {
    if (error.code === '42703') {
      return <div className="p-8 text-amber-600 font-bold">Feature flags column not found. Please run the migration to add 'feature_flags' to the restaurants table.</div>;
    }
    return <div className="text-red-500 p-8">Error loading settings: {error.message}</div>;
  }

  const AVAILABLE_FLAGS = ["beta_kds", "advanced_analytics", "custom_domain_beta"];

  return (
    <div className="space-y-8 font-sans-vibrant">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Feature Flags</h1>
        <p className="mt-1 text-slate-500 font-medium">Manage experimental features and beta access on a per-restaurant basis.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Settings2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Tenant Settings</h2>
          </div>
          <AdminSearch />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="px-6 py-4">Restaurant</th>
                {AVAILABLE_FLAGS.map(flag => (
                  <th key={flag} className="px-6 py-4">{flag.replace('_', ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {restaurants?.map((restaurant) => {
                const flags = restaurant.feature_flags || {};
                
                return (
                  <tr key={restaurant.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">{restaurant.name}</p>
                      <p className="text-xs text-slate-500 font-mono">/{restaurant.slug}</p>
                    </td>
                    {AVAILABLE_FLAGS.map(flag => (
                      <td key={flag} className="px-6 py-5">
                        <FeatureToggle 
                          restaurantId={restaurant.id} 
                          flagName={flag} 
                          isEnabled={!!flags[flag]} 
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
              {restaurants?.length === 0 && (
                <tr>
                  <td colSpan={AVAILABLE_FLAGS.length + 1} className="px-6 py-12 text-center text-slate-500">
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
