"use client";

import { Check, X, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const COMPARISON_DATA = [
  {
    feature: "Monthly Charges",
    legacy: "$135–$300+ /mo",
    addon: "POS Cost + ~$50–$100/mo",
    nomenu: "$0 to start",
  },
  {
    feature: "Hardware",
    legacy: "Proprietary ($349–$1,799+)",
    addon: "Needs $349+ POS underneath",
    nomenu: "$0 (Your own devices)",
  },
  {
    feature: "Contract",
    legacy: "Multi-year",
    addon: "Varies",
    nomenu: "None. Cancel anytime",
  },
  {
    feature: "Setup",
    legacy: "Sales call + install",
    addon: "POS integration",
    nomenu: "15 min, self-serve",
  },
  {
    feature: "KDS & Kitchen",
    legacy: "Paid add-on (+$25/mo)",
    addon: "Paid add-on (+$25/mo)",
    nomenu: "Included",
  },
  {
    feature: "Loyalty Program",
    legacy: "Paid add-on (+$50/mo)",
    addon: "Paid add-on (+$50/mo)",
    nomenu: "Included",
  },
];

export function CompetitiveComparison() {
  return (
    <section id="compare" className="relative py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-4">
            Everything they charge for.{" "}
            <span className="text-slate-400">Nothing they lock you into.</span>
          </h2>
          <p className="text-base text-slate-500 font-medium leading-relaxed">
            Legacy platforms lock you into hardware and multi-year contracts. 
            Payment add-ons still need an expensive POS underneath. 
            NoMenu gives you everything, without the trap.
          </p>
        </div>

        {/* Compact Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider w-1/4">
                    Features
                  </th>
                  <th className="px-6 py-4 text-center border-l border-slate-200 w-1/4">
                    <p className="text-base font-bold text-slate-900">Legacy POS</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Toast, Clover</p>
                  </th>
                  <th className="px-6 py-4 text-center border-l border-slate-200 w-1/4">
                    <p className="text-base font-bold text-slate-900">Payment Add-ons</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Sunday</p>
                  </th>
                  <th className="px-6 py-4 text-center border-l border-slate-200 bg-indigo-50/50 w-1/4">
                    <p className="text-xl font-black text-indigo-600">NoMenu</p>
                    <div className="inline-flex items-center gap-1 mt-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      <Check className="w-3 h-3" /> Recommended
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARISON_DATA.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center border-l border-slate-100 font-medium text-slate-500">
                      {row.legacy}
                    </td>
                    <td className="px-6 py-4 text-center border-l border-slate-100 font-medium text-slate-500">
                      {row.addon}
                    </td>
                    <td className="px-6 py-4 text-center border-l border-slate-100 bg-indigo-50/30 font-bold text-indigo-700">
                      {row.nomenu}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td className="px-6 py-4" />
                  <td className="px-6 py-4 text-center border-l border-slate-200">
                    <div className="flex flex-col items-center justify-center">
                      <X className="w-4 h-4 text-slate-400 mb-1" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Locked In</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center border-l border-slate-200">
                    <div className="flex flex-col items-center justify-center">
                      <Info className="w-4 h-4 text-slate-400 mb-1" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Requires POS</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center border-l border-slate-200 bg-indigo-50/50">
                    <Link href="/signup" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                      Start Free Today
                    </Link>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center px-4">
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xl mx-auto">
            Based on publicly available pricing as of July 2026. Trademarks (Toast, Clover, Sunday) belong to their respective owners. <br className="hidden sm:block" />
            Sources: vendor pricing pages and independent industry reviews.
          </p>
        </div>

      </div>
    </section>
  );
}
