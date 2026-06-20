import React from "react";
import { QrTemplateProps } from "../../types";
import { NightlifeFonts } from "./shared";

export function IndustrialTechno({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#111111] text-[#ffffff] flex flex-col relative overflow-hidden box-border font-rajdhani border-l-[20px] border-[#333333]">
      <NightlifeFonts />
      <div className="absolute top-0 right-0 w-full h-[20px] bg-[#333333]" />
      <div className="absolute bottom-0 right-0 w-full h-[20px] bg-[#333333]" />
      <div className="absolute top-0 right-0 w-[20px] h-full bg-[#333333]" />
      
      <div className="w-full h-full p-12 flex flex-col justify-between">
        
        <div className="flex flex-col items-start w-full">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[30px] h-[30px] object-contain filter brightness-0 invert opacity-50 mb-4" />
          )}
          <h2 className="font-syncopate text-[10px] text-white/40 tracking-[0.2em] uppercase mb-1">{headline}</h2>
          <h1 className="font-bebas text-[54px] leading-[0.85] tracking-widest uppercase">{brandName}</h1>
        </div>

        <div className="bg-[#222222] p-4 self-start border-l-[4px] border-[#ffffff]">
          <div className="bg-white p-2">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[150px] h-[150px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col w-full border-t-[2px] border-white/20 pt-4">
          <h3 className="text-[13px] font-bold uppercase tracking-widest text-white/70 mb-4">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex items-center gap-4 text-white/90">
              <span className="font-syncopate text-[9px] uppercase tracking-widest border border-white/40 px-2 py-1">Network</span>
              <span className="text-[16px] font-bold tracking-widest">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
