import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { FineDiningFonts } from "./shared";

export function TheMonolith({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1a1a1a] text-[#ffffff] flex flex-col relative overflow-hidden box-border">
      <FineDiningFonts />
      
      {/* Golden ratio split */}
      <div className="absolute top-0 left-0 w-full h-[62%] bg-[#0f0f0f]" />
      
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-10">
        
        <div className="flex justify-between items-start w-full">
          <h1 className="font-playfair text-[32px] uppercase max-w-[200px] leading-tight">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter brightness-0 invert" />
          )}
        </div>

        <div className="w-full flex flex-col items-center">
          <div className="bg-white p-3 shadow-2xl transform translate-y-8">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[220px] h-[220px] object-contain" />
          </div>
        </div>

        <div className="flex justify-between items-end w-full pt-16">
          <div className="flex flex-col">
            <h2 className="font-bodoni text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-1">{headline}</h2>
            <h3 className="font-cormorant text-[16px] italic">{subtext}</h3>
          </div>
          
          {wifiPassword && (
            <div className="text-right">
              <Wifi className="w-4 h-4 text-slate-400 mb-1 ml-auto" />
              <div className="font-playfair text-[12px] tracking-wider">{wifiPassword}</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
