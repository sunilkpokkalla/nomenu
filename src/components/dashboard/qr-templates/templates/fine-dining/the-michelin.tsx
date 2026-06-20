import React from "react";
import { QrTemplateProps } from "../../types";
import { FineDiningFonts } from "./shared";

export function TheMichelin({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0A0A0A] text-white flex flex-col relative overflow-hidden p-8 box-border" style={{ boxSizing: "border-box" }}>
      <FineDiningFonts />
      <div className="w-full h-full border border-white/20 p-2 relative">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#D4AF37]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#D4AF37]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#D4AF37]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#D4AF37]" />
        
        <div className="w-full h-full flex flex-col items-center justify-between py-10">
          <div className="flex flex-col items-center">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain mb-4 filter brightness-0 invert opacity-80" />
            )}
            <h1 className="font-bodoni text-[36px] font-bold tracking-widest text-[#D4AF37] text-center uppercase">{brandName}</h1>
            <div className="w-12 h-[1px] bg-[#D4AF37]/50 my-4" />
            <h2 className="font-cormorant text-[14px] italic text-slate-300 tracking-wider">{headline}</h2>
          </div>

          <div className="bg-white p-4">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain" />
          </div>

          <div className="flex flex-col items-center">
            <h3 className="font-playfair text-[18px] tracking-[0.2em] text-[#D4AF37] uppercase mb-4">{subtext}</h3>
            {wifiPassword && (
              <div className="flex flex-col items-center">
                <span className="font-cormorant text-[10px] uppercase tracking-widest text-slate-400">Complimentary WiFi</span>
                <span className="font-playfair text-[14px] tracking-wider text-white mt-1">{wifiPassword}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
