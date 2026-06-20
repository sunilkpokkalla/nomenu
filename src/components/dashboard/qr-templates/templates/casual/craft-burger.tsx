import React from "react";
import { QrTemplateProps } from "../../types";
import { CasualFonts } from "./shared";

export function CraftBurger({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1a1a1a] text-[#F4E6CC] flex flex-col relative overflow-hidden box-border p-6 font-quicksand">
      <CasualFonts />
      <div className="w-full h-full border-4 border-[#F4E6CC] rounded-xl flex flex-col p-8 justify-between bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-black/40 bg-blend-multiply">
        
        <div className="flex flex-col items-center text-center">
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#E85D04] mb-2">{headline}</h2>
          <h1 className="font-nunito text-[46px] font-black uppercase leading-[0.9] text-[#F4E6CC] tracking-tight">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter brightness-0 invert opacity-80 mt-6" />
          )}
        </div>

        <div className="bg-[#F4E6CC] p-4 transform -rotate-2 shadow-[4px_4px_0_0_#E85D04]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full text-center">
          <div className="w-[50px] h-[4px] bg-[#E85D04] mb-4" />
          <h3 className="text-[16px] font-bold uppercase tracking-widest mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full border-t-2 border-dashed border-[#F4E6CC]/30 pt-4 flex justify-between items-center text-[14px]">
              <span className="font-bold uppercase tracking-widest text-[#E85D04]">WIFI ACCESS</span>
              <span className="font-black text-[16px]">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
