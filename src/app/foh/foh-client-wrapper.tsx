"use client";

import { Maximize, Minimize } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function FohClientWrapper({ children }: { children: React.ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full min-h-screen bg-slate-50 overflow-auto ${
        isFullscreen ? "fixed inset-0 z-[100] h-screen w-screen" : ""
      }`}
    >
      {/* Main Content */}
      {children}
    </div>
  );
}
