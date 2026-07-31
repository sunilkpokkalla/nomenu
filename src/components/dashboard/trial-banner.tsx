"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, AlertTriangle } from "lucide-react";

interface TrialBannerProps {
  createdAt?: string | null;
  plan: string;
}

export function TrialBanner({ createdAt, plan }: TrialBannerProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const isFreePlan = !plan || plan.toLowerCase() === "free";

  useEffect(() => {
    if (!isFreePlan || !createdAt) return;

    const calculateTimeLeft = () => {
      const createdTime = new Date(createdAt).getTime();
      const trialEndTime = createdTime + 24 * 60 * 60 * 1000;
      const difference = trialEndTime - Date.now();

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft(null);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [createdAt, isFreePlan]);

  // If they have upgraded, hide the trial banner completely
  if (!isFreePlan) return null;

  if (isExpired) {
    return (
      <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-2.5 flex items-center justify-between text-amber-800 text-xs font-bold shadow-sm transition-all duration-300">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Your 24-Hour All-Access Pass has expired. You are on the Free Plan.</span>
        </div>
        <Link 
          href="/dashboard/billing" 
          className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg transition-colors font-extrabold uppercase tracking-wider text-[10px]"
        >
          Upgrade Now
        </Link>
      </div>
    );
  }

  if (!timeLeft) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 border-b border-indigo-700 px-6 py-2.5 flex items-center justify-between text-white text-xs font-semibold shadow-sm transition-all duration-300">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse shrink-0" />
        <span>
          You have <strong className="text-white font-extrabold">{timeLeft} left</strong> of your <strong className="text-amber-300 font-extrabold">All-Access Pass</strong>. Premium features are unlocked!
        </span>
      </div>
      <Link 
        href="/dashboard/billing" 
        className="bg-white hover:bg-slate-50 text-indigo-700 px-3.5 py-1 rounded-lg font-extrabold uppercase tracking-wider text-[10px] shadow-sm transition-all hover:scale-[1.02]"
      >
        Lock in Elite
      </Link>
    </div>
  );
}
