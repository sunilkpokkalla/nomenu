import React from "react";
import { QrTemplateProps } from "../../types";
import { CreativeFonts } from "./shared";

export function PopArt({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FFEB3B] text-[#111] flex flex-col relative overflow-hidden box-border p-6 font-syne border-[8px] border-[#E91E63]">
      <CreativeFonts />
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/polka-dots.png')]" />
      
      <div className="w-full h-full border-4 border-[#111] bg-white p-6 relative flex flex-col items-center justify-between shadow-[12px_12px_0_0_#2196F3]">
        
        <div className="w-full flex justify-between items-start mb-4 relative z-10">
          <div className="bg-[#E91E63] text-white font-bold uppercase tracking-widest px-3 py-1 transform -rotate-3 border-2 border-[#111] shadow-[4px_4px_0_0_#111]">
            {headline}
          </div>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain border-2 border-[#111] bg-[#FFEB3B] p-1 shadow-[4px_4px_0_0_#111]" />
          )}
        </div>

        <h1 className="text-[48px] font-black uppercase text-center leading-[0.9] text-[#2196F3] drop-shadow-[3px_3px_0_#111] relative z-10 mb-6">{brandName}</h1>

        <div className="bg-[#FFEB3B] p-3 border-4 border-[#111] shadow-[8px_8px_0_0_#E91E63] transform rotate-2 relative z-10 mb-8">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full relative z-10 text-center font-cabinet">
          <h3 className="text-[18px] font-black uppercase mb-4 bg-white border-2 border-[#111] px-4 py-2 transform -rotate-1">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full bg-[#2196F3] text-white border-4 border-[#111] shadow-[6px_6px_0_0_#111] p-3 flex justify-between items-center text-[16px]">
              <span className="font-bold uppercase tracking-widest">WIFI:</span>
              <span className="font-black text-[20px]">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
