import React from "react";
import { QrTemplateProps } from "../../types";
import { CreativeFonts } from "./shared";

export function BrutalistPop({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  // Use a bright, aggressive background if colorStart isn't provided or is too dark
  const bg = colorStart && colorStart !== '#000000' && colorStart !== '#ffffff' ? colorStart : '#FFE600';
  
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#f4f4f0] text-black flex flex-col relative overflow-hidden box-border font-cabinet border-[8px] border-black p-6">
      <CreativeFonts />
      
      {/* Background Pop Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      <div className="w-full h-full flex flex-col justify-between relative z-10">
        
        {/* Header Ticket */}
        <div className="w-full bg-white border-[4px] border-black shadow-[6px_6px_0_0_#000] p-4 flex items-center justify-between mb-6 transform -rotate-1">
          <div className="flex items-center gap-3">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain border-[2px] border-black bg-white" />
            )}
            <h2 className="text-[14px] font-black uppercase tracking-[0.2em]">{headline}</h2>
          </div>
          <div className="bg-black text-white px-3 py-1 font-bold text-[12px] uppercase">
            SCAN
          </div>
        </div>

        {/* Brand Name Banner */}
        <div className="w-[110%] -ml-[5%] bg-black text-white p-4 py-6 transform rotate-2 shadow-[0_10px_0_0_#00000040] mb-8 relative z-20" style={{ backgroundColor: bg }}>
          <h1 className="text-[48px] font-black uppercase leading-[0.8] tracking-tighter text-center" style={{ color: '#000', textShadow: '2px 2px 0 #fff' }}>
            {brandName}
          </h1>
        </div>

        {/* QR Code Block */}
        <div className="self-center bg-white border-[6px] border-black p-2 shadow-[12px_12px_0_0_#000] transform -rotate-2 relative z-10 mb-8 transition-transform hover:rotate-0 hover:translate-y-1 hover:shadow-[6px_6px_0_0_#000]">
          <div className="absolute -top-4 -right-4 bg-[#FF3366] text-white border-2 border-black font-black px-3 py-1 text-[12px] rotate-12 shadow-[4px_4px_0_0_#000]">
            HERE
          </div>
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[190px] h-[190px] object-contain mix-blend-multiply" />
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <div className="bg-white border-[4px] border-black shadow-[6px_6px_0_0_#000] p-3 text-center">
            <h3 className="text-[16px] font-black uppercase tracking-widest">{subtext}</h3>
          </div>
          
          {wifiPassword && (
            <div className="bg-[#00E5FF] border-[4px] border-black shadow-[6px_6px_0_0_#000] p-3 flex justify-between items-center text-[14px]">
              <span className="font-black uppercase tracking-widest">WIFI PWD</span>
              <span className="bg-white border-[2px] border-black px-3 py-1 font-black text-[16px]">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
