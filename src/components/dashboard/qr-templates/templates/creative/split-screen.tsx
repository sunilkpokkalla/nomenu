import React from "react";
import { QrTemplateProps } from "../../types";
import { CreativeFonts } from "./shared";

export function SplitScreen({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-white text-[#111] flex flex-col relative overflow-hidden box-border font-cabinet border-[1px] border-[#e0e0e0]">
      <CreativeFonts />
      <div className="flex flex-col h-full w-full">
        
        {/* Top Half */}
        <div className="w-full h-[55%] flex flex-col justify-between p-10 bg-slate-50 relative overflow-hidden border-b border-slate-200">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-slate-200 rounded-full blur-3xl opacity-50" />
          
          <div className="flex justify-between items-start w-full relative z-10">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] object-contain grayscale" />
            )}
            <span className="font-syne text-[10px] font-bold uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-full">{headline}</span>
          </div>

          <div className="relative z-10">
            <h1 className="font-syne text-[40px] font-bold uppercase tracking-tighter leading-none mb-2">{brandName}</h1>
            <h3 className="text-[14px] font-medium text-slate-500 uppercase tracking-widest">{subtext}</h3>
          </div>
        </div>

        {/* Bottom Half */}
        <div className="w-full h-[45%] flex p-10 justify-between items-end" style={{ backgroundColor: colorStart }}>
          
          <div className="bg-white p-3 shadow-lg rounded-2xl transform -translate-y-[80px]">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain mix-blend-multiply" />
          </div>

          {wifiPassword && (
            <div className="flex flex-col text-right text-white max-w-[120px]">
              <span className="text-[10px] uppercase tracking-widest opacity-80 mb-1">Wifi Network</span>
              <span className="text-[16px] font-bold break-words">{wifiPassword}</span>
            </div>
          )}
          
        </div>

      </div>
    </div>
  );
}
