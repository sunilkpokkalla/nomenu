"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OpsContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playOrderSound: () => void;
  playCheckoutSound: () => void;
  playFeedbackSound: () => void;
}

const OpsContext = createContext<OpsContextType | undefined>(undefined);

export function OpsProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const lastSoundTime = useRef(0);

  const toggleMute = () => setIsMuted((prev) => !prev);

  // Helper to throttle sounds so we don't get overlapping rings when multiple boards receive the same event
  const playSound = useCallback(
    (soundPath: string) => {
      if (isMuted) return;
      const now = Date.now();
      if (now - lastSoundTime.current < 2000) {
        return; // Ignore if a sound played in the last 2 seconds
      }
      lastSoundTime.current = now;
      
      try {
        const audio = new Audio(soundPath);
        audio.play().catch((e) => console.log("Audio play prevented by browser:", e));
      } catch (e) {
        console.error("Failed to play audio:", e);
      }
    },
    [isMuted]
  );

  const playOrderSound = useCallback(() => playSound("/sounds/new-order.mp3"), [playSound]);
  const playCheckoutSound = useCallback(() => playSound("/sounds/checkout.mp3"), [playSound]);
  const playFeedbackSound = useCallback(() => playSound("/sounds/feedback.mp3"), [playSound]);

  return (
    <OpsContext.Provider
      value={{
        isMuted,
        toggleMute,
        playOrderSound,
        playCheckoutSound,
        playFeedbackSound,
      }}
    >
      {children}
    </OpsContext.Provider>
  );
}

export function useOpsAudio() {
  const context = useContext(OpsContext);
  if (context === undefined) {
    return {
      isMuted: false,
      toggleMute: () => {},
      playOrderSound: () => {},
      playCheckoutSound: () => {},
      playFeedbackSound: () => {},
    };
  }
  return context;
}

export function GlobalMuteButton() {
  const { isMuted, toggleMute } = useOpsAudio();
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMute}
      className={`rounded-full shadow-sm transition-colors ${
        isMuted ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
      }`}
      title={isMuted ? "Unmute Alerts" : "Mute Alerts"}
    >
      {isMuted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
    </Button>
  );
}
