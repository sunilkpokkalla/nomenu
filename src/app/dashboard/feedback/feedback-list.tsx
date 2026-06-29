"use client";

import React, { useState, useEffect, useMemo } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { 
  MessageSquare, Star, ArrowUpRight, ArrowDownRight, User, MapPin, 
  Mail, QrCode, Search, ChevronDown, ChevronUp, Clock, Filter, Sparkles, Send,
  ChevronLeft, ChevronRight, Download, Phone, AlertCircle
} from "lucide-react";
import { formatTimeAgoWithExact } from "@/lib/date-utils";
import { createBrowserClient } from "@supabase/ssr";
import { getRandomOfferForDay, DayCategory } from "@/lib/retention-offers";
import { getRandomLoyaltyIdeaForDay } from "@/lib/loyalty-offers";
import { fetchFeedbackOrderDetails } from "./fetch-order-action";

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
  recovery_request?: string | null;
  recovery_offer_given?: string | null;
  qr_codes?: { label: string | null; location_zone?: string | null } | null;
}

// Any because we just need basic fields
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OrderDetailsType = any;

type SortColumn = "date" | "rating";
type SortDirection = "asc" | "desc";
type RatingFilter = "all" | "positive" | "neutral" | "attention";

// Global AudioContext to prevent recreating it
let audioCtx: AudioContext | null = null;

