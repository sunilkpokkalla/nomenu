import React from "react";
import { QrTemplateProps } from "../../types";

export function VintageCloche({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#293531] text-[#D4AF37] flex flex-col relative overflow-hidden box-border p-6 shadow-inner">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Cinzel:wght@400;600&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-cinzel { font-family: 'Cinzel', serif; }
      `}} />

      {/* Corner Ornaments */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-[#D4AF37] rounded-tl-xl opacity-80" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-[#D4AF37] rounded-tr-xl opacity-80" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-[#D4AF37] rounded-bl-xl opacity-80" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-[#D4AF37] rounded-br-xl opacity-80" />
      
      {/* Decorative Corner Swirls (SVGs) */}
      <svg className="absolute top-3 left-3 w-8 h-8 text-[#D4AF37] opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 2 C 2 2, 2 12, 12 12 C 22 12, 22 22, 12 22" />
      </svg>
      <svg className="absolute top-3 right-3 w-8 h-8 text-[#D4AF37] opacity-60 transform scale-x-[-1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 2 C 2 2, 2 12, 12 12 C 22 12, 22 22, 12 22" />
      </svg>
      <svg className="absolute bottom-3 left-3 w-8 h-8 text-[#D4AF37] opacity-60 transform scale-y-[-1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 2 C 2 2, 2 12, 12 12 C 22 12, 22 22, 12 22" />
      </svg>
      <svg className="absolute bottom-3 right-3 w-8 h-8 text-[#D4AF37] opacity-60 transform scale-[-1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 2 C 2 2, 2 12, 12 12 C 22 12, 22 22, 12 22" />
      </svg>

      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between py-6">
        
        {/* Top Section with Cloche */}
        <div className="flex flex-col items-center w-full relative mt-4">
          <div className="relative w-[280px] h-[120px] flex flex-col items-center justify-center">
            {/* Cloche Dome SVG */}
            <svg className="absolute inset-0 w-full h-full text-[#D4AF37]" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 90 C 20 20, 180 20, 180 90" strokeLinecap="round" />
              <path d="M10 90 C 10 110, 40 110, 40 90" strokeLinecap="round" />
              <path d="M190 90 C 190 110, 160 110, 160 90" strokeLinecap="round" />
              <path d="M90 10 C 90 0, 110 0, 110 10 Z" strokeLinecap="round" />
              <path d="M100 20 V35 M85 25 L95 35 M115 25 L105 35" strokeWidth="1.5" />
            </svg>
            
            <div className="z-10 flex flex-col items-center mt-6 text-center">
              <h2 className="font-cinzel text-[11px] font-bold tracking-[0.3em] uppercase text-[#D4AF37] mb-1">{headline}</h2>
              <h1 className="font-playfair text-[44px] font-bold text-white tracking-wide uppercase leading-none drop-shadow-md">{brandName}</h1>
            </div>
          </div>
        </div>

        {/* Center QR Code Container */}
        <div className="bg-white p-3 shadow-[0_15px_30px_rgba(0,0,0,0.4)] mt-8 mb-4 relative flex items-center justify-center">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
          
          {/* Logo overlay on QR */}
          {logoUrl && (
            <div className="absolute w-[45px] h-[45px] bg-[#E88C5D] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[25px] h-[25px] object-contain filter brightness-0 invert" />
            </div>
          )}
        </div>

        {/* Bottom Text Area */}
        <div className="flex flex-col items-center text-center w-full mt-4">
          <h3 className="font-cinzel text-[16px] font-semibold tracking-widest text-[#D4AF37] uppercase">{subtext}</h3>
          
          {wifiPassword && (
            <div className="mt-6 flex items-center gap-2 font-cinzel text-[12px] text-[#D4AF37]/80 tracking-widest border border-[#D4AF37]/30 px-6 py-2 rounded-full">
              <span>WIFI: {wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
