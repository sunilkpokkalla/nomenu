import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { NightlifeFonts } from "./shared";

export function ConfettiParty({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#ffffff] text-black flex flex-col relative overflow-hidden box-border p-8 font-rajdhani border-8" style={{ borderColor: colorStart }}>
      <NightlifeFonts />
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none bg-[radial-gradient(circle,rgba(0,0,0,0.1)_2px,transparent_2px)]" style={{ backgroundSize: '20px 20px' }} />
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full mix-blend-multiply opacity-50 blur-xl" style={{ backgroundColor: colorEnd }} />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full mix-blend-multiply opacity-50 blur-xl" style={{ backgroundColor: colorStart }} />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between bg-white/80 backdrop-blur-sm p-6 rounded-3xl border-4" style={{ borderColor: colorEnd }}>
        
        <div className="flex flex-col items-center text-center">
          <h2 className="text-[14px] font-bold tracking-widest uppercase mb-2" style={{ color: colorEnd }}>{headline}</h2>
          <h1 className="font-bebas text-[54px] leading-none tracking-wider drop-shadow-sm mb-4" style={{ color: colorStart }}>{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain" />
          )}
        </div>

        <div className="bg-white p-3 rounded-2xl shadow-xl transform rotate-2 border-2" style={{ borderColor: colorStart }}>
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain" />
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-syncopate text-[12px] uppercase tracking-widest mb-6 text-center font-bold" style={{ color: colorEnd }}>{subtext}</h3>
          
          {wifiPassword && (
            <div className="rounded-full px-6 py-2 border-2 flex items-center gap-3 bg-white" style={{ borderColor: colorStart }}>
              <Wifi className="w-5 h-5" style={{ color: colorEnd }} />
              <span className="text-[16px] font-black tracking-widest text-black">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
