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

// 2. Brutalist Pop (Neo-Brutalist)
export function BrutalistPop({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  // Use a bright, aggressive background if colorStart isn't provided or is too dark
  const bg = colorStart && colorStart !== '#000000' && colorStart !== '#ffffff' ? colorStart : '#FFE600';
  
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#f4f4f0] text-black flex flex-col relative overflow-hidden box-border font-cabinet border-[8px] border-black p-6">
      <CreativeFonts />
      
      {/* Background Pop Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      <div className="w-full h-full flex flex-col justify-between relative z-10">
        
        {/* Header Ticket */}
        <div className="w-full bg-white border-[4px] border-black shadow-[6px_6px_0_0_#000] p-4 flex items-center justify-between mb-6 transform -rotate-1">
          <div className="flex items-center gap-3">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain border-[2px] border-black bg-white" />
            )}
            <h2 className="text-[14px] font-black uppercase tracking-[0.2em]">{headline}</h2>
          </div>
          <div className="bg-black text-white px-3 py-1 font-bold text-[12px] uppercase">
            SCAN
          </div>
        </div>

        {/* Brand Name Banner */}
        <div className="w-[110%] -ml-[5%] bg-black text-white p-4 py-6 transform rotate-2 shadow-[0_10px_0_0_#00000040] mb-8 relative z-20" style={{ backgroundColor: bg }}>
          <h1 className="text-[48px] font-black uppercase leading-[0.8] tracking-tighter text-center" style={{ color: '#000', textShadow: '2px 2px 0 #fff' }}>
            {brandName}
          </h1>
        </div>

        {/* QR Code Block */}
        <div className="self-center bg-white border-[6px] border-black p-2 shadow-[12px_12px_0_0_#000] transform -rotate-2 relative z-10 mb-8 transition-transform hover:rotate-0 hover:translate-y-1 hover:shadow-[6px_6px_0_0_#000]">
          <div className="absolute -top-4 -right-4 bg-[#FF3366] text-white border-2 border-black font-black px-3 py-1 text-[12px] rotate-12 shadow-[4px_4px_0_0_#000]">
            HERE
          </div>
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[190px] h-[190px] object-contain mix-blend-multiply" />
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <div className="bg-white border-[4px] border-black shadow-[6px_6px_0_0_#000] p-3 text-center">
            <h3 className="text-[16px] font-black uppercase tracking-widest">{subtext}</h3>
          </div>
          
          {wifiPassword && (
            <div className="bg-[#00E5FF] border-[4px] border-black shadow-[6px_6px_0_0_#000] p-3 flex justify-between items-center text-[14px]">
              <span className="font-black uppercase tracking-widest">WIFI PWD</span>
              <span className="bg-white border-[2px] border-black px-3 py-1 font-black text-[16px]">{wifiPassword}</span>
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

// 7. Holographic Iridescent
export function Holographic({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] text-white flex flex-col relative overflow-hidden box-border p-8 font-syne border-[1px] border-white/40" 
      style={{ 
        background: 'linear-gradient(135deg, #f1f2f6 0%, #ffffff 20%, #fbd5e1 35%, #b2f1f8 50%, #eadaff 65%, #ffffff 80%, #f1f2f6 100%)',
        boxShadow: 'inset 0 0 60px rgba(255,255,255,0.8)'
      }}>
      <CreativeFonts />
      
      {/* Iridescent shimmer overlay */}
      <div className="absolute inset-0 opacity-40 mix-blend-color-burn" style={{ background: 'linear-gradient(45deg, rgba(255,0,0,0.1), rgba(0,255,0,0.1), rgba(0,0,255,0.1))' }} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 opacity-50 mix-blend-overlay" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.8), transparent 60%)' }} />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between bg-white/20 backdrop-blur-xl border-[2px] border-white/60 rounded-[30px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05),inset_0_0_20px_rgba(255,255,255,0.8)]">
        
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <div className="w-[60px] h-[60px] rounded-[18px] bg-white/50 backdrop-blur-md p-2 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-white mb-4">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-full h-full object-contain filter drop-shadow-sm" />
            </div>
          )}
          <h1 className="text-[38px] font-extrabold tracking-tight mb-2 text-slate-800 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)] leading-[1.1]">{brandName}</h1>
          <h2 className="font-cabinet text-[12px] font-bold uppercase tracking-[0.2em] bg-white/70 text-slate-600 px-5 py-2 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-white/80">{headline}</h2>
        </div>

        <div className="relative group">
          {/* Holographic glowing ring around QR */}
          <div className="absolute -inset-2 rounded-[32px] blur-xl opacity-60 animate-pulse" style={{ background: 'linear-gradient(90deg, #ff9a9e, #fecfef, #a1c4fd, #c2e9fb)' }} />
          <div className="bg-white/90 p-4 rounded-[28px] relative z-10 border-2 border-white backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <div className="relative overflow-hidden rounded-[16px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30 mix-blend-overlay" />
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply opacity-90" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-cabinet text-[15px] font-bold text-center mb-6 text-slate-700 drop-shadow-[0_1px_2px_rgba(255,255,255,1)] uppercase tracking-wider">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full bg-white/60 border border-white rounded-[20px] p-3 flex justify-between items-center backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
              <span className="text-[11px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-2"><Wifi className="w-4 h-4"/> WiFi</span>
              <span className="text-[15px] font-black text-slate-800">{wifiPassword}</span>
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
