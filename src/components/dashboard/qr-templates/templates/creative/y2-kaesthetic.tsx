import React from "react";
import { QrTemplateProps } from "../../types";
import { CreativeFonts } from "./shared";

export function Y2KAesthetic({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#ffffff] text-[#ff00ff] flex flex-col relative overflow-hidden box-border p-8 font-syne border-8 border-[#c0c0c0]" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}>
      <CreativeFonts />
      
      {/* Windows 98 / Early Mac OS X style grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(#f0f0f0_1px,transparent_1px),linear-gradient(90deg,#f0f0f0_1px,transparent_1px)] opacity-80" style={{ backgroundSize: '20px 20px' }} />
      
      {/* Chrome orb decorations */}
      <div className="absolute -top-10 -right-10 w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffffff,#c0c0c0_40%,#808080)] shadow-xl" />
      <div className="absolute -bottom-20 -left-10 w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffffff,#c0c0c0_40%,#808080)] shadow-xl" />

      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between p-6 bg-white/40 backdrop-blur-md rounded-[32px] border-4 border-[#ff00ff] shadow-[8px_8px_0_0_#00ffff]">
        
        {/* Top Header Window */}
        <div className="w-full border-2 border-[#00ffff] bg-white rounded-2xl p-4 flex flex-col items-center relative shadow-[4px_4px_0_0_#ff00ff]">
          <div className="absolute top-2 right-2 flex gap-1">
            <div className="w-3 h-3 rounded-full bg-[#ff00ff]" />
            <div className="w-3 h-3 rounded-full bg-[#00ffff]" />
          </div>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain mb-2 filter drop-shadow-[2px_2px_0_#00ffff]" />
          )}
          <h1 className="text-[38px] font-black italic uppercase tracking-tighter text-center leading-[0.9] drop-shadow-[2px_2px_0_#00ffff]">{brandName}</h1>
          <h2 className="text-[12px] font-bold text-black uppercase tracking-[0.2em] mt-3 bg-[#00ffff] px-4 py-1 rounded-full">{headline}</h2>
        </div>

        <div className="bg-white p-3 rounded-3xl border-4 border-[#00ffff] shadow-[8px_8px_0_0_#ff00ff] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ff00ff]/20 to-[#00ffff]/20 mix-blend-overlay pointer-events-none" />
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain relative z-10 mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="bg-white border-2 border-[#ff00ff] shadow-[4px_4px_0_0_#00ffff] rounded-xl py-2 px-6 mb-4">
            <h3 className="text-[14px] font-bold text-center tracking-widest text-black uppercase">{subtext}</h3>
          </div>
          
          {wifiPassword && (
            <div className="w-full bg-[#ff00ff] text-white border-2 border-black rounded-xl p-3 flex justify-between items-center shadow-[4px_4px_0_0_black]">
              <span className="text-[12px] uppercase tracking-widest font-bold">WIFI:</span>
              <span className="text-[16px] font-black bg-black text-[#00ffff] px-3 py-1 rounded-md">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
