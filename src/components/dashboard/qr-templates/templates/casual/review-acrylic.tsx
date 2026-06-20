import React from "react";
import { QrTemplateProps } from "../../types";

export function ReviewAcrylic({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#959d90] flex flex-col relative overflow-hidden box-border p-8 rounded-[32px] shadow-inner border border-white/20">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Montserrat:wght@300;400;800;900&display=swap');
        .font-caveat { font-family: 'Caveat', cursive; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}} />

      {/* Frosted Glass / Acrylic Noise Texture */}
      <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm pointer-events-none" />

      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between py-4">
        
        {/* Top Text Section */}
        <div className="flex flex-col items-center w-full mt-2 relative">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain mb-4 filter drop-shadow-sm" />
          )}
          
          <h1 className="font-montserrat text-[64px] font-black text-[#1a1a1a] uppercase tracking-tighter leading-none relative z-0">
            {brandName}
          </h1>
          
          <h2 className="font-caveat text-[65px] text-[#f2f4f1] leading-none transform -rotate-2 -mt-10 relative z-10 drop-shadow-sm">
            {headline}
          </h2>
        </div>

        {/* Center QR Code Container */}
        <div className="bg-[#f2f4f1] p-4 shadow-lg mt-4 mb-8">
          <div className="border border-black/5 p-1 bg-white">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[220px] h-[220px] object-contain mix-blend-multiply" />
          </div>
        </div>

        {/* Bottom Text Area & Stars */}
        <div className="flex flex-col items-center w-full text-center">
          <p className="font-montserrat text-[20px] font-light text-[#e8ebe7] leading-snug tracking-wide max-w-[320px] mb-8">
            {subtext}
          </p>
          
          {/* 5 Stars */}
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-8 h-8 text-[#d4bd7f] drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          {wifiPassword && (
            <div className="mt-8 font-montserrat text-[12px] font-medium tracking-[0.2em] text-[#1a1a1a]/60 uppercase bg-white/20 px-6 py-2 rounded-full backdrop-blur-md">
              WIFI: {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
