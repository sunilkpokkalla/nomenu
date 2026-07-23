"use client";

import React, { useMemo, useState, useEffect } from "react";
import { User, Mail, Phone, Star, Award, AlertCircle, MessageSquare, Search, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";
import { FeedbackData } from "./feedback-analytics";

interface CustomerDirectoryProps {
  feedbacks: FeedbackData[];
  timezone: string;
  onRedeemClaim?: (feedbackId: string) => Promise<void>;
}

const formatPhone = (phoneStr?: string | null) => {
  if (!phoneStr) return '';
  const cleaned = phoneStr.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,10)}`;
  } else if (cleaned.length > 10) {
    return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(cleaned.length - 10, cleaned.length - 7)}) ${cleaned.slice(cleaned.length - 7, cleaned.length - 4)}-${cleaned.slice(cleaned.length - 4)}`;
  }
  return phoneStr; // Return raw string if it's strangely short (legacy data)
};

interface CustomerProfile {
  id: string; // The primary identifier (email, phone, name, or card id)
  name: string;
  email: string | null;
  phone: string | null;
  contactInfo: string;
  totalFeedbacks: number;
  averageRating: number;
  latestFeedbackDate: string;
  loyaltyStamps: number;
  latestComment: string;
  recoveryOfferGiven?: string | null;
  recoveryOfferDate?: string | null;
  activeReward: string | null;
  pendingClaims: { id: string, text: string }[];
}

