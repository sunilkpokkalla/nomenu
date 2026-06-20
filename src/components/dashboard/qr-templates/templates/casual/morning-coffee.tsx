import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { CasualFonts } from "./shared";

export function MorningCoffee({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FAF8F5] text-[#4A3B32] flex flex-col relative overflow-hidden box-border p-8 font-nunito border-[8px] border-[#8C6D58]/10 rounded-[30px]">
      <CasualFonts />
      <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-[#E8DCC4] rounded-full opacity-30" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#D4E0D9] rounded-full opacity-30" />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between bg-white/40 backdrop-blur-sm rounded-[20px] p-8 border border-white/60 shadow-xl">
        
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[60px] h-[60px] object-cover rounded-full border-2 border-[#8C6D58]/20 mb-4" />
          )}
          <h1 className="text-[36px] font-extrabold tracking-tight text-[#4A3B32] leading-tight mb-2">{brandName}</h1>
          <h2 className="font-quicksand text-[15px] font-semibold text-[#8C6D58] uppercase tracking-wider">{headline}</h2>
        </div>

        <div className="bg-white p-4 rounded-[24px] shadow-[0_10px_30px_rgba(140,109,88,0.15)] transform rotate-1">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain rounded-xl mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-pacifico text-[24px] text-[#8C6D58] mb-6 transform -rotate-2">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full bg-[#FAF8F5] rounded-[16px] p-4 flex flex-col items-center justify-center border border-[#8C6D58]/10">
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#8C6D58]/60 mb-1 flex items-center gap-1">
                <Wifi className="w-3 h-3" /> Connect to WiFi
              </span>
              <span className="text-[16px] font-bold text-[#4A3B32]">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
