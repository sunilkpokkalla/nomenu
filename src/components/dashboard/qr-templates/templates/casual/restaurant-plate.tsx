import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { Spoon, Fork } from "./shared";

export function RestaurantPlate({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#161616] text-white flex flex-col items-center relative overflow-hidden box-border p-6">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;800;900&display=swap');
        .font-anton { font-family: 'Anton', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}} />
      
      {/* Chalkboard / Sketch Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\"100\\" height=\\"100\\" viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cpath d=\\"M10 10 C 20 20, 40 20, 50 10 C 60 0, 80 0, 90 10 C 100 20, 100 40, 90 50 C 80 60, 60 60, 50 50 C 40 40, 20 40, 10 50 C 0 60, 0 80, 10 90 C 20 100, 40 100, 50 90 C 60 80, 80 80, 90 90\\" stroke=\\"white\\" stroke-width=\\"2\\" fill=\\"none\\"/%3E%3C/svg%3E")', backgroundSize: '150px' }} />

      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between">
        
        {/* Top Header: Brand Name & Headline */}
        <div className="flex flex-col items-center text-center mt-2 w-full font-inter">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[30px] h-[30px] object-contain mb-2 filter brightness-0 invert" />
          )}
          <h1 className="text-[40px] font-black tracking-tight leading-none uppercase">{brandName}</h1>
          <div className="flex items-center gap-2 mt-1 w-[80%] max-w-[200px]">
            <div className="h-[2px] flex-grow bg-[#D4B895]" />
            <Fork className="w-2 h-4 text-[#D4B895]" />
            <div className="h-[2px] flex-grow bg-[#D4B895]" />
          </div>
          <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase mt-2 text-white/70">{headline}</h2>
        </div>

        {/* Scan For MENU */}
        <div className="flex flex-col items-center w-full font-inter mt-6">
          <div className="text-[14px] font-semibold tracking-wider text-white mb-[-8px]">SCAN FOR</div>
          <div className="font-anton text-[90px] leading-none text-[#D4B895] tracking-wide">MENU</div>
        </div>

        {/* Plate + Cutlery + QR Code */}
        <div className="flex items-center justify-center w-full relative mt-[-20px] mb-4">
          <Spoon className="w-[45px] h-[160px] text-white absolute left-2" />
          
          <div className="w-[260px] h-[260px] bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_-8px_16px_rgba(0,0,0,0.1)] border-[8px] border-[#EEEEEE] z-10 relative">
            <div className="absolute inset-0 rounded-full border border-black/10 m-2 pointer-events-none" />
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>

          <Fork className="w-[45px] h-[160px] text-white absolute right-2" />
        </div>

        {/* Bottom Text */}
        <div className="flex flex-col items-center w-full font-inter mb-4">
          <h3 className="text-[26px] font-black tracking-widest uppercase text-white drop-shadow-md">{subtext}</h3>
          
          {wifiPassword && (
            <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-white/50 tracking-wider">
              <Wifi className="w-4 h-4" />
              <span>WIFI PASS: <span className="text-[#D4B895]">{wifiPassword}</span></span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
