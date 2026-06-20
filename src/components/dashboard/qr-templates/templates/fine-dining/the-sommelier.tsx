import React from "react";
import { QrTemplateProps } from "../../types";
import { FineDiningFonts } from "./shared";

export function TheSommelier({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#2C1318] text-[#F5E6D3] flex flex-col relative overflow-hidden p-6 box-border">
      <FineDiningFonts />
      <div className="w-full h-full border-2 border-[#8B3A42] flex flex-col items-center justify-between p-8 relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="flex flex-col items-center z-10">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[60px] h-[60px] rounded-full border border-[#F5E6D3] object-cover mb-6" />
          )}
          <h1 className="font-playfair text-[40px] italic text-center leading-none">{brandName}</h1>
        </div>

        <div className="bg-[#F5E6D3] p-3 rounded-sm z-10">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[220px] h-[220px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center text-center z-10 w-full">
          <div className="border-t border-b border-[#8B3A42] py-2 w-full mb-4">
            <h2 className="font-cormorant text-[18px] tracking-[0.15em] uppercase">{headline}</h2>
          </div>
          <span className="font-playfair text-[14px] italic text-[#D3A9A3] mb-4">{subtext}</span>
          
          {wifiPassword && (
            <div className="font-cormorant text-[12px] tracking-widest border border-[#8B3A42] px-4 py-1">
              WIFI: {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
