import React from "react";
import { QrTemplateProps } from "../../types";
import { FineDiningFonts } from "./shared";

export function ModernSteakhouse({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#111111] text-[#E5E5E5] flex flex-col relative overflow-hidden box-border border-l-[12px] border-[#A62C2B]">
      <FineDiningFonts />
      
      <div className="w-full h-full flex flex-col items-start justify-between p-10">
        <div className="w-full">
          <h2 className="font-bodoni text-[11px] uppercase tracking-[0.4em] text-[#A62C2B] mb-2">{headline}</h2>
          <h1 className="font-playfair text-[48px] leading-[0.9] font-bold uppercase mb-6">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter brightness-0 invert opacity-60" />
          )}
        </div>

        <div className="bg-[#E5E5E5] p-2 self-center">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[240px] h-[240px] object-contain" />
        </div>

        <div className="w-full">
          <div className="w-full h-[1px] bg-white/20 mb-4" />
          <div className="flex justify-between items-end w-full">
            <h3 className="font-cormorant text-[16px] italic text-slate-400 max-w-[200px]">{subtext}</h3>
            {wifiPassword && (
              <div className="text-right">
                <div className="font-bodoni text-[9px] uppercase tracking-widest text-[#A62C2B]">WIFI</div>
                <div className="font-playfair text-[14px]">{wifiPassword}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
