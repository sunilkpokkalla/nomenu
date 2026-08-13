import React from 'react';
import { ChefHat, Clock, CheckCircle2 } from 'lucide-react';

export function DualDeviceMockup() {
  return (
    <div className="w-full h-full bg-[#fdfbf7] relative flex items-center justify-center overflow-visible p-4 [perspective:1500px] [transform-style:preserve-3d]">
      
      {/* iPad Mockup (KDS) */}
      <div className="absolute left-[5%] md:left-[12%] w-[68%] md:w-[62%] h-[82%] md:h-[85%] bg-[#0e1117] rounded-[1.5rem] md:rounded-[2.5rem] border-[4px] md:border-[8px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col transition-all duration-700 ease-out [transform:rotateX(18deg)_rotateY(-18deg)_rotateZ(-2deg)] hover:[transform:rotateX(8deg)_rotateY(-8deg)_translateZ(20px)]">
        
        {/* iPad Bezel ... */}
        <div className="h-3 w-full flex justify-center mt-1.5 shrink-0">
          <div className="w-10 md:w-16 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* KDS App */}
        <div className="flex-1 p-2 md:p-5 flex flex-col gap-2.5 md:gap-4 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center text-white shrink-0 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-[10px] md:text-sm font-black tracking-tight uppercase text-slate-200">KDS Live Terminal</h3>
            </div>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>
          </div>

          {/* Columns */}
          <div className="flex gap-2 md:gap-3 h-full overflow-hidden">
            {/* New Orders Column */}
            <div className="flex-1 bg-[#151922] rounded-lg md:rounded-xl border border-slate-800/80 p-1.5 md:p-3 flex flex-col gap-1.5 md:gap-2.5 overflow-hidden">
              <div className="flex items-center gap-1 text-slate-400 shrink-0">
                <Clock className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-emerald-400" />
                <span className="text-[8px] md:text-xs font-black uppercase tracking-wider">New</span>
              </div>
              
              {/* Order Card 1 */}
              <div className="bg-[#202632] rounded-md md:rounded-lg p-1.5 md:p-2.5 border border-slate-700/60 shadow-sm relative shrink-0">
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <div className="flex justify-between items-center mb-1 md:mb-2">
                  <span className="text-white font-black text-[9px] md:text-sm">#104</span>
                  <span className="text-[7px] md:text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-black">PAID</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-start gap-1">
                    <span className="text-[7px] md:text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-1 rounded">2x</span>
                    <span className="text-[8px] md:text-xs text-slate-200 font-semibold leading-none truncate">Truffle Burger</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <span className="text-[7px] md:text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-1 rounded">1x</span>
                    <span className="text-[8px] md:text-xs text-slate-200 font-semibold leading-none truncate">Potato Fries</span>
                  </div>
                </div>
              </div>

              {/* Order Card 2 - Hidden on small mobile to fit */}
              <div className="bg-[#202632] rounded-md md:rounded-lg p-1.5 md:p-2.5 border border-slate-700/60 shadow-sm opacity-50 shrink-0 hidden sm:block">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-white font-black text-[9px] md:text-sm">#105</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-start gap-1">
                    <span className="text-[7px] md:text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-1 rounded">1x</span>
                    <span className="text-[8px] md:text-xs text-slate-300 font-semibold leading-none truncate">Spicy Sushi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prep Column */}
            <div className="flex-1 bg-[#151922] rounded-lg md:rounded-xl border border-slate-800/80 p-1.5 md:p-3 flex flex-col gap-1.5 md:gap-2.5 overflow-hidden">
              <div className="flex items-center gap-1 text-slate-400 shrink-0">
                <ChefHat className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-amber-400" />
                <span className="text-[8px] md:text-xs font-black uppercase tracking-wider">Prep</span>
              </div>
              
              <div className="bg-[#202632] rounded-md md:rounded-lg p-1.5 md:p-2.5 border border-slate-700/60 shadow-sm shrink-0">
                <div className="flex justify-between items-center mb-1 md:mb-2">
                  <span className="text-white font-black text-[9px] md:text-sm">#103</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-start gap-1">
                    <span className="text-[7px] md:text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-1 rounded">1x</span>
                    <span className="text-[8px] md:text-xs text-slate-200 font-semibold leading-none truncate font-mono">Steak Ribeye</span>
                  </div>
                  <span className="text-[6px] md:text-[8px] text-amber-400 bg-amber-500/10 px-1 rounded italic font-semibold">Med Rare</span>
                </div>
              </div>
            </div>

            {/* Ready Column - Desktop Only */}
            <div className="hidden lg:flex flex-1 bg-[#151922] rounded-xl border border-slate-800/80 p-3 flex-col gap-2.5 overflow-hidden">
              <div className="flex items-center gap-1 text-slate-400 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-wider">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* iPhone Mockup (Digital Menu) */}
      <div className="absolute right-[4%] md:right-[15%] w-[42%] sm:w-[35%] md:w-[22%] h-[88%] md:h-[92%] bg-white rounded-[1.2rem] md:rounded-[2.2rem] border-[3px] md:border-[6px] border-slate-200 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transition-all duration-700 ease-out [transform:rotateX(18deg)_rotateY(-18deg)_rotateZ(4deg)_translateZ(60px)] hover:[transform:rotateX(8deg)_rotateY(-8deg)_translateZ(100px)] z-20">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[35%] h-3.5 bg-black rounded-full z-20 shrink-0" />

        {/* Menu App */}
        <div className="flex-1 bg-slate-50 overflow-hidden flex flex-col relative pt-5">
          
          {/* Header Image banner */}
          <div className="h-[20%] bg-indigo-950 relative overflow-hidden shrink-0 flex items-end p-2">
            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)', backgroundSize: '12px 12px' }} />
            <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-indigo-900 text-[10px]">
              L
            </div>
          </div>

          {/* Body */}
          <div className="p-2 space-y-2 flex-1 overflow-hidden">
            <div className="space-y-0.5">
              <h2 className="text-[10px] md:text-xs font-black text-slate-900 leading-tight">Lumina Bistro</h2>
              <p className="text-[6px] md:text-[8px] text-slate-400 font-bold uppercase tracking-wider">Table 4</p>
            </div>

            <div className="flex gap-1.5 overflow-hidden shrink-0 pb-1">
              <span className="px-1.5 py-0.5 rounded-full bg-indigo-900 text-white text-[6px] md:text-[8px] font-black">Mains</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[6px] md:text-[8px] font-bold">Drinks</span>
            </div>

            {/* Menu Item 1 */}
            <div className="bg-white rounded-lg p-1.5 flex gap-1.5 shadow-sm border border-slate-100/80">
              <div className="flex-1 space-y-0.5">
                <h4 className="text-[8px] md:text-[10px] font-black text-slate-900 leading-tight">Truffle Burger</h4>
                <p className="text-[5px] md:text-[7px] text-slate-400 leading-tight line-clamp-1">Wagyu beef, black truffle aioli.</p>
                <div className="text-[7px] md:text-[9px] font-black text-indigo-600">$24</div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-50/50 rounded-md shrink-0 flex items-center justify-center text-[12px] md:text-[16px]">
                🍔
              </div>
            </div>

            {/* Menu Item 2 - Hidden on small mobile to fit */}
            <div className="bg-white rounded-lg p-1.5 flex gap-1.5 shadow-sm border border-slate-100/80 hidden sm:flex">
              <div className="flex-1 space-y-0.5">
                <h4 className="text-[8px] md:text-[10px] font-black text-slate-900 leading-tight">Sweet Potato Fries</h4>
                <div className="text-[7px] md:text-[9px] font-black text-indigo-600">$8</div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-50/50 rounded-md shrink-0 flex items-center justify-center text-[12px] md:text-[16px]">
                🍟
              </div>
            </div>

          </div>

          {/* Floating Cart Button */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-900 text-white rounded-full py-1.5 flex items-center justify-between px-2.5 shadow-lg border border-slate-800">
            <span className="text-[6px] md:text-[8px] font-black bg-white/20 px-1 py-0.5 rounded leading-none">2</span>
            <span className="text-[7px] md:text-[9px] font-black uppercase tracking-wider">View Cart</span>
            <span className="text-[7px] md:text-[9px] font-black">$32</span>
          </div>

        </div>
      </div>

    </div>
  );
}
