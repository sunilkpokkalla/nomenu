import React from "react";
import { QrTemplateProps } from "../../types";
import { NightlifeFonts } from "./shared";

export function LaserGrid({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#020202] text-white flex flex-col relative overflow-hidden box-border font-rajdhani">
      <NightlifeFonts />
      <div className="absolute bottom-0 left-0 w-full h-[50%] opacity-20 pointer-events-none" style={{
        backgroundImage: `linear-gradient(transparent 95%, ${colorStart} 100%), linear-gradient(90deg, transparent 95%, ${colorEnd} 100%)`,
        backgroundSize: '30px 30px',
        transform: 'perspective(500px) rotateX(60deg) scale(2)',
        transformOrigin: 'bottom center'
      }} />
      
      <div className="w-full h-full relative z-10 flex flex-col p-10 justify-between items-center">
        
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] object-contain filter brightness-0 invert mb-4" />
          )}
          <h1 className="font-syncopate text-[26px] font-bold uppercase tracking-widest leading-tight" style={{ color: colorStart }}>{brandName}</h1>
          <h2 className="text-[14px] text-white/50 tracking-widest uppercase mt-2">{headline}</h2>
        </div>

        <div className="relative p-1 bg-gradient-to-br rounded-sm" style={{ backgroundImage: `linear-gradient(to bottom right, ${colorStart}, ${colorEnd})` }}>
          <div className="bg-black p-3">
            <div className="bg-white p-2">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain mix-blend-multiply" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-syncopate text-[11px] text-white/80 uppercase tracking-widest mb-6 text-center">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex items-center gap-3 border border-white/20 px-6 py-2 bg-black/50 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">NET</span>
              <span className="text-[14px] font-bold tracking-widest" style={{ color: colorEnd }}>{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
