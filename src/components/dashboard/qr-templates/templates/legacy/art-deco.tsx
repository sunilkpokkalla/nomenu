import React from "react";
import { QrTemplateProps } from "../../types";

export function ArtDeco({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1A2522] border-[8px] border-[#D4AF37] p-[16px] box-border relative overflow-hidden">
      <div className="w-full h-full border-[2px] border-[#D4AF37] p-[2px] box-border">
        <div className="w-full h-full border-[1px] border-[#D4AF37] flex flex-col items-center justify-between p-[24px] box-border">
          
          <div className="flex flex-col items-center w-full relative">
            <div className="w-full flex items-center justify-center mb-6">
              <div className="w-[40px] h-[2px] bg-[#D4AF37]" />
              <div className="w-[10px] h-[10px] rotate-45 border border-[#D4AF37] mx-2" />
              <div className="w-[40px] h-[2px] bg-[#D4AF37]" />
            </div>
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-cover grayscale opacity-80 mb-3" />
            )}
            <h1 className="text-[32px] font-serif text-[#D4AF37] uppercase tracking-widest text-center leading-tight">{brandName}</h1>
            <h2 className="text-[11px] font-sans text-slate-300 uppercase tracking-[0.2em] mt-2">{headline}</h2>
          </div>

          <div className="relative p-2">
            <div className="absolute top-0 left-0 w-[20px] h-[20px] border-t-[2px] border-l-[2px] border-[#D4AF37]" />
            <div className="absolute top-0 right-0 w-[20px] h-[20px] border-t-[2px] border-r-[2px] border-[#D4AF37]" />
            <div className="absolute bottom-0 left-0 w-[20px] h-[20px] border-b-[2px] border-l-[2px] border-[#D4AF37]" />
            <div className="absolute bottom-0 right-0 w-[20px] h-[20px] border-b-[2px] border-r-[2px] border-[#D4AF37]" />
            <div className="bg-[#FAF9F6] p-2">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain" />
            </div>
          </div>

          <div className="flex flex-col items-center w-full">
            <h3 className="text-[20px] font-serif text-[#D4AF37] tracking-widest mb-6">{subtext.toUpperCase()}</h3>
            
            {wifiPassword && (
              <div className="flex flex-col items-center text-slate-400">
                <span className="text-[9px] uppercase tracking-[0.1em] font-sans">Complimentary Network</span>
                <span className="text-[12px] font-serif text-[#D4AF37] tracking-widest mt-1">{wifiPassword}</span>
              </div>
            )}
            <div className="w-full flex items-center justify-center mt-6">
              <div className="w-[30px] h-[1px] bg-[#D4AF37]" />
              <div className="w-[6px] h-[6px] rotate-45 bg-[#D4AF37] mx-2" />
              <div className="w-[30px] h-[1px] bg-[#D4AF37]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
