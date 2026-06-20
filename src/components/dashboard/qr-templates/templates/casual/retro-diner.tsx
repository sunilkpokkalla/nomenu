import React from "react";
import { QrTemplateProps } from "../../types";
import { CasualFonts } from "./shared";

export function RetroDiner({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#E0F7FA] text-[#006064] flex flex-col relative overflow-hidden box-border p-6 border-[8px] border-[#FF1744]">
      <CasualFonts />
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Shrikhand&family=Oswald:wght@400;700&display=swap');
        .font-shrikhand { font-family: 'Shrikhand', cursive; }
        .font-oswald { font-family: 'Oswald', sans-serif; }
      `}} />

      {/* Checkerboard border */}
      <div className="absolute inset-0 border-[16px] border-transparent" style={{ borderImage: 'repeating-linear-gradient(45deg, #000 0, #000 10px, #fff 10px, #fff 20px) 16' }} />
      
      <div className="w-full h-full bg-[#E0F7FA] border-4 border-[#00BCD4] p-8 flex flex-col justify-between items-center relative z-10 shadow-inner">
        
        {/* Atomic starburst decorations */}
        <div className="absolute top-10 left-6 text-[#FF1744] text-[24px] rotate-12">✦</div>
        <div className="absolute top-20 right-8 text-[#00BCD4] text-[18px] -rotate-12">✧</div>
        
        <div className="flex flex-col items-center text-center mt-4 w-full">
          <div className="bg-[#FF1744] text-white font-oswald px-6 py-1 text-[14px] uppercase tracking-[0.2em] rounded-full transform -rotate-3 mb-4 shadow-[2px_2px_0_0_#000]">
            {headline}
          </div>
          <h1 className="font-shrikhand text-[44px] text-[#006064] leading-tight drop-shadow-[3px_3px_0px_#FFFFFF] transform rotate-[-2deg] mb-4">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain filter drop-shadow-[2px_2px_0_#00BCD4] bg-white rounded-full p-1" />
          )}
        </div>

        {/* Chrome-style QR Container */}
        <div className="bg-white p-3 border-4 border-[#00BCD4] rounded-2xl shadow-[4px_4px_0_0_#FF1744] relative my-6">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-[#00BCD4]/10 rounded-xl pointer-events-none" />
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply relative z-10" />
        </div>

        <div className="flex flex-col items-center w-full font-oswald">
          <h3 className="text-[18px] font-bold text-[#006064] mb-6 uppercase tracking-wider bg-white px-4 py-1 border-2 border-[#00BCD4] shadow-[2px_2px_0_0_#FF1744] transform rotate-1">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full bg-[#FF1744] text-white px-6 py-3 border-4 border-black shadow-[4px_4px_0_0_#00BCD4] text-[16px] flex justify-between items-center transform -rotate-1">
              <span className="tracking-widest">WIFI:</span>
              <span className="font-black text-[20px]">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
