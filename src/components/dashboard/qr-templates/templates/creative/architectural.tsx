import React from "react";
import { QrTemplateProps } from "../../types";
import { CreativeFonts } from "./shared";

export function Architectural({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#F4F4F4] text-[#111111] flex flex-col relative overflow-hidden box-border font-cabinet border-[1px] border-[#D1D1D1]">
      <CreativeFonts />
      <div className="absolute top-0 right-0 w-[200px] h-full bg-[#E8E8E8] border-l-[1px] border-[#D1D1D1]" />
      
      <div className="w-full h-full relative z-10 p-10 flex flex-col justify-between">
        
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-[60%]">
            <h1 className="font-syne text-[32px] font-bold uppercase leading-[0.9] tracking-tighter mb-4">{brandName}</h1>
            <h2 className="text-[11px] font-medium tracking-[0.2em] uppercase text-slate-500">{headline}</h2>
          </div>
          <div className="w-[30%] flex justify-end">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain grayscale" />
            )}
          </div>
        </div>

        <div className="w-full flex justify-start py-10 relative">
          <div className="absolute top-1/2 left-[10%] w-[120%] h-[1px] bg-[#D1D1D1]" />
          <div className="bg-white p-4 border-[1px] border-[#111111] shadow-[10px_10px_0_0_#E8E8E8] relative z-10 ml-4">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col w-full text-right items-end mt-4">
          <h3 className="text-[16px] font-bold uppercase tracking-widest w-[80%] mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="border border-[#111111] p-3 w-[60%] flex justify-between items-center text-[13px] bg-white">
              <span className="font-medium text-slate-500 uppercase">WiFi</span>
              <span className="font-bold">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
