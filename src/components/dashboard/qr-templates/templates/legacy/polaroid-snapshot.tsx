import React from "react";
import { QrTemplateProps } from "../../types";

export function PolaroidSnapshot({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#f0f0f0] flex items-center justify-center p-[20px] box-border shadow-inner">
      <div className="w-full h-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex flex-col p-[24px] pb-[60px] box-border relative transform rotate-[-1deg]">
        
        {/* Photo area */}
        <div className="w-full bg-slate-900 aspect-square mb-[24px] p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[280px] h-[280px] object-contain mix-blend-screen opacity-90" />
        </div>

        {/* Text area (marker style) */}
        <div className="flex flex-col items-center flex-grow justify-between font-['Comic_Sans_MS',cursive,sans-serif] text-slate-800">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-[28px] font-bold transform -rotate-1">{brandName}</h1>
            <h2 className="text-[16px] text-slate-500 transform rotate-1 mt-1">{headline}</h2>
          </div>

          <div className="text-[22px] font-bold mt-4 transform -rotate-2">
            #{subtext}
          </div>

          {wifiPassword && (
            <div className="text-[14px] text-slate-600 mt-4 border-t-2 border-dashed border-slate-300 pt-2 w-full text-center">
              wifi: {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
