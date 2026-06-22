"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";

interface WelcomeChecklistProps {
  menusCount: number;
  itemsCount: number;
  qrCodesCount: number;
}

export function WelcomeChecklist({ menusCount, itemsCount, qrCodesCount }: WelcomeChecklistProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const hasMenu = menusCount > 0;
  const hasItems = itemsCount > 0;
  const hasQrCode = qrCodesCount > 0;

  if ((hasMenu && hasItems && hasQrCode) || isDismissed) {
    return null;
  }

  const steps = [
    { 
      id: 1, 
      title: "Profile", 
      isCompleted: true, 
      isActive: false,
      href: null 
    },
    { 
      id: 2, 
      title: "Create Menu", 
      isCompleted: hasMenu, 
      isActive: !hasMenu,
      href: "/dashboard/menus" 
    },
    { 
      id: 3, 
      title: "Add Items", 
      isCompleted: hasItems, 
      isActive: hasMenu && !hasItems,
      href: hasMenu ? "/dashboard/items" : null 
    },
    { 
      id: 4, 
      title: "Print QR Code", 
      isCompleted: hasQrCode, 
      isActive: hasItems && !hasQrCode,
      href: hasItems ? "/dashboard/qrcodes" : null 
    }
  ];

  const progress = steps.filter((s) => s.isCompleted).length;
  const total = steps.length;
  const percentage = Math.round((progress / (total - 1)) * 100);

  return (
    <div className="mb-10 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Let's get your digital menu live.</h2>
          <p className="text-sm text-slate-500 mt-1">
            Complete these quick steps to fully configure your restaurant.
          </p>
        </div>
        <button 
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
          title="Dismiss setup guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stepper Container */}
      <div className="relative">
        
        {/* Background Progress Line */}
        <div className="absolute top-5 left-[5%] right-[5%] md:left-[10%] md:right-[10%] h-1 bg-slate-100 rounded-full" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-5 left-[5%] md:left-[10%] h-1 bg-primary rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${Math.min(percentage * 0.9, 100)}%` }} 
        />

        {/* Steps */}
        <div className="relative z-10 flex justify-between">
          {steps.map((step) => {
            const isClickable = step.href !== null;

            const NodeContent = () => (
              <div className="flex flex-col items-center group">
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300 ring-4 ring-white
                    ${step.isCompleted 
                      ? 'bg-primary text-white shadow-primary/20 scale-100' 
                      : step.isActive 
                        ? 'bg-white border-2 border-primary text-primary scale-110 shadow-lg' 
                        : 'bg-slate-100 text-slate-400 border border-slate-200 scale-100'}
                    ${isClickable ? 'group-hover:scale-110 group-hover:shadow-md' : ''}
                  `}
                >
                  {step.isCompleted ? <Check className="w-5 h-5" strokeWidth={3} /> : step.id}
                </div>
                <span 
                  className={`
                    mt-3 text-sm font-bold transition-colors duration-300 text-center
                    ${step.isCompleted 
                      ? 'text-slate-900' 
                      : step.isActive 
                        ? 'text-primary' 
                        : 'text-slate-400'}
                  `}
                >
                  {step.title}
                </span>
                {/* Optional mini label for CTA */}
                {step.isActive && (
                  <span className="mt-1 text-[10px] uppercase tracking-wider font-bold text-primary/60 bg-primary/10 px-2 py-0.5 rounded-full">
                    Up Next
                  </span>
                )}
              </div>
            );

            if (isClickable && step.href) {
              return (
                <Link key={step.id} href={step.href} className="w-24 md:w-32 outline-none">
                  <NodeContent />
                </Link>
              );
            }

            return (
              <div key={step.id} className={`w-24 md:w-32 ${!step.isCompleted && !step.isActive ? "opacity-60 grayscale" : ""}`}>
                <NodeContent />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
