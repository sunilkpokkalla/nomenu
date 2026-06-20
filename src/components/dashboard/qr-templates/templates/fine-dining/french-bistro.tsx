import React from "react";
import { QrTemplateProps } from "../../types";
import { FineDiningFonts } from "./shared";

export function FrenchBistro({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#Fdfbf7] text-[#1a1a1a] flex flex-col relative overflow-hidden box-border p-6">
      <FineDiningFonts />
      <div className="w-full h-full border-[3px] border-double border-[#1a1a1a] flex flex-col items-center justify-between p-6">
        
        <div className="flex flex-col items-center w-full">
          <div className="w-full border-b border-[#1a1a1a] pb-4 mb-4 text-center">
            <h2 className="font-cormorant text-[14px] uppercase tracking-[0.2em]">{headline}</h2>
          </div>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[70px] h-[70px] object-cover rounded-full border border-[#1a1a1a] mb-4" />
          )}
          <h1 className="font-playfair text-[38px] font-bold italic text-center leading-none">{brandName}</h1>
        </div>

        <div className="relative">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[220px] h-[220px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="w-[50px] h-[2px] bg-[#1a1a1a] mb-4" />
          <h3 className="font-bodoni text-[16px] uppercase tracking-widest mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full border-t border-[#1a1a1a] pt-4 text-center font-cormorant">
              <span className="text-[14px] italic mr-2">Accès WiFi:</span>
              <span className="text-[14px] font-bold">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
