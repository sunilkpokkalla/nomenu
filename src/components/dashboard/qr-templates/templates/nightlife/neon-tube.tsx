import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { NightlifeFonts } from "./shared";

export function NeonTube({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  const neonColor = colorStart || '#00FFFF';
  
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden box-border p-10 font-rajdhani">
      <NightlifeFonts />
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Monoton&display=swap');
        .font-monoton { font-family: 'Monoton', cursive; }
      `}} />
      
      {/* Brick Wall Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brick-wall-dark.png')] opacity-60 mix-blend-overlay" />
      
      {/* Global Ambient Glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen" style={{ background: `radial-gradient(circle at center, ${neonColor} 0%, transparent 70%)` }} />
      
      <div className="w-full h-full flex flex-col justify-between items-center relative z-10">
        
        {/* Neon Sign Header */}
        <div className="flex flex-col items-center text-center w-full">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain filter brightness-0 invert mb-4 opacity-90" style={{ filter: `drop-shadow(0 0 10px ${neonColor}) drop-shadow(0 0 20px ${neonColor})` }} />
          )}
          
          {/* Off-state tube behind text for realism */}
          <div className="relative">
            <h1 className="font-monoton text-[42px] leading-tight tracking-wider absolute inset-0 text-white/5 blur-[2px]">{brandName}</h1>
            <h1 className="font-monoton text-[42px] leading-tight tracking-wider relative text-white" style={{ textShadow: `0 0 5px #fff, 0 0 10px #fff, 0 0 20px ${neonColor}, 0 0 40px ${neonColor}, 0 0 80px ${neonColor}` }}>
              {brandName}
            </h1>
          </div>
          
          <h2 className="text-[14px] font-bold tracking-[0.4em] uppercase mt-6 text-white/80 border-t border-b py-2 w-full border-white/20" style={{ textShadow: `0 0 10px ${neonColor}` }}>{headline}</h2>
        </div>

        {/* Neon Framed QR */}
        <div className="relative p-1 rounded-2xl" style={{ boxShadow: `0 0 10px ${neonColor}, inset 0 0 10px ${neonColor}` }}>
          <div className="absolute inset-0 rounded-2xl opacity-20 bg-white" />
          <div className="bg-black p-3 rounded-xl border border-white/10 relative z-10">
            <div className="bg-white p-2 rounded-lg">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[170px] h-[170px] object-contain mix-blend-multiply" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full mt-4">
          <h3 className="font-rajdhani text-[14px] uppercase tracking-widest text-white/60 mb-6 font-medium">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full bg-black/60 border-2 rounded-xl p-4 flex justify-between items-center backdrop-blur-md" style={{ borderColor: `${neonColor}80`, boxShadow: `0 0 15px ${neonColor}40, inset 0 0 15px ${neonColor}40` }}>
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 flex items-center gap-2"><Wifi className="w-4 h-4"/> NETWORK</span>
              <span className="text-[18px] font-bold tracking-widest text-white" style={{ textShadow: `0 0 10px ${neonColor}, 0 0 20px ${neonColor}` }}>{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
