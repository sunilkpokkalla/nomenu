import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";

export function ClassicPortrait({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FFFFFF] flex flex-col relative overflow-hidden box-border p-8 border-[1px] border-[#E5E5E5]">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
      `}} />
      
      {/* Strict Swiss Grid Lines */}
      <div className="absolute top-8 bottom-8 left-8 w-[1px] bg-[#E5E5E5] pointer-events-none" />
      <div className="absolute top-8 bottom-8 right-8 w-[1px] bg-[#E5E5E5] pointer-events-none" />
      <div className="absolute top-8 left-8 right-8 h-[1px] bg-[#E5E5E5] pointer-events-none" />
      <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-[#E5E5E5] pointer-events-none" />

      <div className="w-full h-full p-6 flex flex-col items-start justify-between box-border bg-white font-inter">
        
        {/* Extreme typographic contrast header */}
        <div className="flex flex-col items-start w-full">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[32px] h-[32px] object-contain mb-8 filter grayscale" />
          )}
          <h2 className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.3em] mb-2">{headline}</h2>
          <h1 className="text-[48px] font-extrabold text-black leading-[0.9] tracking-tighter w-full hyphens-auto break-words">{brandName}</h1>
        </div>

        {/* Minimalist QR placement */}
        <div className="w-full flex justify-end my-8 border-t border-b border-[#E5E5E5] py-4">
          <div className="bg-white p-1">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>
        </div>

        {/* Structured Footer */}
        <div className="flex flex-col items-start w-full">
          <div className="text-[12px] font-medium text-black tracking-widest uppercase mb-6 bg-[#F5F5F5] px-3 py-1">
            {subtext}
          </div>
          
          {wifiPassword && (
            <div className="w-full border-t border-[#E5E5E5] pt-4 mt-auto">
              <div className="flex justify-between items-center w-full">
                <span className="text-[10px] font-semibold text-[#888] uppercase tracking-widest flex items-center gap-2">
                  <Wifi className="w-3 h-3" /> NETWORK
                </span>
                <span className="text-[14px] font-bold text-black tracking-widest">{wifiPassword}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
