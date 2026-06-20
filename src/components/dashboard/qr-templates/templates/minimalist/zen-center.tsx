import React from "react";
import { QrTemplateProps } from "../../types";
import { MinimalistFonts } from "./shared";

export function ZenCenter({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-white text-slate-800 flex flex-col relative overflow-hidden box-border items-center justify-center p-12 text-center">
      <MinimalistFonts />
      
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full border border-slate-100 bg-slate-50/50" />
      
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full">
        
        <div className="flex flex-col items-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[30px] h-[30px] object-contain grayscale opacity-60 mb-6" />
          )}
          <h1 className="font-inter text-[24px] font-bold tracking-[0.2em] uppercase text-slate-900">{brandName}</h1>
        </div>

        <div className="p-2 border border-slate-200 rounded-[20px] bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply rounded-xl opacity-90" />
        </div>

        <div className="flex flex-col items-center w-full">
          <h2 className="font-outfit text-[18px] text-slate-700 mb-2">{headline}</h2>
          <h3 className="font-inter text-[11px] text-slate-400 uppercase tracking-widest mb-8">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-inter text-[11px] font-medium tracking-widest text-slate-500 flex flex-col gap-1">
              <span>WIFI CONNECT</span>
              <span className="text-slate-900">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
