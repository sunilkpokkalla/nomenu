import React from "react";
import { QrTemplateProps } from "../../types";

export function VintageClassic({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#f4ebd0] text-[#4a3b32] flex flex-col relative overflow-hidden p-10 box-border border-[12px] border-[#8b7355]/30" style={{ boxSizing: "border-box" }}>
      {/* Import Google Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-lora { font-family: 'Lora', serif; }
      `}} />

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-60 mix-blend-multiply pointer-events-none" />

      <div className="flex-grow flex flex-col items-center justify-between z-10 border-[2px] border-[#8b7355]/40 p-6 relative">
        
        {/* Corner Ornaments */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-[2px] border-l-[2px] border-[#8b7355]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-[2px] border-r-[2px] border-[#8b7355]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-[2px] border-l-[2px] border-[#8b7355]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-[2px] border-r-[2px] border-[#8b7355]" />

        <div className="flex flex-col items-center text-center mt-4">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[60px] h-[60px] rounded-full object-cover border-[3px] border-[#8b7355] mb-4 filter sepia-[0.3]" />
          )}
          
          <h1 className="font-playfair text-[42px] font-bold leading-none tracking-wide text-[#4a3b32] uppercase mb-2 text-center drop-shadow-[1px_1px_0_rgba(255,255,255,0.5)]">
            {brandName}
          </h1>
          
          <div className="flex items-center gap-2 mb-2 opacity-70">
            <div className="w-10 h-[1px] bg-[#8b7355]" />
            <div className="w-2 h-2 rotate-45 bg-[#8b7355]" />
            <div className="w-10 h-[1px] bg-[#8b7355]" />
          </div>

          <h2 className="font-lora text-[14px] italic text-[#6b5847]">
            {headline}
          </h2>
        </div>

        <div className="relative p-2 my-6 bg-white border border-[#8b7355]/30 shadow-[0_4px_15px_rgba(139,115,85,0.2)] transform -rotate-1">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain filter sepia-[0.2] contrast-125 mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center text-center w-full mb-4">
          <h3 className="font-playfair text-[20px] font-bold tracking-widest text-[#4a3b32] uppercase mb-4">
            {subtext}
          </h3>

          {wifiPassword && (
            <div className="font-lora text-[13px] border-t border-b border-[#8b7355]/30 py-2 px-8 flex flex-col items-center">
              <span className="italic text-[#6b5847] mb-1">Guest Network</span>
              <span className="font-bold tracking-widest text-[#4a3b32]">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
