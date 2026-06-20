import React from "react";
import { QrTemplateProps } from "../../types";
import { CasualFonts } from "./shared";

export function TheBakery({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FAF8F5] text-[#2C3E50] flex flex-col relative overflow-hidden box-border p-8 border-[12px] border-[#E8DCC4]">
      <CasualFonts />
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Great+Vibes&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-vibes { font-family: 'Great Vibes', cursive; }
      `}} />
      
      {/* Subtle organic noise/texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] mix-blend-multiply pointer-events-none" />

      <div className="w-full h-full border border-[#2C3E50]/20 flex flex-col items-center justify-between py-10 px-6 relative z-10 bg-white/40">
        
        {/* Ornate Header */}
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] object-contain mb-6 filter sepia-[0.3]" />
          )}
          <h2 className="font-cormorant text-[12px] uppercase tracking-[0.4em] text-[#8C7A6B] mb-2">Maison de Qualité</h2>
          <h1 className="font-vibes text-[54px] leading-[0.8] text-[#2C3E50] mb-6">{brandName}</h1>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-[1px] bg-[#8C7A6B]/50" />
            <span className="font-cormorant text-[14px] italic text-[#8C7A6B]">{headline}</span>
            <div className="w-8 h-[1px] bg-[#8C7A6B]/50" />
          </div>
        </div>

        {/* Embossed QR Container */}
        <div className="relative p-2 bg-white shadow-[0_8px_24px_rgba(44,62,80,0.08)] border border-[#E8DCC4] my-4 rounded-sm transform rotate-1">
          <div className="absolute inset-0 border border-[#2C3E50]/10 m-1" />
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[190px] h-[190px] object-contain relative z-10 mix-blend-multiply opacity-90 sepia-[0.1]" />
        </div>

        {/* Elegant Footer */}
        <div className="flex flex-col items-center w-full text-center">
          <h3 className="font-cormorant text-[18px] font-semibold tracking-widest uppercase text-[#2C3E50] mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex flex-col items-center font-cormorant border-t border-b border-[#2C3E50]/20 py-3 px-8">
              <span className="text-[12px] italic text-[#8C7A6B] mb-1">Réseau Invité</span>
              <span className="text-[16px] font-semibold tracking-widest">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
