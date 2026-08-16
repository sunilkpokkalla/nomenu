"use client";

import { useState } from "react";
import { CampaignForm } from "./campaign-form";
import { EmailScraper } from "./email-scraper";
import { Copy, Check, Calendar, Mail, Search, Trash2, CheckSquare, Square, AlertCircle, Loader2, MessageSquareCode } from "lucide-react";
import { deleteNomiLeadsAction } from "../actions";

interface Lead {
  id: string;
  email: string;
  name?: string;
  restaurant_name?: string;
  phone?: string;
  demo_time?: string;
  created_at: string;
}

interface MarketingTabsProps {
  initialLeads: Lead[];
}

export function MarketingTabs({ initialLeads }: MarketingTabsProps) {
  const [activeTab, setActiveTab] = useState<"campaigns" | "leads">("campaigns");
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Copy all lead emails to clipboard
  const handleCopyAll = () => {
    const emails = leads.map(l => l.email).join(", ");
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter leads based on search term (search name, email, or restaurant)
  const filteredLeads = leads.filter(l => 
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.name && l.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (l.restaurant_name && l.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const allFilteredSelected = filteredLeads.length > 0 && filteredLeads.every(l => selectedIds.includes(l.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredSet = new Set(filteredLeads.map(l => l.id));
      setSelectedIds(prev => prev.filter(id => !filteredSet.has(id)));
    } else {
      const newSelected = new Set([...selectedIds, ...filteredLeads.map(l => l.id)]);
      setSelectedIds(Array.from(newSelected));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (idsToDelete: string[]) => {
    if (idsToDelete.length === 0) return;

    const confirmMsg = idsToDelete.length === 1 
      ? "Are you sure you want to delete this lead?" 
      : `Are you sure you want to delete ${idsToDelete.length} selected leads?`;

    if (!window.confirm(confirmMsg)) return;

    setIsDeleting(true);
    setFeedback(null);

    const res = await deleteNomiLeadsAction(idsToDelete);

    setIsDeleting(false);
    if (res.success) {
      setLeads(prev => prev.filter(l => !idsToDelete.includes(l.id)));
      setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)));
      setFeedback({ type: "success", message: res.message || "Lead(s) deleted successfully." });
    } else {
      setFeedback({ type: "error", message: res.error || "Failed to delete lead(s)." });
    }

    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "campaigns" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          <Mail className="w-4 h-4" />
          Email Campaigns
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "leads" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
        >
          <MessageSquareCode className="w-4 h-4" />
          Nomi Leads ({leads.length})
        </button>
      </div>

      {activeTab === "campaigns" ? (
        <div className="space-y-8">
          <EmailScraper />
          <CampaignForm />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Feedback alert */}
          {feedback && (
            <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
              feedback.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}>
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Stats & Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2.5 rounded-lg">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Captured Leads & Demo Bookings</h3>
                <p className="text-xs text-slate-500">{leads.length} total leads from Nomi Chatbot & Calendar</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <button
                  onClick={() => handleDelete(selectedIds)}
                  disabled={isDeleting}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Delete Selected ({selectedIds.length})</span>
                </button>
              )}

              <button
                onClick={handleCopyAll}
                disabled={leads.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied All!" : "Copy All Emails"}
              </button>
            </div>
          </div>

          {/* Search bar & List */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search leads by name, email, or restaurant..."
                  className="w-full bg-transparent border-none text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-0 focus:outline-none"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-200/60"
                  >
                    Clear
                  </button>
                )}
              </div>

              {filteredLeads.length > 0 && (
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {allFilteredSelected ? (
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>
                    {allFilteredSelected 
                      ? "Deselect All" 
                      : `Select All (${filteredLeads.length})`}
                  </span>
                </button>
              )}
            </div>

            {filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                {searchTerm ? "No leads matching search." : "No Nomi chatbot or demo leads captured yet."}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
                {filteredLeads.map((lead) => {
                  const isSelected = selectedIds.includes(lead.id);
                  return (
                    <div 
                      key={lead.id} 
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <button
                          onClick={() => toggleSelectOne(lead.id)}
                          className="mt-1 sm:mt-0 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex shrink-0 items-center justify-center text-slate-600">
                          <Mail className="w-4 h-4" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {lead.name ? (
                              <span className="text-sm font-extrabold text-slate-900">{lead.name}</span>
                            ) : null}
                            {lead.restaurant_name ? (
                              <span className="text-xs font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                                🏢 {lead.restaurant_name}
                              </span>
                            ) : null}
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 flex-wrap">
                            <span className="font-medium text-slate-700">{lead.email}</span>
                            {lead.phone ? (
                              <span className="font-semibold text-slate-600">📞 {lead.phone}</span>
                            ) : null}
                          </div>

                          {lead.demo_time ? (
                            <div className="text-[11px] font-bold text-indigo-600 mt-1 flex items-center gap-1">
                              <span>📅 Demo Booked: {lead.demo_time}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                        </div>
                        <button
                          onClick={() => handleDelete([lead.id])}
                          disabled={isDeleting}
                          title="Delete lead email"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Users icon helper since we only need it here
function Users({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A2.25 2.25 0 0 1 12.75 21.5h-1.5a2.25 2.25 0 0 1-2.25-2.263V19.13m4.13-3.073A11.386 11.386 0 0 1 15 19.128M10.13 16.057A11.398 11.398 0 0 0 7.5 19.128m0 0a9.38 9.38 0 0 1-2.625.372 9.337 9.337 0 0 1-4.121-.952 4.125 4.125 0 0 1 7.533-2.493M7.5 19.128v-.003c0-1.113.285-2.16.786-3.07M7.5 19.128v.109A2.25 2.25 0 0 0 9.75 21.5h1.5a2.25 2.25 0 0 0 2.25-2.263V19.13M8.286 16.057A11.386 11.386 0 0 0 7.5 19.128m0-3.073a11.385 11.385 0 0 0-1.63 3.07M12 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM18 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}
