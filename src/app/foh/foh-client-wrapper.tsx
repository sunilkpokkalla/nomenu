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
      <button
        onClick={toggleFullscreen}
        className={`absolute top-6 right-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
          isFullscreen 
            ? "bg-slate-800 hover:bg-slate-700 text-white" 
            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
        }`}
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen FOH"}</span>
      </button>

      {/* Main Content */}
      {children}
    </div>
  );
}
