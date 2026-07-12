"use client";

import React, { useMemo, useState } from "react";
import { User, Mail, Phone, Star, Award, AlertCircle, MessageSquare, Search, Gift } from "lucide-react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";
import { FeedbackData } from "./feedback-analytics";

interface CustomerDirectoryProps {
  feedbacks: FeedbackData[];
  timezone: string;
}

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
}

export function CustomerDirectory({ feedbacks, timezone }: CustomerDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'top-regulars' | 'reward-ready'>('all');

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
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setActiveFilter('all')}
          className={`text-left bg-white rounded-2xl p-6 border shadow-sm transition-all hover:shadow-md hover:border-blue-300 active:scale-[0.98] focus:outline-none ${activeFilter === 'all' ? 'ring-2 ring-blue-500 border-blue-200' : 'border-slate-200'}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Total Members</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalIdentified}</p>
          <p className="text-sm text-slate-500 mt-1">Active loyalty members</p>
        </button>
        
        <button 
          onClick={() => setActiveFilter('top-regulars')}
          className={`text-left bg-white rounded-2xl p-6 border shadow-sm transition-all hover:shadow-md hover:border-amber-300 active:scale-[0.98] focus:outline-none ${activeFilter === 'top-regulars' ? 'ring-2 ring-amber-500 border-amber-200' : 'border-slate-200'}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Top Regulars</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{topRegulars.length > 0 ? topRegulars[0].totalFeedbacks : 0}</p>
          <p className="text-sm text-slate-500 mt-1">Most visits by a member</p>
        </button>

        <button 
          onClick={() => setActiveFilter('reward-ready')}
          className={`text-left bg-emerald-50/30 rounded-2xl p-6 border shadow-sm transition-all hover:shadow-md hover:border-emerald-400 active:scale-[0.98] focus:outline-none ${activeFilter === 'reward-ready' ? 'ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/80' : 'border-emerald-200'}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-emerald-800">Rewards Ready</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-900">{rewardReady.length}</p>
          <p className="text-sm text-emerald-600 mt-1">Members with 10 stamps</p>
        </button>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Directory Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
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
                {customers.filter(c => {
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
                }).map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{customer.name}</div>
                      {(customer.email || customer.phone || customer.contactInfo) && (
                        <div className="text-xs text-slate-500 mt-0.5 space-y-0.5">
                          {customer.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3" />{customer.email}</div>}
                          {customer.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phone}</div>}
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
                      {customer.activeReward ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 max-w-[150px] truncate" title={customer.activeReward}>
                          <Gift className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{customer.activeReward}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatTimeAgoWithExact(customer.latestFeedbackDate, timezone)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Reward Ready Panel */}
          {rewardReady.length > 0 && (
            <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-emerald-100 bg-emerald-100 flex items-center justify-between">
                <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                  <Star className="w-4 h-4 fill-emerald-600" />
                  Rewards Ready
                </h3>
                <span className="text-xs font-bold bg-white text-emerald-800 px-2 py-0.5 rounded-full">{rewardReady.length}</span>
              </div>
              <div className="divide-y divide-emerald-100">
                {rewardReady.map(customer => (
                  <div key={customer.id} className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-900">{customer.name}</span>
                      <span className="flex items-center text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded shadow-sm">
                        Verify ID
                      </span>
                    </div>
                    {(customer.email || customer.phone || customer.contactInfo) && (
                      <div className="text-xs text-slate-600 mb-2 font-mono bg-white px-2 py-1 rounded inline-block border border-emerald-100">
                        {customer.email && <div>{customer.email}</div>}
                        {customer.phone && <div>{customer.phone}</div>}
                        {!customer.email && !customer.phone && customer.contactInfo && <div>{customer.contactInfo}</div>}
                      </div>
                    )}
                    <div className="text-xs text-slate-500 mt-1">
                      Ready to claim 10-stamp reward.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Regulars */}
          {topRegulars.length > 0 && (
            <div className="bg-amber-50/50 rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-amber-100 bg-amber-50 flex items-center justify-between">
                <h3 className="font-bold text-amber-900 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Top Regulars
                </h3>
              </div>
              <div className="divide-y divide-amber-100">
                {topRegulars.map(customer => (
                  <div key={customer.id} className="p-4 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-900 block">{customer.name}</span>
                      <span className="text-xs text-slate-500">{formatTimeAgoWithExact(customer.latestFeedbackDate, timezone)}</span>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
                        {customer.totalFeedbacks} Visits
                      </span>
                      {customer.loyaltyStamps > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          {customer.loyaltyStamps}/10 Stamps
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
