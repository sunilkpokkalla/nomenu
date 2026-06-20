import React from "react";
import { QrTemplateProps } from "../../types";
import { CreativeFonts } from "./shared";

export function FunkyRetro({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FFE0B2] text-[#4E342E] flex flex-col relative overflow-hidden box-border p-6 font-syne">
      <CreativeFonts />
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/retina-wood.png')]" />
      
      <div className="w-full h-full border-4 border-[#4E342E] rounded-[40px] flex flex-col p-8 justify-between relative bg-[#FFCC80] overflow-hidden shadow-inner">
        
        {/* Retro rays */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none" style={{
          background: `repeating-conic-gradient(from 0deg, ${colorStart} 0deg 15deg, transparent 15deg 30deg)`
        }} />

        <div className="relative z-10 flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain filter drop-shadow-[2px_2px_0_#4E342E] mb-2" />
          )}
          <h1 className="font-knewave text-[48px] text-[#FF5722] drop-shadow-[3px_3px_0_#4E342E] leading-tight transform -rotate-2">{brandName}</h1>
          <h2 className="text-[14px] font-bold tracking-widest uppercase mt-4 bg-[#4E342E] text-[#FFE0B2] px-4 py-1 rounded-full">{headline}</h2>
        </div>

        <div className="relative z-10 bg-[#FFF3E0] p-4 rounded-3xl border-4 border-[#4E342E] shadow-[8px_8px_0_0_#4E342E] transform rotate-2 self-center">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
        </div>

        <div className="relative z-10 flex flex-col items-center w-full">
          <h3 className="text-[18px] font-bold uppercase mb-6 text-center">{subtext}</h3>
          
          {wifiPassword && (
            <div className="bg-[#FF5722] text-white border-2 border-[#4E342E] shadow-[4px_4px_0_0_#4E342E] px-6 py-2 rounded-xl flex gap-3 items-center font-bold">
              <span className="uppercase text-[12px] opacity-80">WIFI:</span>
              <span className="text-[16px]">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