export function CustomerDirectory({ feedbacks, timezone, onRedeemClaim }: CustomerDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'top-regulars' | 'reward-ready'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  const { customers, topRegulars, rewardReady, totalIdentified } = useMemo(() => {
    const profileMap = new Map<string, CustomerProfile>();
    
    feedbacks.forEach(f => {
      // Find the best identifier (Prioritize Phone Number for Loyalty Grouping)
      let identifier = f.customer_phone?.trim().toLowerCase();
      if (!identifier) identifier = f.customer_email?.trim().toLowerCase();
      if (!identifier && f.loyalty_cards && f.loyalty_cards.length > 0) identifier = f.loyalty_cards[0].id;
      if (!identifier) identifier = f.contact_info?.trim().toLowerCase();
      if (!identifier) identifier = f.customer_name?.trim().toLowerCase();
      
      if (!identifier) return; // Completely anonymous, skip
      
      const existing = profileMap.get(identifier);
      
      let stamps = 0;
      let cardName = null;
      let cardEmail = null;
      let cardPhone = null;
      let activeReward = null;

      if (f.loyalty_cards && f.loyalty_cards.length > 0) {
        const card = f.loyalty_cards[0] as { customer_name?: string, customer_email?: string, phone_number?: string, active_reward?: string, stamps: number };
        stamps = card.stamps;
        cardName = card.customer_name || null;
        cardEmail = card.customer_email || null;
        cardPhone = card.phone_number || null;
        activeReward = card.active_reward || null;
      }
      
      const resolvedName = cardName || f.customer_name || "Anonymous Customer";
      const resolvedEmail = cardEmail || f.customer_email || null;
      const resolvedPhone = cardPhone || f.customer_phone || null;

      const pendingClaims: { id: string, text: string }[] = [];
      if (f.claim_status === "issued" && f.recovery_offer_given) {
        pendingClaims.push({ id: f.id, text: f.recovery_offer_given });
      }

      if (!existing) {
        profileMap.set(identifier, {
          id: identifier,
          name: resolvedName,
          email: resolvedEmail,
          phone: resolvedPhone,
          contactInfo: f.contact_info || "",
          totalFeedbacks: 1,
          averageRating: f.rating,
          latestFeedbackDate: f.created_at,
          loyaltyStamps: stamps,
          latestComment: f.comment || "",
          activeReward: activeReward,
          pendingClaims: pendingClaims,
        });
      } else {
        // Update existing
        // For stamps, keep the maximum found (in case of multiple cards, though rare)
        existing.loyaltyStamps = Math.max(existing.loyaltyStamps, stamps);
        existing.totalFeedbacks += 1;
        // Running average
        existing.averageRating = ((existing.averageRating * (existing.totalFeedbacks - 1)) + f.rating) / existing.totalFeedbacks;
        
        if (cardName) existing.name = cardName;
        if (cardEmail) existing.email = cardEmail;
        if (cardPhone) existing.phone = cardPhone;
        if (activeReward !== undefined && activeReward !== null) existing.activeReward = activeReward;
        if (pendingClaims.length > 0) existing.pendingClaims.push(...pendingClaims);

        // If this feedback is newer, update latest info
        if (new Date(f.created_at) > new Date(existing.latestFeedbackDate)) {
          existing.latestFeedbackDate = f.created_at;
          if (f.contact_info) existing.contactInfo = f.contact_info;
          if (f.comment) existing.latestComment = f.comment;
          // Fallback to feedback details if card details are still missing
          if (!existing.name || existing.name === "Anonymous Customer") existing.name = f.customer_name || "Anonymous Customer";
          if (!existing.email && f.customer_email) existing.email = f.customer_email;
          if (!existing.phone && f.customer_phone) existing.phone = f.customer_phone;
        }
      }
    });
    
    const customerList = Array.from(profileMap.values())
      .filter(c => c.loyaltyStamps > 0) // ONLY show loyalty members
      .sort((a, b) => new Date(b.latestFeedbackDate).getTime() - new Date(a.latestFeedbackDate).getTime());
    
    const topRegulars = customerList.sort((a, b) => b.totalFeedbacks - a.totalFeedbacks).slice(0, 3);
    const rewardReady = customerList.filter(c => c.loyaltyStamps >= 10);
    
    return {
      customers: customerList,
      topRegulars,
      rewardReady,
      totalIdentified: customerList.length
    };
  }, [feedbacks]);

  if (totalIdentified === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm mt-8">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">No Loyalty Members Yet</h3>
        <p className="text-slate-500 max-w-sm">
          Once your customers earn their first loyalty stamp, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col">
      {/* Table Section */}
      <div className="w-full order-2 flex flex-col gap-6">
        {/* Main Directory Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h3 className="font-bold text-slate-900">
              {activeFilter === 'top-regulars' ? 'Top Regulars' : activeFilter === 'reward-ready' ? 'Rewards Ready' : 'Loyalty Members'}
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, phone, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Visits</th>
                  <th className="px-6 py-4 font-semibold">Loyalty Status</th>
                  <th className="px-6 py-4 font-semibold">Active Reward</th>
                  <th className="px-6 py-4 font-semibold">Last Visit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(() => {
                  const filteredCustomers = customers.filter(c => {
                    if (activeFilter === 'top-regulars') {
                      if (!topRegulars.find(r => r.id === c.id)) return false;
                    } else if (activeFilter === 'reward-ready') {
                      if (c.loyaltyStamps < 10) return false;
                    }
                    
                    if (!searchTerm) return true;
                    const q = searchTerm.toLowerCase();
                    return (c.name.toLowerCase().includes(q) || 
                            (c.email && c.email.toLowerCase().includes(q)) || 
                            (c.phone && c.phone.toLowerCase().includes(q)));
                  });
                  
                  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE));
                  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

                  return (
                    <>
                      {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{customer.name}</div>
                      {(customer.email || customer.phone || customer.contactInfo) && (
                        <div className="text-xs text-slate-500 mt-0.5 space-y-0.5">
                          {customer.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3" />{customer.email}</div>}
                          {customer.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{formatPhone(customer.phone)}</div>}
                          {!customer.email && !customer.phone && customer.contactInfo && <div>{customer.contactInfo}</div>}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{customer.totalFeedbacks} visits</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className={`w-3 h-3 ${customer.averageRating >= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-300 fill-slate-300'}`} />
                        <span className="text-xs text-slate-500">{customer.averageRating.toFixed(1)} avg rating</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.loyaltyStamps >= 10 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 animate-pulse border border-emerald-200 shadow-sm">
                          <Award className="w-4 h-4" />
                          Reward Ready! (10/10)
                        </span>
                      ) : customer.loyaltyStamps > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Award className="w-3.5 h-3.5" />
                          {customer.loyaltyStamps}/10 Stamps
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">No Card</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        {customer.activeReward && (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 max-w-[200px] truncate" title={customer.activeReward}>
                            <Gift className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{customer.activeReward}</span>
                          </div>
                        )}
                        {customer.pendingClaims.map(claim => (
                          <div key={claim.id} className="flex flex-col gap-1 text-xs font-medium text-rose-700 bg-rose-50 px-2 py-1.5 rounded border border-rose-100 w-fit max-w-[250px]">
                            <div className="flex items-center gap-1.5 truncate" title={claim.text}>
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate font-semibold">Claim: {claim.text}</span>
                            </div>
                            {onRedeemClaim && (
                              <button 
                                onClick={async () => {
                                  try {
                                    await onRedeemClaim(claim.id);
                                  } catch(e) {
                                    console.error(e);
                                    alert("Failed to redeem claim. Please try again.");
                                  }
                                }}
                                className="bg-rose-600 text-white text-[10px] uppercase tracking-wider font-bold py-1 px-2 rounded self-start hover:bg-rose-700 transition-colors shadow-sm"
                              >
                                Mark Redeemed
                              </button>
                            )}
                          </div>
                        ))}
                        {!customer.activeReward && customer.pendingClaims.length === 0 && (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatTimeAgoWithExact(customer.latestFeedbackDate, timezone)}
                    </td>
                  </tr>
                ))}
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm text-slate-500">
              {(() => {
                const filteredCount = customers.filter(c => {
                  if (activeFilter === 'top-regulars') return topRegulars.find(r => r.id === c.id);
                  if (activeFilter === 'reward-ready') return c.loyaltyStamps >= 10;
                  if (!searchTerm) return true;
                  const q = searchTerm.toLowerCase();
                  return (c.name.toLowerCase().includes(q) || (c.email && c.email.toLowerCase().includes(q)) || (c.phone && c.phone.toLowerCase().includes(q)));
                }).length;
                if (filteredCount === 0) return "No results found";
                return `Showing ${((currentPage - 1) * ITEMS_PER_PAGE) + 1} to ${Math.min(currentPage * ITEMS_PER_PAGE, filteredCount)} of ${filteredCount} members`;
              })()}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors bg-white shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => {
                  const filteredCount = customers.filter(c => {
                    if (activeFilter === 'top-regulars') return topRegulars.find(r => r.id === c.id);
                    if (activeFilter === 'reward-ready') return c.loyaltyStamps >= 10;
                    if (!searchTerm) return true;
                    const q = searchTerm.toLowerCase();
                    return (c.name.toLowerCase().includes(q) || (c.email && c.email.toLowerCase().includes(q)) || (c.phone && c.phone.toLowerCase().includes(q)));
                  }).length;
                  const totalPages = Math.max(1, Math.ceil(filteredCount / ITEMS_PER_PAGE));
                  return Math.min(totalPages, p + 1);
                })}
                disabled={(() => {
                  const filteredCount = customers.filter(c => {
                    if (activeFilter === 'top-regulars') return topRegulars.find(r => r.id === c.id);
                    if (activeFilter === 'reward-ready') return c.loyaltyStamps >= 10;
                    if (!searchTerm) return true;
                    const q = searchTerm.toLowerCase();
                    return (c.name.toLowerCase().includes(q) || (c.email && c.email.toLowerCase().includes(q)) || (c.phone && c.phone.toLowerCase().includes(q)));
                  }).length;
                  const totalPages = Math.max(1, Math.ceil(filteredCount / ITEMS_PER_PAGE));
                  return currentPage >= totalPages;
                })()}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors bg-white shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Bottom Analytics Blocks */}
      <div className="w-full order-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Block 1: Total Members */}
        <button 
          onClick={() => setActiveFilter('all')}
          className={`text-left bg-white rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md hover:border-blue-300 active:scale-[0.98] focus:outline-none flex flex-col justify-between ${activeFilter === 'all' ? 'ring-2 ring-blue-500 border-blue-200' : 'border-slate-200'}`}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-700 text-sm">Total Members</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900 mt-2">{totalIdentified}</p>
          </div>
          <p className="text-xs text-slate-500 mt-2">Active loyalty members</p>
        </button>
        
        {/* Block 2: Top Regulars Metric */}
        <button 
          onClick={() => setActiveFilter('top-regulars')}
          className={`text-left bg-white rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md hover:border-amber-300 active:scale-[0.98] focus:outline-none flex flex-col justify-between ${activeFilter === 'top-regulars' ? 'ring-2 ring-amber-500 border-amber-200' : 'border-slate-200'}`}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-700 text-sm">Top Regulars</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900 mt-2">{topRegulars.length > 0 ? topRegulars[0].totalFeedbacks : 0}</p>
          </div>
          <p className="text-xs text-slate-500 mt-2">Most visits by a member</p>
        </button>

        {/* Block 3: Rewards Ready Metric */}
        <button 
          onClick={() => setActiveFilter('reward-ready')}
          className={`text-left bg-emerald-50/30 rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md hover:border-emerald-400 active:scale-[0.98] focus:outline-none flex flex-col justify-between ${activeFilter === 'reward-ready' ? 'ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/80' : 'border-emerald-200'}`}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-emerald-800 text-sm">Rewards Ready</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-900 mt-2">{rewardReady.length}</p>
          </div>
          <p className="text-xs text-emerald-600 mt-2">Members with 10 stamps</p>
        </button>

        {/* Block 4: Top Regulars List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-100 bg-amber-50/50 flex items-center justify-between">
            <h3 className="font-bold text-amber-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              Top Visitors
            </h3>
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1 p-2">
            {topRegulars.length > 0 ? topRegulars.map(customer => (
              <div key={customer.id} className="py-2 px-1 flex justify-between items-center">
                <div className="flex flex-col truncate pr-2">
                  <span className="font-semibold text-slate-900 text-xs truncate">{customer.name}</span>
                </div>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 shrink-0">
                  {customer.totalFeedbacks} visits
                </span>
              </div>
            )) : (
              <div className="p-4 text-center text-xs text-slate-400">No regulars yet</div>
            )}
          </div>
        </div>

        {/* Block 5: Rewards Ready List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-100 bg-emerald-50/50 flex items-center justify-between">
            <h3 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-emerald-600" />
              Claim Ready
            </h3>
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1 p-2">
            {rewardReady.length > 0 ? rewardReady.slice(0, 3).map(customer => (
              <div key={customer.id} className="py-2 px-1 flex justify-between items-center">
                <div className="flex flex-col truncate pr-2">
                  <span className="font-semibold text-slate-900 text-xs truncate">{customer.name}</span>
                </div>
                <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shadow-sm shrink-0">
                  Verify ID
                </span>
              </div>
            )) : (
              <div className="p-4 text-center text-xs text-slate-400">None ready</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
