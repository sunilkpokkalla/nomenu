/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Wifi } from "lucide-react";
import { QrTemplateProps } from "./types";

// Helper to inject Google Fonts
const CasualFonts = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Quicksand:wght@400;500;600;700&family=Pacifico&display=swap');
    .font-nunito { font-family: 'Nunito', sans-serif; }
    .font-quicksand { font-family: 'Quicksand', sans-serif; }
    .font-pacifico { font-family: 'Pacifico', cursive; }
  `}} />
);

// 1. Morning Coffee
export function MorningCoffee({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FAF8F5] text-[#4A3B32] flex flex-col relative overflow-hidden box-border p-8 font-nunito border-[8px] border-[#8C6D58]/10 rounded-[30px]">
      <CasualFonts />
      <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-[#E8DCC4] rounded-full opacity-30" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#D4E0D9] rounded-full opacity-30" />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between bg-white/40 backdrop-blur-sm rounded-[20px] p-8 border border-white/60 shadow-xl">
        
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[60px] h-[60px] object-cover rounded-full border-2 border-[#8C6D58]/20 mb-4" />
          )}
          <h1 className="text-[36px] font-extrabold tracking-tight text-[#4A3B32] leading-tight mb-2">{brandName}</h1>
          <h2 className="font-quicksand text-[15px] font-semibold text-[#8C6D58] uppercase tracking-wider">{headline}</h2>
        </div>

        <div className="bg-white p-4 rounded-[24px] shadow-[0_10px_30px_rgba(140,109,88,0.15)] transform rotate-1">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain rounded-xl mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-pacifico text-[24px] text-[#8C6D58] mb-6 transform -rotate-2">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full bg-[#FAF8F5] rounded-[16px] p-4 flex flex-col items-center justify-center border border-[#8C6D58]/10">
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#8C6D58]/60 mb-1 flex items-center gap-1">
                <Wifi className="w-3 h-3" /> Connect to WiFi
              </span>
              <span className="text-[16px] font-bold text-[#4A3B32]">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 2. The Bakery (Parisian Patisserie)
export function TheBakery({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FAF8F5] text-[#2C3E50] flex flex-col relative overflow-hidden box-border p-8 border-[12px] border-[#E8DCC4]">
      <CasualFonts />
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Great+Vibes&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-vibes { font-family: 'Great Vibes', cursive; }
      `}} />
      
      {/* Subtle organic noise/texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] mix-blend-multiply pointer-events-none" />

      <div className="w-full h-full border border-[#2C3E50]/20 flex flex-col items-center justify-between py-10 px-6 relative z-10 bg-white/40">
        
        {/* Ornate Header */}
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] object-contain mb-6 filter sepia-[0.3]" />
          )}
          <h2 className="font-cormorant text-[12px] uppercase tracking-[0.4em] text-[#8C7A6B] mb-2">Maison de Qualité</h2>
          <h1 className="font-vibes text-[54px] leading-[0.8] text-[#2C3E50] mb-6">{brandName}</h1>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-[1px] bg-[#8C7A6B]/50" />
            <span className="font-cormorant text-[14px] italic text-[#8C7A6B]">{headline}</span>
            <div className="w-8 h-[1px] bg-[#8C7A6B]/50" />
          </div>
        </div>

        {/* Embossed QR Container */}
        <div className="relative p-2 bg-white shadow-[0_8px_24px_rgba(44,62,80,0.08)] border border-[#E8DCC4] my-4 rounded-sm transform rotate-1">
          <div className="absolute inset-0 border border-[#2C3E50]/10 m-1" />
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[190px] h-[190px] object-contain relative z-10 mix-blend-multiply opacity-90 sepia-[0.1]" />
        </div>

        {/* Elegant Footer */}
        <div className="flex flex-col items-center w-full text-center">
          <h3 className="font-cormorant text-[18px] font-semibold tracking-widest uppercase text-[#2C3E50] mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex flex-col items-center font-cormorant border-t border-b border-[#2C3E50]/20 py-3 px-8">
              <span className="text-[12px] italic text-[#8C7A6B] mb-1">Réseau Invité</span>
              <span className="text-[16px] font-semibold tracking-widest">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 3. Craft Burger
export function CraftBurger({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1a1a1a] text-[#F4E6CC] flex flex-col relative overflow-hidden box-border p-6 font-quicksand">
      <CasualFonts />
      <div className="w-full h-full border-4 border-[#F4E6CC] rounded-xl flex flex-col p-8 justify-between bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-black/40 bg-blend-multiply">
        
        <div className="flex flex-col items-center text-center">
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#E85D04] mb-2">{headline}</h2>
          <h1 className="font-nunito text-[46px] font-black uppercase leading-[0.9] text-[#F4E6CC] tracking-tight">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter brightness-0 invert opacity-80 mt-6" />
          )}
        </div>

        <div className="bg-[#F4E6CC] p-4 transform -rotate-2 shadow-[4px_4px_0_0_#E85D04]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full text-center">
          <div className="w-[50px] h-[4px] bg-[#E85D04] mb-4" />
          <h3 className="text-[16px] font-bold uppercase tracking-widest mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full border-t-2 border-dashed border-[#F4E6CC]/30 pt-4 flex justify-between items-center text-[14px]">
              <span className="font-bold uppercase tracking-widest text-[#E85D04]">WIFI ACCESS</span>
              <span className="font-black text-[16px]">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 4. Urban Cafe
export function UrbanCafe({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#E8EAE6] text-[#2D312A] flex flex-col relative overflow-hidden box-border font-nunito">
      <CasualFonts />
      <div className="absolute top-0 right-0 w-[60%] h-[100%] bg-white clip-path-polygon" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 30% 0)' }} />
      
      <div className="w-full h-full relative z-10 flex flex-col p-10 justify-between">
        
        <div className="flex flex-col items-start w-full">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain mb-4 filter drop-shadow-sm" />
          )}
          <h1 className="text-[38px] font-black leading-none tracking-tight text-[#2D312A] mb-2">{brandName}</h1>
          <h2 className="font-quicksand text-[14px] font-semibold text-[#737C6A] uppercase tracking-widest">{headline}</h2>
        </div>

        <div className="self-end bg-white p-3 rounded-3xl shadow-[0_20px_40px_-10px_rgba(45,49,42,0.15)] mr-4 border border-[#E8EAE6]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain rounded-xl mix-blend-multiply" />
        </div>

        <div className="flex flex-col w-full">
          <h3 className="font-quicksand text-[18px] font-bold text-[#2D312A] mb-6 max-w-[200px] leading-snug">{subtext}</h3>
          
          {wifiPassword && (
            <div className="bg-[#2D312A] text-white rounded-2xl p-4 flex justify-between items-center w-[90%] shadow-lg">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A2AFA2]">Network</span>
                <span className="text-[16px] font-black">{wifiPassword}</span>
              </div>
              <Wifi className="w-6 h-6 text-[#A2AFA2]" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 5. Sunday Brunch
export function SundayBrunch({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FFFAF0] text-[#FF7F50] flex flex-col relative overflow-hidden box-border p-8 border-[12px] border-[#FFF0F5] rounded-[40px]">
      <CasualFonts />
      
      <div className="w-full h-full border-[3px] border-dashed border-[#FF7F50]/30 rounded-[24px] flex flex-col items-center justify-between p-8 bg-white/50">
        
        <div className="flex flex-col items-center text-center">
          <h2 className="font-quicksand text-[12px] font-bold uppercase tracking-[0.2em] text-[#FFA07A] mb-4">{headline}</h2>
          <h1 className="font-pacifico text-[48px] text-[#FF7F50] leading-none mb-4 transform -rotate-2">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain opacity-80" />
          )}
        </div>

        <div className="bg-white p-4 rounded-full shadow-[0_8px_20px_rgba(255,127,80,0.15)] border border-[#FF7F50]/10">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply rounded-full" />
        </div>

        <div className="flex flex-col items-center text-center w-full">
          <h3 className="font-nunito text-[16px] font-bold text-[#FFA07A] mb-6 max-w-[250px]">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-quicksand text-[14px] font-bold text-[#FF7F50] bg-[#FFF0F5] px-6 py-2 rounded-full border border-[#FF7F50]/20">
              WIFI / {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}



// 6. Aesthetic Cafe
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

// 7. Pizzeria (Neo-Grotesque Raw)
export function Pizzeria({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FDFBF7] text-[#D32F2F] flex flex-col relative overflow-hidden box-border border-[10px] border-[#D32F2F]">
      <CasualFonts />
      <div className="w-full h-full border-[2px] border-dashed border-[#D32F2F]/30 flex flex-col p-8 justify-between relative bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
        
        <div className="absolute top-0 right-10 w-[40px] h-[60px] bg-[#4CAF50] rounded-b-full shadow-sm" />

        <div className="flex flex-col items-start w-full z-10 mt-6">
          <h2 className="font-quicksand text-[14px] font-bold uppercase tracking-[0.2em] text-[#4CAF50] mb-1">{headline}</h2>
          <h1 className="font-nunito text-[46px] font-black uppercase text-[#D32F2F] leading-[0.8] tracking-tighter max-w-[300px]">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] object-contain mt-6" />
          )}
        </div>

        <div className="self-center bg-white p-4 shadow-xl border-2 border-[#D32F2F]/10 transform rotate-3 z-10">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col w-full z-10 text-center items-center font-quicksand">
          <h3 className="text-[18px] font-bold text-[#D32F2F] mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="bg-[#D32F2F] text-white px-8 py-3 rounded-full flex items-center gap-3 shadow-md font-nunito">
              <Wifi className="w-5 h-5 text-[#FDFBF7]" />
              <span className="text-[16px] font-bold">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 8. Juice Bar (Vibrant Organic)
// 8. Table Order (Digital Menu)
export function TableOrder({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#222] text-white flex flex-col relative overflow-hidden box-border font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap');
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}} />
      
      {/* Solid Background overlay to give it some texture without an image */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3a2822] to-[#1a1210]" />
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
      
      <div className="w-full h-full relative z-10 flex flex-col p-8 justify-between items-center font-montserrat">
        
        {/* Top Header: Table Number & Menu */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <h1 className="text-[36px] font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{brandName}</h1>
          <div className="w-[2px] h-[40px] bg-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          <div className="flex flex-col items-start leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <span className="text-[16px] font-normal tracking-widest">{headline}</span>
            <span className="text-[28px] font-bold tracking-wider">MENU</span>
          </div>
        </div>

        {/* Center QR Code Container */}
        <div className="bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.3)] mt-8 mb-4 relative">
          {logoUrl && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center shadow-md p-1 z-20">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
          )}
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[240px] h-[240px] object-contain mix-blend-multiply relative z-10" />
        </div>

        {/* Bottom Text Area */}
        <div className="flex flex-col items-center text-center w-full mb-6">
          <h2 className="text-[36px] font-extrabold text-white leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] max-w-[350px]">
            {subtext}
          </h2>
          <p className="text-[14px] font-normal text-white mt-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-[300px] leading-relaxed">
            Scan the QR code with your mobile device for contactless order.
          </p>
          
          {wifiPassword && (
            <div className="mt-6 bg-black/60 backdrop-blur-sm border border-white/20 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <Wifi className="w-4 h-4" />
              <span className="text-[13px] font-semibold tracking-wider">WIFI: {wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 9. Retro Diner (50s Atomic Age)
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

// 10. Cozy Teahouse
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

// 11. Restaurant Plate (BBQ Menu)
const Spoon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 100" fill="currentColor">
    <ellipse cx="12" cy="20" rx="9" ry="18" />
    <rect x="10" y="35" width="4" height="55" rx="2" />
    <circle cx="12" cy="90" r="3" />
  </svg>
);

const Fork = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 100" fill="currentColor">
    <path d="M4 5 L4 25 A 8 8 0 0 0 20 25 L20 5 M9.3 5 L9.3 25 M14.7 5 L14.7 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <rect x="10.5" y="33" width="3" height="57" rx="1.5" />
    <circle cx="12" cy="90" r="2.5" />
  </svg>
);

export function RestaurantPlate({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#161616] text-white flex flex-col items-center relative overflow-hidden box-border p-6">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;800;900&display=swap');
        .font-anton { font-family: 'Anton', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}} />
      
      {/* Chalkboard / Sketch Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\"100\\" height=\\"100\\" viewBox=\\"0 0 100 100\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cpath d=\\"M10 10 C 20 20, 40 20, 50 10 C 60 0, 80 0, 90 10 C 100 20, 100 40, 90 50 C 80 60, 60 60, 50 50 C 40 40, 20 40, 10 50 C 0 60, 0 80, 10 90 C 20 100, 40 100, 50 90 C 60 80, 80 80, 90 90\\" stroke=\\"white\\" stroke-width=\\"2\\" fill=\\"none\\"/%3E%3C/svg%3E")', backgroundSize: '150px' }} />

      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between">
        
        {/* Top Header: Brand Name & Headline */}
        <div className="flex flex-col items-center text-center mt-2 w-full font-inter">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[30px] h-[30px] object-contain mb-2 filter brightness-0 invert" />
          )}
          <h1 className="text-[40px] font-black tracking-tight leading-none uppercase">{brandName}</h1>
          <div className="flex items-center gap-2 mt-1 w-[80%] max-w-[200px]">
            <div className="h-[2px] flex-grow bg-[#D4B895]" />
            <Fork className="w-2 h-4 text-[#D4B895]" />
            <div className="h-[2px] flex-grow bg-[#D4B895]" />
          </div>
          <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase mt-2 text-white/70">{headline}</h2>
        </div>

        {/* Scan For MENU */}
        <div className="flex flex-col items-center w-full font-inter mt-6">
          <div className="text-[14px] font-semibold tracking-wider text-white mb-[-8px]">SCAN FOR</div>
          <div className="font-anton text-[90px] leading-none text-[#D4B895] tracking-wide">MENU</div>
        </div>

        {/* Plate + Cutlery + QR Code */}
        <div className="flex items-center justify-center w-full relative mt-[-20px] mb-4">
          <Spoon className="w-[45px] h-[160px] text-white absolute left-2" />
          
          <div className="w-[260px] h-[260px] bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_-8px_16px_rgba(0,0,0,0.1)] border-[8px] border-[#EEEEEE] z-10 relative">
            <div className="absolute inset-0 rounded-full border border-black/10 m-2 pointer-events-none" />
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>

          <Fork className="w-[45px] h-[160px] text-white absolute right-2" />
        </div>

        {/* Bottom Text */}
        <div className="flex flex-col items-center w-full font-inter mb-4">
          <h3 className="text-[26px] font-black tracking-widest uppercase text-white drop-shadow-md">{subtext}</h3>
          
          {wifiPassword && (
            <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-white/50 tracking-wider">
              <Wifi className="w-4 h-4" />
              <span>WIFI PASS: <span className="text-[#D4B895]">{wifiPassword}</span></span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 12. Review Acrylic (Frosted Sign)
export function ReviewAcrylic({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#959d90] flex flex-col relative overflow-hidden box-border p-8 rounded-[32px] shadow-inner border border-white/20">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Montserrat:wght@300;400;800;900&display=swap');
        .font-caveat { font-family: 'Caveat', cursive; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}} />

      {/* Frosted Glass / Acrylic Noise Texture */}
      <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm pointer-events-none" />

      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between py-4">
        
        {/* Top Text Section */}
        <div className="flex flex-col items-center w-full mt-2 relative">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain mb-4 filter drop-shadow-sm" />
          )}
          
          <h1 className="font-montserrat text-[64px] font-black text-[#1a1a1a] uppercase tracking-tighter leading-none relative z-0">
            {brandName}
          </h1>
          
          <h2 className="font-caveat text-[65px] text-[#f2f4f1] leading-none transform -rotate-2 -mt-10 relative z-10 drop-shadow-sm">
            {headline}
          </h2>
        </div>

        {/* Center QR Code Container */}
        <div className="bg-[#f2f4f1] p-4 shadow-lg mt-4 mb-8">
          <div className="border border-black/5 p-1 bg-white">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[220px] h-[220px] object-contain mix-blend-multiply" />
          </div>
        </div>

        {/* Bottom Text Area & Stars */}
        <div className="flex flex-col items-center w-full text-center">
          <p className="font-montserrat text-[20px] font-light text-[#e8ebe7] leading-snug tracking-wide max-w-[320px] mb-8">
            {subtext}
          </p>
          
          {/* 5 Stars */}
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-8 h-8 text-[#d4bd7f] drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          {wifiPassword && (
            <div className="mt-8 font-montserrat text-[12px] font-medium tracking-[0.2em] text-[#1a1a1a]/60 uppercase bg-white/20 px-6 py-2 rounded-full backdrop-blur-md">
              WIFI: {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 13. Burger Sketches
export function BurgerSketches({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#6cbda8] text-black flex flex-col relative overflow-hidden box-border">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Roboto:wght@500;700;900&display=swap');
        .font-fredoka { font-family: 'Fredoka', sans-serif; }
        .font-roboto { font-family: 'Roboto', sans-serif; }
      `}} />
      
      {/* Background Sketches */}
      
      {/* Top Left Burger Sketch */}
      <svg className="absolute -top-10 -left-12 w-[320px] h-[320px] opacity-90" viewBox="0 0 200 200" fill="none" stroke="black" strokeWidth="1.5">
        <path d="M 30,80 C 30,30 170,30 170,80" />
        <path d="M 25,85 C 50,75 150,75 175,85" />
        <path d="M 20,95 C 40,85 60,105 80,95 C 100,85 120,105 140,95 C 160,85 180,95 180,95" />
        <path d="M 25,110 C 50,120 150,120 175,110" />
        <path d="M 30,120 C 30,150 170,150 170,120" />
        {/* Seeds */}
        <circle cx="70" cy="50" r="1.5" fill="black" />
        <circle cx="100" cy="40" r="1.5" fill="black" />
        <circle cx="130" cy="55" r="1.5" fill="black" />
        <circle cx="60" cy="65" r="1.5" fill="black" />
        <circle cx="140" cy="70" r="1.5" fill="black" />
        {/* Cross hatching */}
        <path d="M 40,50 L 50,60 M 150,50 L 160,60 M 40,130 L 60,140 M 140,130 L 160,140" strokeWidth="1" opacity="0.6" />
        <path d="M 50,40 L 40,60 M 140,40 L 150,60 M 50,140 L 40,130 M 140,140 L 150,130" strokeWidth="1" opacity="0.6" />
        <path d="M 30,80 L 170,80 M 30,120 L 170,120 M 50,130 L 60,145 M 120,145 L 130,130" strokeWidth="1.5" />
      </svg>

      {/* Top Right Soda Can Sketch */}
      <svg className="absolute -top-6 -right-12 w-[220px] h-[220px] opacity-90 transform rotate-[25deg]" viewBox="0 0 100 150" fill="none" stroke="black" strokeWidth="1.5">
        <ellipse cx="50" cy="20" rx="30" ry="10" />
        <path d="M 20,20 L 25,130 C 25,140 75,140 75,130 L 80,20" />
        <ellipse cx="50" cy="130" rx="25" ry="8" />
        {/* Pop tab */}
        <ellipse cx="50" cy="20" rx="6" ry="3" />
        <circle cx="45" cy="20" r="1.5" fill="black" />
        {/* Detail lines / Bubbles */}
        <circle cx="40" cy="60" r="4" />
        <circle cx="65" cy="80" r="6" />
        <circle cx="35" cy="100" r="3" />
        <path d="M 25,40 L 75,60 M 25,60 L 75,80 M 25,80 L 75,100 M 25,100 L 75,120" strokeWidth="1" opacity="0.5" />
        <path d="M 22,30 L 30,120 M 78,30 L 70,120" strokeWidth="1" opacity="0.5" />
      </svg>

      {/* Bottom Right Fries Sketch */}
      <svg className="absolute -bottom-16 -right-10 w-[280px] h-[280px] opacity-90 transform -rotate-12" viewBox="0 0 150 150" fill="none" stroke="black" strokeWidth="1.5">
        {/* Fries lines */}
        <path d="M 30,50 L 35,90 M 45,30 L 50,90 M 60,40 L 65,90 M 75,20 L 80,90 M 90,35 L 90,90 M 105,45 L 100,90 M 120,55 L 110,90" />
        <path d="M 30,50 H 40 M 45,30 H 55 M 60,40 H 70 M 75,20 H 85 M 90,35 H 100 M 105,45 H 115 M 120,55 H 130" strokeWidth="2" />
        <path d="M 35,50 V 90 M 50,30 V 90 M 65,40 V 90 M 80,20 V 90 M 95,35 V 90 M 110,45 V 90 M 125,55 V 90" strokeWidth="1" opacity="0.6" />
        {/* Fries Box */}
        <path d="M 20,85 C 75,100 130,85 130,85 L 110,150 C 75,160 30,150 30,150 Z" fill="#6cbda8" />
        <path d="M 20,85 C 75,100 130,85 130,85 L 110,150 C 75,160 30,150 30,150 Z" />
        <path d="M 25,95 L 35,145 M 50,100 L 60,148 M 80,100 L 80,150 M 105,95 L 100,145 M 125,90 L 115,145" strokeWidth="1" opacity="0.6" />
      </svg>

      {/* Bottom Left Hand & Phone Silhouette */}
      <svg className="absolute -bottom-10 -left-6 w-[280px] h-[380px]" viewBox="0 0 200 300" fill="black">
        {/* Main Hand Base */}
        <path d="M 0,200 C 40,200 70,240 70,300 H 0 Z" />
        <path d="M 0,160 C 30,150 60,170 70,200 C 50,220 20,230 0,220 Z" />
        
        {/* Fingers on the right side of the phone */}
        <path d="M 140,140 C 160,140 170,150 170,160 C 170,170 160,180 140,180 Z" />
        <path d="M 140,185 C 160,185 170,195 170,205 C 170,215 160,225 140,225 Z" />
        <path d="M 140,230 C 155,230 165,240 165,250 C 165,260 155,270 140,270 Z" />
        <path d="M 140,275 C 150,275 160,285 160,295 C 160,305 150,315 140,315 Z" />
        
        {/* Phone Body */}
        <rect x="60" y="80" width="100" height="190" rx="12" fill="black" />
        
        {/* Screen */}
        <rect x="68" y="100" width="84" height="150" rx="4" fill="#6cbda8" />
        
        {/* Phone Screen Content (HTML via foreignObject) */}
        <foreignObject x="72" y="105" width="76" height="140">
          <div className="flex flex-col items-center justify-center h-full text-center p-1">
            <svg className="w-4 h-4 mb-2 text-black opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            {subtext && (
              <div className="font-roboto text-[11px] font-black text-black leading-[1.1] uppercase mb-2">
                {subtext}
              </div>
            )}
            {wifiPassword && (
              <div className="font-roboto text-[9px] font-bold text-black border-t border-black/20 pt-1 w-full uppercase">
                WIFI:<br/>{wifiPassword}
              </div>
            )}
          </div>
        </foreignObject>
        
        {/* Top Speaker */}
        <rect x="95" y="90" width="30" height="4" rx="2" fill="#6cbda8" />
        
        {/* Home Button */}
        <circle cx="110" cy="260" r="5" fill="#6cbda8" />
        
        {/* Thumb crossing over */}
        <path d="M -10,180 C 40,140 70,130 90,160 C 100,170 80,190 60,190 C 40,190 20,180 -10,180 Z" fill="black" />
      </svg>


      {/* Content */}
      <div className="w-full h-full relative z-10 flex flex-col pt-[160px] pl-[180px] pr-6">
        
        <div className="flex flex-col items-start w-full relative">
          {/* Logo overlay */}
          {logoUrl && (
            <div className="absolute -top-12 right-0 w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center shadow-md">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[20px] h-[20px] object-contain" />
            </div>
          )}
          
          <h2 className="font-roboto text-[13px] font-black tracking-widest uppercase text-black mb-3">
            {brandName}
          </h2>
          
          <h1 className="font-fredoka text-[40px] font-bold text-black leading-[1.2] max-w-[240px]">
            {headline}
          </h1>
        </div>

        <div className="flex flex-col items-start w-full mt-6">
          <div className="bg-white p-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-black">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[140px] h-[140px] object-contain mix-blend-multiply" />
          </div>
        </div>

      </div>
    </div>
  );
}

// 13. Vibrant Yellow
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
