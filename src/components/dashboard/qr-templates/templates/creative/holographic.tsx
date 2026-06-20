import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { CreativeFonts } from "./shared";

export function Holographic({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] text-white flex flex-col relative overflow-hidden box-border p-8 font-syne border-[1px] border-white/40" 
      style={{ 
        background: 'linear-gradient(135deg, #f1f2f6 0%, #ffffff 20%, #fbd5e1 35%, #b2f1f8 50%, #eadaff 65%, #ffffff 80%, #f1f2f6 100%)',
        boxShadow: 'inset 0 0 60px rgba(255,255,255,0.8)'
      }}>
      <CreativeFonts />
      
      {/* Iridescent shimmer overlay */}
      <div className="absolute inset-0 opacity-40 mix-blend-color-burn" style={{ background: 'linear-gradient(45deg, rgba(255,0,0,0.1), rgba(0,255,0,0.1), rgba(0,0,255,0.1))' }} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 opacity-50 mix-blend-overlay" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.8), transparent 60%)' }} />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between bg-white/20 backdrop-blur-xl border-[2px] border-white/60 rounded-[30px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05),inset_0_0_20px_rgba(255,255,255,0.8)]">
        
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <div className="w-[60px] h-[60px] rounded-[18px] bg-white/50 backdrop-blur-md p-2 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-white mb-4">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-full h-full object-contain filter drop-shadow-sm" />
            </div>
          )}
          <h1 className="text-[38px] font-extrabold tracking-tight mb-2 text-slate-800 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)] leading-[1.1]">{brandName}</h1>
          <h2 className="font-cabinet text-[12px] font-bold uppercase tracking-[0.2em] bg-white/70 text-slate-600 px-5 py-2 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-white/80">{headline}</h2>
        </div>

        <div className="relative group">
          {/* Holographic glowing ring around QR */}
          <div className="absolute -inset-2 rounded-[32px] blur-xl opacity-60 animate-pulse" style={{ background: 'linear-gradient(90deg, #ff9a9e, #fecfef, #a1c4fd, #c2e9fb)' }} />
          <div className="bg-white/90 p-4 rounded-[28px] relative z-10 border-2 border-white backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <div className="relative overflow-hidden rounded-[16px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30 mix-blend-overlay" />
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply opacity-90" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-cabinet text-[15px] font-bold text-center mb-6 text-slate-700 drop-shadow-[0_1px_2px_rgba(255,255,255,1)] uppercase tracking-wider">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full bg-white/60 border border-white rounded-[20px] p-3 flex justify-between items-center backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
              <span className="text-[11px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-2"><Wifi className="w-4 h-4"/> WiFi</span>
              <span className="text-[15px] font-black text-slate-800">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
