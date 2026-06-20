import React from "react";
import { QrTemplateProps } from "../../types";
import { FineDiningFonts } from "./shared";

export function VelvetNoir({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#161616] text-[#E0E0E0] flex flex-col relative overflow-hidden box-border p-4">
      <FineDiningFonts />
      <div className="w-full h-full border-[2px] border-[#595959] p-[2px]">
        <div className="w-full h-full border border-[#595959] flex flex-col items-center justify-between py-12 px-8">
          
          <div className="flex flex-col items-center text-center w-full">
            <h2 className="font-cormorant text-[13px] uppercase tracking-[0.3em] text-[#999999] mb-6">{headline}</h2>
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] rounded-full object-cover grayscale mb-4" />
            )}
            <h1 className="font-playfair text-[34px] tracking-wider uppercase">{brandName}</h1>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] border border-[#595959] rotate-45" />
            <div className="bg-white p-4 relative z-10">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain" />
            </div>
          </div>

          <div className="flex flex-col items-center w-full">
            <h3 className="font-playfair text-[15px] italic text-[#B0B0B0] mb-6">{subtext}</h3>
            {wifiPassword && (
              <div className="w-full flex justify-between items-center border-t border-[#595959] pt-4 font-cormorant text-[13px]">
                <span className="tracking-[0.1em] uppercase text-[#999999]">WIFI ACCESS</span>
                <span className="font-bold">{wifiPassword}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
