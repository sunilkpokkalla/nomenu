import React from "react";
import { QrTemplateProps } from "../../types";

export function Minimalist({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[400px] h-[560px] bg-white border-[2px] border-slate-900 p-[6px] box-border relative">
      <div className="w-full h-full border border-slate-900 p-[24px] flex flex-col items-center justify-between box-border">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[28px] font-serif italic text-slate-900 mb-1">{brandName}</h1>
          <div className="text-[12px] font-bold tracking-widest text-slate-400 mb-2">• • •</div>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] rounded-full object-cover grayscale" />
          )}
        </div>

        <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />

        <div className="flex flex-col items-center w-full text-center">
          <div className="w-[120px] h-[1px] bg-slate-900 mb-4" />
          <h2 className="text-[16px] font-bold font-serif text-slate-900 mb-1">{headline}</h2>
          <div className="text-[14px] font-bold text-slate-800 tracking-[0.1em] mb-2">{subtext.toUpperCase()}</div>
          <p className="text-[10px] italic font-serif text-slate-500 mb-4">Please scan code to browse</p>
          
          {wifiPassword && (
            <div className="text-[10px] font-serif text-slate-700">
              WiFi Available | Pass: {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
