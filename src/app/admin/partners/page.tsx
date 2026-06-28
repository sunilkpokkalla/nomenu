import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Check, X, MapPin, Link as LinkIcon, Target } from "lucide-react";
import { approvePartnerAction } from "./actions";
import { RejectPartnerForm } from "./RejectPartnerForm";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "admin@nomenu.us").split(",");
  if (!adminEmails.includes(user.email)) {
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
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Partner</th>
                      <th className="px-6 py-4">Details</th>
                      <th className="px-6 py-4">Strategy</th>
                      <th className="px-6 py-4">Code</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pending.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 align-top">
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <a href={`mailto:${p.email}`} className="text-blue-600 text-xs hover:underline block mt-0.5">{p.email}</a>
                          <div className="mt-3 text-[11px] text-slate-400 font-medium">
                            Applied {p.created_at ? formatDistanceToNow(new Date(p.created_at), { addSuffix: true }) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top text-xs space-y-2">
                          <p><span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Exp:</span> <span className="font-medium text-slate-700">{p.expertise || "N/A"}</span></p>
                          <p><span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Size:</span> <span className="font-medium text-slate-700">{p.social_influence || "N/A"}</span></p>
                          <p><span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Loc:</span> <span className="font-medium text-slate-700">{p.location || "N/A"}</span></p>
                          <p className="truncate max-w-[150px]" title={p.social_media_details || ""}><span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Link:</span> <span className="font-medium text-slate-700">{p.social_media_details || "N/A"}</span></p>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <p className="text-slate-600 italic text-xs max-w-[250px] line-clamp-4 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100" title={p.purpose || "N/A"}>
                            "{p.purpose || "N/A"}"
                          </p>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span className="font-mono font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md text-xs">{p.referral_code}</span>
                        </td>
                        <td className="px-6 py-4 align-top text-right">
                          <div className="flex flex-col items-end gap-2">
                            <form action={approvePartnerAction.bind(null, p.id, p.email)}>
                              <Button size="sm" className="w-28 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 rounded-lg" type="submit">
                                <Check className="w-4 h-4 mr-1" /> Approve
                              </Button>
                            </form>
                            <RejectPartnerForm id={p.id} email={p.email} label="Reject" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                        <RejectPartnerForm id={p.id} email={p.email} label="Revoke" />
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
