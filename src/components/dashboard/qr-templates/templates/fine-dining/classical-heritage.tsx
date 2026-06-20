import React from "react";
import { QrTemplateProps } from "../../types";
import { FineDiningFonts } from "./shared";

export function ClassicalHeritage({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FAF9F6] text-[#2B2B2B] flex flex-col relative overflow-hidden box-border p-8 border-[10px] border-[#2B2B2B]">
      <FineDiningFonts />
      <div className="w-full h-full flex flex-col items-center justify-between">
        
        <div className="flex flex-col items-center text-center w-full">
          <div className="w-full border-b-[2px] border-[#2B2B2B] mb-2" />
          <div className="w-full border-b border-[#2B2B2B] mb-6" />
          
          <h1 className="font-bodoni text-[46px] uppercase font-bold leading-[0.9]">{brandName}</h1>
          <h2 className="font-cormorant text-[18px] italic mt-4">{headline}</h2>
        </div>

        <div className="w-full flex justify-center py-6 border-y border-[#2B2B2B]/20">
          <div className="p-2 border border-[#2B2B2B]">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain grayscale mb-4" />
          )}
          <h3 className="font-playfair text-[12px] uppercase tracking-[0.2em] mb-4">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-bodoni text-[12px] border border-[#2B2B2B] px-4 py-2 uppercase tracking-widest">
              Passcode: {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
