import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";

export function TableOrder({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#222] text-white flex flex-col relative overflow-hidden box-border font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap');
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}} />
      
      {/* Solid Background overlay to give it some texture without an image */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3a2822] to-[#1a1210]" />
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
      
      <div className="w-full h-full relative z-10 flex flex-col p-8 justify-between items-center font-montserrat">
        
        {/* Top Header: Table Number & Menu */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <h1 className="text-[36px] font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{brandName}</h1>
          <div className="w-[2px] h-[40px] bg-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          <div className="flex flex-col items-start leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <span className="text-[16px] font-normal tracking-widest">{headline}</span>
            <span className="text-[28px] font-bold tracking-wider">MENU</span>
          </div>
        </div>

        {/* Center QR Code Container */}
        <div className="bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.3)] mt-8 mb-4 relative">
          {logoUrl && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center shadow-md p-1 z-20">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
          )}
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[240px] h-[240px] object-contain mix-blend-multiply relative z-10" />
        </div>

        {/* Bottom Text Area */}
        <div className="flex flex-col items-center text-center w-full mb-6">
          <h2 className="text-[36px] font-extrabold text-white leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] max-w-[350px]">
            {subtext}
          </h2>
          <p className="text-[14px] font-normal text-white mt-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-[300px] leading-relaxed">
            Scan the QR code with your mobile device for contactless order.
          </p>
          
          {wifiPassword && (
            <div className="mt-6 bg-black/60 backdrop-blur-sm border border-white/20 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <Wifi className="w-4 h-4" />
              <span className="text-[13px] font-semibold tracking-wider">WIFI: {wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
