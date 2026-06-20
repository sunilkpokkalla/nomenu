import React from "react";
import { QrTemplateProps } from "../../types";
import { NightlifeFonts } from "./shared";

export function Cyberpunk({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  const accent = colorStart || '#FCEE0A';
  
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#050505] text-[#fcee0a] flex flex-col relative overflow-hidden box-border font-rajdhani border-[2px]" style={{ borderColor: accent, color: accent }}>
      <NightlifeFonts />
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        .font-tech { font-family: 'Share Tech Mono', monospace; }
      `}} />
      
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, #000 2px, #000 4px)' }} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-50 mix-blend-overlay" />

      {/* Decorative HUD Elements */}
      <div className="absolute top-4 right-4 flex gap-1">
        {[1,2,3,4].map(i => <div key={i} className="w-2 h-4 border border-current opacity-50" style={{ backgroundColor: i < 3 ? accent : 'transparent' }} />)}
      </div>
      <div className="absolute bottom-4 left-4 font-tech text-[10px] opacity-60">
        SYS.REQ // 90.0.12<br/>LOC.TRK // ACTIVE
      </div>
      
      <div className="w-full h-full relative z-10 p-8 flex flex-col justify-between">
        
        <div className="flex flex-col items-start w-full border-l-4 pl-4 mb-6" style={{ borderColor: accent }}>
          <div className="text-black px-2 py-0.5 text-[10px] font-bold tracking-widest mb-3 font-tech" style={{ backgroundColor: accent }}>
            WARNING // AUTHORIZED ONLY
          </div>
          <h1 className="font-syncopate text-[32px] font-bold leading-tight uppercase text-white tracking-tighter drop-shadow-[2px_2px_0_rgba(252,238,10,0.5)]">
            {brandName}
          </h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] object-contain filter brightness-0 invert mt-4 opacity-90" />
          )}
        </div>

        <div className="flex justify-center w-full py-4 relative group">
          {/* Target Reticle Corners */}
          <div className="absolute top-0 left-[10%] w-4 h-4 border-t-2 border-l-2 border-current" />
          <div className="absolute top-0 right-[10%] w-4 h-4 border-t-2 border-r-2 border-current" />
          <div className="absolute bottom-0 left-[10%] w-4 h-4 border-b-2 border-l-2 border-current" />
          <div className="absolute bottom-0 right-[10%] w-4 h-4 border-b-2 border-r-2 border-current" />
          
          <div className="bg-black p-2 border-[1px] border-current shadow-[0_0_15px_rgba(252,238,10,0.2)]">
            <div className="bg-white p-2">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full text-white/90 mt-4">
          <div className="flex justify-between items-end border-b border-white/20 pb-2 mb-3">
            <h2 className="text-[14px] font-bold tracking-[0.2em] uppercase font-tech text-white">{headline}</h2>
            <span className="font-tech text-[10px] uppercase" style={{ color: accent }}>{subtext}</span>
          </div>
          
          {wifiPassword && (
            <div className="w-full p-3 flex justify-between items-center font-tech border border-current bg-black/60 backdrop-blur-sm mt-2">
              <span className="uppercase text-[11px] tracking-widest opacity-80">&gt; NET_KEY</span>
              <span className="text-[16px] font-bold tracking-wider">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
