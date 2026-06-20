import React from "react";
import { QrTemplateProps } from "../../types";

export function RetroVintage({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#d3e3d6] text-[#2c4c3b] flex flex-col relative overflow-hidden p-8 box-border" style={{ boxSizing: "border-box" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=DM+Sans:ital,wght@0,400;0,700;1,400&display=swap');
        .font-abril { font-family: 'Abril Fatface', serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
      `}} />

      <div className="absolute inset-0 border-[20px] border-[#2c4c3b] pointer-events-none" />
      <div className="absolute inset-[24px] border-[2px] border-[#2c4c3b] pointer-events-none" />

      <div className="flex-grow flex flex-col items-center justify-between z-10 pt-10 pb-6 px-6 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] mix-blend-multiply">
        
        <div className="flex flex-col items-center text-center">
          <h2 className="font-dm text-[12px] font-bold tracking-[0.3em] uppercase text-[#2c4c3b] mb-4 border-b-2 border-[#2c4c3b] pb-1">
            EST. 2024
          </h2>
          
          <h1 className="font-abril text-[52px] leading-[0.9] text-[#2c4c3b] uppercase mb-4 text-center">
            {brandName}
          </h1>
          
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] object-contain filter sepia hue-rotate-180 saturate-200 brightness-50" />
          )}
        </div>

        <div className="relative p-3 my-4 bg-[#f9f9f9] border-[3px] border-[#2c4c3b] rounded-md shadow-[4px_4px_0px_#2c4c3b]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[190px] h-[190px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center text-center w-full">
          <div className="font-dm text-[16px] font-bold text-[#2c4c3b] uppercase bg-white border-2 border-[#2c4c3b] px-6 py-2 shadow-[2px_2px_0px_#2c4c3b] mb-4 rotate-2">
            {headline}
          </div>

          <h3 className="font-dm text-[14px] font-bold tracking-widest text-[#2c4c3b] uppercase mb-4">
            — {subtext} —
          </h3>

          {wifiPassword && (
            <div className="font-dm text-[12px] font-bold flex gap-2 items-center bg-[#2c4c3b] text-white px-4 py-2 rounded-full">
              <span className="uppercase tracking-widest opacity-80">WIFI:</span>
              <span className="tracking-wider">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
