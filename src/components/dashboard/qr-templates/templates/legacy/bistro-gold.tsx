import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";

export function BistroGold({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0c0c0c] text-white flex flex-col relative overflow-hidden p-10 box-border border-2 border-[#c5af7d]/35" style={{ boxSizing: "border-box" }}>
      {/* Import Google Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@200;300;400;500;600&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}} />

      {/* Subtle background glow */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#c5af7d]/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex-grow flex flex-col items-center justify-between z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mt-4">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] rounded-full object-cover border border-[#c5af7d] mb-4 shadow-lg shadow-black/45" />
          )}
          
          <span className="font-montserrat text-[12px] font-light tracking-[0.35em] text-slate-400 uppercase mb-2">
            Welcome To
          </span>
          
          <h1 className="font-cinzel text-[36px] font-normal leading-tight text-[#c5af7d] tracking-[0.18em] uppercase max-w-[360px] break-words">
            {brandName}
          </h1>
          
          <span className="font-montserrat text-[16px] font-medium tracking-[0.25em] text-slate-100 uppercase mt-3">
            {subtext}
          </span>
        </div>

        {/* QR Code Section with Gold Corner Framing */}
        <div className="relative p-5 my-6 flex items-center justify-center">
          {/* Custom Gold Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-[2.5px] border-l-[2.5px] border-[#c5af7d]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-[2.5px] border-r-[2.5px] border-[#c5af7d]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[2.5px] border-l-[2.5px] border-[#c5af7d]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[2.5px] border-r-[2.5px] border-[#c5af7d]" />
          
          <div className="bg-white p-3 rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-[#c5af7d]/10">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain" />
          </div>
        </div>

        {/* Bottom CTA / Wifi Details */}
        <div className="flex flex-col items-center text-center w-full mb-4">
          <span className="font-montserrat text-[11px] font-medium tracking-[0.22em] text-[#c5af7d] uppercase mb-4">
            {headline || "Scan For Digital Menu"}
          </span>

          {wifiPassword && (
            <div className="border border-[#c5af7d]/20 bg-white/[0.02] rounded-full py-1.5 px-6 shadow-inner flex items-center gap-2 max-w-[300px]">
              <span className="font-montserrat text-[9px] font-normal tracking-[0.15em] text-slate-400 uppercase">WiFi:</span>
              <span className="font-montserrat text-[10px] font-semibold tracking-wider text-slate-200">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
