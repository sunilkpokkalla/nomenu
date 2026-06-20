import React from "react";
import { QrTemplateProps } from "../../types";
import { MinimalistFonts } from "./shared";

export function PureWhitespace({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-white text-[#1a1a1a] flex flex-col relative overflow-hidden box-border">
      <MinimalistFonts />
      <div className="w-full h-full p-12 flex flex-col items-center justify-center relative">
        
        <div className="absolute top-12 left-12 flex items-center gap-4">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[24px] h-[24px] object-contain grayscale" />
          )}
          <h1 className="font-outfit text-[16px] font-semibold tracking-wide">{brandName}</h1>
        </div>

        <div className="mb-12 mt-8">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply opacity-90" />
        </div>

        <div className="text-center flex flex-col items-center w-full">
          <h2 className="font-outfit text-[22px] font-light tracking-tight mb-2">{headline}</h2>
          <h3 className="font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-outfit text-[13px] text-slate-500 bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
              WiFi <span className="font-semibold text-slate-800 ml-2">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
