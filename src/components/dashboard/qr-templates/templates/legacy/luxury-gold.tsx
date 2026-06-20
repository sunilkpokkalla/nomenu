import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";

export function LuxuryGold({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0A0A0A] p-[24px] box-border relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1)_0%,transparent_70%)]" />
      <div className="w-full h-full border-[2px] border-[#D4AF37] p-[4px] relative z-10 box-border">
        <div className="w-full h-full border border-[#D4AF37]/50 flex flex-col items-center justify-between p-[30px] box-border bg-[#0F0F0F]">
          
          <div className="flex flex-col items-center w-full">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-6" />
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[60px] h-[60px] rounded-full object-cover border border-[#D4AF37] mb-4" />
            )}
            <h1 className="text-[28px] font-serif text-[#D4AF37] text-center tracking-widest">{brandName.toUpperCase()}</h1>
            <h2 className="text-[12px] font-light text-slate-300 uppercase tracking-[0.3em] mt-3">{headline}</h2>
          </div>

          <div className="bg-white p-3 border-[2px] border-[#D4AF37]">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain" />
          </div>

          <div className="flex flex-col items-center w-full">
            <h3 className="text-[16px] font-serif text-white tracking-[0.2em] mb-4">{subtext.toUpperCase()}</h3>
            
            {wifiPassword && (
              <div className="flex flex-col items-center gap-1 opacity-80">
                <Wifi className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[10px] text-slate-400 font-light tracking-widest uppercase">Guest Network</span>
                <span className="text-[11px] text-white tracking-widest">{wifiPassword}</span>
              </div>
            )}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
