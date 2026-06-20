import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";

export function Claymorphism({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#E0E5EC] flex items-center justify-center p-[24px] box-border relative overflow-hidden rounded-[40px]">
      <div className="w-full h-full rounded-[30px] bg-[#E0E5EC] p-[30px] flex flex-col items-center justify-between box-border shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]">
        
        <div className="flex flex-col items-center">
          {logoUrl && (
            <div className="w-[80px] h-[80px] rounded-full bg-[#E0E5EC] flex items-center justify-center shadow-[inset_6px_6px_10px_0_rgba(163,177,198,0.6),inset_-6px_-6px_10px_0_rgba(255,255,255,0.5)] mb-4 p-2">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-full h-full rounded-full object-cover" />
            </div>
          )}
          <h1 className="text-[24px] font-extrabold text-slate-700">{brandName}</h1>
          <h2 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">{headline}</h2>
        </div>

        <div className="p-4 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply rounded-xl" />
        </div>

        <div className="flex flex-col items-center w-full gap-4">
          <div className="px-8 py-3 rounded-full bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgb(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
            <span className="text-[16px] font-bold text-slate-600 tracking-wider uppercase">{subtext}</span>
          </div>
          
          {wifiPassword && (
            <div className="w-full rounded-[20px] bg-[#E0E5EC] p-4 text-center shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1 mb-1"><Wifi className="w-3 h-3" /> Guest WiFi</span>
              <span className="text-[14px] font-bold text-slate-600">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
