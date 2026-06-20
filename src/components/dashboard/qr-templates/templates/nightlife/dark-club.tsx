import React from "react";
import { QrTemplateProps } from "../../types";
import { NightlifeFonts } from "./shared";

export function DarkClub({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0a0a0a] text-[#ffffff] flex flex-col relative overflow-hidden box-border p-6 font-rajdhani">
      <NightlifeFonts />
      <div className="w-full h-full border border-white/10 p-8 flex flex-col justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        
        <div className="flex flex-col items-center text-center">
          <div className="w-[2px] h-[40px] bg-white/20 mb-6" />
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter brightness-0 invert mb-4 opacity-80" />
          )}
          <h1 className="font-bebas text-[60px] leading-[0.8] tracking-widest uppercase mb-4 text-white/90">{brandName}</h1>
          <h2 className="text-[14px] font-bold tracking-[0.2em] text-white/40 uppercase">{headline}</h2>
        </div>

        <div className="bg-white/5 p-4 rounded-sm border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-sm">
          <div className="bg-[#f0f0f0] p-1">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-bebas text-[24px] tracking-widest text-white/30 mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex flex-col items-center">
              <div className="w-[40px] h-[2px] bg-white/20 mb-2" />
              <div className="text-[14px] font-bold tracking-widest text-white/60">
                WIFI: {wifiPassword}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
