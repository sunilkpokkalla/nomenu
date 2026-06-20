import React from "react";
import { QrTemplateProps } from "../../types";

export function VibrantYellow({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] flex flex-col relative overflow-hidden box-border bg-[#FDC02A] text-black">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;900&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .hard-shadow { text-shadow: 5px 5px 0px #000; }
      `}} />
      
      {/* Radiating Wave Pattern Background */}
      <svg className="absolute inset-0 w-[200%] h-[200%] pointer-events-none opacity-[0.06] -translate-x-[25%] -translate-y-[10%]" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        {[...Array(50)].map((_, i) => (
          <path key={i} d={`M-200,1000 Q${400 + i*30},${800 - i*20} 1000,${-200 + i*40}`} fill="none" stroke="#000" strokeWidth="1.5" />
        ))}
        {[...Array(30)].map((_, i) => (
          <path key={i+50} d={`M-200,1000 Q${200 + i*40},${600 - i*30} ${800 - i*20},-200`} fill="none" stroke="#000" strokeWidth="1.5" />
        ))}
      </svg>
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between py-[50px] px-8 text-center font-outfit">
        
        {/* Top Header */}
        <div className="w-full flex flex-col items-center mt-2">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain mb-4 rounded-xl shadow-sm bg-white p-1" />
          )}
          
          <h1 className="text-[72px] font-black leading-[0.9] uppercase tracking-wide text-white hard-shadow" style={{ WebkitTextStroke: '2.5px black' }}>
            {brandName}
          </h1>
          
          <h2 className="text-[34px] font-bold mt-10 text-black leading-tight tracking-wide">
            {headline}
          </h2>
        </div>

        {/* QR Code */}
        <div className="bg-white p-5 my-6 relative z-20">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
        </div>

        {/* Bottom Area */}
        <div className="w-full flex flex-col items-center mb-2">
          <p className="text-[18px] text-black font-medium leading-snug tracking-wide">
            {subtext}
          </p>
          
          <div className="w-[95%] h-[2.5px] bg-white my-5 opacity-100 shadow-sm" />
          
          {wifiPassword && (
             <p className="text-[18px] text-black font-medium tracking-wide">
                {wifiPassword}
             </p>
          )}
        </div>

      </div>
    </div>
  );
}
