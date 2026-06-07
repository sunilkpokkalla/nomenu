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

// 2. The Bakery
export function TheBakery({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FFFBF0] text-[#3D3A30] flex flex-col relative overflow-hidden box-border">
      <CasualFonts />
      
      {/* Scalloped top border effect using radial gradients */}
      <div className="w-full h-[40px] absolute top-0 left-0" style={{
        backgroundColor: colorStart,
        maskImage: 'radial-gradient(circle at 15px 0px, transparent 15px, black 16px)',
        maskSize: '30px 20px',
        maskRepeat: 'repeat-x'
      }} />

      <div className="w-full h-full p-10 flex flex-col items-center justify-between pt-16">
        
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain mb-4 filter drop-shadow-sm" />
          )}
          <h1 className="font-pacifico text-[42px] leading-tight text-[#3D3A30] drop-shadow-sm">{brandName}</h1>
          <h2 className="font-quicksand text-[13px] font-bold uppercase tracking-[0.2em] text-[#A69C82] mt-4">{headline}</h2>
        </div>

        <div className="relative">
          <div className="absolute inset-[-10px] border-2 border-dashed border-[#E3D9C1] rounded-3xl" />
          <div className="bg-white p-3 rounded-2xl relative z-10 shadow-lg">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full font-quicksand text-center">
          <h3 className="text-[18px] font-bold text-[#3D3A30] mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex items-center gap-3 text-[14px] font-semibold text-[#8C836A] bg-white px-6 py-2 rounded-full border border-[#E3D9C1] shadow-sm">
              <Wifi className="w-4 h-4" /> 
              <span>WIFI: <span className="font-bold text-[#3D3A30]">{wifiPassword}</span></span>
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

// 6. Local Pub
export function LocalPub({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1E272E] text-[#D2DAE2] flex flex-col relative overflow-hidden box-border p-6 font-quicksand border-[6px] border-[#3C40C6]">
      <CasualFonts />
      <div className="w-full h-full border border-[#485460] p-8 flex flex-col justify-between relative bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] bg-black/20 bg-blend-multiply">
        
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[60px] h-[60px] object-contain filter brightness-0 invert opacity-90 mb-4" />
          )}
          <h1 className="font-nunito text-[40px] font-black text-[#FFD32A] uppercase leading-[0.9] tracking-tight">{brandName}</h1>
          <div className="w-[40px] h-[3px] bg-[#0FB1CH] my-4" />
          <h2 className="text-[14px] font-bold tracking-[0.2em] uppercase text-[#0FB1CH]">{headline}</h2>
        </div>

        <div className="self-center bg-[#D2DAE2] p-3 shadow-[6px_6px_0px_#3C40C6]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center text-center w-full">
          <h3 className="text-[16px] font-bold text-[#808E9B] mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full bg-[#3C40C6] text-white p-3 flex justify-between items-center rounded-sm font-nunito">
              <span className="text-[12px] font-bold uppercase tracking-widest">WIFI PASS</span>
              <span className="text-[18px] font-black">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 7. Pizzeria
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

// 8. Juice Bar
export function JuiceBar({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#E8F5E9] text-[#2E7D32] flex flex-col relative overflow-hidden box-border font-nunito">
      <CasualFonts />
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#81C784] rounded-full blur-[60px] opacity-40" />
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-[#FFF176] rounded-full blur-[60px] opacity-40" />
      
      <div className="w-full h-full relative z-10 flex flex-col p-10 justify-between">
        
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <h1 className="text-[34px] font-black tracking-tight text-[#1B5E20]">{brandName}</h1>
            <h2 className="font-quicksand text-[13px] font-bold uppercase tracking-widest text-[#4CAF50]">{headline}</h2>
          </div>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain" />
          )}
        </div>

        <div className="w-full flex justify-center py-8">
          <div className="bg-white/60 p-4 rounded-[30px] border border-white backdrop-blur-md shadow-[0_10px_30px_rgba(46,125,50,0.1)]">
            <div className="bg-white p-2 rounded-[20px]">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply rounded-[12px]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center text-center w-full">
          <h3 className="font-pacifico text-[22px] text-[#2E7D32] mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full bg-[#1B5E20] text-white p-4 rounded-2xl flex justify-between items-center shadow-lg">
              <span className="font-quicksand text-[11px] font-bold uppercase tracking-widest">Connect to WiFi</span>
              <span className="text-[16px] font-black">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 9. Retro Diner
export function RetroDiner({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#E0F7FA] text-[#006064] flex flex-col relative overflow-hidden box-border p-6 border-[8px] border-[#FF5252]">
      <CasualFonts />
      <div className="w-full h-full border-[4px] border-[#00BCD4] rounded-t-full rounded-b-2xl p-8 flex flex-col justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-white/50 bg-blend-multiply">
        
        <div className="flex flex-col items-center text-center mt-12 w-full">
          <div className="bg-[#FF5252] text-white font-nunito font-black px-4 py-1 text-[12px] uppercase tracking-widest rounded-full transform -rotate-3 mb-4 shadow-sm">
            {headline}
          </div>
          <h1 className="font-pacifico text-[42px] text-[#006064] leading-tight drop-shadow-[2px_2px_0px_#FFFFFF]">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] object-contain filter drop-shadow-md mt-2" />
          )}
        </div>

        <div className="bg-white p-3 border-4 border-[#FF5252] rounded-xl shadow-[6px_6px_0px_#00BCD4]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full font-quicksand">
          <h3 className="text-[16px] font-bold text-[#00838F] mb-6 uppercase tracking-wider">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-nunito bg-[#00BCD4] text-white px-8 py-2 rounded-full border-2 border-white shadow-md text-[14px] font-bold">
              WIFI: {wifiPassword}
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
