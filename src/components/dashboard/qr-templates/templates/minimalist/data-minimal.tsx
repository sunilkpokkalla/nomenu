import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { MinimalistFonts } from "./shared";

export function DataMinimal({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-slate-50 text-slate-900 flex flex-col relative overflow-hidden box-border font-space">
      <MinimalistFonts />
      
      {/* Top Bar */}
      <div className="w-full bg-slate-900 text-white p-3 flex justify-between items-center text-[10px] uppercase tracking-widest">
        <span>ID: {brandName.substring(0,4).toUpperCase()}</span>
        <span>SYS_ACTIVE</span>
      </div>

      <div className="flex-grow p-10 flex flex-col justify-between w-full h-full">
        
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain grayscale mb-6" />
            )}
            <h1 className="text-[28px] font-bold uppercase tracking-tighter leading-none">{brandName}</h1>
            <h2 className="text-[12px] text-slate-500 mt-2">[{subtext}]</h2>
          </div>
        </div>

        <div className="w-full flex justify-center py-8 border-y border-slate-200 border-dashed my-8">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase">Action</span>
            <span className="text-[14px] font-semibold">{headline}</span>
          </div>
          {wifiPassword && (
            <div className="flex flex-col border-l border-slate-200 pl-4">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1"><Wifi className="w-3 h-3"/> Network</span>
              <span className="text-[14px] font-semibold">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
