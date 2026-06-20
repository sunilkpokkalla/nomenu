import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";

export function ModernGlass({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#f5f5f7] p-[20px] box-border relative overflow-hidden flex items-center justify-center rounded-[32px] font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600;700&display=swap');
      `}} />

      {/* Dynamic blurred abstract background */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] rounded-full blur-[100px] opacity-70 mix-blend-multiply" style={{ backgroundColor: colorStart || '#007AFF' }} />
      <div className="absolute -bottom-[10%] -right-[10%] w-[80%] h-[80%] rounded-full blur-[100px] opacity-70 mix-blend-multiply" style={{ backgroundColor: colorEnd || '#FF2D55' }} />
      <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] rounded-full blur-[80px] bg-[#FFF200] opacity-50 mix-blend-multiply" />
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay pointer-events-none" />

      {/* Glass card - true specular highlights */}
      <div className="w-full h-full bg-white/30 backdrop-blur-[60px] rounded-[24px] border border-white/60 shadow-[0_30px_60px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] p-[32px] flex flex-col items-center justify-between box-border z-10 relative">
        
        <div className="flex flex-col items-center w-full text-center">
          {logoUrl && (
            <div className="w-[56px] h-[56px] rounded-[16px] bg-white/50 border border-white/80 shadow-[0_8px_16px_rgba(0,0,0,0.05)] flex items-center justify-center mb-6 p-1.5 backdrop-blur-md">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-full h-full rounded-[10px] object-cover" />
            </div>
          )}
          <h1 className="text-[32px] font-bold text-black tracking-tight leading-none mb-2">{brandName}</h1>
          <h2 className="text-[13px] font-semibold text-black/50 uppercase tracking-widest">{headline}</h2>
        </div>

        <div className="bg-white/70 p-5 rounded-[32px] border border-white shadow-[0_20px_40px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] backdrop-blur-md transition-transform hover:scale-[1.02]">
          <div className="bg-white p-2 rounded-[24px] shadow-sm">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply rounded-[16px]" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full gap-4">
          <div className="text-[15px] font-semibold text-black/80 tracking-wide text-center">{subtext}</div>
          
          {wifiPassword && (
            <div className="w-full bg-black/5 border border-white/40 rounded-[16px] p-4 flex justify-between items-center backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              <span className="text-[12px] font-semibold text-black/50 uppercase flex items-center gap-2">
                <Wifi className="w-4 h-4" /> Wi-Fi
              </span>
              <span className="text-[15px] font-bold text-black">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
