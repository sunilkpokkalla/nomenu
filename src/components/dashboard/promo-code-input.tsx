"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tag, Check, Sparkles, X } from "lucide-react";

export function PromoCodeInput() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPromo = (searchParams.get("promo") || searchParams.get("ref") || searchParams.get("coupon") || "").toUpperCase().trim();
  const [inputCode, setInputCode] = useState(currentPromo);

  const is75Off = currentPromo === "INVITE75" || currentPromo === "75OFF" || currentPromo === "VIP75";
  const is50Off = currentPromo === "HALFPRICE" || currentPromo === "50OFF";

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("promo", inputCode.trim().toUpperCase());
    router.push(`?${params.toString()}`);
  };

  const handleRemove = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("promo");
    params.delete("ref");
    params.delete("coupon");
    setInputCode("");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="max-w-md mx-auto mb-10 bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
      {currentPromo && (is75Off || is50Off) ? (
        <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
          is75Off 
            ? "bg-purple-50 border-purple-200 text-purple-900" 
            : "bg-rose-50 border-rose-200 text-rose-900"
        }`}>
          <div className="flex items-center gap-2.5">
            <Sparkles className={`w-5 h-5 ${is75Off ? "text-purple-600 animate-pulse" : "text-rose-600 animate-pulse"}`} />
            <div>
              <div className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span>{is75Off ? "🎉 75% OFF VIP Invite Applied! (First 7 Days)" : "🔥 50% OFF Promo Applied!"}</span>
              </div>
              <p className="text-xs font-semibold opacity-80">
                Code <span className="font-mono underline">{currentPromo}</span> is active for checkout.
                {is75Off && <span className="block text-[11px] text-purple-700 font-normal mt-0.5">⏱️ Valid for 7 days from invite date; steps down to 50% OFF afterwards.</span>}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-1 rounded-lg hover:bg-slate-200/50 text-slate-500 transition-colors"
            title="Remove promo code"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Promo Code (e.g. INVITE75, HALFPRICE)"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 uppercase placeholder:normal-case placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" /> Apply
          </button>
        </form>
      )}
    </div>
  );
}
