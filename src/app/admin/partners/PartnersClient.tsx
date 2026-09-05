"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Search, UserPlus, X, Mail, Phone, Calendar, Briefcase, Users, MapPin, Globe, ExternalLink } from "lucide-react";
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
    } catch (err) {
      console.error(err);
      toast.error("Failed to invite partner");
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderPartnerCard = (p: Partner, tabStatus: "pending" | "approved" | "rejected") => {
    return (
      <div key={p.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-6">
        {/* Top Row: Partner Profile, Code, Status & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-extrabold text-lg flex items-center justify-center border border-indigo-100 shadow-inner shrink-0">
              {p.name ? p.name.charAt(0).toUpperCase() : "P"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                <span className="font-mono text-xs font-black bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-200/80">
                  {p.referral_code}
                </span>
                {tabStatus === "approved" && (
                  p.stripe_account_id ? (
                    <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50 font-bold text-[11px] px-2.5 py-0.5">
                      Stripe Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50 font-bold text-[11px] px-2.5 py-0.5">
                      Stripe Pending
                    </Badge>
                  )
                )}
                {tabStatus === "pending" && (
                  <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50 font-bold text-[11px] px-2.5 py-0.5">
                    Needs Review
                  </Badge>
                )}
                {tabStatus === "rejected" && (
                  <Badge variant="outline" className="text-rose-700 border-rose-200 bg-rose-50 font-bold text-[11px] px-2.5 py-0.5">
                    Rejected
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mt-1.5">
                <a href={`mailto:${p.email}`} className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {p.email}
                </a>
                {p.phone && (
                  <span className="flex items-center gap-1 text-slate-600">
                    • <Phone className="w-3.5 h-3.5 text-slate-400" /> {p.phone}
                  </span>
                )}
                <span className="flex items-center gap-1 text-slate-400">
                  • <Calendar className="w-3.5 h-3.5" /> Applied {p.created_at ? formatDistanceToNow(new Date(p.created_at), { addSuffix: true }) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {tabStatus === "pending" && (
              <>
                <form action={approvePartnerAction.bind(null, p.id, p.email)}>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 px-4 rounded-xl shadow-sm" type="submit">
                    <Check className="w-4 h-4 mr-1.5" /> Approve
                  </Button>
                </form>
                <RejectPartnerForm id={p.id} email={p.email} label="Reject" />
              </>
            )}
            {tabStatus === "approved" && (
              <RejectPartnerForm id={p.id} email={p.email} label="Revoke Access" />
            )}
            {tabStatus === "rejected" && (
              <form action={approvePartnerAction.bind(null, p.id, p.email)}>
                <Button variant="outline" size="sm" className="h-9 px-4 text-xs bg-white font-bold text-slate-700 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 rounded-xl">
                  Undo & Approve
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Grid of Metadata */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/80 p-4.5 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
              <Briefcase className="w-3 h-3" /> Expertise / Role
            </span>
            <span className="text-xs font-bold text-slate-800 leading-snug block">{p.expertise || "N/A"}</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
              <Users className="w-3 h-3" /> Audience / Reach
            </span>
            <span className="text-xs font-bold text-slate-800 leading-snug block">{p.social_influence || "N/A"}</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3" /> Location
            </span>
            <span className="text-xs font-bold text-slate-800 leading-snug block">{p.location || "N/A"}</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
              <Globe className="w-3 h-3" /> Website / Social Link
            </span>
            {p.social_media_details ? (
              <a 
                href={p.social_media_details.startsWith("http") ? p.social_media_details : `https://${p.social_media_details}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1 break-all"
              >
                {p.social_media_details} <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ) : (
              <span className="text-xs font-medium text-slate-400">N/A</span>
            )}
          </div>
        </div>

        {/* Strategy / Purpose Section (FULL UNCUT TEXT) */}
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
            Strategy & Audience Pitch
          </span>
          <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/70 text-slate-800 text-sm leading-relaxed font-normal whitespace-pre-wrap">
            {p.purpose ? `"${p.purpose}"` : "No strategy statement provided."}
          </div>
        </div>
      </div>
    );
  };

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
            <div className="space-y-4">
              {filteredPending.map((p) => renderPartnerCard(p, "pending"))}
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
            <div className="space-y-4">
              {filteredApproved.map((p) => renderPartnerCard(p, "approved"))}
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
            <div className="space-y-4">
              {filteredRejected.map((p) => renderPartnerCard(p, "rejected"))}
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
