"use client";

import { useState, useEffect } from "react";
import { X, Share, PlusSquare } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
}

export function AddToHomeScreen() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if app is already installed / running in standalone mode
    const isAlreadyStandalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      (window.navigator as unknown as { standalone: boolean }).standalone === true;
      
    setIsStandalone(isAlreadyStandalone);

    // If not standalone and is iOS, we show the iOS specific manual prompt after a short delay
    if (isIosDevice && !isAlreadyStandalone) {
      const timer = setTimeout(() => {
        // Only show if they haven't dismissed it recently
        if (!localStorage.getItem("a2hs_dismissed")) {
          setShowPrompt(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Android/Chrome: Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!localStorage.getItem("a2hs_dismissed")) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Loyalty Card',
            url: window.location.href,
          });
        } catch (err) {
          console.error("Share failed", err);
        }
      } else {
        alert("To add this card, tap the Share icon at the bottom of your screen and select 'Add to Home Screen'.");
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("a2hs_dismissed", "true");
  };

  if (isStandalone || !showPrompt) {
    return null;
  }

  // Unified Clean Prompt
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border border-slate-200">
        <PlusSquare className="w-5 h-5 text-slate-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Add to Home Screen</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Save card to your phone</p>
      </div>
      <button 
        onClick={handleInstallClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
      >
        Install
      </button>
      <button onClick={handleDismiss} className="text-slate-400 hover:text-slate-600 ml-1 p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
