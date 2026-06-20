import React from "react";
import { QrTemplateProps } from "../../types";

export function AestheticCafe({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#fdf8f5] text-[#2c2c2c] flex flex-col relative overflow-hidden box-border">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;600&display=swap');
        .font-bodoni { font-family: 'Bodoni Moda', serif; }
        .font-outfit { font-family: 'Outfit', sans-serif; }
      `}} />
      
      {/* Soft Gradient & Texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFE4E1]/80 to-[#FFF0F5]/80" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply" />
      
      {/* Decorative Blob */}
      <svg className="absolute -top-20 -right-20 w-[300px] h-[300px] text-[#FFB6C1] opacity-30" viewBox="0 0 200 200" fill="currentColor">
        <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.9,-18.1,95.8,-3.2C94.7,11.7,86.4,26.1,76.5,39.3C66.6,52.5,55.1,64.5,41.4,72.2C27.7,79.9,11.8,83.3,-4.1,87.4C-20,91.5,-36,96.3,-49.6,89.5C-63.2,82.7,-74.4,64.3,-82.1,46.2C-89.8,28.1,-94,10.3,-92.3,-6.6C-90.6,-23.5,-83,-39.5,-71.4,-51.7C-59.8,-63.9,-44.2,-72.3,-29.4,-78.5C-14.6,-84.7,1.4,-88.7,16.4,-84.5C31.4,-80.3,45.8,-67.9,44.7,-76.4Z" transform="translate(100 100)" />
      </svg>

      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between py-12 px-8">
        
        {/* Top Header */}
        <div className="flex flex-col items-center text-center w-full relative">
          
          {/* Model Icon (Chic Line Art Silhouette) */}
          <svg className="w-20 h-20 text-[#d48c8c] mb-3 drop-shadow-sm" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M40,80 C45,70 48,65 55,65 C65,65 70,55 70,45 C70,30 60,20 45,20 C30,20 20,30 20,45 C20,55 25,65 35,65 C42,65 45,70 50,80" />
            <path d="M15,35 C10,20 30,5 50,5 C70,5 90,20 85,35 C80,45 75,40 70,30" />
            <path d="M35,40 Q40,43 45,40" strokeWidth="2" />
            <path d="M40,43 L42,46 M38,42 L36,44 M42,41 L45,43" strokeWidth="1" />
            <path d="M42,55 Q45,57 48,55" strokeWidth="2" />
            <circle cx="65" cy="45" r="3" />
            <path d="M45,80 V100 M55,80 V100 M20,100 C25,90 40,85 45,85 M70,100 C65,90 50,85 55,85" />
          </svg>

          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[35px] h-[35px] object-contain mb-3 rounded-full shadow-sm" />
          )}

          <h1 className="font-bodoni text-[42px] font-bold text-[#333333] leading-[1.1] mb-2 tracking-tight italic">
            {brandName}
          </h1>
          <h2 className="font-outfit text-[11px] font-bold tracking-[0.3em] uppercase text-[#d48c8c]">
            {headline}
          </h2>
        </div>

        {/* QR Code container (Glassmorphism) */}
        <div className="bg-white/50 backdrop-blur-md p-4 rounded-[2rem] shadow-[0_8px_32px_rgba(229,160,160,0.25)] border border-white/80">
          <div className="bg-white p-2 rounded-2xl">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[170px] h-[170px] object-contain mix-blend-multiply rounded-xl" />
          </div>
        </div>

        {/* Bottom Text Area */}
        <div className="flex flex-col items-center text-center w-full">
          <p className="font-bodoni text-[16px] text-[#666666] leading-snug mb-5 italic max-w-[260px]">
            {subtext}
          </p>

          {wifiPassword && (
            <div className="font-outfit text-[10px] font-bold tracking-[0.2em] uppercase text-[#d48c8c] bg-white/70 border border-white px-6 py-2.5 rounded-full shadow-sm">
              Wi-Fi: {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
