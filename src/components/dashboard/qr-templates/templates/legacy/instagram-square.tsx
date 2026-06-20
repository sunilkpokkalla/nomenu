import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";

export function InstagramSquare({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[500px] h-[500px] bg-[#FAFAFA] flex items-center justify-center relative overflow-hidden p-8 box-border font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;600;700&display=swap');
      `}} />
      
      {/* iOS-style background blur elements */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#FF3366] rounded-full blur-[80px] opacity-20 mix-blend-multiply" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#00C6FF] rounded-full blur-[80px] opacity-20 mix-blend-multiply" />
      
      {/* Main Card */}
      <div className="w-full h-full bg-white/80 backdrop-blur-[40px] rounded-[32px] border border-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-8 flex flex-col justify-between box-border relative z-10">
        
        {/* Header Profile */}
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <div className="w-[48px] h-[48px] rounded-full p-[2px] bg-gradient-to-tr from-[#FF007A] via-[#7928CA] to-[#FF007A]">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-full h-full rounded-full border-2 border-white object-cover bg-white" />
            </div>
          ) : (
            <div className="w-[48px] h-[48px] rounded-full bg-slate-200" />
          )}
          <div className="flex flex-col">
            <h1 className="text-[18px] font-bold text-slate-900 leading-tight">{brandName}</h1>
            <h2 className="text-[13px] text-slate-500 font-medium">{headline}</h2>
          </div>
        </div>

        {/* Centered QR */}
        <div className="w-full flex justify-center py-4">
          <div className="bg-white p-4 rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-slate-100">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <div className="text-[14px] font-bold text-slate-900 tracking-tight">{subtext}</div>
            <div className="text-[12px] text-slate-500">Scan to view</div>
          </div>
          
          {wifiPassword && (
            <div className="bg-black text-white px-4 py-2 rounded-full text-[13px] font-semibold flex items-center gap-2 shadow-md">
              <Wifi className="w-4 h-4" /> 
              {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
