import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { CasualFonts } from "./shared";

export function CozyTeahouse({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#F5F1E7] text-[#5D5746] flex flex-col relative overflow-hidden box-border font-quicksand">
      <CasualFonts />
      
      {/* Soft watercolor blob */}
      <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-[#E3DAC3] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-50 mix-blend-multiply blur-sm" />
      <div className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] bg-[#C1D0C4] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] opacity-50 mix-blend-multiply blur-sm" />
      
      <div className="w-full h-full relative z-10 flex flex-col p-10 justify-between items-center">
        
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter grayscale opacity-70 mb-4" />
          )}
          <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8C8570] mb-2">{headline}</h2>
          <h1 className="font-nunito text-[32px] font-bold tracking-tight text-[#3E3A2E]">{brandName}</h1>
        </div>

        <div className="bg-white/80 p-5 rounded-full backdrop-blur-md shadow-[0_10px_30px_rgba(93,87,70,0.1)] border border-white">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[170px] h-[170px] object-contain mix-blend-multiply rounded-full" />
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="text-[14px] font-medium text-[#5D5746] mb-8 text-center">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex items-center gap-2 text-[12px] font-bold text-[#8C8570]">
              <Wifi className="w-3 h-3" />
              <span>NETWORK: <span className="text-[#3E3A2E]">{wifiPassword}</span></span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
