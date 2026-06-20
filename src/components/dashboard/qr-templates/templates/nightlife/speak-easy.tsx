import React from "react";
import { QrTemplateProps } from "../../types";
import { NightlifeFonts } from "./shared";

export function SpeakEasy({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1a1412] text-[#d4af37] flex flex-col relative overflow-hidden box-border p-6 font-bebas">
      <NightlifeFonts />
      <div className="w-full h-full border border-[#d4af37]/30 p-2">
        <div className="w-full h-full border-2 border-[#d4af37] p-8 flex flex-col items-center justify-between relative bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a1412] px-4">
            <div className="w-[20px] h-[20px] rotate-45 border border-[#d4af37]" />
          </div>

          <div className="flex flex-col items-center text-center mt-4 w-full">
            <h2 className="font-rajdhani text-[12px] font-medium tracking-[0.4em] uppercase text-[#d4af37]/70 mb-2">{headline}</h2>
            <h1 className="text-[52px] tracking-widest leading-[0.9]">{brandName}</h1>
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter sepia hue-rotate-[30deg] saturate-[100%] brightness-75 mt-4" />
            )}
          </div>

          <div className="bg-[#FAF9F6] p-3 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>

          <div className="flex flex-col items-center w-full">
            <h3 className="font-rajdhani text-[14px] uppercase tracking-widest text-[#d4af37]/80 mb-6">{subtext}</h3>
            
            {wifiPassword && (
              <div className="w-full border-t border-[#d4af37]/30 pt-4 flex flex-col items-center font-rajdhani">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]/50">Password Required</span>
                <span className="text-[16px] font-bold tracking-widest mt-1">{wifiPassword}</span>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#1a1412] px-4">
            <div className="w-[20px] h-[20px] rotate-45 border border-[#d4af37]" />
          </div>

        </div>
      </div>
    </div>
  );
}
