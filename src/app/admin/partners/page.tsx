import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Check, X, MapPin, Link as LinkIcon, Target } from "lucide-react";
import { approvePartnerAction, rejectPartnerAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "admin@nomenu.us").split(",");
  if (process.env.NODE_ENV !== 'development' && !adminEmails.includes(user.email)) {
    redirect("/dashboard");
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  const { data: partners, error } = await adminSupabase
    .from("affiliates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500 font-bold">Failed to load partners: {error.message}</div>;
  }

  const pending = partners?.filter(p => p.status === "pending") || [];
  const approved = partners?.filter(p => p.status === "approved" || p.status === null) || []; // Treat null as approved for legacy users
  const rejected = partners?.filter(p => p.status === "rejected") || [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans-vibrant">
      <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Partner Applications</h1>
          <p className="text-slate-500 font-medium mt-1">Review and manage incoming applications to the NoMenu Partner Program.</p>
        </div>

        {/* Pending Review */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            Needs Review
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">{pending.length}</Badge>
          </h2>
          
          {pending.length === 0 ? (
            <p className="text-slate-500 font-medium py-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">No pending applications right now.</p>
          ) : (
            <div className="grid gap-6">
              {pending.map((p) => (
                <div key={p.id} className="bg-white border border-amber-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start">
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                      <a href={`mailto:${p.email}`} className="text-blue-600 font-medium text-sm hover:underline">{p.email}</a>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4 text-sm bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div>
                        <span className="text-slate-500 font-bold uppercase tracking-wider text-xs block mb-1">Expertise</span>
                        <span className="text-slate-900 font-medium">{p.expertise || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold uppercase tracking-wider text-xs block mb-1">Influence Size</span>
                        <span className="text-slate-900 font-medium">{p.social_influence || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold uppercase tracking-wider text-xs block mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</span>
                        <span className="text-slate-900 font-medium">{p.location || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold uppercase tracking-wider text-xs block mb-1 flex items-center gap-1"><LinkIcon className="w-3 h-3" /> Links</span>
                        <span className="text-slate-900 font-medium">{p.social_media_details || "N/A"}</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-slate-500 font-bold uppercase tracking-wider text-xs block mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> Purpose / Strategy</span>
                      <p className="text-slate-700 italic bg-white p-3 rounded-xl border border-slate-200 text-sm">"{p.purpose || "N/A"}"</p>
                    </div>

                    <div>
                      <span className="text-slate-500 font-bold uppercase tracking-wider text-xs block mb-1">Requested Promo Code</span>
                      <span className="font-mono font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-lg text-sm">{p.referral_code}</span>
                    </div>
                    
                    <p className="text-xs text-slate-400 font-medium">Applied {p.created_at ? formatDistanceToNow(new Date(p.created_at), { addSuffix: true }) : 'unknown time ago'}</p>
                  </div>

                  <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                    <form action={approvePartnerAction.bind(null, p.id, p.email)} className="flex-1 md:w-full">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 md:w-40 rounded-xl" type="submit">
                        <Check className="w-5 h-5 mr-2" /> Approve
                      </Button>
                    </form>
                    <form action={rejectPartnerAction.bind(null, p.id)} className="flex-1 md:w-full">
                      <Button variant="outline" className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold h-12 md:w-40 rounded-xl border-rose-200" type="submit">
                        <X className="w-5 h-5 mr-2" /> Reject
                      </Button>
                    </form>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approved Partners */}
        <div className="space-y-4 pt-8">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            Approved Partners
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{approved.length}</Badge>
          </h2>
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Partner</th>
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Stripe</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {approved.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="text-slate-500 text-xs">{p.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs">{p.referral_code}</span>
                      </td>
                      <td className="px-6 py-4">
                        {p.stripe_account_id ? (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">Connected</Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-400 border-slate-200">Pending</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <form action={rejectPartnerAction.bind(null, p.id)}>
                          <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold" type="submit">
                            Revoke
                          </Button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Rejected Partners */}
        {rejected.length > 0 && (
          <div className="space-y-4 pt-8 opacity-60">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              Rejected Applications ({rejected.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {rejected.map((p) => (
                <div key={p.id} className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-sm">
                  <span className="font-bold text-slate-900">{p.name}</span> <span className="text-slate-500">({p.email})</span>
                  <div className="mt-2">
                    <form action={approvePartnerAction.bind(null, p.id, p.email)}>
                      <Button variant="outline" size="sm" className="h-7 text-xs bg-white">Undo & Approve</Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
