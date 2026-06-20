import React from "react";
import { QrTemplateProps } from "../../types";
import { FineDiningFonts } from "./shared";

export function OmakaseMinimal({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#F9F7F1] text-[#2C2C2C] flex flex-col relative overflow-hidden box-border">
      <FineDiningFonts />
      <div className="absolute top-0 left-0 w-2 h-full bg-[#8C2121]" />
      
      <div className="w-full h-full flex flex-col items-start justify-between p-12 ml-4">
        <div>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain mb-6 grayscale" />
          )}
          <h1 className="font-playfair text-[42px] font-bold leading-tight">{brandName}</h1>
          <h2 className="font-cormorant text-[16px] italic text-slate-500 mt-2">{headline}</h2>
        </div>

        <div className="relative">
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#2C2C2C]" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#2C2C2C]" />
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col">
          <h3 className="font-bodoni text-[14px] tracking-[0.3em] uppercase mb-4">{subtext}</h3>
          {wifiPassword && (
            <div className="font-playfair text-[12px] text-slate-600">
              <span className="italic mr-2">Network:</span> {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
