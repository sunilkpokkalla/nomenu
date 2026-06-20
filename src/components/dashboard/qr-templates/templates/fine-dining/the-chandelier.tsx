import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { FineDiningFonts } from "./shared";

export function TheChandelier({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-slate-900 text-white flex flex-col relative overflow-hidden box-border items-center justify-center p-8">
      <FineDiningFonts />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-slate-700/30 rounded-full blur-[60px]" />
      
      <div className="w-full h-full border-[0.5px] border-slate-500 rounded-[40px] flex flex-col items-center justify-between p-8 backdrop-blur-sm bg-black/20">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-cormorant text-[12px] tracking-[0.4em] text-slate-400 uppercase mb-4">{headline}</h2>
          <h1 className="font-bodoni text-[32px] text-white tracking-wider">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[30px] h-[30px] object-contain mt-4 opacity-70 filter brightness-0 invert" />
          )}
        </div>

        <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl">
          <div className="bg-white p-2 rounded-2xl">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-500 to-transparent mb-4" />
          <h3 className="font-playfair text-[14px] italic text-slate-300 mb-4">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex items-center gap-2 font-cormorant text-[12px] text-slate-400 tracking-widest border border-slate-600 rounded-full px-6 py-2">
              <Wifi className="w-3 h-3" /> {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
