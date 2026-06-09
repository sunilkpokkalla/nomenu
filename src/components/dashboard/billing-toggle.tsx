"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function BillingToggle() {
  const searchParams = useSearchParams();
  const isAnnual = searchParams.get("billing") === "annual";

  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <span className={`text-sm font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
      <Link 
        href={`?billing=${isAnnual ? 'monthly' : 'annual'}`}
        className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-900 transition-colors focus:outline-none"
        scroll={false}
      >
        <span 
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`}
        />
      </Link>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Annual</span>
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
          Save 20%
        </span>
      </div>
    </div>
  );
}
