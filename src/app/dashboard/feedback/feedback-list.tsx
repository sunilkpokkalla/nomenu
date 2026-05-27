"use client";

import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { 
  MessageSquare, Star, ArrowUpRight, ArrowDownRight, User, MapPin, 
  Mail, QrCode, Search, ChevronDown, ChevronUp, Clock, Filter 
} from "lucide-react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";
import { createBrowserClient } from "@supabase/ssr";

interface FeedbackData {
  id: string;
  rating: number;
  comment?: string | null;
  customer_name?: string | null;
  contact_info?: string | null;
  table_number?: string | null;
  created_at: string;
  is_public?: boolean;
  status?: string;
  qr_codes?: { label: string | null } | null;
}

type SortColumn = "date" | "rating";
type SortDirection = "asc" | "desc";
type RatingFilter = "all" | "positive" | "neutral" | "attention";

export function FeedbackList({ feedbacks, timezone, restaurantId, supabaseUrl, supabaseAnonKey }: { feedbacks: FeedbackData[], timezone: string, restaurantId: string, supabaseUrl: string, supabaseAnonKey: string }) {
  const [liveFeedbacks, setLiveFeedbacks] = useState<FeedbackData[]>(feedbacks);
  const [mounted, setMounted] = useState(false);
  
  // Table Controls State
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [sortColumn, setSortColumn] = useState<SortColumn>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  
  // Expanded Rows State
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real-time subscription
  useEffect(() => {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    const channel = supabase.channel(`feedbacks-${restaurantId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "customer_feedback", filter: `restaurant_id=eq.${restaurantId}` },
        async (payload) => {
          const { data: fullFeedback } = await supabase
            .from("customer_feedback")
            .select("*, qr_codes(label)")
            .eq("id", payload.new.id)
            .single();
          if (fullFeedback) {
            setLiveFeedbacks(prev => [fullFeedback as FeedbackData, ...prev]);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [restaurantId, supabaseUrl, supabaseAnonKey]);

  // Derived state (filtering & sorting)
  const processedFeedbacks = useMemo(() => {
    let result = [...liveFeedbacks];

    // Filter by Rating
    if (ratingFilter !== "all") {
      result = result.filter(fb => {
        if (ratingFilter === "positive") return fb.rating >= 4;
        if (ratingFilter === "neutral") return fb.rating === 3;
        if (ratingFilter === "attention") return fb.rating <= 2;
        return true;
      });
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(fb => 
        (fb.customer_name?.toLowerCase().includes(lowerQuery)) ||
        (fb.comment?.toLowerCase().includes(lowerQuery)) ||
        (fb.table_number?.toLowerCase().includes(lowerQuery)) ||
        (fb.qr_codes?.label?.toLowerCase().includes(lowerQuery))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortColumn === "date") {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
      } else {
        return sortDirection === "desc" ? b.rating - a.rating : a.rating - b.rating;
      }
    });

    return result;
  }, [liveFeedbacks, ratingFilter, searchQuery, sortColumn, sortDirection]);

  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortDirection(prev => prev === "desc" ? "asc" : "desc");
    } else {
      setSortColumn(col);
      setSortDirection("desc"); // Default to desc when switching columns
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!mounted) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Table Controls Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          Feedback Submissions
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search comments, names, tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 w-full sm:w-64"
            />
          </div>
          
          {/* Rating Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select 
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value as RatingFilter)}
              className="pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 cursor-pointer appearance-none w-full sm:w-auto"
            >
              <option value="all">All Ratings</option>
              <option value="positive">Positive (4-5 Stars)</option>
              <option value="neutral">Neutral (3 Stars)</option>
              <option value="attention">Needs Attention (1-2 Stars)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none w-48" onClick={() => handleSort("date")}>
                <div className="flex items-center gap-1.5">
                  Date / Time
                  {sortColumn === "date" && (sortDirection === "desc" ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th className="px-6 py-4">Customer & Location</th>
              <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none w-40" onClick={() => handleSort("rating")}>
                <div className="flex items-center gap-1.5">
                  Rating
                  {sortColumn === "rating" && (sortDirection === "desc" ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th className="px-6 py-4">Sentiment</th>
              <th className="px-6 py-4 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {processedFeedbacks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <MessageSquare className="w-10 h-10 text-slate-300 mb-3" />
                    <p className="text-slate-500 font-medium text-base">No feedback found</p>
                    <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              processedFeedbacks.map((fb) => {
                const isExpanded = expandedRows.has(fb.id);
                const fbDate = toZonedTime(new Date(fb.created_at), timezone);
                
                return (
                  <React.Fragment key={fb.id}>
                    <tr 
                      onClick={() => toggleRow(fb.id)} 
                      className={`hover:bg-slate-50 transition-colors cursor-pointer group ${isExpanded ? "bg-slate-50" : ""}`}
                    >
                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-medium">{format(fbDate, "MMM d, yyyy")}</span>
                          <span className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {format(fbDate, "h:mm a")}
                          </span>
                        </div>
                      </td>
                      
                      {/* Customer Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {fb.customer_name ? (
                            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                <User className="w-3.5 h-3.5 text-slate-500" />
                              </div>
                              {fb.customer_name}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-xs">Anonymous</span>
                          )}
                          
                          {(fb.table_number || fb.qr_codes?.label) && (
                            <div className="flex gap-1.5 items-center">
                              <span className="text-slate-300">•</span>
                              {fb.table_number && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md uppercase">
                                  <MapPin className="w-3 h-3" /> T-{fb.table_number}
                                </span>
                              )}
                              {fb.qr_codes?.label && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-100 px-1.5 py-0.5 rounded-md uppercase">
                                  <QrCode className="w-3 h-3" /> {fb.qr_codes.label}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= fb.rating 
                                  ? "fill-amber-400 text-amber-400" 
                                  : "fill-slate-100 text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      {/* Sentiment */}
                      <td className="px-6 py-4">
                        {fb.rating >= 4 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                            <ArrowUpRight className="w-3 h-3" /> Positive
                          </span>
                        ) : fb.rating === 3 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                            Neutral
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">
                            <ArrowDownRight className="w-3 h-3" /> Needs Attention
                          </span>
                        )}
                      </td>

                      {/* Expand Toggle */}
                      <td className="px-6 py-4 text-right">
                        <button className={`p-1.5 rounded-md transition-colors ${isExpanded ? "bg-indigo-50 text-indigo-600" : "text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-200"}`}>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="px-0 py-0 border-b-2 border-slate-100">
                          <div className="bg-slate-50/50 px-6 py-5 border-t border-slate-100 whitespace-normal">
                            <div className="flex flex-col gap-4">
                              <div>
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Customer Comment</h4>
                                {fb.comment ? (
                                  <p className="text-slate-700 text-[14px] leading-relaxed max-w-3xl border-l-2 border-indigo-200 pl-4 py-1">
                                    "{fb.comment}"
                                  </p>
                                ) : (
                                  <p className="text-slate-400 italic text-sm">No written comment provided.</p>
                                )}
                              </div>
                              
                              {fb.contact_info && (
                                <div>
                                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contact Info</h4>
                                  <div className="flex items-center gap-2 text-sm text-slate-700 font-medium bg-white border border-slate-200 px-3 py-2 rounded-lg w-fit shadow-sm">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    {fb.contact_info}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
