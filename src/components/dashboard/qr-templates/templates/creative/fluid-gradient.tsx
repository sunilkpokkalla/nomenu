import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { CreativeFonts } from "./shared";

export function FluidGradient({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] text-white flex flex-col relative overflow-hidden box-border p-8 font-cabinet bg-black">
      <CreativeFonts />
      
      {/* Deep Aura Background */}
      <div className="absolute inset-0 opacity-80" style={{ background: `linear-gradient(135deg, ${colorStart || '#FF3366'}, ${colorEnd || '#4D00FF'})` }} />
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-black opacity-30 blur-[100px]" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 mix-blend-overlay pointer-events-none" />
      
      {/* Precision Glass Card */}
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[32px] p-8 shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
        
        {/* Subtle top edge highlight */}
        <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] mb-6" />
          )}
          <h1 className="font-syne text-[38px] font-extrabold tracking-tight leading-none mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">{brandName}</h1>
          <h2 className="text-[12px] font-bold tracking-[0.3em] uppercase text-white/70">{headline}</h2>
        </div>

        <div className="relative p-[1px] rounded-3xl bg-gradient-to-br from-white/40 via-white/5 to-transparent shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="bg-black/20 p-4 rounded-[23px] backdrop-blur-md">
            <div className="bg-white p-2 rounded-[16px]">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[170px] h-[170px] object-contain mix-blend-multiply rounded-[8px]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-syne text-[14px] font-bold uppercase tracking-[0.2em] mb-6 text-center text-white/80">{subtext}</h3>
          
          {wifiPassword && (
            <div className="bg-black/30 px-6 py-3 rounded-2xl border border-white/10 flex items-center justify-between w-full backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-widest text-white/50 flex items-center gap-2">
                <Wifi className="w-3 h-3" /> Network
              </span>
              <span className="text-[14px] font-bold tracking-wider">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
