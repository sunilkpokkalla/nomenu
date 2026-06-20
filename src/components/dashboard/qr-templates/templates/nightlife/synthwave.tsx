import React from "react";
import { QrTemplateProps } from "../../types";
import { NightlifeFonts } from "./shared";

export function Synthwave({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1a0b2e] text-[#ff00ff] flex flex-col relative overflow-hidden box-border p-8 font-rajdhani">
      <NightlifeFonts />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-b from-[#ff00ff] to-[#00ffff] rounded-full blur-[100px] opacity-20 pointer-events-none" />
      
      <div className="w-full h-full border-2 border-[#00ffff]/30 rounded-3xl p-6 relative z-10 flex flex-col items-center justify-between bg-black/20 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,255,0.1)]">
        
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain filter drop-shadow-[0_0_10px_#ff00ff] mb-4" />
          )}
          <h1 className="font-syncopate text-[28px] font-bold text-[#00ffff] uppercase tracking-widest drop-shadow-[0_0_10px_#00ffff]">{brandName}</h1>
          <h2 className="text-[14px] font-semibold tracking-widest text-white mt-2">{headline}</h2>
        </div>

        <div className="bg-[#ff00ff] p-1 rounded-xl shadow-[0_0_20px_#ff00ff]">
          <div className="bg-white p-3 rounded-lg">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#00ffff] mb-4">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full bg-[#ff00ff]/10 border border-[#ff00ff]/50 rounded-xl p-3 flex justify-between items-center text-white">
              <span className="text-[12px] uppercase tracking-widest">WIFI</span>
              <span className="text-[16px] font-bold tracking-widest text-[#00ffff]">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
