import React from "react";
import { QrTemplateProps } from "../../types";

export function Brutalist({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#E5E5E5] flex flex-col relative overflow-hidden box-border border-[4px] border-black">
      <div className="w-full border-b-[4px] border-black bg-[#FF3B30] p-4 flex items-center justify-between" style={{ backgroundColor: colorStart }}>
        <h1 className="text-[24px] font-black text-black uppercase tracking-tighter mix-blend-overlay">{brandName}</h1>
        {logoUrl && (
          <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-cover border-[2px] border-black mix-blend-luminosity" />
        )}
      </div>

      <div className="flex-grow p-[30px] flex flex-col items-center justify-between box-border">
        <div className="w-full">
          <h2 className="text-[48px] font-black text-black leading-[0.9] uppercase break-words text-left tracking-tighter">{headline}</h2>
        </div>

        <div className="border-[4px] border-black bg-white p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[260px] h-[260px] object-contain mix-blend-multiply" />
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="border-[3px] border-black p-3 bg-black text-white text-center">
            <span className="text-[24px] font-black uppercase tracking-widest">{subtext}</span>
          </div>
          
          {wifiPassword && (
            <div className="border-[3px] border-black p-3 bg-white flex justify-between items-center font-bold">
              <span className="uppercase text-[14px]">WiFi PASS:</span>
              <span className="text-[18px]">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
