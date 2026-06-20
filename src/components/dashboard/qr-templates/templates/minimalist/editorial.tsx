import React from "react";
import { QrTemplateProps } from "../../types";
import { MinimalistFonts } from "./shared";

export function Editorial({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#F7F5F0] text-[#1A1A1A] flex flex-col relative overflow-hidden box-border p-12">
      <MinimalistFonts />
      
      <div className="flex flex-col w-full h-full justify-between">
        
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain grayscale opacity-80" />
            )}
            <div className="h-[1px] flex-grow bg-[#1A1A1A]" />
          </div>
          <h2 className="font-space text-[12px] uppercase tracking-[0.2em] mb-2">{subtext}</h2>
          <h1 className="font-outfit text-[46px] font-light leading-none tracking-tight">{brandName}</h1>
        </div>

        <div className="self-center my-8 bg-white p-6 shadow-xl w-fit">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col w-full border-l-[2px] border-[#1A1A1A] pl-6">
          <h3 className="font-inter text-[16px] font-semibold mb-2">{headline}</h3>
          <p className="font-inter text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed mb-4 max-w-[200px]">
            Scan the code above to view our digital experience.
          </p>
          
          {wifiPassword && (
            <div className="font-space text-[13px] font-bold mt-auto">
              WIFI / {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
