"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Search, UserPlus, X } from "lucide-react";
import { approvePartnerAction, manuallyCreatePartnerAction } from "./actions";
import { RejectPartnerForm } from "./RejectPartnerForm";

export type Partner = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  expertise?: string | null;
  social_influence?: string | null;
  location?: string | null;
  social_media_details?: string | null;
  purpose?: string | null;
  created_at: string;
  referral_code?: string | null;
  status?: string | null;
  stripe_account_id?: string | null;
};

interface PartnersClientProps {
  pending: Partner[];
  approved: Partner[];
  rejected: Partner[];
}

export function PartnersClient({ pending, approved, rejected }: PartnersClientProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter based on search query
  const filterPartners = (partners: Partner[]) => {
    if (!searchQuery) return partners;
    const lowerQuery = searchQuery.toLowerCase();
    return partners.filter((p) => 
      p.name?.toLowerCase().includes(lowerQuery) || 
      p.email?.toLowerCase().includes(lowerQuery) || 
      p.referral_code?.toLowerCase().includes(lowerQuery)
    );
  };

  const filteredPending = filterPartners(pending);
  const filteredApproved = filterPartners(approved);
  const filteredRejected = filterPartners(rejected);

  async function handleManualInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      await manuallyCreatePartnerAction(formData);
      setIsInviteModalOpen(false);
      // Optional: show a success toast here
    } catch (err) {
      console.error(err);
      alert("Failed to invite partner");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Top Bar with Search and Invite Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Tabs */}
        <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "pending" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
          >
            Needs Review
            {pending.length > 0 && <span className="ml-2 bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[10px]">{pending.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab("approved")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "approved" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
          >
            Approved
            {approved.length > 0 && <span className="ml-2 bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full text-[10px]">{approved.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab("rejected")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "rejected" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
          >
            Rejected
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search partners..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          
          {/* Invite Button */}
          <Button 
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-bold rounded-xl h-10 px-4"
          >
            <UserPlus className="w-4 h-4 mr-2" /> Invite
          </Button>
        </div>
      </div>

      {/* TABS CONTENT */}

      {/* PENDING TAB */}
      {activeTab === "pending" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            Needs Review
          </h2>
          
          {filteredPending.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
              <p className="text-slate-500 text-sm mt-1">There are no pending applications waiting for your review.</p>
            </div>
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
                    {filteredPending.map((p) => (
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
      )}

      {/* APPROVED TAB */}
      {activeTab === "approved" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            Approved Partners
          </h2>
          
          {filteredApproved.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-emerald-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No approved partners</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                {searchQuery ? `No approved partners matched "${searchQuery}".` : "You don't have any approved partners yet. Click the 'Invite' button above to add someone manually, or approve a pending application."}
              </p>
            </div>
          ) : (
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
                    {filteredApproved.map((p) => (
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
          )}
        </div>
      )}

      {/* REJECTED TAB */}
      {activeTab === "rejected" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            Rejected / Archived
          </h2>
          
          {filteredRejected.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No rejected partners</h3>
              <p className="text-slate-500 text-sm mt-1">There are no rejected applications to show.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-wrap gap-3">
              {filteredRejected.map((p) => (
                <div key={p.id} className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm min-w-[250px] flex-1 max-w-sm">
                  <span className="font-bold text-slate-900 block">{p.name}</span> 
                  <span className="text-slate-500 text-xs block mb-3">{p.email}</span>
                  
                  <form action={approvePartnerAction.bind(null, p.id, p.email)}>
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-white font-bold text-slate-700 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50">
                      Undo & Approve
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INVITE PARTNER MODAL */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Invite Partner</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleManualInvite} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="e.g. jane@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Custom Referral Code</label>
                <input 
                  type="text" 
                  name="referral_code" 
                  required 
                  placeholder="e.g. JANE100"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                  onChange={(e) => e.target.value = e.target.value.toUpperCase()}
                />
                <p className="text-xs text-slate-500 mt-1">Code must be unique. They will use this for their tracking link.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setIsInviteModalOpen(false)} className="flex-1 rounded-xl h-11 font-bold">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 font-bold">
                  {isSubmitting ? "Creating..." : "Create Partner"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
