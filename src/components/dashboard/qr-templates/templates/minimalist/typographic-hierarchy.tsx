import React from "react";
import { QrTemplateProps } from "../../types";
import { MinimalistFonts } from "./shared";

export function TypographicHierarchy({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#000] text-[#fff] flex flex-col relative overflow-hidden box-border p-12 justify-between">
      <MinimalistFonts />
      
      <div className="flex flex-col w-full">
        {logoUrl && (
          <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[36px] h-[36px] object-contain filter brightness-0 invert mb-8" />
        )}
        <h1 className="font-inter text-[64px] font-black leading-[0.8] tracking-tighter break-words">{brandName}</h1>
        <h2 className="font-space text-[16px] text-slate-400 mt-6 max-w-[200px]">{headline}</h2>
      </div>

      <div className="self-end bg-white p-2">
        <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain mix-blend-multiply" />
      </div>

      <div className="w-full flex justify-between items-end border-b border-white/30 pb-4">
        <h3 className="font-inter text-[14px] font-bold uppercase tracking-widest text-white">{subtext}</h3>
        {wifiPassword && (
          <div className="font-space text-[14px] text-slate-300">
            WIFI: <span className="text-white font-bold">{wifiPassword}</span>
          </div>
        )}
      </div>

    </div>
  );
}
