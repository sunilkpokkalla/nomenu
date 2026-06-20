import React from "react";
import { QrTemplateProps } from "../../types";
import { Info } from "lucide-react";
import { MinimalistFonts } from "./shared";

export function SwissGrid({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-white text-black flex flex-col relative overflow-hidden p-[20px] box-border border-[1px] border-slate-100">
      <MinimalistFonts />
      <div className="w-full h-full border-[1px] border-black flex flex-col">
        
        {/* Top Header */}
        <div className="w-full border-b-[1px] border-black p-4 flex justify-between items-start h-[100px]">
          <div className="flex flex-col">
            <h1 className="font-inter text-[28px] font-black leading-none uppercase tracking-tighter">{brandName}</h1>
            <h2 className="font-inter text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-2">{headline}</h2>
          </div>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain grayscale" />
          )}
        </div>

        {/* Center QR Grid */}
        <div className="flex-grow flex items-center justify-center p-8 bg-[#f9f9f9]">
          <div className="w-[280px] h-[280px] bg-white border-[1px] border-black p-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-full h-full object-contain mix-blend-multiply" />
          </div>
        </div>

        {/* Bottom Info Grid */}
        <div className="w-full h-[120px] border-t-[1px] border-black flex">
          <div className="w-1/2 border-r-[1px] border-black p-4 flex flex-col justify-between bg-black text-white">
            <span className="font-inter text-[10px] uppercase tracking-widest text-slate-400">Scan to View</span>
            <span className="font-inter text-[18px] font-bold leading-tight">{subtext}</span>
          </div>
          <div className="w-1/2 p-4 flex flex-col justify-between">
            <span className="font-inter text-[10px] uppercase tracking-widest text-slate-500">Network</span>
            <span className="font-inter text-[14px] font-bold">{wifiPassword || "N/A"}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
