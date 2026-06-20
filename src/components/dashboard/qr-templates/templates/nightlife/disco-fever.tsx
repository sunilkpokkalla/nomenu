import React from "react";
import { QrTemplateProps } from "../../types";
import { NightlifeFonts } from "./shared";

export function DiscoFever({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1a1a2e] text-[#e94560] flex flex-col relative overflow-hidden box-border p-6 font-bebas border-[10px] border-[#0f3460]">
      <NightlifeFonts />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[2px] border-[#e94560]/30 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-[1px] border-[#0f3460]/50 rounded-full" />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between text-center p-6 bg-gradient-to-b from-[#1a1a2e]/90 to-[#1a1a2e]/90 backdrop-blur-sm rounded-xl">
        
        <div className="flex flex-col items-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain filter drop-shadow-[0_0_10px_#e94560] mb-4" />
          )}
          <h1 className="text-[64px] tracking-wider leading-[0.8] drop-shadow-[4px_4px_0_#0f3460] text-white">{brandName}</h1>
          <h2 className="font-rajdhani text-[16px] font-bold tracking-[0.2em] text-[#e94560] uppercase mt-4 bg-[#0f3460] px-4 py-1">{headline}</h2>
        </div>

        <div className="bg-white p-3 rounded-full shadow-[0_0_40px_rgba(233,69,96,0.5)]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain rounded-[40px] mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-rajdhani text-[14px] uppercase tracking-widest text-white/80 mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full flex justify-between items-center bg-[#0f3460] border border-[#e94560] p-4 font-rajdhani">
              <span className="text-[14px] uppercase tracking-widest text-[#e94560] font-bold">DISCO NET</span>
              <span className="text-[18px] font-bold tracking-widest text-white">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
