import React from 'react';
import { ChefHat, Clock, CheckCircle2, QrCode } from 'lucide-react';

export function DualDeviceMockup() {
  return (
    <div className="w-full h-full bg-[#f8fafc] relative flex items-center justify-center overflow-hidden">
      
      {/* iPad Mockup (KDS) */}
      <div className="absolute left-[10%] md:left-[15%] w-[60%] md:w-[65%] h-[85%] bg-[#0f1115] rounded-[2rem] border-[6px] border-slate-800 shadow-2xl overflow-hidden flex flex-col transform rotate-[-2deg] transition-transform duration-700 hover:rotate-0">
        
        {/* iPad Top Bar */}
        <div className="h-4 w-full flex justify-center mt-2">
          <div className="w-16 h-1.5 bg-slate-800 rounded-full" />
        </div>

        {/* KDS App */}
        <div className="flex-1 p-3 md:p-5 flex flex-col gap-4 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center text-white">
            <h3 className="text-sm md:text-base font-bold tracking-tight">KDS Console</h3>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
          </div>

          {/* Columns */}
          <div className="flex gap-3 h-full">
            {/* New Orders */}
            <div className="flex-1 bg-[#1a1d24] rounded-xl border border-slate-800 p-2 md:p-3 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-slate-300 mb-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider">New</span>
              </div>
              
              {/* Order Card 1 */}
              <div className="bg-[#2d323b] rounded-lg p-2.5 border border-slate-700 shadow-sm relative">
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-black text-xs md:text-sm">#104</span>
                  <span className="text-[8px] md:text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">PAID</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <span className="text-[8px] md:text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-1 rounded">2x</span>
                    <span className="text-[9px] md:text-xs text-slate-200 font-semibold leading-tight">Truffle Burger</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[8px] md:text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-1 rounded">1x</span>
                    <span className="text-[9px] md:text-xs text-slate-200 font-semibold leading-tight">Sweet Potato Fries</span>
                  </div>
                </div>
              </div>

              {/* Order Card 2 */}
              <div className="bg-[#2d323b] rounded-lg p-2.5 border border-slate-700 shadow-sm opacity-60">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-black text-xs md:text-sm">#105</span>
                  <span className="text-[8px] md:text-[10px] border border-rose-500/30 text-rose-400 px-1.5 py-0.5 rounded font-bold">UNPAID</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <span className="text-[8px] md:text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-1 rounded">1x</span>
                    <span className="text-[9px] md:text-xs text-slate-200 font-semibold leading-tight">Spicy Tuna Roll</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preparing */}
            <div className="flex-1 bg-[#1a1d24] rounded-xl border border-slate-800 p-2 md:p-3 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-slate-300 mb-1">
                <ChefHat className="w-3 h-3 text-amber-400" />
                <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider">Prep</span>
              </div>
              
              <div className="bg-[#2d323b] rounded-lg p-2.5 border border-slate-700 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-black text-xs md:text-sm">#103</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <span className="text-[8px] md:text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-1 rounded">1x</span>
                    <span className="text-[9px] md:text-xs text-slate-200 font-semibold leading-tight">Ribeye Steak</span>
                  </div>
                  <span className="text-[7px] md:text-[9px] text-rose-400 bg-rose-500/10 px-1 rounded italic ml-4">Med Rare</span>
                </div>
              </div>
            </div>

            {/* Ready */}
            <div className="hidden md:flex flex-1 bg-[#1a1d24] rounded-xl border border-slate-800 p-3 flex-col gap-2">
              <div className="flex items-center gap-1.5 text-slate-300 mb-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* iPhone Mockup (Digital Menu) */}
      <div className="absolute right-[10%] md:right-[20%] w-[25%] md:w-[22%] h-[90%] bg-white rounded-[2rem] border-[4px] border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col transform rotate-[3deg] transition-transform duration-700 hover:rotate-0 hover:z-10 hover:-translate-y-2">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[35%] h-4 bg-black rounded-full z-20" />

        {/* Menu App */}
        <div className="flex-1 bg-slate-50 overflow-hidden flex flex-col relative">
          
          {/* Header Image */}
          <div className="h-[25%] bg-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
            <div className="absolute bottom-3 left-3">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-indigo-600 text-xs">L</div>
            </div>
          </div>

          {/* Body */}
          <div className="p-3 space-y-3">
            <div className="space-y-0.5">
              <h2 className="text-[11px] font-black text-slate-900">Lumina Bistro</h2>
              <p className="text-[7px] text-slate-500">Table 4</p>
            </div>

            <div className="flex gap-2 overflow-hidden pb-1">
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[7px] font-bold">Mains</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[7px] font-bold">Drinks</span>
            </div>

            {/* Menu Item 1 */}
            <div className="bg-white rounded-xl p-2 flex gap-2 shadow-sm border border-slate-100">
              <div className="flex-1 space-y-1">
                <h4 className="text-[9px] font-bold text-slate-900 leading-tight">Truffle Burger</h4>
                <p className="text-[6px] text-slate-500 leading-tight line-clamp-2">Wagyu beef, black truffle aioli, aged cheddar.</p>
                <div className="text-[8px] font-black text-indigo-600 mt-1">$24</div>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center">
                <span className="text-slate-300 text-[10px]">🍔</span>
              </div>
            </div>

            {/* Menu Item 2 */}
            <div className="bg-white rounded-xl p-2 flex gap-2 shadow-sm border border-slate-100">
              <div className="flex-1 space-y-1">
                <h4 className="text-[9px] font-bold text-slate-900 leading-tight">Sweet Potato Fries</h4>
                <div className="text-[8px] font-black text-indigo-600 mt-1">$8</div>
              </div>
            </div>

          </div>

          {/* Floating Cart Button */}
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900 text-white rounded-full py-2 flex items-center justify-between px-3 shadow-lg">
            <span className="text-[7px] font-bold bg-white/20 px-1.5 py-0.5 rounded">2</span>
            <span className="text-[8px] font-bold">View Cart</span>
            <span className="text-[8px] font-bold">$32</span>
          </div>

        </div>
      </div>

    </div>
  );
}
