"use client";

import { ExternalLink, Maximize, Minimize } from "lucide-react";
import { useState, useEffect } from "react";

export function FohPopoutButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      
      const el = document.getElementById('foh-dashboard-container');
      if (el) {
        if (isFs) {
          el.classList.add("fixed", "inset-0", "z-[100]", "h-screen", "w-screen", "bg-slate-50", "max-w-none", "overflow-auto", "p-6");
        } else {
          el.classList.remove("fixed", "inset-0", "z-[100]", "h-screen", "w-screen", "bg-slate-50", "max-w-none", "overflow-auto", "p-6");
        }
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    const el = document.getElementById('foh-dashboard-container');
    if (!document.fullscreenElement) {
      el?.requestFullscreen().catch((err) => console.error(err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => window.open('/foh', '_blank')}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
      >
        <ExternalLink className="w-4 h-4" />
        Pop-out FOH
      </button>
      <button 
        onClick={toggleFullscreen}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
          isFullscreen 
            ? "bg-slate-800 hover:bg-slate-700 text-white" 
            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 shadow-lg"
        }`}
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen FOH"}</span>
      </button>
    </div>
  );
}
