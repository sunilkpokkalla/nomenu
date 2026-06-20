import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { CasualFonts } from "./shared";

export function Pizzeria({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FDFBF7] text-[#D32F2F] flex flex-col relative overflow-hidden box-border border-[10px] border-[#D32F2F]">
      <CasualFonts />
      <div className="w-full h-full border-[2px] border-dashed border-[#D32F2F]/30 flex flex-col p-8 justify-between relative bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
        
        <div className="absolute top-0 right-10 w-[40px] h-[60px] bg-[#4CAF50] rounded-b-full shadow-sm" />

        <div className="flex flex-col items-start w-full z-10 mt-6">
          <h2 className="font-quicksand text-[14px] font-bold uppercase tracking-[0.2em] text-[#4CAF50] mb-1">{headline}</h2>
          <h1 className="font-nunito text-[46px] font-black uppercase text-[#D32F2F] leading-[0.8] tracking-tighter max-w-[300px]">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] object-contain mt-6" />
          )}
        </div>

        <div className="self-center bg-white p-4 shadow-xl border-2 border-[#D32F2F]/10 transform rotate-3 z-10">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col w-full z-10 text-center items-center font-quicksand">
          <h3 className="text-[18px] font-bold text-[#D32F2F] mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="bg-[#D32F2F] text-white px-8 py-3 rounded-full flex items-center gap-3 shadow-md font-nunito">
              <Wifi className="w-5 h-5 text-[#FDFBF7]" />
              <span className="text-[16px] font-bold">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
