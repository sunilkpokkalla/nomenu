import React from "react";
import { QrTemplateProps } from "../../types";
import { CasualFonts } from "./shared";

export function SundayBrunch({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FFFAF0] text-[#FF7F50] flex flex-col relative overflow-hidden box-border p-8 border-[12px] border-[#FFF0F5] rounded-[40px]">
      <CasualFonts />
      
      <div className="w-full h-full border-[3px] border-dashed border-[#FF7F50]/30 rounded-[24px] flex flex-col items-center justify-between p-8 bg-white/50">
        
        <div className="flex flex-col items-center text-center">
          <h2 className="font-quicksand text-[12px] font-bold uppercase tracking-[0.2em] text-[#FFA07A] mb-4">{headline}</h2>
          <h1 className="font-pacifico text-[48px] text-[#FF7F50] leading-none mb-4 transform -rotate-2">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain opacity-80" />
          )}
        </div>

        <div className="bg-white p-4 rounded-full shadow-[0_8px_20px_rgba(255,127,80,0.15)] border border-[#FF7F50]/10">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply rounded-full" />
        </div>

        <div className="flex flex-col items-center text-center w-full">
          <h3 className="font-nunito text-[16px] font-bold text-[#FFA07A] mb-6 max-w-[250px]">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-quicksand text-[14px] font-bold text-[#FF7F50] bg-[#FFF0F5] px-6 py-2 rounded-full border border-[#FF7F50]/20">
              WIFI / {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
