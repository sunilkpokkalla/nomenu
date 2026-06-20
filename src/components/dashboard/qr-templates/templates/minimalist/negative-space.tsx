import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { MinimalistFonts } from "./shared";

export function NegativeSpace({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#111] text-white flex flex-col relative overflow-hidden box-border">
      <MinimalistFonts />
      <div className="absolute top-0 right-0 w-[80%] h-full bg-white clip-path-diagonal" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
      
      <div className="w-full h-full relative z-10 flex flex-col p-10 justify-between">
        
        <div className="w-full max-w-[200px]">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter brightness-0 invert mb-6" />
          )}
          <h1 className="font-space text-[42px] font-bold leading-none uppercase tracking-tighter mix-blend-difference text-white">{brandName}</h1>
        </div>

        <div className="self-end bg-white p-4 shadow-2xl mr-4 border border-slate-100">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain" />
        </div>

        <div className="flex flex-col text-right items-end text-[#111]">
          <h2 className="font-space text-[18px] font-bold mb-1">{headline}</h2>
          <h3 className="font-inter text-[12px] text-slate-500 uppercase tracking-widest mb-4">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-space text-[14px] font-semibold flex items-center gap-2 text-slate-800">
              <Wifi className="w-4 h-4" /> {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
