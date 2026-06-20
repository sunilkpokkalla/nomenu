import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { CreativeFonts } from "./shared";

export function GlassOrbs({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#111] text-white flex flex-col relative overflow-hidden box-border font-cabinet">
      <CreativeFonts />
      
      {/* High saturation deep background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#222]" />
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full blur-[80px] mix-blend-screen opacity-50" style={{ backgroundColor: colorStart || '#00F0FF' }} />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full blur-[100px] mix-blend-screen opacity-40" style={{ backgroundColor: colorEnd || '#FF0055' }} />
      
      {/* Heavy noise overlay for physical texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')] opacity-30 mix-blend-overlay pointer-events-none" />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between p-8">
        
        <div className="w-full flex flex-col items-center text-center bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-3xl p-6 shadow-2xl">
          {logoUrl && (
            <div className="w-[50px] h-[50px] mb-4">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </div>
          )}
          <h1 className="font-syne text-[32px] font-extrabold tracking-tight mb-2 leading-none">{brandName}</h1>
          <h2 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.3em]">{headline}</h2>
        </div>

        <div className="relative group perspective-1000">
          <div className="bg-white/10 p-[2px] rounded-[32px] backdrop-blur-[40px] border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.4)]">
            <div className="bg-white p-3 rounded-[30px]">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[190px] h-[190px] object-contain mix-blend-multiply rounded-[20px]" />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center">
          <div className="w-full bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-3xl p-6 flex flex-col items-center shadow-2xl">
            <h3 className="text-[14px] font-bold text-white/80 uppercase tracking-widest mb-4">{subtext}</h3>
            
            {wifiPassword && (
              <div className="w-full bg-black/40 text-white px-5 py-3 rounded-xl border border-white/5 flex justify-between items-center font-bold text-[14px]">
                <div className="flex items-center gap-2 opacity-50">
                  <Wifi className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-widest">Connect</span>
                </div>
                <span>{wifiPassword}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
