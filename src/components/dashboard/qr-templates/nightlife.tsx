/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Wifi } from "lucide-react";
import { QrTemplateProps } from "./types";

// Helper to inject Google Fonts
const NightlifeFonts = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');
    .font-syncopate { font-family: 'Syncopate', sans-serif; }
    .font-bebas { font-family: 'Bebas Neue', sans-serif; }
    .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
  `}} />
);

// 1. Neon Tube (Hyper-Realistic Neon)
export function NeonTube({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  const neonColor = colorStart || '#00FFFF';
  
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden box-border p-10 font-rajdhani">
      <NightlifeFonts />
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Monoton&display=swap');
        .font-monoton { font-family: 'Monoton', cursive; }
      `}} />
      
      {/* Brick Wall Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brick-wall-dark.png')] opacity-60 mix-blend-overlay" />
      
      {/* Global Ambient Glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen" style={{ background: `radial-gradient(circle at center, ${neonColor} 0%, transparent 70%)` }} />
      
      <div className="w-full h-full flex flex-col justify-between items-center relative z-10">
        
        {/* Neon Sign Header */}
        <div className="flex flex-col items-center text-center w-full">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain filter brightness-0 invert mb-4 opacity-90" style={{ filter: `drop-shadow(0 0 10px ${neonColor}) drop-shadow(0 0 20px ${neonColor})` }} />
          )}
          
          {/* Off-state tube behind text for realism */}
          <div className="relative">
            <h1 className="font-monoton text-[42px] leading-tight tracking-wider absolute inset-0 text-white/5 blur-[2px]">{brandName}</h1>
            <h1 className="font-monoton text-[42px] leading-tight tracking-wider relative text-white" style={{ textShadow: `0 0 5px #fff, 0 0 10px #fff, 0 0 20px ${neonColor}, 0 0 40px ${neonColor}, 0 0 80px ${neonColor}` }}>
              {brandName}
            </h1>
          </div>
          
          <h2 className="text-[14px] font-bold tracking-[0.4em] uppercase mt-6 text-white/80 border-t border-b py-2 w-full border-white/20" style={{ textShadow: `0 0 10px ${neonColor}` }}>{headline}</h2>
        </div>

        {/* Neon Framed QR */}
        <div className="relative p-1 rounded-2xl" style={{ boxShadow: `0 0 10px ${neonColor}, inset 0 0 10px ${neonColor}` }}>
          <div className="absolute inset-0 rounded-2xl opacity-20 bg-white" />
          <div className="bg-black p-3 rounded-xl border border-white/10 relative z-10">
            <div className="bg-white p-2 rounded-lg">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[170px] h-[170px] object-contain mix-blend-multiply" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full mt-4">
          <h3 className="font-rajdhani text-[14px] uppercase tracking-widest text-white/60 mb-6 font-medium">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full bg-black/60 border-2 rounded-xl p-4 flex justify-between items-center backdrop-blur-md" style={{ borderColor: `${neonColor}80`, boxShadow: `0 0 15px ${neonColor}40, inset 0 0 15px ${neonColor}40` }}>
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 flex items-center gap-2"><Wifi className="w-4 h-4"/> NETWORK</span>
              <span className="text-[18px] font-bold tracking-widest text-white" style={{ textShadow: `0 0 10px ${neonColor}, 0 0 20px ${neonColor}` }}>{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 2. Dark Club
export function DarkClub({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0a0a0a] text-[#ffffff] flex flex-col relative overflow-hidden box-border p-6 font-rajdhani">
      <NightlifeFonts />
      <div className="w-full h-full border border-white/10 p-8 flex flex-col justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        
        <div className="flex flex-col items-center text-center">
          <div className="w-[2px] h-[40px] bg-white/20 mb-6" />
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter brightness-0 invert mb-4 opacity-80" />
          )}
          <h1 className="font-bebas text-[60px] leading-[0.8] tracking-widest uppercase mb-4 text-white/90">{brandName}</h1>
          <h2 className="text-[14px] font-bold tracking-[0.2em] text-white/40 uppercase">{headline}</h2>
        </div>

        <div className="bg-white/5 p-4 rounded-sm border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-sm">
          <div className="bg-[#f0f0f0] p-1">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-bebas text-[24px] tracking-widest text-white/30 mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex flex-col items-center">
              <div className="w-[40px] h-[2px] bg-white/20 mb-2" />
              <div className="text-[14px] font-bold tracking-widest text-white/60">
                WIFI: {wifiPassword}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 3. Cyberpunk (HUD Interface)
export function Cyberpunk({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  const accent = colorStart || '#FCEE0A';
  
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#050505] text-[#fcee0a] flex flex-col relative overflow-hidden box-border font-rajdhani border-[2px]" style={{ borderColor: accent, color: accent }}>
      <NightlifeFonts />
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        .font-tech { font-family: 'Share Tech Mono', monospace; }
      `}} />
      
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, #000 2px, #000 4px)' }} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-50 mix-blend-overlay" />

      {/* Decorative HUD Elements */}
      <div className="absolute top-4 right-4 flex gap-1">
        {[1,2,3,4].map(i => <div key={i} className="w-2 h-4 border border-current opacity-50" style={{ backgroundColor: i < 3 ? accent : 'transparent' }} />)}
      </div>
      <div className="absolute bottom-4 left-4 font-tech text-[10px] opacity-60">
        SYS.REQ // 90.0.12<br/>LOC.TRK // ACTIVE
      </div>
      
      <div className="w-full h-full relative z-10 p-8 flex flex-col justify-between">
        
        <div className="flex flex-col items-start w-full border-l-4 pl-4 mb-6" style={{ borderColor: accent }}>
          <div className="text-black px-2 py-0.5 text-[10px] font-bold tracking-widest mb-3 font-tech" style={{ backgroundColor: accent }}>
            WARNING // AUTHORIZED ONLY
          </div>
          <h1 className="font-syncopate text-[32px] font-bold leading-tight uppercase text-white tracking-tighter drop-shadow-[2px_2px_0_rgba(252,238,10,0.5)]">
            {brandName}
          </h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] object-contain filter brightness-0 invert mt-4 opacity-90" />
          )}
        </div>

        <div className="flex justify-center w-full py-4 relative group">
          {/* Target Reticle Corners */}
          <div className="absolute top-0 left-[10%] w-4 h-4 border-t-2 border-l-2 border-current" />
          <div className="absolute top-0 right-[10%] w-4 h-4 border-t-2 border-r-2 border-current" />
          <div className="absolute bottom-0 left-[10%] w-4 h-4 border-b-2 border-l-2 border-current" />
          <div className="absolute bottom-0 right-[10%] w-4 h-4 border-b-2 border-r-2 border-current" />
          
          <div className="bg-black p-2 border-[1px] border-current shadow-[0_0_15px_rgba(252,238,10,0.2)]">
            <div className="bg-white p-2">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full text-white/90 mt-4">
          <div className="flex justify-between items-end border-b border-white/20 pb-2 mb-3">
            <h2 className="text-[14px] font-bold tracking-[0.2em] uppercase font-tech text-white">{headline}</h2>
            <span className="font-tech text-[10px] uppercase" style={{ color: accent }}>{subtext}</span>
          </div>
          
          {wifiPassword && (
            <div className="w-full p-3 flex justify-between items-center font-tech border border-current bg-black/60 backdrop-blur-sm mt-2">
              <span className="uppercase text-[11px] tracking-widest opacity-80">&gt; NET_KEY</span>
              <span className="text-[16px] font-bold tracking-wider">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 4. Liquid Night
export function LiquidNight({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0c0518] text-white flex flex-col relative overflow-hidden box-border p-8 font-rajdhani">
      <NightlifeFonts />
      <div className="absolute top-0 left-0 w-full h-[50%] opacity-40 mix-blend-screen pointer-events-none" style={{ background: `linear-gradient(180deg, ${colorStart}, transparent)` }} />
      <div className="absolute bottom-0 right-0 w-full h-[50%] opacity-40 mix-blend-screen pointer-events-none" style={{ background: `linear-gradient(0deg, ${colorEnd}, transparent)` }} />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between">
        
        <div className="flex flex-col items-center text-center mt-4">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[60px] h-[60px] object-contain filter brightness-0 invert opacity-90 mb-4" />
          )}
          <h2 className="text-[12px] font-semibold tracking-[0.3em] uppercase text-white/60 mb-2">{headline}</h2>
          <h1 className="font-bebas text-[48px] tracking-wider leading-none">{brandName}</h1>
        </div>

        <div className="relative p-6">
          <div className="absolute inset-0 rounded-full blur-xl opacity-30" style={{ background: `linear-gradient(45deg, ${colorStart}, ${colorEnd})` }} />
          <div className="bg-white/90 p-3 rounded-2xl relative z-10 shadow-2xl backdrop-blur-md">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-syncopate text-[10px] uppercase tracking-[0.2em] text-white/70 mb-6 text-center">{subtext}</h3>
          
          {wifiPassword && (
            <div className="rounded-full px-6 py-2 border border-white/20 bg-white/5 backdrop-blur-sm flex items-center gap-3">
              <Wifi className="w-4 h-4 text-white/60" />
              <span className="text-[14px] font-bold tracking-widest text-white/90">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 5. Speak Easy
export function SpeakEasy({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1a1412] text-[#d4af37] flex flex-col relative overflow-hidden box-border p-6 font-bebas">
      <NightlifeFonts />
      <div className="w-full h-full border border-[#d4af37]/30 p-2">
        <div className="w-full h-full border-2 border-[#d4af37] p-8 flex flex-col items-center justify-between relative bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a1412] px-4">
            <div className="w-[20px] h-[20px] rotate-45 border border-[#d4af37]" />
          </div>

          <div className="flex flex-col items-center text-center mt-4 w-full">
            <h2 className="font-rajdhani text-[12px] font-medium tracking-[0.4em] uppercase text-[#d4af37]/70 mb-2">{headline}</h2>
            <h1 className="text-[52px] tracking-widest leading-[0.9]">{brandName}</h1>
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter sepia hue-rotate-[30deg] saturate-[100%] brightness-75 mt-4" />
            )}
          </div>

          <div className="bg-[#FAF9F6] p-3 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>

          <div className="flex flex-col items-center w-full">
            <h3 className="font-rajdhani text-[14px] uppercase tracking-widest text-[#d4af37]/80 mb-6">{subtext}</h3>
            
            {wifiPassword && (
              <div className="w-full border-t border-[#d4af37]/30 pt-4 flex flex-col items-center font-rajdhani">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]/50">Password Required</span>
                <span className="text-[16px] font-bold tracking-widest mt-1">{wifiPassword}</span>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#1a1412] px-4">
            <div className="w-[20px] h-[20px] rotate-45 border border-[#d4af37]" />
          </div>

        </div>
      </div>
    </div>
  );
}

// 6. Laser Grid
export function LaserGrid({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#020202] text-white flex flex-col relative overflow-hidden box-border font-rajdhani">
      <NightlifeFonts />
      <div className="absolute bottom-0 left-0 w-full h-[50%] opacity-20 pointer-events-none" style={{
        backgroundImage: `linear-gradient(transparent 95%, ${colorStart} 100%), linear-gradient(90deg, transparent 95%, ${colorEnd} 100%)`,
        backgroundSize: '30px 30px',
        transform: 'perspective(500px) rotateX(60deg) scale(2)',
        transformOrigin: 'bottom center'
      }} />
      
      <div className="w-full h-full relative z-10 flex flex-col p-10 justify-between items-center">
        
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] object-contain filter brightness-0 invert mb-4" />
          )}
          <h1 className="font-syncopate text-[26px] font-bold uppercase tracking-widest leading-tight" style={{ color: colorStart }}>{brandName}</h1>
          <h2 className="text-[14px] text-white/50 tracking-widest uppercase mt-2">{headline}</h2>
        </div>

        <div className="relative p-1 bg-gradient-to-br rounded-sm" style={{ backgroundImage: `linear-gradient(to bottom right, ${colorStart}, ${colorEnd})` }}>
          <div className="bg-black p-3">
            <div className="bg-white p-2">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain mix-blend-multiply" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-syncopate text-[11px] text-white/80 uppercase tracking-widest mb-6 text-center">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex items-center gap-3 border border-white/20 px-6 py-2 bg-black/50 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">NET</span>
              <span className="text-[14px] font-bold tracking-widest" style={{ color: colorEnd }}>{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 7. Synthwave
export function Synthwave({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1a0b2e] text-[#ff00ff] flex flex-col relative overflow-hidden box-border p-8 font-rajdhani">
      <NightlifeFonts />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-b from-[#ff00ff] to-[#00ffff] rounded-full blur-[100px] opacity-20 pointer-events-none" />
      
      <div className="w-full h-full border-2 border-[#00ffff]/30 rounded-3xl p-6 relative z-10 flex flex-col items-center justify-between bg-black/20 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,255,0.1)]">
        
        <div className="flex flex-col items-center text-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain filter drop-shadow-[0_0_10px_#ff00ff] mb-4" />
          )}
          <h1 className="font-syncopate text-[28px] font-bold text-[#00ffff] uppercase tracking-widest drop-shadow-[0_0_10px_#00ffff]">{brandName}</h1>
          <h2 className="text-[14px] font-semibold tracking-widest text-white mt-2">{headline}</h2>
        </div>

        <div className="bg-[#ff00ff] p-1 rounded-xl shadow-[0_0_20px_#ff00ff]">
          <div className="bg-white p-3 rounded-lg">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#00ffff] mb-4">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full bg-[#ff00ff]/10 border border-[#ff00ff]/50 rounded-xl p-3 flex justify-between items-center text-white">
              <span className="text-[12px] uppercase tracking-widest">WIFI</span>
              <span className="text-[16px] font-bold tracking-widest text-[#00ffff]">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 8. VIP Lounge
export function VIPLounge({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0A0A0E] text-[#E5E5E5] flex flex-col relative overflow-hidden box-border p-10 font-rajdhani">
      <NightlifeFonts />
      <div className="w-full h-full flex flex-col items-center justify-between relative z-10">
        
        <div className="flex flex-col items-center text-center w-full border-b border-white/10 pb-8">
          <h2 className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase mb-4">VIP Access</h2>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter brightness-0 invert opacity-80 mb-4" />
          )}
          <h1 className="font-bebas text-[42px] tracking-[0.1em] text-white">{brandName}</h1>
          <h3 className="text-[14px] font-semibold tracking-widest text-white/50 uppercase mt-2">{headline}</h3>
        </div>

        <div className="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="bg-white p-3 rounded-2xl">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-syncopate text-[10px] uppercase tracking-[0.2em] text-white/40 mb-6 text-center leading-relaxed">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-bebas text-[20px] tracking-widest text-white/80 bg-white/10 px-8 py-2 rounded-full border border-white/20">
              PASS: {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 9. Industrial Techno
export function IndustrialTechno({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#111111] text-[#ffffff] flex flex-col relative overflow-hidden box-border font-rajdhani border-l-[20px] border-[#333333]">
      <NightlifeFonts />
      <div className="absolute top-0 right-0 w-full h-[20px] bg-[#333333]" />
      <div className="absolute bottom-0 right-0 w-full h-[20px] bg-[#333333]" />
      <div className="absolute top-0 right-0 w-[20px] h-full bg-[#333333]" />
      
      <div className="w-full h-full p-12 flex flex-col justify-between">
        
        <div className="flex flex-col items-start w-full">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[30px] h-[30px] object-contain filter brightness-0 invert opacity-50 mb-4" />
          )}
          <h2 className="font-syncopate text-[10px] text-white/40 tracking-[0.2em] uppercase mb-1">{headline}</h2>
          <h1 className="font-bebas text-[54px] leading-[0.85] tracking-widest uppercase">{brandName}</h1>
        </div>

        <div className="bg-[#222222] p-4 self-start border-l-[4px] border-[#ffffff]">
          <div className="bg-white p-2">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[150px] h-[150px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col w-full border-t-[2px] border-white/20 pt-4">
          <h3 className="text-[13px] font-bold uppercase tracking-widest text-white/70 mb-4">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex items-center gap-4 text-white/90">
              <span className="font-syncopate text-[9px] uppercase tracking-widest border border-white/40 px-2 py-1">Network</span>
              <span className="text-[16px] font-bold tracking-widest">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 10. Abstract Bass
export function AbstractBass({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#000000] text-white flex flex-col relative overflow-hidden box-border font-rajdhani">
      <NightlifeFonts />
      {/* Abstract geometric background */}
      <div className="absolute top-[20%] left-[-20%] w-[150%] h-[150px] transform -rotate-45 mix-blend-screen opacity-50" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${colorStart}, transparent)` }} />
      <div className="absolute bottom-[20%] right-[-20%] w-[150%] h-[150px] transform -rotate-45 mix-blend-screen opacity-50" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${colorEnd}, transparent)` }} />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between p-10">
        
        <div className="flex flex-col items-center text-center w-full">
          <h1 className="font-syncopate text-[32px] font-bold tracking-tighter uppercase mb-2">{brandName}</h1>
          <h2 className="text-[14px] font-medium tracking-[0.3em] text-white/60 uppercase">{headline}</h2>
        </div>

        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r blur-lg opacity-40 rounded-xl" style={{ backgroundImage: `linear-gradient(to right, ${colorStart}, ${colorEnd})` }} />
          <div className="bg-white p-3 rounded-xl relative z-10">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <h3 className="text-[12px] uppercase tracking-widest text-white/80 mb-4 text-center">{subtext}</h3>
          
          {wifiPassword && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">WIFI:</span>
              <span className="font-bebas text-[20px] tracking-wider">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 11. Confetti Party
export function ConfettiParty({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#ffffff] text-black flex flex-col relative overflow-hidden box-border p-8 font-rajdhani border-8" style={{ borderColor: colorStart }}>
      <NightlifeFonts />
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none bg-[radial-gradient(circle,rgba(0,0,0,0.1)_2px,transparent_2px)]" style={{ backgroundSize: '20px 20px' }} />
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full mix-blend-multiply opacity-50 blur-xl" style={{ backgroundColor: colorEnd }} />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full mix-blend-multiply opacity-50 blur-xl" style={{ backgroundColor: colorStart }} />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between bg-white/80 backdrop-blur-sm p-6 rounded-3xl border-4" style={{ borderColor: colorEnd }}>
        
        <div className="flex flex-col items-center text-center">
          <h2 className="text-[14px] font-bold tracking-widest uppercase mb-2" style={{ color: colorEnd }}>{headline}</h2>
          <h1 className="font-bebas text-[54px] leading-none tracking-wider drop-shadow-sm mb-4" style={{ color: colorStart }}>{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain" />
          )}
        </div>

        <div className="bg-white p-3 rounded-2xl shadow-xl transform rotate-2 border-2" style={{ borderColor: colorStart }}>
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain" />
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-syncopate text-[12px] uppercase tracking-widest mb-6 text-center font-bold" style={{ color: colorEnd }}>{subtext}</h3>
          
          {wifiPassword && (
            <div className="rounded-full px-6 py-2 border-2 flex items-center gap-3 bg-white" style={{ borderColor: colorStart }}>
              <Wifi className="w-5 h-5" style={{ color: colorEnd }} />
              <span className="text-[16px] font-black tracking-widest text-black">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 12. Disco Fever
export function DiscoFever({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1a1a2e] text-[#e94560] flex flex-col relative overflow-hidden box-border p-6 font-bebas border-[10px] border-[#0f3460]">
      <NightlifeFonts />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[2px] border-[#e94560]/30 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-[1px] border-[#0f3460]/50 rounded-full" />
      
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between text-center p-6 bg-gradient-to-b from-[#1a1a2e]/90 to-[#1a1a2e]/90 backdrop-blur-sm rounded-xl">
        
        <div className="flex flex-col items-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-contain filter drop-shadow-[0_0_10px_#e94560] mb-4" />
          )}
          <h1 className="text-[64px] tracking-wider leading-[0.8] drop-shadow-[4px_4px_0_#0f3460] text-white">{brandName}</h1>
          <h2 className="font-rajdhani text-[16px] font-bold tracking-[0.2em] text-[#e94560] uppercase mt-4 bg-[#0f3460] px-4 py-1">{headline}</h2>
        </div>

        <div className="bg-white p-3 rounded-full shadow-[0_0_40px_rgba(233,69,96,0.5)]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain rounded-[40px] mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className="font-rajdhani text-[14px] uppercase tracking-widest text-white/80 mb-6">{subtext}</h3>
          
          {wifiPassword && (
            <div className="w-full flex justify-between items-center bg-[#0f3460] border border-[#e94560] p-4 font-rajdhani">
              <span className="text-[14px] uppercase tracking-widest text-[#e94560] font-bold">DISCO NET</span>
              <span className="text-[18px] font-bold tracking-widest text-white">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
