/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Wifi } from "lucide-react";
import { QrTemplateProps } from "./types";

// Helper to inject Google Fonts
const FineDiningFonts = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;1,6..96,400&display=swap');
    .font-playfair { font-family: 'Playfair Display', serif; }
    .font-cormorant { font-family: 'Cormorant Garamond', serif; }
    .font-bodoni { font-family: 'Bodoni Moda', serif; }
  `}} />
);

// 1. The Michelin
export function TheMichelin({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0A0A0A] text-white flex flex-col relative overflow-hidden p-8 box-border" style={{ boxSizing: "border-box" }}>
      <FineDiningFonts />
      <div className="w-full h-full border border-white/20 p-2 relative">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#D4AF37]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#D4AF37]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#D4AF37]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#D4AF37]" />
        
        <div className="w-full h-full flex flex-col items-center justify-between py-10">
          <div className="flex flex-col items-center">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain mb-4 filter brightness-0 invert opacity-80" />
            )}
            <h1 className="font-bodoni text-[36px] font-bold tracking-widest text-[#D4AF37] text-center uppercase">{brandName}</h1>
            <div className="w-12 h-[1px] bg-[#D4AF37]/50 my-4" />
            <h2 className="font-cormorant text-[14px] italic text-slate-300 tracking-wider">{headline}</h2>
          </div>

          <div className="bg-white p-4">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain" />
          </div>

          <div className="flex flex-col items-center">
            <h3 className="font-playfair text-[18px] tracking-[0.2em] text-[#D4AF37] uppercase mb-4">{subtext}</h3>
            {wifiPassword && (
              <div className="flex flex-col items-center">
                <span className="font-cormorant text-[10px] uppercase tracking-widest text-slate-400">Complimentary WiFi</span>
                <span className="font-playfair text-[14px] tracking-wider text-white mt-1">{wifiPassword}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. The Sommelier
export function TheSommelier({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#2C1318] text-[#F5E6D3] flex flex-col relative overflow-hidden p-6 box-border">
      <FineDiningFonts />
      <div className="w-full h-full border-2 border-[#8B3A42] flex flex-col items-center justify-between p-8 relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="flex flex-col items-center z-10">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[60px] h-[60px] rounded-full border border-[#F5E6D3] object-cover mb-6" />
          )}
          <h1 className="font-playfair text-[40px] italic text-center leading-none">{brandName}</h1>
        </div>

        <div className="bg-[#F5E6D3] p-3 rounded-sm z-10">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[220px] h-[220px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center text-center z-10 w-full">
          <div className="border-t border-b border-[#8B3A42] py-2 w-full mb-4">
            <h2 className="font-cormorant text-[18px] tracking-[0.15em] uppercase">{headline}</h2>
          </div>
          <span className="font-playfair text-[14px] italic text-[#D3A9A3] mb-4">{subtext}</span>
          
          {wifiPassword && (
            <div className="font-cormorant text-[12px] tracking-widest border border-[#8B3A42] px-4 py-1">
              WIFI: {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. Omakase Minimal
export function OmakaseMinimal({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#F9F7F1] text-[#2C2C2C] flex flex-col relative overflow-hidden box-border">
      <FineDiningFonts />
      <div className="absolute top-0 left-0 w-2 h-full bg-[#8C2121]" />
      
      <div className="w-full h-full flex flex-col items-start justify-between p-12 ml-4">
        <div>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain mb-6 grayscale" />
          )}
          <h1 className="font-playfair text-[42px] font-bold leading-tight">{brandName}</h1>
          <h2 className="font-cormorant text-[16px] italic text-slate-500 mt-2">{headline}</h2>
        </div>

        <div className="relative">
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#2C2C2C]" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#2C2C2C]" />
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col">
          <h3 className="font-bodoni text-[14px] tracking-[0.3em] uppercase mb-4">{subtext}</h3>
          {wifiPassword && (
            <div className="font-playfair text-[12px] text-slate-600">
              <span className="italic mr-2">Network:</span> {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. The Chandelier
export function TheChandelier({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-slate-900 text-white flex flex-col relative overflow-hidden box-border items-center justify-center p-8">
      <FineDiningFonts />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-slate-700/30 rounded-full blur-[60px]" />
      
      <div className="w-full h-full border-[0.5px] border-slate-500 rounded-[40px] flex flex-col items-center justify-between p-8 backdrop-blur-sm bg-black/20">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-cormorant text-[12px] tracking-[0.4em] text-slate-400 uppercase mb-4">{headline}</h2>
          <h1 className="font-bodoni text-[32px] text-white tracking-wider">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[30px] h-[30px] object-contain mt-4 opacity-70 filter brightness-0 invert" />
          )}
        </div>

        <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl">
          <div className="bg-white p-2 rounded-2xl">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-500 to-transparent mb-4" />
          <h3 className="font-playfair text-[14px] italic text-slate-300 mb-4">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex items-center gap-2 font-cormorant text-[12px] text-slate-400 tracking-widest border border-slate-600 rounded-full px-6 py-2">
              <Wifi className="w-3 h-3" /> {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 5. French Bistro
export function FrenchBistro({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#Fdfbf7] text-[#1a1a1a] flex flex-col relative overflow-hidden box-border p-6">
      <FineDiningFonts />
      <div className="w-full h-full border-[3px] border-double border-[#1a1a1a] flex flex-col items-center justify-between p-6">
        
        <div className="flex flex-col items-center w-full">
          <div className="w-full border-b border-[#1a1a1a] pb-4 mb-4 text-center">
            <h2 className="font-cormorant text-[14px] uppercase tracking-[0.2em]">{headline}</h2>
          </div>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[70px] h-[70px] object-cover rounded-full border border-[#1a1a1a] mb-4" />
          )}
          <h1 className="font-playfair text-[38px] font-bold italic text-center leading-none">{brandName}</h1>
        </div>

        <div className="relative">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[220px] h-[220px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="w-[50px] h-[2px] bg-[#1a1a1a] mb-4" />
          <h3 className="font-bodoni text-[16px] uppercase tracking-widest mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full border-t border-[#1a1a1a] pt-4 text-center font-cormorant">
              <span className="text-[14px] italic mr-2">Accès WiFi:</span>
              <span className="text-[14px] font-bold">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 6. Modern Steakhouse
export function ModernSteakhouse({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#111111] text-[#E5E5E5] flex flex-col relative overflow-hidden box-border border-l-[12px] border-[#A62C2B]">
      <FineDiningFonts />
      
      <div className="w-full h-full flex flex-col items-start justify-between p-10">
        <div className="w-full">
          <h2 className="font-bodoni text-[11px] uppercase tracking-[0.4em] text-[#A62C2B] mb-2">{headline}</h2>
          <h1 className="font-playfair text-[48px] leading-[0.9] font-bold uppercase mb-6">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter brightness-0 invert opacity-60" />
          )}
        </div>

        <div className="bg-[#E5E5E5] p-2 self-center">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[240px] h-[240px] object-contain" />
        </div>

        <div className="w-full">
          <div className="w-full h-[1px] bg-white/20 mb-4" />
          <div className="flex justify-between items-end w-full">
            <h3 className="font-cormorant text-[16px] italic text-slate-400 max-w-[200px]">{subtext}</h3>
            {wifiPassword && (
              <div className="text-right">
                <div className="font-bodoni text-[9px] uppercase tracking-widest text-[#A62C2B]">WIFI</div>
                <div className="font-playfair text-[14px]">{wifiPassword}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. The Botanical
export function TheBotanical({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#EBE7E0] text-[#2C402E] flex flex-col relative overflow-hidden box-border items-center justify-center p-6">
      <FineDiningFonts />
      <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] border-[1px] border-[#2C402E] rounded-full opacity-20" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[250px] h-[250px] border-[1px] border-[#2C402E] rounded-full opacity-20" />
      
      <div className="w-full h-full flex flex-col items-center justify-between p-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain mb-4 filter brightness-0 sepia hue-rotate-[90deg] saturate-[50%]" />
          )}
          <h1 className="font-cormorant text-[42px] uppercase tracking-widest leading-none mb-2">{brandName}</h1>
          <h2 className="font-playfair text-[14px] italic text-[#4A5D4C]">{headline}</h2>
        </div>

        <div className="bg-white p-6 rounded-t-full rounded-b-[40px] shadow-sm border border-[#2C402E]/10">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-bodoni text-[12px] uppercase tracking-[0.2em] mb-4">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-cormorant border border-[#2C402E]/30 rounded-full px-6 py-1 text-[13px] flex items-center gap-2">
              <Wifi className="w-3 h-3" /> {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 8. Velvet Noir
export function VelvetNoir({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#161616] text-[#E0E0E0] flex flex-col relative overflow-hidden box-border p-4">
      <FineDiningFonts />
      <div className="w-full h-full border-[2px] border-[#595959] p-[2px]">
        <div className="w-full h-full border border-[#595959] flex flex-col items-center justify-between py-12 px-8">
          
          <div className="flex flex-col items-center text-center w-full">
            <h2 className="font-cormorant text-[13px] uppercase tracking-[0.3em] text-[#999999] mb-6">{headline}</h2>
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] rounded-full object-cover grayscale mb-4" />
            )}
            <h1 className="font-playfair text-[34px] tracking-wider uppercase">{brandName}</h1>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] border border-[#595959] rotate-45" />
            <div className="bg-white p-4 relative z-10">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain" />
            </div>
          </div>

          <div className="flex flex-col items-center w-full">
            <h3 className="font-playfair text-[15px] italic text-[#B0B0B0] mb-6">{subtext}</h3>
            {wifiPassword && (
              <div className="w-full flex justify-between items-center border-t border-[#595959] pt-4 font-cormorant text-[13px]">
                <span className="tracking-[0.1em] uppercase text-[#999999]">WIFI ACCESS</span>
                <span className="font-bold">{wifiPassword}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// 9. Classical Heritage
export function ClassicalHeritage({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FAF9F6] text-[#2B2B2B] flex flex-col relative overflow-hidden box-border p-8 border-[10px] border-[#2B2B2B]">
      <FineDiningFonts />
      <div className="w-full h-full flex flex-col items-center justify-between">
        
        <div className="flex flex-col items-center text-center w-full">
          <div className="w-full border-b-[2px] border-[#2B2B2B] mb-2" />
          <div className="w-full border-b border-[#2B2B2B] mb-6" />
          
          <h1 className="font-bodoni text-[46px] uppercase font-bold leading-[0.9]">{brandName}</h1>
          <h2 className="font-cormorant text-[18px] italic mt-4">{headline}</h2>
        </div>

        <div className="w-full flex justify-center py-6 border-y border-[#2B2B2B]/20">
          <div className="p-2 border border-[#2B2B2B]">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain grayscale mb-4" />
          )}
          <h3 className="font-playfair text-[12px] uppercase tracking-[0.2em] mb-4">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-bodoni text-[12px] border border-[#2B2B2B] px-4 py-2 uppercase tracking-widest">
              Passcode: {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 10. The Monolith
export function TheMonolith({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1a1a1a] text-[#ffffff] flex flex-col relative overflow-hidden box-border">
      <FineDiningFonts />
      
      {/* Golden ratio split */}
      <div className="absolute top-0 left-0 w-full h-[62%] bg-[#0f0f0f]" />
      
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-10">
        
        <div className="flex justify-between items-start w-full">
          <h1 className="font-playfair text-[32px] uppercase max-w-[200px] leading-tight">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter brightness-0 invert" />
          )}
        </div>

        <div className="w-full flex flex-col items-center">
          <div className="bg-white p-3 shadow-2xl transform translate-y-8">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[220px] h-[220px] object-contain" />
          </div>
        </div>

        <div className="flex justify-between items-end w-full pt-16">
          <div className="flex flex-col">
            <h2 className="font-bodoni text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-1">{headline}</h2>
            <h3 className="font-cormorant text-[16px] italic">{subtext}</h3>
          </div>
          
          {wifiPassword && (
            <div className="text-right">
              <Wifi className="w-4 h-4 text-slate-400 mb-1 ml-auto" />
              <div className="font-playfair text-[12px] tracking-wider">{wifiPassword}</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
