import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { NightlifeFonts } from "./shared";

export function LiquidNight({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0c0518] text-white flex flex-col relative overflow-hidden box-border p-8 font-rajdhani">
      <NightlifeFonts />
      <div className="absolute top-0 left-0 w-full h-[50%] opacity-40 mix-blend-screen pointer-events-none" style={{ background: `linear-gradient(180deg, ${colorStart}, transparent)` }} />
      <div className="absolute bottom-0 right-0 w-full h-[50%] opacity-40 mix-blend-screen pointer-events-none" style={{ background: `linear-gradient(0deg, ${colorEnd}, transparent)` }} />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between">
        
        <div className="flex flex-col items-center text-center mt-4">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[60px] h-[60px] object-contain filter brightness-0 invert opacity-90 mb-4" />
          )}
          <h2 className="text-[12px] font-semibold tracking-[0.3em] uppercase text-white/60 mb-2">{headline}</h2>
          <h1 className="font-bebas text-[48px] tracking-wider leading-none">{brandName}</h1>
        </div>

        <div className="relative p-6">
          <div className="absolute inset-0 rounded-full blur-xl opacity-30" style={{ background: `linear-gradient(45deg, ${colorStart}, ${colorEnd})` }} />
          <div className="bg-white/90 p-3 rounded-2xl relative z-10 shadow-2xl backdrop-blur-md">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-syncopate text-[10px] uppercase tracking-[0.2em] text-white/70 mb-6 text-center">{subtext}</h3>
          
          {wifiPassword && (
            <div className="rounded-full px-6 py-2 border border-white/20 bg-white/5 backdrop-blur-sm flex items-center gap-3">
              <Wifi className="w-4 h-4 text-white/60" />
              <span className="text-[14px] font-bold tracking-widest text-white/90">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
