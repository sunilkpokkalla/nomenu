/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Maximize, Minimize, AlertCircle, Star, MessageSquare, ExternalLink } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { formatTimeAgoWithExact } from "@/lib/date-utils";
import { markClaimRedeemed } from "@/app/dashboard/actions";
import { resolveManagerRequest } from "@/app/dashboard/feedback/reward-actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LiveFeedbackClient({ initialFeedback, restaurantId, supabaseUrl, supabaseAnonKey, timezone }: any) {
  const [feedbacks, setFeedbacks] = useState(initialFeedback);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => console.error(err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const playAlertSound = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    
    // Bubble pop effect for new feedback
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  };

  useEffect(() => {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

    const channel = supabase
      .channel("live_feedback_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "customer_feedback",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // Need to fetch related data like qr_codes since it's not in the insert payload
            const { data } = await supabase
              .from("customer_feedback")
              .select("*, qr_codes(label, location_zone), loyalty_cards(id, stamps, last_stamp_at)")
              .eq("id", payload.new.id)
              .single();

            if (data) {
              setFeedbacks((current: any) => [data, ...current]);
              playAlertSound();
            }
          } else if (payload.eventType === "UPDATE") {
            setFeedbacks((current: any) =>
              current.map((fb: any) => (fb.id === payload.new.id ? { ...fb, ...payload.new } : fb))
            );
          } else if (payload.eventType === "DELETE") {
            setFeedbacks((current: any) => current.filter((fb: any) => fb.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, supabaseUrl, supabaseAnonKey]);

  const handleDismiss = (id: string) => {
    setFeedbacks((current: any) => current.filter((fb: any) => fb.id !== id));
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col h-screen w-full bg-slate-100 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Live Feedback</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Real-Time Monitor</p>
          </div>
        </div>
        <button 
          onClick={toggleFullscreen}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-sm"
        >
          {isFullscreen ? (
            <><Minimize className="w-4 h-4" /> Exit Fullscreen</>
          ) : (
            <><Maximize className="w-4 h-4" /> Fullscreen</>
          )}
        </button>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {feedbacks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No feedback today</p>
              <p className="text-sm">Waiting for incoming responses...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
              {feedbacks.map((fb: any) => {
                const isCritical = fb.rating <= 2;
                const isWarning = fb.rating === 3;
                const isAttention = (isCritical || isWarning) && !fb.resolution_notes;
                
                let borderColor = 'border-slate-200';
                if (isAttention) {
                  borderColor = isCritical 
                    ? 'border-rose-300 shadow-rose-100 ring-2 ring-rose-500 ring-offset-2 animate-pulse' 
                    : 'border-orange-300 shadow-orange-100 ring-2 ring-orange-500 ring-offset-2 animate-pulse';
                }

                return (
                  <div 
                    key={fb.id} 
                    className={`relative p-5 rounded-2xl border bg-white shadow-sm transition-all duration-500 flex flex-col ${borderColor}`}
                  >
                    {isAttention && (
                      <div className={`absolute -top-3 -right-3 text-white p-1.5 rounded-full shadow-lg ${isCritical ? 'bg-rose-500' : 'bg-orange-500'}`}>
                        <AlertCircle className="w-5 h-5" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          let starColor = 'text-slate-200 fill-slate-200';
                          if (star <= fb.rating) {
                            if (fb.rating >= 4) starColor = 'text-emerald-500 fill-emerald-500';
                            else if (fb.rating === 3) starColor = 'text-orange-500 fill-orange-500';
                            else starColor = 'text-rose-500 fill-rose-500';
                          }
                          return (
                            <Star 
                              key={star} 
                              className={`w-5 h-5 ${starColor}`} 
                            />
                          );
                        })}
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        {formatTimeAgoWithExact(fb.created_at, timezone)}
                      </span>
                    </div>

                    {fb.qr_codes && (
                      <div className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded mb-3">
                        {fb.qr_codes.location_zone || "General"} • {fb.qr_codes.label || "QR"}
                      </div>
                    )}

                    {fb.comment ? (
                      <p className="text-slate-700 font-medium mb-4 text-sm leading-relaxed">
                        "{fb.comment}"
                      </p>
                    ) : (
                      <p className="text-slate-400 italic mb-4 text-sm leading-relaxed">
                        No comment provided.
                      </p>
                    )}

                    <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-slate-100">
                      {(fb.customer_name || fb.contact_info) && (
                        <div className="text-xs font-medium text-slate-500 flex flex-col">
                          <span className="text-slate-900 font-bold">{fb.customer_name || "Anonymous"}</span>
                          <span>{fb.contact_info}</span>
                        </div>
                      )}
                      
                      {fb.claim_status === "issued" && (
                        <div className="mt-2 p-2 bg-rose-50 border border-rose-100 rounded-lg flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-700 truncate mr-2">Claim Issued</span>
                          <button
                            onClick={async () => {
                              try {
                                await markClaimRedeemed(fb.id);
                                handleDismiss(fb.id);
                              } catch(e) {
                                console.error(e);
                              }
                            }}
                            className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white text-[10px] uppercase font-bold py-1 px-2 rounded transition-colors"
                          >
                            Redeem
                          </button>
                        </div>
                      )}

                      {isAttention ? (
                        <button
                          onClick={async () => {
                            try {
                              await resolveManagerRequest(fb.id, "Resolved via Live FOH");
                              handleDismiss(fb.id);
                            } catch(e) {
                              console.error(e);
                            }
                          }}
                          className="mt-2 w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDismiss(fb.id)}
                          className="mt-2 w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 text-xs font-bold py-2 rounded-lg transition-colors"
                        >
                          Dismiss from Board
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
