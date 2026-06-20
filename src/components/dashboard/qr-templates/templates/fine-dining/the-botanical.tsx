import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { FineDiningFonts } from "./shared";

export function TheBotanical({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#EBE7E0] text-[#2C402E] flex flex-col relative overflow-hidden box-border items-center justify-center p-6">
      <FineDiningFonts />
      <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] border-[1px] border-[#2C402E] rounded-full opacity-20" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[250px] h-[250px] border-[1px] border-[#2C402E] rounded-full opacity-20" />
      
      <div className="w-full h-full flex flex-col items-center justify-between p-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain mb-4 filter brightness-0 sepia hue-rotate-[90deg] saturate-[50%]" />
          )}
          <h1 className="font-cormorant text-[42px] uppercase tracking-widest leading-none mb-2">{brandName}</h1>
          <h2 className="font-playfair text-[14px] italic text-[#4A5D4C]">{headline}</h2>
        </div>

        <div className="bg-white p-6 rounded-t-full rounded-b-[40px] shadow-sm border border-[#2C402E]/10">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-bodoni text-[12px] uppercase tracking-[0.2em] mb-4">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-cormorant border border-[#2C402E]/30 rounded-full px-6 py-1 text-[13px] flex items-center gap-2">
              <Wifi className="w-3 h-3" /> {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
