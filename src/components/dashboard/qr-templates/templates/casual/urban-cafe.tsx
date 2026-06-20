import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { CasualFonts } from "./shared";

export function UrbanCafe({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#E8EAE6] text-[#2D312A] flex flex-col relative overflow-hidden box-border font-nunito">
      <CasualFonts />
      <div className="absolute top-0 right-0 w-[60%] h-[100%] bg-white clip-path-polygon" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 30% 0)' }} />
      
      <div className="w-full h-full relative z-10 flex flex-col p-10 justify-between">
        
        <div className="flex flex-col items-start w-full">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain mb-4 filter drop-shadow-sm" />
          )}
          <h1 className="text-[38px] font-black leading-none tracking-tight text-[#2D312A] mb-2">{brandName}</h1>
          <h2 className="font-quicksand text-[14px] font-semibold text-[#737C6A] uppercase tracking-widest">{headline}</h2>
        </div>

        <div className="self-end bg-white p-3 rounded-3xl shadow-[0_20px_40px_-10px_rgba(45,49,42,0.15)] mr-4 border border-[#E8EAE6]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain rounded-xl mix-blend-multiply" />
        </div>

        <div className="flex flex-col w-full">
          <h3 className="font-quicksand text-[18px] font-bold text-[#2D312A] mb-6 max-w-[200px] leading-snug">{subtext}</h3>
          
          {wifiPassword && (
            <div className="bg-[#2D312A] text-white rounded-2xl p-4 flex justify-between items-center w-[90%] shadow-lg">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A2AFA2]">Network</span>
                <span className="text-[16px] font-black">{wifiPassword}</span>
              </div>
              <Wifi className="w-6 h-6 text-[#A2AFA2]" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
