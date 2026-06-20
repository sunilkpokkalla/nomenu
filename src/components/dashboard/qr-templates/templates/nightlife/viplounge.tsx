import React from "react";
import { QrTemplateProps } from "../../types";
import { NightlifeFonts } from "./shared";

export function VIPLounge({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0A0A0E] text-[#E5E5E5] flex flex-col relative overflow-hidden box-border p-10 font-rajdhani">
      <NightlifeFonts />
      <div className="w-full h-full flex flex-col items-center justify-between relative z-10">
        
        <div className="flex flex-col items-center text-center w-full border-b border-white/10 pb-8">
          <h2 className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase mb-4">VIP Access</h2>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter brightness-0 invert opacity-80 mb-4" />
          )}
          <h1 className="font-bebas text-[42px] tracking-[0.1em] text-white">{brandName}</h1>
          <h3 className="text-[14px] font-semibold tracking-widest text-white/50 uppercase mt-2">{headline}</h3>
        </div>

        <div className="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="bg-white p-3 rounded-2xl">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-syncopate text-[10px] uppercase tracking-[0.2em] text-white/40 mb-6 text-center leading-relaxed">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-bebas text-[20px] tracking-widest text-white/80 bg-white/10 px-8 py-2 rounded-full border border-white/20">
              PASS: {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
