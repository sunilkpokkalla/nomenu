import React from "react";
import { QrTemplateProps } from "../../types";
import { MinimalistFonts } from "./shared";

export function Bauhaus({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#F5F5DC] text-[#222] flex flex-col relative overflow-hidden box-border">
      <MinimalistFonts />
      <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full mix-blend-multiply opacity-80" style={{ backgroundColor: colorStart }} />
      <div className="absolute bottom-[-20px] right-[-20px] w-[150px] h-[150px] rounded-sm mix-blend-multiply opacity-80 bg-[#FF3B30]" />
      
      <div className="w-full h-full relative z-10 p-10 flex flex-col justify-between">
        <div className="flex justify-between items-center w-full">
          <h1 className="font-inter text-[24px] font-bold tracking-tighter uppercase">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain grayscale mix-blend-multiply" />
          )}
        </div>

        <div className="w-full flex justify-center py-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] border-[4px] border-[#222] rotate-[15deg] pointer-events-none" />
          <div className="bg-[#FAF9F6] p-4 border-[2px] border-[#222] shadow-[8px_8px_0_0_rgba(34,34,34,1)]">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="w-full bg-[#222] text-white p-6 -mx-10 -mb-10 w-[calc(100%+80px)] flex justify-between items-end">
          <div className="flex flex-col">
            <h3 className="font-space text-[12px] uppercase tracking-widest text-slate-400 mb-1">{subtext}</h3>
            <h2 className="font-inter text-[20px] font-bold">{headline}</h2>
          </div>
          
          {wifiPassword && (
            <div className="font-space text-[14px] bg-white text-[#222] px-4 py-2 font-bold transform -skew-x-12">
              WIFI: {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
