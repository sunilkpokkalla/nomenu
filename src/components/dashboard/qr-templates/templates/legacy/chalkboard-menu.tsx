import React from "react";
import { QrTemplateProps } from "../../types";

export function ChalkboardMenu({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1a1a1a] text-white flex flex-col relative overflow-hidden box-border p-5">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400&display=swap');
        .font-caveat { font-family: 'Caveat', cursive; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}} />
      
      {/* Chalkboard Texture Background */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />

      {/* Double Border Frame */}
      <div className="absolute inset-0 m-4 border-2 border-white/80 rounded-sm pointer-events-none" />
      <div className="absolute inset-0 m-6 border border-white/40 rounded-sm pointer-events-none" />

      {/* Decorative Corner Ornaments */}
      <svg className="absolute top-2 left-2 w-12 h-12 text-white/90" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 25 C 10 10, 25 10, 25 10 M10 25 C 10 40, 25 40, 25 40" />
        <circle cx="20" cy="25" r="3" />
        <path d="M30 15 C 20 20, 20 30, 30 35" />
      </svg>
      <svg className="absolute top-2 right-2 w-12 h-12 text-white/90 transform scale-x-[-1]" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 25 C 10 10, 25 10, 25 10 M10 25 C 10 40, 25 40, 25 40" />
        <circle cx="20" cy="25" r="3" />
        <path d="M30 15 C 20 20, 20 30, 30 35" />
      </svg>
      <svg className="absolute bottom-2 left-2 w-12 h-12 text-white/90 transform scale-y-[-1]" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 25 C 10 10, 25 10, 25 10 M10 25 C 10 40, 25 40, 25 40" />
        <circle cx="20" cy="25" r="3" />
        <path d="M30 15 C 20 20, 20 30, 30 35" />
      </svg>
      <svg className="absolute bottom-2 right-2 w-12 h-12 text-white/90 transform scale-[-1]" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 25 C 10 10, 25 10, 25 10 M10 25 C 10 40, 25 40, 25 40" />
        <circle cx="20" cy="25" r="3" />
        <path d="M30 15 C 20 20, 20 30, 30 35" />
      </svg>

      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between py-10 px-8">
        
        {/* Top Hand-drawn Title */}
        <div className="flex flex-col items-center text-center">
          <h2 className="font-montserrat text-[12px] font-light tracking-[0.4em] uppercase text-white/70 mb-2">{headline}</h2>
          <h1 className="font-caveat text-[70px] font-bold text-white tracking-wide leading-none -rotate-2 drop-shadow-sm">{brandName}</h1>
        </div>

        {/* Center QR Code Container */}
        <div className="bg-white p-3 shadow-lg border border-white/20 mt-6 relative flex items-center justify-center transform rotate-1">
          <div className="absolute inset-0 border border-black/10 pointer-events-none m-1" />
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          
          {/* Circular Logo overlay */}
          {logoUrl && (
            <div className="absolute w-[40px] h-[40px] bg-[#E88C5D] rounded-full flex items-center justify-center shadow-md border-2 border-white">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[20px] h-[20px] object-contain filter brightness-0 invert" />
            </div>
          )}
        </div>

        {/* Cutlery Graphics */}
        <div className="flex justify-center gap-6 mt-8 opacity-90">
          {/* Fork */}
          <svg width="16" height="80" viewBox="0 0 16 80" fill="none" stroke="white" strokeWidth="1.5" className="opacity-80">
            <path d="M3 5 V25 A 5 5 0 0 0 13 25 V5 M8 5 V20 M8 30 V75" />
          </svg>
          {/* Spoon */}
          <svg width="20" height="80" viewBox="0 0 20 80" fill="none" stroke="white" strokeWidth="1.5" className="opacity-80">
            <ellipse cx="10" cy="15" rx="6" ry="10" />
            <path d="M10 25 V75" />
          </svg>
          {/* Knife */}
          <svg width="12" height="80" viewBox="0 0 12 80" fill="none" stroke="white" strokeWidth="1.5" className="opacity-80">
            <path d="M6 5 C 10 5, 10 30, 6 35 V75 H4 V35 C 0 30, 0 5, 6 5 Z" />
          </svg>
        </div>

        {/* Bottom Text Area */}
        <div className="flex flex-col items-center w-full mt-6 text-center">
          <h3 className="font-montserrat text-[14px] font-light tracking-[0.2em] text-white/90 uppercase text-center mb-6">{subtext}</h3>
          
          {/* Flourish */}
          <svg width="150" height="20" viewBox="0 0 150 20" fill="none" stroke="white" strokeWidth="1.5" className="opacity-60 mb-2">
            <path d="M10 10 Q 30 0, 50 10 T 90 10 T 140 10" strokeLinecap="round" />
            <path d="M60 10 Q 70 20, 80 10" strokeLinecap="round" />
          </svg>
          
          {wifiPassword && (
            <div className="font-montserrat text-[11px] font-light tracking-[0.1em] text-white/60 uppercase">
              WIFI: {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