export function FeedbackList({ feedbacks, timezone, restaurantId, supabaseUrl, supabaseAnonKey, recoveryOfferText }: { feedbacks: FeedbackData[], timezone: string, restaurantId: string, supabaseUrl: string, supabaseAnonKey: string, recoveryOfferText?: string }) {
  const [liveFeedbacks, setLiveFeedbacks] = useState<FeedbackData[]>(feedbacks);
  const [mounted, setMounted] = useState(false);
  
  // Table Controls State
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [sortColumn, setSortColumn] = useState<SortColumn>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Expanded Rows State
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [retentionOffers, setRetentionOffers] = useState<Record<string, ReturnType<typeof getRandomOfferForDay>>>({});
  const [loyaltyIdeas, setLoyaltyIdeas] = useState<Record<string, ReturnType<typeof getRandomLoyaltyIdeaForDay>>>({});
  const [orderDetailsMap, setOrderDetailsMap] = useState<Record<string, OrderDetailsType>>({});

  useEffect(() => {
    setMounted(true);
    
    // Initialize AudioContext on first user interaction to bypass browser autoplay blocks
    const initAudio = () => {
      if (!audioCtx) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    };

    // Attach to common interactions
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
  }, []);

  // Reset to page 1 when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ratingFilter, sortColumn, sortDirection]);

  // Distinct notification sound for feedback (Soft bubble pop / chime)
  const playFeedbackSound = () => {
    try {
      if (!audioCtx) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        audioCtx = new AudioContextClass();
      }

      // Resume context if it's suspended (browser auto-play policy)
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      // Soft sine wave
      osc.type = 'sine';
      
      // Bubble pop effect (sweep frequency up quickly)
      osc.frequency.setValueAtTime(500, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
      
      // Quick envelope
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.3);
    } catch(e) {
      console.error("Audio playback failed", e);
    }
  };

  const playUrgentSound = () => {
    try {
      if (!audioCtx) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        audioCtx = new AudioContextClass();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      // Urgent siren-like two-tone sound
      osc.type = 'square';
      
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.2);
      osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.4);
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.6);
      
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime + 0.75);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.8);
    } catch(e) {
      console.error("Urgent audio playback failed", e);
    }
  };

  // Real-time subscription
  useEffect(() => {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    console.log("Subscribing to realtime for customer_feedback...");
    const channel = supabase.channel(`feedbacks-${restaurantId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "customer_feedback" },
        async (payload) => {
          console.log("Realtime payload received!", payload);
          
          const recordId = payload.eventType === "DELETE" ? payload.old.id : payload.new.id;
          
          if (payload.eventType === "DELETE") {
            setLiveFeedbacks(prev => prev.filter(fb => fb.id !== recordId));
            return;
          }

          const { data: fullFeedback } = await supabase
            .from("customer_feedback")
            .select("*, qr_codes(label, location_zone)")
            .eq("id", recordId)
            .single();
            
          if (fullFeedback) {
            setLiveFeedbacks(prev => {
              const existingIndex = prev.findIndex(fb => fb.id === fullFeedback.id);
              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = fullFeedback as FeedbackData;
                return updated;
              } else {
                return [fullFeedback as FeedbackData, ...prev];
              }
            });

            // Play appropriate sound based on event and contents
            if (payload.eventType === "INSERT") {
              playFeedbackSound();
            } else if (payload.eventType === "UPDATE") {
              const oldReq = payload.old.recovery_request;
              const newReq = payload.new.recovery_request;
              const oldContact = payload.old.contact_info;
              const newContact = payload.new.contact_info;
              
              if (newReq === "manager_visit" && oldReq !== "manager_visit") {
                playUrgentSound();
              } else if (newContact?.includes("URGENT") && !oldContact?.includes("URGENT")) {
                playUrgentSound();
              }
            }
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });
    return () => { supabase.removeChannel(channel); };
  }, [restaurantId, supabaseUrl, supabaseAnonKey]);

  // Derived state (filtering & sorting)
  const processedFeedbacks = useMemo(() => {
    let result = [...liveFeedbacks];

    // Filter by Date Range
    if (dateFrom || dateTo) {
      result = result.filter(fb => {
        const fbDate = new Date(fb.created_at);
        // Start of day for dateFrom, End of day for dateTo for inclusive range
        if (dateFrom) {
          const from = new Date(dateFrom);
          from.setHours(0, 0, 0, 0);
          if (fbDate < from) return false;
        }
        if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          if (fbDate > to) return false;
        }
        return true;
      });
    }

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
        (fb.contact_info?.toLowerCase().includes(lowerQuery)) ||
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
  }, [liveFeedbacks, ratingFilter, searchQuery, sortColumn, sortDirection, dateFrom, dateTo]);

  // Pagination logic
  const totalPages = Math.ceil(processedFeedbacks.length / itemsPerPage);
  const paginatedFeedbacks = processedFeedbacks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownloadCSV = () => {
    if (processedFeedbacks.length === 0) return;

    const headers = ["Date", "Time", "Customer Name", "Contact Info", "Table/Location", "Rating", "Sentiment", "Comment"];
    
    const escapeCSV = (str?: string | null) => {
      if (!str) return "";
      const escaped = str.toString().replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const rows = processedFeedbacks.map(fb => {
      const fbDate = toZonedTime(new Date(fb.created_at), timezone);
      const sentiment = fb.rating >= 4 ? "Positive" : fb.rating === 3 ? "Neutral" : "Needs Attention";
      const location = [fb.table_number ? `T-${fb.table_number}` : "", fb.qr_codes?.label || ""].filter(Boolean).join(" ");
      
      return [
        escapeCSV(format(fbDate, "yyyy-MM-dd")),
        escapeCSV(format(fbDate, "HH:mm:ss")),
        escapeCSV(fb.customer_name),
        escapeCSV(fb.contact_info),
        escapeCSV(location),
        escapeCSV(fb.rating.toString()),
        escapeCSV(sentiment),
        escapeCSV(fb.comment)
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nomenu-customer-feedback-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortDirection(prev => prev === "desc" ? "asc" : "desc");
    } else {
      setSortColumn(col);
      setSortDirection("desc"); // Default to desc when switching columns
    }
  };

  const toggleRow = async (fb: FeedbackData) => {
    const id = fb.id;
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Generate a retention offer if it's a poor rating and we don't have one yet
        if (fb.rating <= 3 && !retentionOffers[id]) {
          setRetentionOffers(currentOffers => ({
            ...currentOffers,
            [id]: recoveryOfferText 
              ? { id: 'custom', text: recoveryOfferText, category: 'monday' as DayCategory }
              : getRandomOfferForDay(fb.created_at)
          }));
        }
        // Generate a loyalty idea if it's a great rating and we don't have one yet
        if (fb.rating >= 4 && !loyaltyIdeas[id]) {
          setLoyaltyIdeas(currentIdeas => ({
            ...currentIdeas,
            [id]: getRandomLoyaltyIdeaForDay(fb.created_at)
          }));
        }
        
        // Fetch order details if table number exists and we haven't fetched yet
        if (fb.table_number && !orderDetailsMap[id]) {
          fetchFeedbackOrderDetails(restaurantId, fb.table_number, fb.created_at).then((order) => {
            if (order) {
              setOrderDetailsMap(current => ({ ...current, [id]: order }));
            } else {
              setOrderDetailsMap(current => ({ ...current, [id]: { not_found: true } }));
            }
          });
        }
      }
      return next;
    });
  };

  if (!mounted) return null;

  let lastDateStr = "";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Table Controls Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2 whitespace-nowrap">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          Feedback Submissions
        </h2>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
          {/* Search */}
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search comments, names, tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 w-full sm:w-64"
            />
          </div>
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <input 
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 w-full sm:w-auto"
            />
            <span className="text-slate-400 text-sm">to</span>
            <input 
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 w-full sm:w-auto"
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

          {/* Download CSV */}
          <button
            onClick={handleDownloadCSV}
            disabled={processedFeedbacks.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Download CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>
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
            {paginatedFeedbacks.length === 0 ? (
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
              paginatedFeedbacks.map((fb) => {
                const isExpanded = expandedRows.has(fb.id);
                const fbDate = toZonedTime(new Date(fb.created_at), timezone);
                const dateStr = format(fbDate, "MMM d, yyyy");
                
                let dateHeader = null;
                // Only show date groupings if we are sorting by date
                if (sortColumn === "date" && dateStr !== lastDateStr) {
                  lastDateStr = dateStr;
                  let headerText = dateStr;
                  if (isToday(fbDate)) headerText = "Today";
                  else if (isYesterday(fbDate)) headerText = "Yesterday";
                  
                  dateHeader = (
                    <tr key={`header-${dateStr}`} className="bg-slate-100/60 border-b border-slate-200">
                      <td colSpan={5} className="px-6 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {headerText}
                      </td>
                    </tr>
                  );
                }
                
                return (
                  <React.Fragment key={fb.id}>
                    {dateHeader}
                    <tr 
                      onClick={() => toggleRow(fb)} 
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
                        <div className="flex flex-col gap-1.5">
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
                                    <QrCode className="w-3 h-3" /> 
                                    {fb.qr_codes.label} 
                                    {fb.qr_codes.location_zone && ` (${fb.qr_codes.location_zone})`}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          {fb.contact_info && (
                            <div className="flex items-center gap-1 text-xs pl-7 mt-1 font-medium">
                              {fb.contact_info.includes('URGENT') ? (
                                <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 flex items-center gap-1">
                                  <ArrowDownRight className="w-3 h-3" />
                                  {fb.contact_info}
                                </span>
                              ) : (
                                <span className="text-slate-500 flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {fb.contact_info}
                                </span>
                              )}
                            </div>
                          )}
                          
                          {fb.recovery_request === 'compensation' && (
                            <div className="flex items-center gap-1 text-xs pl-7 mt-1 font-medium">
                              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                Requested Compensation
                              </span>
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
                            <div className="flex flex-col md:flex-row gap-6 lg:gap-12 w-full">
                              
                              {/* Left Side: Original Feedback */}
                              <div className="flex flex-col gap-4 flex-1">
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
                                
                                {orderDetailsMap[fb.id] && !orderDetailsMap[fb.id].not_found && (
                                  <div className="mt-2">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Order Details</h4>
                                    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm text-sm text-slate-700">
                                      <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-100">
                                        <span className="font-semibold">Order #{orderDetailsMap[fb.id].daily_order_number || orderDetailsMap[fb.id].id.slice(0,6).toUpperCase()}</span>
                                        <span className="text-xs text-slate-500">{format(new Date(orderDetailsMap[fb.id].created_at), "h:mm a")}</span>
                                      </div>
                                      <ul className="space-y-1.5">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {orderDetailsMap[fb.id].order_items?.map((item: any, i: number) => (
                                          <li key={i} className="flex justify-between">
                                            <span>{item.quantity}x {item.menu_items?.name || 'Unknown Item'}</span>
                                            <span className="text-slate-500">${(item.price_at_time_of_order * item.quantity).toFixed(2)}</span>
                                          </li>
                                        ))}
                                      </ul>
                                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 font-bold text-slate-900">
                                        <span>Total</span>
                                        <span>${orderDetailsMap[fb.id].total_amount?.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Right Side: Strategy Engine (Retention OR Loyalty) */}
                              
                              {/* Negative Feedback: Retention Strategy */}
                              {fb.recovery_request === 'compensation' ? (
                                <div className="flex-1 max-w-lg">
                                  <div className="bg-emerald-50 border-2 border-emerald-100 rounded-xl overflow-hidden shadow-sm relative">
                                    <div className="bg-emerald-100/50 px-4 py-2.5 border-b border-emerald-100 flex items-center justify-between">
                                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                                        <Sparkles className="w-4 h-4" />
                                        Service Recovery Successful
                                      </div>
                                      <span className="text-[10px] font-bold bg-white text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                                        OFFER CLAIMED
                                      </span>
                                    </div>
                                    <div className="p-4 flex flex-col gap-3">
                                      <p className="text-sm text-emerald-800 font-medium">
                                        The customer accepted the following automated compensation offer on {format(new Date(fb.created_at), "MMM d, yyyy")}:
                                      </p>
                                      <div className="bg-white border border-emerald-200 p-3 rounded-lg text-emerald-900 text-sm italic font-medium leading-relaxed">
                                        "{fb.recovery_offer_given || "15% off next visit"}"
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : fb.recovery_request === 'contact_later' ? (
                                <div className="flex-1 max-w-lg">
                                  <div className="bg-blue-50 border-2 border-blue-100 rounded-xl overflow-hidden shadow-sm relative">
                                    <div className="bg-blue-100/50 px-4 py-2.5 border-b border-blue-100 flex items-center justify-between">
                                      <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs uppercase tracking-wider">
                                        <Phone className="w-4 h-4" />
                                        Contact Requested
                                      </div>
                                    </div>
                                    <div className="p-4 flex flex-col gap-3">
                                      <p className="text-sm text-blue-800 font-medium">
                                        The customer requested a follow-up. Please reach out to them at your earliest convenience to resolve their concerns.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ) : fb.rating <= 3 && retentionOffers[fb.id] && (
                                <div className="flex-1 max-w-lg">
                                  <div className="bg-white border-2 border-rose-100 rounded-xl overflow-hidden shadow-sm relative">
                                    <div className="bg-rose-50 px-4 py-2.5 border-b border-rose-100 flex items-center justify-between">
                                      <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs uppercase tracking-wider">
                                        <Sparkles className="w-4 h-4" />
                                        Retention Strategy
                                      </div>
                                      <span className="text-[10px] font-bold bg-white text-rose-600 px-2 py-0.5 rounded-full border border-rose-100">
                                        {retentionOffers[fb.id].category.toUpperCase()} OFFER
                                      </span>
                                    </div>
                                    <div className="p-4 flex flex-col gap-3">
                                      <p className="text-sm text-slate-600 font-medium">
                                        Don't let this customer leave unhappy. Win them back by sending this exact offer right now:
                                      </p>
                                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-800 text-sm italic font-medium leading-relaxed">
                                        "{retentionOffers[fb.id].text}"
                                      </div>
                                      
                                      {fb.contact_info ? (
                                        <button 
                                          onClick={() => {
                                            const isEmail = fb.contact_info?.includes('@');
                                            const message = retentionOffers[fb.id].text;
                                            
                                            if (isEmail) {
                                              const subject = encodeURIComponent("So sorry about your experience - let us make it right");
                                              const body = encodeURIComponent(`Hi ${fb.customer_name || 'there'},\n\nI am the manager at our restaurant, and I saw your recent feedback. I am so sorry we missed the mark. \n\n${message}\n\nPlease let me know when you plan to come back so I can ensure you have a perfect experience.\n\nBest,\nManager`);
                                              window.open(`mailto:${fb.contact_info}?subject=${subject}&body=${body}`, '_blank');
                                            } else {
                                              const body = encodeURIComponent(`Hi ${fb.customer_name || 'there'}, this is the manager. I saw your feedback & am so sorry. ${message}. Show this text on your next visit!`);
                                              window.open(`sms:${fb.contact_info}?body=${body}`, '_blank');
                                            }
                                          }}
                                          className="mt-1 w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                                        >
                                          <Send className="w-4 h-4" />
                                          Send Offer to Customer
                                        </button>
                                      ) : (
                                        <div className="mt-1 p-2.5 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-xs flex items-start gap-2">
                                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                          <p>No contact info provided. If they are still in the restaurant, approach their table manually to offer this.</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Positive Feedback: Loyalty Strategy */}
                              {fb.rating >= 4 && loyaltyIdeas[fb.id] && (
                                <div className="flex-1 max-w-lg">
                                  <div className="bg-white border-2 border-emerald-100 rounded-xl overflow-hidden shadow-sm relative">
                                    <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 flex items-center justify-between">
                                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                                        <Sparkles className="w-4 h-4" />
                                        Loyalty Strategy
                                      </div>
                                      <span className="text-[10px] font-bold bg-white text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                                        {loyaltyIdeas[fb.id].category.toUpperCase()} IDEA
                                      </span>
                                    </div>
                                    <div className="p-4 flex flex-col gap-3">
                                      <p className="text-sm text-slate-600 font-medium">
                                        This customer loves you! Turn them into a raving regular by sending them this special surprise:
                                      </p>
                                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-800 text-sm italic font-medium leading-relaxed">
                                        "{loyaltyIdeas[fb.id].text}"
                                      </div>
                                      
                                      {fb.contact_info ? (
                                        <button 
                                          onClick={() => {
                                            const isEmail = fb.contact_info?.includes('@');
                                            const message = loyaltyIdeas[fb.id].text;
                                            
                                            if (isEmail) {
                                              const subject = encodeURIComponent("Thank you for your amazing review!");
                                              const body = encodeURIComponent(`Hi ${fb.customer_name || 'there'},\n\nI am the manager at our restaurant. We saw your recent glowing review and it made our whole team's day!\n\nAs a token of our appreciation, ${message}\n\nPlease let us know when you plan to come back!\n\nBest,\nManager`);
                                              window.open(`mailto:${fb.contact_info}?subject=${subject}&body=${body}`, '_blank');
                                            } else {
                                              const body = encodeURIComponent(`Hi ${fb.customer_name || 'there'}, manager here! Thanks for the amazing review! As a thank you, ${message}. Show this text on your next visit!`);
                                              window.open(`sms:${fb.contact_info}?body=${body}`, '_blank');
                                            }
                                          }}
                                          className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                                        >
                                          <Send className="w-4 h-4" />
                                          Send Reward to Customer
                                        </button>
                                      ) : (
                                        <div className="mt-1 text-center py-2 text-xs text-emerald-600 font-medium bg-emerald-50 rounded-lg">
                                          No contact info provided to send reward.
                                        </div>
                                      )}
                                    </div>
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

      {/* Pagination Footer */}
      {processedFeedbacks.length > 0 && (
        <div className="border-t border-slate-200 p-4 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-slate-900">{Math.min(currentPage * itemsPerPage, processedFeedbacks.length)}</span> of <span className="font-medium text-slate-900">{processedFeedbacks.length}</span> results
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="text-sm font-medium text-slate-700 px-2">
              Page {currentPage} of {totalPages || 1}
            </div>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-500">
            Show
            <select 
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-200 rounded-md bg-white py-1 pl-2 pr-6 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
