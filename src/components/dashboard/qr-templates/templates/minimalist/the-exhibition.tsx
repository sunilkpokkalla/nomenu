import React from "react";
import { QrTemplateProps } from "../../types";
import { MinimalistFonts } from "./shared";

export function TheExhibition({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#EEEEEE] text-[#111] flex flex-col relative overflow-hidden box-border p-[30px]">
      <MinimalistFonts />
      <div className="w-full h-full bg-white shadow-2xl p-8 flex flex-col">
        
        <div className="flex justify-between w-full mb-12">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[30px] h-[30px] object-contain grayscale opacity-80" />
          )}
          <span className="font-inter text-[10px] text-slate-400 tracking-widest uppercase">Exhibit A</span>
        </div>

        <div className="flex-grow flex flex-col justify-center items-center w-full pb-10">
          <div className="w-full aspect-square border border-slate-200 bg-slate-50 flex items-center justify-center p-6 mb-8">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          
          <h1 className="font-outfit text-[28px] font-bold leading-none mb-2 w-full">{brandName}</h1>
          <h2 className="font-inter text-[14px] text-slate-500 w-full mb-1">{headline}</h2>
          <h3 className="font-inter text-[12px] text-slate-400 w-full">{subtext}</h3>
        </div>

        {wifiPassword && (
          <div className="w-full border-t border-slate-200 pt-4 flex justify-between items-center">
            <span className="font-inter text-[10px] text-slate-400 tracking-widest uppercase">Network</span>
            <span className="font-space text-[12px] font-bold">{wifiPassword}</span>
          </div>
        )}

      </div>
    </div>
  );
}
