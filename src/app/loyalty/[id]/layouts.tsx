import React from 'react';
import { Gift } from "lucide-react";

export interface LayoutProps {
  stamps: number;
  restaurantName: string;
  primaryColor: string;
  stampColor: string;
  StampIcon: React.ElementType;
  stampTheme: { bg: string, text: string };
  rewardText?: string | null;
  cardColor: string;
}

// 1. Classic Punch Card
export function ClassicLayout({ stamps, restaurantName, primaryColor, StampIcon, stampTheme, rewardText, cardColor }: LayoutProps) {
  return (
    <div 
      className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-[1.5rem] overflow-hidden shadow-xl transition-transform hover:scale-[1.02] duration-500 border border-black/5"
      style={{ backgroundColor: cardColor }}
    >
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-0.5 mb-1">
          <h2 className="text-white font-black text-2xl sm:text-3xl tracking-tighter uppercase drop-shadow-sm">Loyalty Card</h2>
          <p className="text-white/90 font-medium tracking-wide text-[10px] sm:text-xs uppercase">{restaurantName}</p>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-2 sm:gap-3 px-1 sm:px-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className={`relative w-full aspect-square rounded-full flex items-center justify-center transition-all duration-300 ${
                  i < stamps ? `bg-white shadow-sm border border-white` : "bg-white/95 shadow-inner border-2 border-black/10 border-dashed"
                }`}
              >
                {i < stamps ? <StampIcon className={`w-5 h-5 sm:w-7 sm:h-7 animate-in zoom-in duration-300 drop-shadow-sm ${stampTheme.text}`} /> : i === 9 ? <span className="text-[0.5rem] sm:text-[0.6rem] font-black text-black/30 uppercase tracking-tighter -rotate-12">Free!</span> : null}
              </div>
            ))}
          </div>
          <div className="text-center">
            {rewardText && <div className="inline-block bg-black/10 backdrop-blur-sm rounded-full px-3 py-1 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-1">{rewardText}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Digital VIP
export function DigitalLayout({ stamps, restaurantName, primaryColor, StampIcon, rewardText, cardColor }: LayoutProps) {
  return (
    <div 
      className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-[1.5rem] overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500"
      style={{ background: `linear-gradient(135deg, ${cardColor} 0%, #000 100%)` }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] hover:translate-x-[200%] transition-transform duration-1000" />
      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
          <div className="text-white font-bold text-xl tracking-tight drop-shadow-md">{restaurantName}</div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white/90 text-xs font-semibold tracking-wider">VIP MEMBER</div>
        </div>
        <div className="space-y-4">
          <div className="text-white/80 text-xs font-medium uppercase tracking-widest">{rewardText || "10 Stamps = 1 Free Item"}</div>
          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className={`relative w-full aspect-square rounded-full border flex items-center justify-center transition-all duration-500 ${
                  i < stamps ? `border-[currentColor] bg-white text-[currentColor]` : "border-white/20 bg-white/5"
                }`}
                style={i < stamps ? { color: primaryColor, boxShadow: `0 0 15px ${primaryColor}66` } : {}}
              >
                {i < stamps ? <StampIcon className={`w-5 h-5 sm:w-6 sm:h-6 animate-in zoom-in duration-300`} /> : i === 9 ? <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Minimalist Grid
export function MinimalistLayout({ stamps, restaurantName, primaryColor, StampIcon, rewardText, cardColor }: LayoutProps) {
  return (
    <div 
      className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-[1rem] overflow-hidden shadow-lg transition-transform hover:scale-[1.02] duration-500 bg-white border-2"
      style={{ borderColor: cardColor }}
    >
      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-center z-10">
        <div className="flex justify-between items-start border-b-2 pb-2 mb-3" style={{ borderColor: `${primaryColor}20` }}>
          <div className="text-left mt-auto">
            <div className="text-3xl font-light leading-none" style={{ color: primaryColor }}>{stamps}/10</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Loyalty Card</div>
            <h2 className="text-slate-900 font-bold text-xl tracking-tight leading-none truncate">{restaurantName}</h2>
            <p className="text-slate-500 font-medium tracking-wide text-[9px] uppercase mt-1 truncate">{rewardText || "Rewards Program"}</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className={`relative w-full aspect-square rounded-md flex items-center justify-center transition-all duration-300 ${
                i < stamps ? `` : "bg-slate-50 border border-slate-200"
              }`}
              style={i < stamps ? { backgroundColor: primaryColor } : {}}
            >
              {i < stamps ? <StampIcon className={`w-5 h-5 sm:w-6 sm:h-6 animate-in zoom-in duration-300 text-white`} /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. Argentine Edge
export function ArgentineLayout({ stamps, restaurantName, primaryColor, StampIcon, stampTheme, rewardText, cardColor }: LayoutProps) {
  return (
    <div className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-none overflow-hidden shadow-md transition-transform hover:scale-[1.02] duration-500 bg-white border-4" style={{ borderColor: primaryColor }}>
      {/* Torn Paper Header/Footer using SVG masks or simple jagged borders, approximated here with jagged background gradients */}
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-20" style={{ backgroundColor: primaryColor }} />
      <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-12" style={{ backgroundColor: primaryColor }} />
      <div className="absolute inset-0 flex flex-col z-10">
        
        <div className="h-16 sm:h-20 flex flex-col items-center justify-center pt-2">
          <h2 className="text-white font-black text-2xl sm:text-3xl tracking-widest uppercase">LOYALTY CARD</h2>
        </div>
        
        <div className="flex-1 bg-white relative flex flex-col items-center justify-center -mx-1" style={{ clipPath: "polygon(0% 5%, 100% 0%, 100% 95%, 0% 100%)" }}>
          <div className="absolute -top-4 bg-amber-400 px-6 py-1 z-20 shadow-sm transform -rotate-1">
            <span className="text-white font-bold tracking-widest uppercase text-sm">{restaurantName}</span>
          </div>
          
          <div className="grid grid-cols-5 gap-2 sm:gap-4 px-4 w-full mt-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className={`relative w-full aspect-square flex items-center justify-center transition-all duration-300 border-2 ${
                  i < stamps ? "border-transparent bg-slate-50" : "border-slate-300 bg-white"
                }`}
                style={i < stamps ? {} : { borderColor: primaryColor }}
              >
                {i < stamps ? (
                  <StampIcon className={`w-6 h-6 sm:w-8 sm:h-8 animate-in zoom-in duration-300 ${stampTheme.text}`} />
                ) : (
                  <span className="text-lg font-bold text-slate-800">{i + 1}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="h-10 sm:h-12 flex items-center justify-center pb-1">
          <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">{rewardText || "Thank you for your visit!"}</span>
        </div>
      </div>
    </div>
  );
}

// 5. Coffee House
export function CoffeeLayout({ stamps, restaurantName, StampIcon, stampTheme, rewardText, cardColor }: LayoutProps) {
  return (
    <div className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-sm overflow-hidden shadow-lg transition-transform hover:scale-[1.02] duration-500 border-4 border-double" style={{ backgroundColor: cardColor, borderColor: '#8b7355' }}>
      <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]" />
      <div className="relative z-10 flex flex-col h-full justify-between p-6">
        <div className="text-center">
          <div className="text-[#8b7355] text-[10px] font-bold uppercase tracking-widest mb-1">Loyalty Card</div>
          <h2 className="text-[#4a3b32] font-serif italic text-2xl sm:text-3xl truncate">{restaurantName}</h2>
          <p className="text-[#5c4a3d] uppercase tracking-widest text-[9px] mt-2 border-b border-[#5c4a3d]/20 pb-2 truncate">{rewardText || "Coffee Rewards"}</p>
        </div>
        <div className="grid grid-cols-5 gap-4 px-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className="relative w-full aspect-square rounded-full border-[3px] border-[#8b7355]/40 flex items-center justify-center bg-[#f4e8da]/50 border-dashed"
            >
              {i < stamps ? (
                <StampIcon className={`w-8 h-8 sm:w-10 sm:h-10 animate-in zoom-in duration-300 opacity-90 ${stampTheme.text} drop-shadow-md`} style={{ transform: `rotate(${Math.random() * 40 - 20}deg)` }} />
              ) : i === 9 ? (
                <span className="text-[10px] font-bold text-[#8b7355] uppercase transform -rotate-12">Free</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 6. Luxury Gold
export function LuxuryLayout({ stamps, restaurantName, StampIcon, rewardText, cardColor }: LayoutProps) {
  return (
    <div className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500 border border-[#d4af37]/30 p-1" style={{ backgroundColor: cardColor }}>
      <div className="w-full h-full border border-[#d4af37] rounded-lg p-5 flex flex-col justify-between">
        <div className="text-center">
          <div className="text-[#d4af37]/60 text-[10px] font-bold uppercase tracking-widest mb-2">Loyalty Card</div>
          <h2 className="text-[#d4af37] font-serif text-2xl sm:text-3xl tracking-widest uppercase">{restaurantName}</h2>
          <div className="w-12 h-[1px] bg-[#d4af37] mx-auto mt-3 mb-1" />
          <p className="text-[#d4af37]/70 text-[10px] tracking-[0.2em] uppercase">{rewardText || "Premium Member"}</p>
        </div>
        <div className="grid grid-cols-5 gap-3 sm:gap-4 px-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className={`relative w-full aspect-square rounded-none border border-[#d4af37]/40 flex items-center justify-center transition-all duration-300 ${i < stamps ? "bg-[#d4af37]/10" : "bg-transparent"}`}
            >
              {i < stamps ? (
                <StampIcon className={`w-5 h-5 sm:w-6 sm:h-6 text-[#d4af37] animate-in zoom-in`} />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 7. Retro Arcade
export function ArcadeLayout({ stamps, restaurantName, StampIcon, cardColor }: LayoutProps) {
  return (
    <div className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-sm overflow-hidden shadow-[8px_8px_0_rgba(0,0,0,1)] transition-transform hover:translate-y-1 hover:shadow-[4px_4px_0_rgba(0,0,0,1)] duration-200 border-4 border-black p-4" style={{ backgroundColor: cardColor }}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.1)_2px,transparent_2px)] bg-[size:10px_10px]" />
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="text-center border-b-4 border-black pb-2 bg-[#ff0055] -mx-4 -mt-4 pt-4 mb-2">
          <h2 className="text-white font-black text-2xl uppercase tracking-widest drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{restaurantName}</h2>
          <p className="text-[#ffff00] text-xs font-bold uppercase drop-shadow-[1px_1px_0_rgba(0,0,0,1)]">Insert Coin To Play</p>
        </div>
        <div className="grid grid-cols-5 gap-2 px-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className={`relative w-full aspect-square border-4 flex items-center justify-center ${i < stamps ? "border-[#00ffcc] bg-[#00ffcc]/20" : "border-black bg-black/40"}`}
            >
              {i < stamps ? (
                <StampIcon className="w-6 h-6 text-[#00ffcc] drop-shadow-[0_0_8px_#00ffcc]" />
              ) : i === 9 ? (
                <span className="text-[#ff0055] font-black text-[10px] uppercase">1UP</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 8. Modern Gradient
export function GradientLayout({ stamps, restaurantName, primaryColor, StampIcon, stampTheme, rewardText, cardColor }: LayoutProps) {
  return (
    <div 
      className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-[2rem] overflow-hidden shadow-xl transition-transform hover:scale-[1.02] duration-500"
      style={{ background: `linear-gradient(to right, ${cardColor}, ${primaryColor})` }}
    >
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/30 p-8 flex flex-col justify-between z-10">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Loyalty Card</div>
            <h2 className="text-slate-800 font-bold text-2xl tracking-tighter">{restaurantName}</h2>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-white/60 text-slate-700 text-[10px] font-bold backdrop-blur-md max-w-[50%] truncate" title={rewardText || "REWARDS"}>{rewardText || "REWARDS"}</div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className={`relative w-full aspect-square rounded-[1rem] flex items-center justify-center transition-all duration-300 ${i < stamps ? "bg-white shadow-lg" : "bg-white/40 shadow-inner"}`}
            >
              {i < stamps ? <StampIcon className={`w-6 h-6 ${stampTheme.text} animate-in scale-in`} /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 9. Glassmorphism
export function BirthdayLayout({ stamps, restaurantName, primaryColor, StampIcon, rewardText, stampTheme, cardColor }: LayoutProps) {
  return (
    <div className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-3xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500 border border-white/10 p-5 sm:p-6 flex flex-col justify-center" style={{ backgroundColor: cardColor }}>
      <div className="absolute -top-32 -right-32 w-64 h-64 blur-[100px] rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.5 }} />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 blur-[100px] rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.3 }} />
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl" />
      
      <div className="relative z-10 flex justify-between items-start w-full mb-3">
        <div className="max-w-[70%]">
          <div className="text-white/50 text-[9px] font-bold uppercase tracking-widest mb-1">Loyalty Card</div>
          <h2 className="text-white font-semibold text-xl tracking-wide truncate leading-tight">{restaurantName}</h2>
          <div className="inline-block bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-3 py-1 mt-2">
            <p className="text-white/80 text-[9px] font-medium uppercase tracking-widest truncate">{rewardText || "Rewards Program"}</p>
          </div>
        </div>
        <div className="text-3xl font-light text-white/90">{stamps}<span className="text-lg text-white/40">/10</span></div>
      </div>

      <div className="relative z-10 grid grid-cols-5 gap-2 sm:gap-3 w-full">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`relative w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-500 ${i < stamps ? 'bg-white/20 border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-white/5 border border-white/10'}`}>
            {i < stamps ? <StampIcon className="w-6 h-6 text-white drop-shadow-md animate-in zoom-in" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

// 10. Fine Dining
export function FineDiningLayout({ stamps, restaurantName, primaryColor, StampIcon, rewardText, cardColor }: LayoutProps) {
  return (
    <div 
      className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-sm overflow-hidden shadow-md transition-transform hover:scale-[1.02] duration-500 border-[1px] border-black/20 p-8 flex flex-col justify-between"
      style={{ backgroundColor: cardColor }}
    >
      <div className="text-center">
        <div className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] mb-2">Loyalty Card</div>
        <h2 className="text-slate-900 font-serif text-2xl tracking-[0.2em] uppercase">{restaurantName}</h2>
        <div className="w-8 h-[1px] bg-slate-300 mx-auto mt-4 mb-2" />
        <p className="text-slate-500 text-[9px] font-light tracking-[0.3em] uppercase">{rewardText || "Patron Rewards"}</p>
      </div>
      <div className="flex justify-center w-full">
        <div className="grid grid-cols-5 gap-y-4 gap-x-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-[0.5px] border-slate-300 flex items-center justify-center">
                {i < stamps ? <StampIcon className="w-4 h-4 text-slate-800" style={{ color: primaryColor }} /> : <div className="w-1 h-1 rounded-full bg-slate-200" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 11. Corporate Sleek
export function CorporateLayout({ stamps, restaurantName, primaryColor, StampIcon, rewardText, cardColor }: LayoutProps) {
  return (
    <div 
      className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-md overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500 border-l-8 flex flex-col justify-between p-6 sm:p-8" 
      style={{ borderLeftColor: primaryColor, backgroundColor: cardColor }}
    >
      <div className="text-left w-full flex flex-col items-start">
        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Loyalty Card</div>
        <h2 className="text-white font-semibold text-2xl tracking-wide leading-tight">{restaurantName}</h2>
        <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-widest">{rewardText || "Rewards Program"}</p>
      </div>
      <div className="w-full mt-auto">
        <div className="grid grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="relative w-full aspect-square rounded-sm border border-slate-700 flex items-center justify-center bg-slate-800/80 shadow-inner transition-colors">
              {i < stamps ? <StampIcon className="w-6 h-6 animate-in zoom-in" style={{ color: primaryColor }} /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



// 13. Botanical Earth
export function BotanicalLayout({ stamps, restaurantName, StampIcon, rewardText, cardColor }: LayoutProps) {
  return (
    <div className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-[2rem] overflow-hidden shadow-lg transition-transform hover:scale-[1.02] duration-500 border border-[#cbd5c0] p-8 flex flex-col justify-between" style={{ backgroundColor: cardColor }}>
      <div className="text-center">
        <div className="text-[#8fbc8f] text-[10px] font-bold uppercase tracking-widest mb-1">Loyalty Card</div>
        <h2 className="text-[#556b2f] font-serif text-3xl tracking-wide">{restaurantName}</h2>
        <p className="text-[#8fbc8f] uppercase tracking-[0.2em] text-[10px] mt-2">{rewardText || "Nourish & Grow"}</p>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="relative w-full aspect-square rounded-full border border-[#8fbc8f]/50 flex items-center justify-center bg-white/50">
            {i < stamps ? <StampIcon className="w-6 h-6 text-[#556b2f]" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

// 14. Holographic Foil
export function HolographicLayout({ stamps, restaurantName, StampIcon, rewardText, cardColor }: LayoutProps) {
  return (
    <div 
      className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-2xl overflow-hidden shadow-xl transition-transform hover:scale-[1.02] duration-500 p-6 flex flex-col justify-center border border-white/40" 
      style={{ background: `linear-gradient(120deg, ${cardColor}, #bfdbfe, #bbf7d0)` }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-white/40 mix-blend-overlay" />
      <div className="relative z-10 w-full">
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 text-center">Loyalty Card</div>
        <h2 className="text-slate-800 font-black text-2xl tracking-tighter uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] text-center leading-tight">{restaurantName}</h2>
        <p className="text-slate-600 font-bold tracking-widest text-[10px] text-center mt-1 mb-3 uppercase drop-shadow-[0_1px_5px_rgba(255,255,255,0.8)] truncate">{rewardText || "Cosmic Rewards"}</p>
        <div className="grid grid-cols-5 gap-2 sm:gap-3 bg-white/30 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/50 shadow-[0_8px_32px_rgba(255,255,255,0.3)] mx-auto w-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`relative w-full aspect-square rounded-lg flex items-center justify-center ${i < stamps ? "bg-white shadow-md" : "bg-white/20 border border-white/50"}`}>
              {i < stamps ? <StampIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 15. Chalkboard Menu
export function ChalkboardLayout({ stamps, restaurantName, StampIcon, rewardText, cardColor }: LayoutProps) {
  return (
    <div 
      className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-lg overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500 border-[12px] border-[#4a3b32] p-5 flex flex-col justify-center"
      style={{ backgroundColor: cardColor }}
    >
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]" />
      <div className="relative z-10 text-center border-b-2 border-white/20 pb-2 mb-3 border-dashed">
        <div className="text-white/50 text-[9px] font-mono uppercase tracking-widest mb-1">Loyalty Card</div>
        <h2 className="text-white font-mono text-xl uppercase tracking-widest opacity-90 truncate leading-tight">{restaurantName}</h2>
        <p className="text-white/60 font-mono text-[9px] uppercase tracking-widest mt-1 truncate">{rewardText || "Daily Specials"}</p>
      </div>
      <div className="relative z-10 grid grid-cols-5 gap-2 sm:gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="relative w-full aspect-square border border-white/20 rounded flex items-center justify-center bg-black/20">
            {i < stamps ? <StampIcon className="w-7 h-7 text-white opacity-90" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

// 16. Lumia Black
export function LumiaLayout({ stamps, restaurantName, primaryColor, StampIcon, rewardText, cardColor }: LayoutProps) {
  return (
    <div className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500 p-8 flex flex-col justify-between" style={{ backgroundColor: cardColor }}>
      <div className="absolute -top-20 -right-20 w-40 h-40 blur-[80px] rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.3 }} />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 blur-[80px] rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.2 }} />
      
      <div className="relative z-10">
        <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Loyalty Card</div>
        <h2 className="text-white font-light text-2xl tracking-[0.15em] truncate">{restaurantName}</h2>
        <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mt-2 font-medium truncate">{rewardText || "Lumia Rewards"}</p>
      </div>
      
      <div className="relative z-10 grid grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`relative w-full aspect-square rounded-full flex items-center justify-center border transition-all duration-300 ${i < stamps ? 'border-transparent bg-white/10 backdrop-blur-md' : 'border-white/10 bg-black/40'}`}>
            {i < stamps ? <StampIcon className="w-5 h-5 drop-shadow-md text-white" style={{ filter: `drop-shadow(0 0 8px ${primaryColor}80)` }} /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// 17. Modern Minimal
export function ModernMinimalLayout({ stamps, restaurantName, primaryColor, StampIcon, rewardText, cardColor }: LayoutProps) {
  return (
    <div className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-3xl overflow-hidden shadow-sm transition-transform hover:scale-[1.02] duration-500 p-8 flex flex-col justify-between border border-slate-100" style={{ backgroundColor: cardColor }}>
      <div className="flex justify-between items-start">
        <div className="flex-1 overflow-hidden pr-4">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Loyalty Card</div>
          <h2 className="text-slate-800 font-semibold text-xl tracking-tight truncate">{restaurantName}</h2>
          <p className="text-slate-400 text-[11px] font-medium tracking-wide mt-1 truncate">{rewardText || "Loyalty Program"}</p>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}15` }}>
          <StampIcon className="w-5 h-5" style={{ color: primaryColor }} />
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/50">
        <div className="flex justify-between items-center mb-3 px-1">
          <span className="text-slate-400 text-[10px] font-semibold tracking-wider uppercase">Progress</span>
          <span className="text-slate-800 font-bold text-sm">{stamps}/10</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className="h-full flex-1 border-r border-white/50 last:border-r-0 transition-all duration-500" 
              style={{ backgroundColor: i < stamps ? primaryColor : 'transparent' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// 18. Vibrant Cafe
export function VibrantCafeLayout({ stamps, restaurantName, primaryColor, StampIcon, rewardText, cardColor }: LayoutProps) {
  return (
    <div className="relative w-full aspect-auto min-h-[240px] sm:aspect-[1.586/1] rounded-[2rem] overflow-hidden shadow-xl transition-transform hover:scale-[1.02] duration-500 p-5 flex flex-col justify-between border" style={{ backgroundColor: cardColor, borderColor: "rgba(255,255,255,0.2)" }}>
      <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-full border-b border-white/30 pb-1.5 mb-1.5">
          <div className="text-white/80 text-[9px] font-bold uppercase tracking-widest mb-0.5">Loyalty Card</div>
          <h2 className="text-white font-black text-xl sm:text-2xl tracking-tight truncate drop-shadow-sm leading-tight">{restaurantName}</h2>
          <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-3 py-0.5 mt-0.5 shadow-sm border border-white/30">
            <p className="text-white text-[8px] font-bold uppercase tracking-widest truncate">{rewardText || "Grab a reward"}</p>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 grid grid-cols-5 gap-1.5 sm:gap-2 mt-auto">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="relative w-full aspect-square rounded-xl flex items-center justify-center transition-all bg-white/10 backdrop-blur-sm border border-white/30 shadow-inner">
            {i < stamps ? <StampIcon className="w-5 h-5 text-white drop-shadow-md" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
