"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { BellRing, X } from "lucide-react";

type GlobalOrderListenerProps = {
  restaurantId: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export function GlobalOrderListener({
  restaurantId,
  supabaseUrl,
  supabaseAnonKey,
}: GlobalOrderListenerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [notification, setNotification] = useState<{ id: string; title: string; subtitle: string; link: string } | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx && !audioContextRef.current) {
      audioContextRef.current = new AudioCtx();
    }

    const unlockAudio = () => {
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume().catch((e) => console.error(e));
      }
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  const playNotificationSound = useCallback(() => {
    const isPreferred = localStorage.getItem(`nomenu_kds_sound_${restaurantId}`) !== "false";
    if (!isPreferred) return;

    try {
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state !== "running") return;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gain1.gain.setValueAtTime(0, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1108.73, ctx.currentTime + 0.1);
      gain2.gain.setValueAtTime(0, ctx.currentTime + 0.1);
      gain2.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, [restaurantId]);

  const playFeedbackSound = useCallback(() => {
    const isPreferred = localStorage.getItem(`nomenu_kds_sound_${restaurantId}`) !== "false";
    if (!isPreferred) return;

    try {
      const audioCtx = audioContextRef.current;
      if (!audioCtx || audioCtx.state !== 'running') return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.5);
    } catch(e) {
      console.error("Feedback audio playback failed", e);
    }
  }, [restaurantId]);

  const playUrgentSound = useCallback(() => {
    const isPreferred = localStorage.getItem(`nomenu_kds_sound_${restaurantId}`) !== "false";
    if (!isPreferred) return;

    try {
      const audioCtx = audioContextRef.current;
      if (!audioCtx || audioCtx.state !== 'running') return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = "square";
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.2); // E5
      osc.frequency.setValueAtTime(440, audioCtx.currentTime + 0.4); // A4
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.6); // E5
      
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.8);
    } catch(e) {
      console.error("Urgent audio playback failed", e);
    }
  }, [restaurantId]);

  useEffect(() => {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    const channel = supabase
      .channel(`global-orders-${restaurantId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurantId}` },
        (payload) => {
          const status = payload.new.status;
          
          // Only alert for brand new incoming orders
          if (status === "pending" || status === "awaiting_payment") {
            const isTakeaway = payload.new.customer_phone !== null;
            
            // Skip if the current page already natively handles this specific order type
            if (isTakeaway && pathname?.startsWith("/dashboard/takeaway")) return;
            if (!isTakeaway && pathname?.startsWith("/dashboard/orders")) return;
            if (pathname?.startsWith("/dashboard/cashier")) return; // Cashier handles everything
            
            const notifiedKey = `notified_order_${payload.new.id}`;
            if (!localStorage.getItem(notifiedKey)) {
              localStorage.setItem(notifiedKey, "true");
              playNotificationSound();
              // Clean up the key after a few seconds to prevent memory leak
              setTimeout(() => localStorage.removeItem(notifiedKey), 10000);
            }
            
            setNotification({
              id: payload.new.id,
              title: `New ${isTakeaway ? "Takeaway" : "Dine-In"} Order!`,
              subtitle: payload.new.customer_name || (payload.new.table_number ? `Table ${payload.new.table_number}` : "Incoming Order"),
              link: isTakeaway ? "/dashboard/takeaway" : "/dashboard/orders"
            });

            setTimeout(() => {
              setNotification(null);
            }, 6000);
          }
        }
      )
      .subscribe();

    const feedbackChannel = supabase
      .channel(`global-feedbacks-${restaurantId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "customer_feedback" },
        (payload) => {
          if (pathname?.startsWith("/dashboard/feedback")) return;

          if (payload.eventType === "INSERT") {
            const notifiedKey = `notified_feedback_${payload.new.id}`;
            if (!localStorage.getItem(notifiedKey)) {
              localStorage.setItem(notifiedKey, "true");
              playFeedbackSound();
              // Clean up the key after a few seconds to prevent memory leak
              setTimeout(() => localStorage.removeItem(notifiedKey), 10000);
              setNotification({
                id: payload.new.id,
                title: "New Customer Feedback",
                subtitle: `Table ${payload.new.table_number || "?"} left a review`,
                link: "/dashboard/feedback"
              });
              setTimeout(() => setNotification(null), 6000);
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
                // Clean up the key after a few seconds to prevent memory leak
                setTimeout(() => localStorage.removeItem(notifiedKey), 10000);
                setNotification({
                  id: payload.new.id,
                  title: "🚨 URGENT: Manager Requested",
                  subtitle: `Table ${payload.new.table_number || "?"} requested a manager!`,
                  link: "/dashboard/feedback"
                });
                setTimeout(() => setNotification(null), 10000);
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(feedbackChannel);
    };
  }, [restaurantId, supabaseUrl, supabaseAnonKey, pathname, playNotificationSound, playFeedbackSound, playUrgentSound]);

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-4 flex items-start gap-4 min-w-[300px]">
        <div className="bg-emerald-500/20 p-2.5 rounded-xl shrink-0 mt-0.5 border border-emerald-500/30">
          <BellRing className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0 pr-4">
          <h4 className="font-bold text-white text-sm truncate">{notification.title}</h4>
          <p className="text-slate-400 text-xs mt-0.5 truncate">{notification.subtitle}</p>
          <button 
            onClick={() => {
              setNotification(null);
              router.push(notification.link);
            }}
            className="mt-3 text-[10px] uppercase font-bold tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View Order →
          </button>
        </div>
        <button 
          onClick={() => setNotification(null)}
          className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
