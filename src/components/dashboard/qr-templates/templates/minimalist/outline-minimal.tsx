import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { MinimalistFonts } from "./shared";

export function OutlineMinimal({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-white text-[#222] flex flex-col relative overflow-hidden box-border">
      <MinimalistFonts />
      <div className="w-full h-full p-6 border-[8px] border-white relative z-10">
        <div className="w-full h-full border-[2px] rounded-[30px] p-8 flex flex-col justify-between" style={{ borderColor: colorStart }}>
          
          <div className="flex justify-between items-center w-full">
            <h1 className="font-outfit text-[22px] font-semibold" style={{ color: colorStart }}>{brandName}</h1>
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[30px] h-[30px] object-contain" />
            )}
          </div>

          <div className="w-full flex justify-center items-center py-8">
            <div className="p-4 rounded-[24px] border-[2px]" style={{ borderColor: colorStart }}>
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain rounded-xl mix-blend-multiply" />
            </div>
          </div>

          <div className="flex flex-col text-center items-center w-full">
            <h2 className="font-inter text-[18px] font-bold mb-2">{headline}</h2>
            <h3 className="font-inter text-[12px] text-slate-500 uppercase tracking-widest mb-6">{subtext}</h3>
            
            {wifiPassword && (
              <div className="font-outfit text-[12px] font-semibold border rounded-full px-6 py-2 flex items-center gap-2" style={{ borderColor: colorStart, color: colorStart }}>
                <Wifi className="w-3 h-3" /> {wifiPassword}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
