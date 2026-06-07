/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Wifi } from "lucide-react";
import { QrTemplateProps } from "./types";

// Helper to inject Google Fonts
const CreativeFonts = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Cabinet+Grotesk:wght@400;500;700;900&family=Knewave&display=swap');
    .font-syne { font-family: 'Syne', sans-serif; }
    .font-cabinet { font-family: 'Cabinet Grotesk', sans-serif; }
    .font-knewave { font-family: 'Knewave', cursive; }
  `}} />
);

// 1. Fluid Gradient
export function FluidGradient({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] text-white flex flex-col relative overflow-hidden box-border p-8 font-cabinet" style={{ background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})` }}>
      <CreativeFonts />
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between bg-white/10 backdrop-blur-xl border border-white/30 rounded-[32px] p-8 shadow-2xl">
        
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[60px] h-[60px] object-contain filter drop-shadow-lg mb-4" />
          )}
          <h1 className="font-syne text-[40px] font-extrabold tracking-tighter leading-none mb-2">{brandName}</h1>
          <h2 className="text-[14px] font-medium tracking-widest uppercase opacity-80">{headline}</h2>
        </div>

        <div className="relative p-1 rounded-3xl bg-gradient-to-br from-white/40 to-white/5">
          <div className="bg-white/90 p-4 rounded-2xl backdrop-blur-md">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-syne text-[16px] font-bold uppercase tracking-wider mb-6 text-center">{subtext}</h3>
          
          {wifiPassword && (
            <div className="bg-white/20 px-6 py-2 rounded-full border border-white/40 flex items-center gap-2 backdrop-blur-md">
              <Wifi className="w-4 h-4 opacity-80" />
              <span className="text-[14px] font-bold">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 2. Brutalist Pop
export function BrutalistPop({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#E5E5E5] text-black flex flex-col relative overflow-hidden box-border font-syne border-[12px] border-black">
      <CreativeFonts />
      
      <div className="w-full flex items-center justify-between border-b-[6px] border-black p-4" style={{ backgroundColor: colorStart }}>
        {logoUrl && (
          <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter brightness-0" />
        )}
        <h2 className="text-[12px] font-bold uppercase tracking-widest">{headline}</h2>
      </div>

      <div className="w-full p-6">
        <h1 className="text-[54px] font-black uppercase leading-[0.85] tracking-tighter break-words">{brandName}</h1>
      </div>

      <div className="flex-grow flex flex-col justify-end p-6 border-t-[6px] border-black bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]">
        
        <div className="self-end bg-white p-3 border-[4px] border-black shadow-[8px_8px_0_0_#000] transform -rotate-3 hover:rotate-0 transition-transform mb-8">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
        </div>

        <div className="w-full bg-black text-white p-4 font-cabinet">
          <h3 className="text-[18px] font-bold uppercase tracking-wider mb-2">{subtext}</h3>
          {wifiPassword && (
            <div className="flex justify-between items-center border-t border-white/20 pt-2 text-[14px]">
              <span className="opacity-60">WIFI PWD</span>
              <span className="font-black" style={{ color: colorStart }}>{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 3. Glass Orbs
export function GlassOrbs({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#f0f2f5] text-[#1c1d20] flex flex-col relative overflow-hidden box-border font-cabinet">
      <CreativeFonts />
      <div className="absolute top-10 left-10 w-[200px] h-[200px] rounded-full blur-[40px] mix-blend-multiply opacity-60" style={{ backgroundColor: colorStart }} />
      <div className="absolute bottom-10 right-10 w-[250px] h-[250px] rounded-full blur-[40px] mix-blend-multiply opacity-60" style={{ backgroundColor: colorEnd }} />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between p-10">
        
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <div className="w-[60px] h-[60px] rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 p-2 shadow-sm mb-4">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <h1 className="font-syne text-[36px] font-bold tracking-tight mb-2">{brandName}</h1>
          <h2 className="text-[14px] font-medium text-slate-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm px-4 py-1 rounded-full">{headline}</h2>
        </div>

        <div className="bg-white/60 p-4 rounded-[32px] backdrop-blur-xl border border-white shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="text-[16px] font-bold text-slate-700 mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="bg-white text-slate-800 px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 font-semibold text-[14px]">
              <Wifi className="w-4 h-4 text-slate-400" />
              {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 4. Funky Retro
export function FunkyRetro({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FFE0B2] text-[#4E342E] flex flex-col relative overflow-hidden box-border p-6 font-syne">
      <CreativeFonts />
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/retina-wood.png')]" />
      
      <div className="w-full h-full border-4 border-[#4E342E] rounded-[40px] flex flex-col p-8 justify-between relative bg-[#FFCC80] overflow-hidden shadow-inner">
        
        {/* Retro rays */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none" style={{
          background: `repeating-conic-gradient(from 0deg, ${colorStart} 0deg 15deg, transparent 15deg 30deg)`
        }} />

        <div className="relative z-10 flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain filter drop-shadow-[2px_2px_0_#4E342E] mb-2" />
          )}
          <h1 className="font-knewave text-[48px] text-[#FF5722] drop-shadow-[3px_3px_0_#4E342E] leading-tight transform -rotate-2">{brandName}</h1>
          <h2 className="text-[14px] font-bold tracking-widest uppercase mt-4 bg-[#4E342E] text-[#FFE0B2] px-4 py-1 rounded-full">{headline}</h2>
        </div>

        <div className="relative z-10 bg-[#FFF3E0] p-4 rounded-3xl border-4 border-[#4E342E] shadow-[8px_8px_0_0_#4E342E] transform rotate-2 self-center">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
        </div>

        <div className="relative z-10 flex flex-col items-center w-full">
          <h3 className="text-[18px] font-bold uppercase mb-6 text-center">{subtext}</h3>
          
          {wifiPassword && (
            <div className="bg-[#FF5722] text-white border-2 border-[#4E342E] shadow-[4px_4px_0_0_#4E342E] px-6 py-2 rounded-xl flex gap-3 items-center font-bold">
              <span className="uppercase text-[12px] opacity-80">WIFI:</span>
              <span className="text-[16px]">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 5. Y2K Aesthetic
export function Y2KAesthetic({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-gradient-to-b from-[#C4B5FD] to-[#FBCFE8] text-[#4C1D95] flex flex-col relative overflow-hidden box-border p-6 font-syne">
      <CreativeFonts />
      
      <div className="w-full h-full border-[3px] border-[#8B5CF6] rounded-[24px] flex flex-col items-center justify-between p-6 relative bg-white/20 backdrop-blur-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]">
        
        {/* Star stickers */}
        <div className="absolute top-4 left-4 w-6 h-6 bg-[#FDE047] rotate-45" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
        <div className="absolute bottom-10 right-4 w-8 h-8 bg-[#60A5FA] -rotate-12" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />

        <div className="flex flex-col items-center text-center mt-6 w-full">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] object-contain mb-4" />
          )}
          <h1 className="text-[42px] font-black italic tracking-tighter uppercase text-white drop-shadow-[2px_2px_0_#8B5CF6]">{brandName}</h1>
          <div className="bg-[#8B5CF6] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest mt-2 uppercase">{headline}</div>
        </div>

        <div className="bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] p-1 rounded-2xl shadow-xl transform -rotate-2">
          <div className="bg-white p-3 rounded-xl">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full bg-white/40 p-4 rounded-xl border border-white/50 backdrop-blur-md">
          <h3 className="text-[14px] font-bold text-center mb-4 text-[#8B5CF6]">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex items-center gap-2 font-cabinet font-black text-[15px]">
              <span className="text-[#EC4899]">NET:</span>
              <span className="bg-white px-3 py-1 rounded-md shadow-sm">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 6. Architectural
export function Architectural({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#F4F4F4] text-[#111111] flex flex-col relative overflow-hidden box-border font-cabinet border-[1px] border-[#D1D1D1]">
      <CreativeFonts />
      <div className="absolute top-0 right-0 w-[200px] h-full bg-[#E8E8E8] border-l-[1px] border-[#D1D1D1]" />
      
      <div className="w-full h-full relative z-10 p-10 flex flex-col justify-between">
        
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-[60%]">
            <h1 className="font-syne text-[32px] font-bold uppercase leading-[0.9] tracking-tighter mb-4">{brandName}</h1>
            <h2 className="text-[11px] font-medium tracking-[0.2em] uppercase text-slate-500">{headline}</h2>
          </div>
          <div className="w-[30%] flex justify-end">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain grayscale" />
            )}
          </div>
        </div>

        <div className="w-full flex justify-start py-10 relative">
          <div className="absolute top-1/2 left-[10%] w-[120%] h-[1px] bg-[#D1D1D1]" />
          <div className="bg-white p-4 border-[1px] border-[#111111] shadow-[10px_10px_0_0_#E8E8E8] relative z-10 ml-4">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col w-full text-right items-end mt-4">
          <h3 className="text-[16px] font-bold uppercase tracking-widest w-[80%] mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="border border-[#111111] p-3 w-[60%] flex justify-between items-center text-[13px] bg-white">
              <span className="font-medium text-slate-500 uppercase">WiFi</span>
              <span className="font-bold">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 7. Holographic
export function Holographic({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] text-[#ffffff] flex flex-col relative overflow-hidden box-border p-8 font-syne" style={{ background: 'linear-gradient(125deg, #FFB8D2, #E8B0FF, #B0C4FF, #B0FFED)' }}>
      <CreativeFonts />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-20 mix-blend-overlay pointer-events-none" />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between bg-white/20 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
        
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <div className="w-[50px] h-[50px] rounded-full bg-white/40 p-2 shadow-inner mb-4">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-full h-full object-contain filter drop-shadow-sm" />
            </div>
          )}
          <h1 className="text-[34px] font-bold tracking-tight mb-2 drop-shadow-md">{brandName}</h1>
          <h2 className="font-cabinet text-[13px] font-semibold uppercase tracking-[0.2em] bg-white/30 px-4 py-1 rounded-full shadow-sm">{headline}</h2>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-white/60 to-white/10 rounded-[28px] blur-md opacity-70" />
          <div className="bg-white/80 p-4 rounded-[24px] relative z-10 border border-white backdrop-blur-md shadow-xl">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply opacity-90" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-cabinet text-[16px] font-bold text-center mb-6 drop-shadow-sm max-w-[250px]">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full bg-white/30 border border-white/50 rounded-2xl p-3 flex justify-between items-center backdrop-blur-sm shadow-sm">
              <span className="text-[12px] uppercase tracking-widest font-bold">Network</span>
              <span className="text-[16px] font-black">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 8. Monospace Terminal
export function MonospaceTerminal({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0D1117] text-[#58A6FF] flex flex-col relative overflow-hidden box-border p-6 font-mono text-[14px]">
      <div className="w-full h-full border border-[#30363D] bg-[#161B22] p-6 flex flex-col">
        
        {/* Terminal Header */}
        <div className="flex items-center gap-2 border-b border-[#30363D] pb-4 mb-6">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          <span className="ml-2 text-[#8B949E] text-[12px]">bash - {brandName.toLowerCase().replace(/\s+/g, '-')}</span>
        </div>

        <div className="flex-grow flex flex-col">
          <div className="text-[#3FB950] mb-2">$ ./start_menu.sh</div>
          
          <div className="flex items-start gap-4 mb-8">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[32px] h-[32px] object-contain filter brightness-0 invert opacity-80" />
            )}
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold text-[#C9D1D9] uppercase">{brandName}</h1>
              <h2 className="text-[#8B949E]">{headline}</h2>
            </div>
          </div>

          <div className="text-[#3FB950] mb-2">$ generate_qr --target=digital_menu</div>
          
          <div className="bg-[#0D1117] border border-[#30363D] p-4 self-start mb-8 inline-block">
            <div className="bg-white p-2">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain mix-blend-multiply" />
            </div>
          </div>

          <div className="text-[#3FB950] mb-2">$ cat info.txt</div>
          <div className="text-[#C9D1D9] mb-4">&gt;&gt; {subtext}</div>

          {wifiPassword && (
            <>
              <div className="text-[#3FB950] mb-2">$ get_network_credentials</div>
              <div className="text-[#C9D1D9] border-l-2 border-[#58A6FF] pl-4">
                SSID: GUEST_NETWORK<br/>
                PASS: <span className="font-bold text-white">{wifiPassword}</span>
              </div>
            </>
          )}

          <div className="mt-auto flex items-center text-[#3FB950] animate-pulse">_</div>
        </div>

      </div>
    </div>
  );
}

// 9. Pop Art
export function PopArt({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FFEB3B] text-[#111] flex flex-col relative overflow-hidden box-border p-6 font-syne border-[8px] border-[#E91E63]">
      <CreativeFonts />
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/polka-dots.png')]" />
      
      <div className="w-full h-full border-4 border-[#111] bg-white p-6 relative flex flex-col items-center justify-between shadow-[12px_12px_0_0_#2196F3]">
        
        <div className="w-full flex justify-between items-start mb-4 relative z-10">
          <div className="bg-[#E91E63] text-white font-bold uppercase tracking-widest px-3 py-1 transform -rotate-3 border-2 border-[#111] shadow-[4px_4px_0_0_#111]">
            {headline}
          </div>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain border-2 border-[#111] bg-[#FFEB3B] p-1 shadow-[4px_4px_0_0_#111]" />
          )}
        </div>

        <h1 className="text-[48px] font-black uppercase text-center leading-[0.9] text-[#2196F3] drop-shadow-[3px_3px_0_#111] relative z-10 mb-6">{brandName}</h1>

        <div className="bg-[#FFEB3B] p-3 border-4 border-[#111] shadow-[8px_8px_0_0_#E91E63] transform rotate-2 relative z-10 mb-8">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full relative z-10 text-center font-cabinet">
          <h3 className="text-[18px] font-black uppercase mb-4 bg-white border-2 border-[#111] px-4 py-2 transform -rotate-1">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full bg-[#2196F3] text-white border-4 border-[#111] shadow-[6px_6px_0_0_#111] p-3 flex justify-between items-center text-[16px]">
              <span className="font-bold uppercase tracking-widest">WIFI:</span>
              <span className="font-black text-[20px]">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 10. Split Screen
export function SplitScreen({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-white text-[#111] flex flex-col relative overflow-hidden box-border font-cabinet border-[1px] border-[#e0e0e0]">
      <CreativeFonts />
      <div className="flex flex-col h-full w-full">
        
        {/* Top Half */}
        <div className="w-full h-[55%] flex flex-col justify-between p-10 bg-slate-50 relative overflow-hidden border-b border-slate-200">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-slate-200 rounded-full blur-3xl opacity-50" />
          
          <div className="flex justify-between items-start w-full relative z-10">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] object-contain grayscale" />
            )}
            <span className="font-syne text-[10px] font-bold uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-full">{headline}</span>
          </div>

          <div className="relative z-10">
            <h1 className="font-syne text-[40px] font-bold uppercase tracking-tighter leading-none mb-2">{brandName}</h1>
            <h3 className="text-[14px] font-medium text-slate-500 uppercase tracking-widest">{subtext}</h3>
          </div>
        </div>

        {/* Bottom Half */}
        <div className="w-full h-[45%] flex p-10 justify-between items-end" style={{ backgroundColor: colorStart }}>
          
          <div className="bg-white p-3 shadow-lg rounded-2xl transform -translate-y-[80px]">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain mix-blend-multiply" />
          </div>

          {wifiPassword && (
            <div className="flex flex-col text-right text-white max-w-[120px]">
              <span className="text-[10px] uppercase tracking-widest opacity-80 mb-1">Wifi Network</span>
              <span className="text-[16px] font-bold break-words">{wifiPassword}</span>
            </div>
          )}
          
        </div>

      </div>
    </div>
  );
}
