import React from "react";
import { QrTemplateProps } from "../../types";
import { NightlifeFonts } from "./shared";

export function AbstractBass({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#000000] text-white flex flex-col relative overflow-hidden box-border font-rajdhani">
      <NightlifeFonts />
      {/* Abstract geometric background */}
      <div className="absolute top-[20%] left-[-20%] w-[150%] h-[150px] transform -rotate-45 mix-blend-screen opacity-50" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${colorStart}, transparent)` }} />
      <div className="absolute bottom-[20%] right-[-20%] w-[150%] h-[150px] transform -rotate-45 mix-blend-screen opacity-50" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${colorEnd}, transparent)` }} />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between p-10">
        
        <div className="flex flex-col items-center text-center w-full">
          <h1 className="font-syncopate text-[32px] font-bold tracking-tighter uppercase mb-2">{brandName}</h1>
          <h2 className="text-[14px] font-medium tracking-[0.3em] text-white/60 uppercase">{headline}</h2>
        </div>

        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r blur-lg opacity-40 rounded-xl" style={{ backgroundImage: `linear-gradient(to right, ${colorStart}, ${colorEnd})` }} />
          <div className="bg-white p-3 rounded-xl relative z-10">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <h3 className="text-[12px] uppercase tracking-widest text-white/80 mb-4 text-center">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">WIFI:</span>
              <span className="font-bebas text-[20px] tracking-wider">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
