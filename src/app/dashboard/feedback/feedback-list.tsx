"use client";

import React, { useState, useEffect, useMemo } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { 
  MessageSquare, Star, ArrowUpRight, ArrowDownRight, User, MapPin, 
  Mail, QrCode, Search, ChevronDown, ChevronUp, Clock, Filter, Sparkles, Send,
  ChevronLeft, ChevronRight, Download, Phone, AlertCircle, CheckCircle2, Check, Award
} from "lucide-react";
import { formatOrderNumber } from "@/lib/utils";
import { resolveManagerRequest } from "./reward-actions";
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
  claim_status?: "issued" | "redeemed" | "expired" | null;
  claim_redeemed_at?: string | null;
  resolution_notes?: string | null;
  qr_codes?: { label: string | null; location_zone?: string | null } | null;
  loyalty_cards?: {
    id: string;
    stamps: number;
    last_stamp_at: string;
  }[] | null;
}

// Any because we just need basic fields
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OrderDetailsType = any;

type SortColumn = "date" | "rating";
type SortDirection = "asc" | "desc";
type RatingFilter = "all" | "positive" | "neutral" | "attention";

// Global AudioContext to prevent recreating it
let audioCtx: AudioContext | null = null;

export function FeedbackList({ feedbacks, timezone, restaurantId, restaurantCreatedAt, supabaseUrl, supabaseAnonKey, recoveryOfferText }: { feedbacks: FeedbackData[], timezone: string, restaurantId: string, restaurantCreatedAt?: string | null, supabaseUrl: string, supabaseAnonKey: string, recoveryOfferText?: string }) {
  const [liveFeedbacks, setLiveFeedbacks] = useState<FeedbackData[]>(feedbacks);
  const [mounted, setMounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // State for Manager Request Resolution Notes
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({});
  const [resolvedRequests, setResolvedRequests] = useState<Record<string, boolean>>({});
  
  // Table Controls State
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [sortColumn, setSortColumn] = useState<SortColumn>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [datePreset, setDatePreset] = useState<"today" | "7days" | "30days" | "all" | "custom">("today");

  const applyDatePreset = (preset: "today" | "7days" | "30days" | "all" | "custom") => {
    setDatePreset(preset);
    if (preset === "all" || preset === "custom") {
      setDateFrom("");
      setDateTo("");
      return;
    }
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    if (preset === "today") {
      setDateFrom(todayStr);
      setDateTo(todayStr);
    } else if (preset === "7days") {
      const past = new Date(today);
      past.setDate(today.getDate() - 7);
      setDateFrom(format(past, "yyyy-MM-dd"));
      setDateTo(todayStr);
    } else if (preset === "30days") {
      const past = new Date(today);
      past.setDate(today.getDate() - 30);
      setDateFrom(format(past, "yyyy-MM-dd"));
      setDateTo(todayStr);
    }
  };
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Expanded Rows State
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [retentionOffers, setRetentionOffers] = useState<Record<string, ReturnType<typeof getRandomOfferForDay>>>({});
  const [customRetentionText, setCustomRetentionText] = useState<Record<string, string>>({});
  const [retentionDeadline, setRetentionDeadline] = useState<Record<string, number>>({});
  const [loyaltyIdeas, setLoyaltyIdeas] = useState<Record<string, ReturnType<typeof getRandomLoyaltyIdeaForDay>>>({});
  const [sentRewards, setSentRewards] = useState<Record<string, boolean>>({});
  const [sentRetention, setSentRetention] = useState<Record<string, boolean>>({});


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

  // Apply default date preset on mount
  useEffect(() => {
    applyDatePreset("today");
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

  const fetchLatestFeedbacks = async () => {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    const { data } = await supabase
      .from("customer_feedback")
      .select("*, qr_codes(label, location_zone), loyalty_cards(id, stamps, last_stamp_at)")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })
      .limit(100);
      
    if (data) {
      // Create a map to preserve resolution notes properly
      setLiveFeedbacks((current) => {
        const newData = data as FeedbackData[];
        // We just replace the liveFeedbacks with the fresh data from the server
        // since resolution states are handled locally in separate state variables
        return newData;
      });
    }
  };

  // Polling Auto-Refresh Fallback (runs every 15 seconds)
  useEffect(() => {
    const interval = setInterval(fetchLatestFeedbacks, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId, supabaseUrl, supabaseAnonKey]);

  // Real-time subscription
  useEffect(() => {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    const channel = supabase.channel(`feedbacks-${restaurantId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "customer_feedback", filter: `restaurant_id=eq.${restaurantId}` },
        async (payload) => {
          
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
              const notifiedKey = `notified_feedback_${payload.new.id}`;
              if (!localStorage.getItem(notifiedKey)) {
                localStorage.setItem(notifiedKey, "true");
                playFeedbackSound();
                setTimeout(() => localStorage.removeItem(notifiedKey), 10000);
              }
            } else if (payload.eventType === "UPDATE") {
              const oldReq = payload.old.recovery_request;
              const newReq = payload.new.recovery_request;
              const oldContact = payload.old.contact_info;
              const newContact = payload.new.contact_info;
              
              const isManagerVisit = newReq === "manager_visit" && oldReq !== "manager_visit";
              const isUrgentContact = newContact?.includes("URGENT") && !oldContact?.includes("URGENT");
              
              if (isManagerVisit || isUrgentContact) {
                const notifiedKey = `notified_urgent_${payload.new.id}`;
                if (!localStorage.getItem(notifiedKey)) {
                  localStorage.setItem(notifiedKey, "true");
                  playUrgentSound();
                  setTimeout(() => localStorage.removeItem(notifiedKey), 10000);
                }
              }
            }
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [restaurantId, supabaseUrl, supabaseAnonKey]);

  // Derived state (filtering & sorting)
  const processedFeedbacks = useMemo(() => {
    let result = [...liveFeedbacks];

    // Filter by Date Range
    if (dateFrom || dateTo) {
      result = result.filter(fb => {
        const fbDate = toZonedTime(new Date(fb.created_at), timezone);
        const fbDateString = format(fbDate, 'yyyy-MM-dd');
        
        if (dateFrom && fbDateString < dateFrom) {
          return false;
        }
        if (dateTo && fbDateString > dateTo) {
          return false;
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
  }, [liveFeedbacks, ratingFilter, searchQuery, sortColumn, sortDirection, dateFrom, dateTo, timezone]);

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
    const isCurrentlyExpanded = expandedRows.has(id);
    
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    if (!isCurrentlyExpanded) {
      // Generate a retention offer if it's a poor rating and we don't have one yet
      if (fb.rating <= 3 && !retentionOffers[id]) {
        const newOffer = recoveryOfferText 
          ? { id: 'custom', text: recoveryOfferText, category: 'monday' as DayCategory }
          : getRandomOfferForDay(new Date(fb.created_at));
        setRetentionOffers(currentOffers => ({
          ...currentOffers,
          [id]: newOffer
        }));
        setCustomRetentionText(currentText => ({
          ...currentText,
          [id]: newOffer.text
        }));
        setRetentionDeadline(currentDeadline => ({
          ...currentDeadline,
          [id]: 7
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
  };

  if (!mounted) return null;

  let lastDateStr = "";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Table Controls Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex flex-col gap-4">
        <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          Feedback Submissions
        </h2>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
          {/* Search */}
          <div className="relative w-full md:w-80 flex-shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search comments, names, tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 w-full shadow-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">
            {/* Date Preset Filter */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-40">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select 
                value={datePreset}
                onChange={(e) => applyDatePreset(e.target.value as "today" | "7days" | "30days" | "all" | "custom")}
                className="pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 cursor-pointer appearance-none w-full shadow-sm font-medium"
              >
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="all">All Time</option>
                <option value="custom">Custom...</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Custom Date Inputs */}
            {datePreset === "custom" && (
              <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
                <input 
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 focus:bg-white transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 w-full sm:w-36 shadow-sm"
                />
                <span className="text-slate-400 text-sm font-medium">to</span>
                <input 
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 focus:bg-white transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 w-full sm:w-36 shadow-sm"
                />
              </div>
            )}
            
            {/* Rating Filter */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-44">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select 
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value as RatingFilter)}
                className="pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 cursor-pointer appearance-none w-full shadow-sm font-medium"
              >
                <option value="all">All Ratings</option>
                <option value="positive">Positive (4-5 Stars)</option>
                <option value="neutral">Neutral (3 Stars)</option>
                <option value="attention">Needs Attention (1-2 Stars)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Export Button */}
            <button
              onClick={() => {
                const csvData = liveFeedbacks.map(fb => ({
                  Date: format(new Date(fb.created_at), "yyyy-MM-dd HH:mm"),
                  Customer: fb.customer_name || "Anonymous",
                  Contact: fb.contact_info || "N/A",
                  Table: fb.table_number || "N/A",
                  Rating: fb.rating,
                  Comments: fb.comment || "",
                  Status: fb.status || "new",
                  "Recovery Action": fb.recovery_offer_given || "N/A"
                }));
                
                const headers = Object.keys(csvData[0]);
                const csvRows = [
                  headers.join(","),
                  ...csvData.map(row => 
                    headers.map(header => {
                      const val = row[header as keyof typeof row] || "";
                      return `"${val.toString().replace(/"/g, '""')}"`;
                    }).join(",")
                  )
                ];
                
                const blob = new Blob([csvRows.join("\\n")], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `nomenu-feedback-${format(new Date(), "yyyy-MM-dd")}.csv`;
                a.click();
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 flex-grow sm:flex-grow-0"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
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
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md uppercase">
                                  <MapPin className="w-3 h-3 text-slate-400" /> 
                                  {fb.table_number 
                                    ? (fb.table_number.toLowerCase().includes('table') ? fb.table_number : `Table ${fb.table_number}`)
                                    : (fb.qr_codes?.label 
                                        ? `${fb.qr_codes.label}${fb.qr_codes.location_zone ? ` (${fb.qr_codes.location_zone})` : ''}`
                                        : 'Unknown Location'
                                      )
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                          {fb.contact_info && fb.contact_info.trim().replace('|', '').length > 2 && (
                            <div className="flex items-center gap-1 text-xs pl-7 mt-1 font-medium">
                              {fb.contact_info.includes('URGENT') ? (
                                <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 flex items-center gap-1">
                                  <ArrowDownRight className="w-3 h-3" />
                                  {fb.contact_info}
                                </span>
                              ) : (
                                <span className="text-slate-500 flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {fb.contact_info.replace(/\|\s*$/, '')}
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
                          <div className="bg-slate-50/70 px-6 py-6 border-t border-slate-100 whitespace-normal shadow-inner">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                              
                              {/* Left Side: Bento Card for Feedback Details */}
                              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col">
                                <div className="mb-6 flex-grow">
                                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <MessageSquare className="w-3.5 h-3.5" /> Customer Comment
                                  </h4>
                                  {fb.comment ? (
                                    <p className="text-slate-800 text-[15px] font-medium leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-4">
                                      "{fb.comment}"
                                    </p>
                                  ) : (
                                    <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-4 flex items-center justify-center h-20">
                                      <p className="text-slate-400 italic text-sm">No written comment provided.</p>
                                    </div>
                                  )}
                                </div>
                                
                                {fb.contact_info && fb.contact_info.trim().replace('|', '').length > 2 && !fb.contact_info.includes('URGENT: Manager requested') && (
                                  <div className="mb-6">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Info</h4>
                                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-lg w-fit">
                                      <Mail className="w-4 h-4 text-slate-400" />
                                      {fb.contact_info.replace(/\|\s*$/, '')}
                                    </div>
                                  </div>
                                )}
                                
                                {orderDetailsMap[fb.id] && !orderDetailsMap[fb.id].not_found && (
                                  <div className="mt-auto">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Order Details</h4>
                                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm text-slate-700">
                                      <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200">
                                        <span className="font-semibold">Order #{orderDetailsMap[fb.id].daily_order_number ? formatOrderNumber(fb.table_number, orderDetailsMap[fb.id].daily_order_number, orderDetailsMap[fb.id].created_at, restaurantId, restaurantCreatedAt) : orderDetailsMap[fb.id].id.slice(0,6).toUpperCase()}</span>
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
                                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200 font-bold text-slate-900">
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
                                <div className="h-full">
                                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm h-full flex flex-col relative overflow-hidden">
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
                                <div className="h-full">
                                  <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm h-full flex flex-col relative overflow-hidden">
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
                              ) : (fb.recovery_request === 'manager_visit' || fb.contact_info?.includes('URGENT: Manager requested')) ? (
                                <div className="h-full">
                                  <div className="bg-rose-50 border border-rose-200 rounded-xl shadow-sm h-full flex flex-col relative overflow-hidden">
                                    <div className="bg-rose-100/50 px-4 py-2.5 border-b border-rose-100 flex items-center justify-between">
                                      <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs uppercase tracking-wider">
                                        <AlertCircle className="w-4 h-4" />
                                        In-Person Resolution
                                      </div>
                                    </div>
                                    <div className="p-4 flex flex-col gap-3 flex-grow">
                                      <p className="text-sm text-rose-800 font-medium mb-1">
                                        Customer requested a manager at their table. Once resolved, please log the outcome below.
                                      </p>
                                      
                                      {fb.resolution_notes || resolvedRequests[fb.id] ? (
                                        <div className="mt-auto">
                                          <div className="bg-white border border-rose-100 p-3 rounded-lg mb-2 text-rose-900 text-sm italic font-medium leading-relaxed">
                                            "{fb.resolution_notes || resolutionNotes[fb.id]}"
                                          </div>
                                          <button disabled className="w-full bg-slate-100 text-rose-700 border border-rose-200 font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-sm">
                                            <CheckCircle2 className="w-4 h-4 text-rose-500" />
                                            Resolved In-Person
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="mt-auto flex flex-col gap-2">
                                          <textarea 
                                            placeholder="e.g. Comped their appetizer, apologized for the delay."
                                            value={resolutionNotes[fb.id] || ""}
                                            onChange={(e) => setResolutionNotes(prev => ({...prev, [fb.id]: e.target.value}))}
                                            className="w-full text-sm border-rose-200 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 bg-white min-h-[60px] p-2"
                                          />
                                          <button 
                                            onClick={async () => {
                                              if (!resolutionNotes[fb.id]) return;
                                              
                                              try {
                                                const { success, error, details } = await resolveManagerRequest(fb.id, resolutionNotes[fb.id]);
                                                if (success) {
                                                  setResolvedRequests(prev => ({...prev, [fb.id]: true}));
                                                } else {
                                                  alert("Failed to save: " + (error || "Unknown error"));
                                                  console.error("Resolve error:", details);
                                                }
                                              } catch (err) {
                                                const errorMessage = err instanceof Error ? err.message : String(err);
                                                alert("Network error: " + errorMessage);
                                                console.error(err);
                                              }
                                            }}
                                            disabled={!resolutionNotes[fb.id]}
                                            className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                                          >
                                            <Check className="w-4 h-4" />
                                            Mark as Resolved
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : fb.rating <= 3 && retentionOffers[fb.id] && (
                                <div className="h-full">
                                  <div className="bg-white border border-rose-200 rounded-xl shadow-sm h-full flex flex-col relative overflow-hidden">
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
                                      <div className="flex flex-col gap-2">
                                        <textarea
                                          value={customRetentionText[fb.id] || retentionOffers[fb.id].text}
                                          onChange={(e) => setCustomRetentionText(prev => ({ ...prev, [fb.id]: e.target.value }))}
                                          className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-800 text-sm font-medium leading-relaxed resize-none w-full focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-colors"
                                          rows={3}
                                        />
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-xs font-semibold text-slate-600">Deadline:</span>
                                          <select 
                                            value={retentionDeadline[fb.id] || 7}
                                            onChange={(e) => setRetentionDeadline(prev => ({ ...prev, [fb.id]: parseInt(e.target.value) }))}
                                            className="text-xs border border-slate-200 rounded-md py-1 px-2 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-rose-400"
                                          >
                                            <option value={1}>24 Hours</option>
                                            <option value={7}>7 Days</option>
                                            <option value={14}>14 Days</option>
                                            <option value={30}>30 Days</option>
                                          </select>
                                        </div>
                                      </div>
                                      
                                      {fb.loyalty_cards && fb.loyalty_cards.length > 0 ? (
                                        sentRetention[fb.id] ? (
                                          <button 
                                            disabled
                                            className="mt-1 w-full bg-slate-100 text-rose-700 border border-rose-200 font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-sm"
                                          >
                                            <CheckCircle2 className="w-4 h-4 text-rose-500" />
                                            Offer Beamed to VIP Card!
                                          </button>
                                        ) : (
                                          <button 
                                            onClick={async () => {
                                              const baseMessage = customRetentionText[fb.id] || retentionOffers[fb.id].text;
                                              const deadlineDays = retentionDeadline[fb.id] || 7;
                                              const expirationDate = new Date();
                                              expirationDate.setDate(expirationDate.getDate() + deadlineDays);
                                              const messageWithDeadline = `${baseMessage} (Expires: ${expirationDate.toLocaleDateString()})`;
                                              
                                              const { sendLoyaltyReward } = await import("./reward-actions");
                                              await sendLoyaltyReward(fb.id, messageWithDeadline, fb.contact_info || null, restaurantId, fb.customer_name || null);
                                              setSentRetention(prev => ({...prev, [fb.id]: true}));
                                            }}
                                            className="mt-1 w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                                          >
                                            <Send className="w-4 h-4" />
                                            Beam Offer to VIP Card
                                          </button>
                                        )
                                      ) : fb.contact_info ? (
                                        <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm flex flex-col gap-2">
                                          <div className="flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                            <p>This customer provided contact info but hasn't claimed a Digital VIP Card, so we cannot beam offers directly to their phone.</p>
                                          </div>
                                          <div className="bg-white p-2 rounded border border-slate-100 mt-1">
                                            <p className="font-semibold text-xs text-slate-900 mb-1">PRO TIP:</p>
                                            <p className="text-xs text-slate-600 leading-relaxed">
                                              Don't let them walk out unhappy next time. Enable <strong>Automated Fallback Compensation</strong> in your settings. If a manager can't reach their table in time, the system will automatically offer them compensation on the spot!
                                            </p>
                                          </div>
                                        </div>
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
                                <div className="h-full">
                                  <div className="bg-white border border-emerald-200 rounded-xl shadow-sm h-full flex flex-col relative overflow-hidden">
                                    <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 flex items-center justify-between">
                                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                                        {fb.loyalty_cards && fb.loyalty_cards.length > 0 ? (
                                          <>
                                            <Award className="w-4 h-4" />
                                            VIP Member
                                          </>
                                        ) : (
                                          <>
                                            <Sparkles className="w-4 h-4" />
                                            Loyalty Strategy
                                          </>
                                        )}
                                      </div>
                                      <span className="text-[10px] font-bold bg-white text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                                        {fb.loyalty_cards && fb.loyalty_cards.length > 0 
                                          ? `${fb.loyalty_cards[0].stamps}/10 STAMPS` 
                                          : `${loyaltyIdeas[fb.id].category.toUpperCase()} IDEA`}
                                      </span>
                                    </div>
                                    <div className="p-4 flex flex-col gap-3">
                                      <p className="text-sm text-slate-600 font-medium">
                                        {fb.loyalty_cards && fb.loyalty_cards.length > 0
                                          ? "This customer is already a loyal regular! Beam a special surprise to their VIP card to keep them delighted:"
                                          : "This customer loves you! Turn them into a raving regular by sending them this special surprise:"}
                                      </p>
                                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-800 text-sm italic font-medium leading-relaxed">
                                        "{loyaltyIdeas[fb.id].text}"
                                      </div>
                                      
                                      {fb.loyalty_cards && fb.loyalty_cards.length > 0 ? (
                                        sentRewards[fb.id] ? (
                                          <button 
                                            disabled
                                            className="w-full mt-1 bg-slate-100 text-emerald-700 border border-emerald-200 font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm"
                                          >
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            Reward Beamed to VIP Card!
                                          </button>
                                        ) : (
                                          <button 
                                            onClick={async () => {
                                              const message = loyaltyIdeas[fb.id].text;
                                              const { sendLoyaltyReward } = await import("./reward-actions");
                                              await sendLoyaltyReward(fb.id, message, fb.contact_info || null, restaurantId, fb.customer_name || null);
                                              setSentRewards(prev => ({ ...prev, [fb.id]: true }));
                                            }}
                                            className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                                          >
                                            <Sparkles className="w-4 h-4" />
                                            Beam Reward to VIP Card
                                          </button>
                                        )
                                      ) : fb.contact_info ? (
                                        <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm flex flex-col gap-2">
                                          <div className="flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                            <p>This customer provided contact info but hasn't claimed a Digital VIP Card, so we cannot beam rewards directly to their phone.</p>
                                          </div>
                                        </div>
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
