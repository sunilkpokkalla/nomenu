/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Wifi } from "lucide-react";
import { QrTemplateProps } from "./types";

// 1. Classic Portrait
export function ClassicPortrait({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-white border border-slate-200 rounded-[20px] flex flex-col relative overflow-hidden" style={{ boxSizing: "border-box" }}>
      <div className="w-full h-4" style={{ backgroundColor: colorStart }} />
      <div className="flex-grow p-[30px] flex flex-col items-center justify-between box-border bg-gradient-to-b from-white to-slate-50">
        <div className="flex flex-col items-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[80px] h-[80px] rounded-full border-[3px] object-cover mb-4 shadow-md" style={{ borderColor: colorStart }} />
          )}
          <h1 className="text-[32px] font-bold text-slate-900 leading-tight text-center">{brandName}</h1>
          <div className="w-[40px] h-[3px] mt-2 mb-4" style={{ backgroundColor: colorEnd }} />
          <h2 className="text-[18px] font-bold text-slate-800 text-center">{headline}</h2>
        </div>

        <div className="border border-slate-200 p-4 rounded-[16px] bg-white shadow-sm">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[240px] h-[240px] object-contain" />
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="px-6 py-2 rounded-full text-white font-bold text-[18px] tracking-wider mb-2 shadow-md" style={{ backgroundColor: colorStart }}>
            {subtext.toUpperCase()}
          </div>
          <p className="text-[12px] font-medium text-slate-500 mb-4">Camera scanning - No apps required</p>
          
          {wifiPassword && (
            <div className="w-full bg-slate-100 border border-slate-200 rounded-[12px] py-3 px-4 text-center">
              <div className="text-[13px] font-bold text-slate-700 flex items-center justify-center gap-1.5 mb-1">
                <Wifi className="w-4 h-4" /> Connect Guest WiFi
              </div>
              <div className="text-[12px] font-semibold text-slate-500">Password: {wifiPassword}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. Instagram Square
export function InstagramSquare({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[500px] h-[500px] rounded-[24px] p-[24px] flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})`, boxSizing: "border-box" }}>
      <div className="w-full h-full bg-white/95 backdrop-blur-xl rounded-[20px] shadow-2xl p-[30px] flex flex-col items-center justify-between box-border">
        <div className="flex flex-col items-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[60px] h-[60px] rounded-full border-[2px] border-slate-200 object-cover mb-2 shadow-sm" />
          )}
          <h1 className="text-[22px] font-extrabold text-slate-900 leading-none mb-1">{brandName}</h1>
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">{headline}</h2>
        </div>

        <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain drop-shadow-md" />

        <div className="flex flex-col items-center w-full gap-2">
          <div className="text-[18px] font-black text-slate-800 tracking-widest">{subtext.toUpperCase()}</div>
          {wifiPassword && (
            <div className="bg-slate-100 px-4 py-1.5 rounded-full text-[11px] font-bold text-slate-600 shadow-inner flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" /> WiFi: {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. Minimalist
export function Minimalist({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[400px] h-[560px] bg-white border-[2px] border-slate-900 p-[6px] box-border relative">
      <div className="w-full h-full border border-slate-900 p-[24px] flex flex-col items-center justify-between box-border">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[28px] font-serif italic text-slate-900 mb-1">{brandName}</h1>
          <div className="text-[12px] font-bold tracking-widest text-slate-400 mb-2">• • •</div>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] rounded-full object-cover grayscale" />
          )}
        </div>

        <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />

        <div className="flex flex-col items-center w-full text-center">
          <div className="w-[120px] h-[1px] bg-slate-900 mb-4" />
          <h2 className="text-[16px] font-bold font-serif text-slate-900 mb-1">{headline}</h2>
          <div className="text-[14px] font-bold text-slate-800 tracking-[0.1em] mb-2">{subtext.toUpperCase()}</div>
          <p className="text-[10px] italic font-serif text-slate-500 mb-4">Please scan code to browse</p>
          
          {wifiPassword && (
            <div className="text-[10px] font-serif text-slate-700">
              WiFi Available | Pass: {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. Neon Cyber
export function NeonCyber({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-slate-950 p-[24px] flex flex-col box-border relative overflow-hidden text-white font-mono" style={{ boxShadow: `inset 0 0 40px ${colorStart}40` }}>
      <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full blur-[80px] pointer-events-none" style={{ backgroundColor: colorStart, opacity: 0.3 }} />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full blur-[80px] pointer-events-none" style={{ backgroundColor: colorEnd, opacity: 0.3 }} />
      
      <div className="relative z-10 w-full h-full border border-white/10 rounded-[16px] bg-black/40 backdrop-blur-md p-[24px] flex flex-col items-center justify-between box-border" style={{ boxShadow: `0 0 20px ${colorEnd}20` }}>
        <div className="flex w-full items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] rounded-md object-cover" style={{ boxShadow: `0 0 10px ${colorStart}` }} />
            )}
            <div>
              <h1 className="text-[16px] font-bold tracking-wider">{brandName.toUpperCase()}</h1>
              <span className="text-[10px] text-slate-400">SYS.MENU.ONLINE</span>
            </div>
          </div>
          <div className="text-[10px] tracking-widest" style={{ color: colorEnd }}>[LIVE]</div>
        </div>

        <div className="relative my-4">
          <div className="absolute -inset-2 bg-gradient-to-r blur-lg opacity-50" style={{ backgroundImage: `linear-gradient(to right, ${colorStart}, ${colorEnd})` }} />
          <div className="relative bg-white p-3 rounded-lg shadow-2xl">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[220px] h-[220px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="w-full border border-white/20 bg-white/5 p-3 flex justify-between items-center rounded-lg">
            <span className="text-[10px] text-slate-400">TARGET:</span>
            <span className="text-[14px] font-bold tracking-widest">{subtext.toUpperCase()}</span>
          </div>
          <div className="w-full border border-white/20 bg-white/5 p-3 flex justify-between items-center rounded-lg">
            <span className="text-[10px] text-slate-400">ACTION:</span>
            <span className="text-[12px] font-bold" style={{ color: colorStart }}>{headline.toUpperCase()}</span>
          </div>
          
          {wifiPassword && (
            <div className="w-full border border-white/20 bg-white/5 p-3 flex justify-between items-center rounded-lg mt-2">
              <span className="text-[10px] text-slate-400 flex items-center gap-1.5"><Wifi className="w-3 h-3" /> NET:</span>
              <span className="text-[12px] font-bold text-slate-200">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 5. Luxury Gold
export function LuxuryGold({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0A0A0A] p-[24px] box-border relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1)_0%,transparent_70%)]" />
      <div className="w-full h-full border-[2px] border-[#D4AF37] p-[4px] relative z-10 box-border">
        <div className="w-full h-full border border-[#D4AF37]/50 flex flex-col items-center justify-between p-[30px] box-border bg-[#0F0F0F]">
          
          <div className="flex flex-col items-center w-full">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-6" />
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[60px] h-[60px] rounded-full object-cover border border-[#D4AF37] mb-4" />
            )}
            <h1 className="text-[28px] font-serif text-[#D4AF37] text-center tracking-widest">{brandName.toUpperCase()}</h1>
            <h2 className="text-[12px] font-light text-slate-300 uppercase tracking-[0.3em] mt-3">{headline}</h2>
          </div>

          <div className="bg-white p-3 border-[2px] border-[#D4AF37]">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain" />
          </div>

          <div className="flex flex-col items-center w-full">
            <h3 className="text-[16px] font-serif text-white tracking-[0.2em] mb-4">{subtext.toUpperCase()}</h3>
            
            {wifiPassword && (
              <div className="flex flex-col items-center gap-1 opacity-80">
                <Wifi className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[10px] text-slate-400 font-light tracking-widest uppercase">Guest Network</span>
                <span className="text-[11px] text-white tracking-widest">{wifiPassword}</span>
              </div>
            )}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. Brutalist
export function Brutalist({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#E5E5E5] flex flex-col relative overflow-hidden box-border border-[4px] border-black">
      <div className="w-full border-b-[4px] border-black bg-[#FF3B30] p-4 flex items-center justify-between" style={{ backgroundColor: colorStart }}>
        <h1 className="text-[24px] font-black text-black uppercase tracking-tighter mix-blend-overlay">{brandName}</h1>
        {logoUrl && (
          <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-cover border-[2px] border-black mix-blend-luminosity" />
        )}
      </div>

      <div className="flex-grow p-[30px] flex flex-col items-center justify-between box-border">
        <div className="w-full">
          <h2 className="text-[48px] font-black text-black leading-[0.9] uppercase break-words text-left tracking-tighter">{headline}</h2>
        </div>

        <div className="border-[4px] border-black bg-white p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[260px] h-[260px] object-contain mix-blend-multiply" />
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="border-[3px] border-black p-3 bg-black text-white text-center">
            <span className="text-[24px] font-black uppercase tracking-widest">{subtext}</span>
          </div>
          
          {wifiPassword && (
            <div className="border-[3px] border-black p-3 bg-white flex justify-between items-center font-bold">
              <span className="uppercase text-[14px]">WiFi PASS:</span>
              <span className="text-[18px]">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 7. Soft Claymorphism
export function Claymorphism({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#E0E5EC] flex items-center justify-center p-[24px] box-border relative overflow-hidden rounded-[40px]">
      <div className="w-full h-full rounded-[30px] bg-[#E0E5EC] p-[30px] flex flex-col items-center justify-between box-border shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]">
        
        <div className="flex flex-col items-center">
          {logoUrl && (
            <div className="w-[80px] h-[80px] rounded-full bg-[#E0E5EC] flex items-center justify-center shadow-[inset_6px_6px_10px_0_rgba(163,177,198,0.6),inset_-6px_-6px_10px_0_rgba(255,255,255,0.5)] mb-4 p-2">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-full h-full rounded-full object-cover" />
            </div>
          )}
          <h1 className="text-[24px] font-extrabold text-slate-700">{brandName}</h1>
          <h2 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">{headline}</h2>
        </div>

        <div className="p-4 rounded-[24px] bg-[#E0E5EC] shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply rounded-xl" />
        </div>

        <div className="flex flex-col items-center w-full gap-4">
          <div className="px-8 py-3 rounded-full bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgb(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
            <span className="text-[16px] font-bold text-slate-600 tracking-wider uppercase">{subtext}</span>
          </div>
          
          {wifiPassword && (
            <div className="w-full rounded-[20px] bg-[#E0E5EC] p-4 text-center shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1 mb-1"><Wifi className="w-3 h-3" /> Guest WiFi</span>
              <span className="text-[14px] font-bold text-slate-600">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 8. Art Deco
export function ArtDeco({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1A2522] border-[8px] border-[#D4AF37] p-[16px] box-border relative overflow-hidden">
      <div className="w-full h-full border-[2px] border-[#D4AF37] p-[2px] box-border">
        <div className="w-full h-full border-[1px] border-[#D4AF37] flex flex-col items-center justify-between p-[24px] box-border">
          
          <div className="flex flex-col items-center w-full relative">
            <div className="w-full flex items-center justify-center mb-6">
              <div className="w-[40px] h-[2px] bg-[#D4AF37]" />
              <div className="w-[10px] h-[10px] rotate-45 border border-[#D4AF37] mx-2" />
              <div className="w-[40px] h-[2px] bg-[#D4AF37]" />
            </div>
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] object-cover grayscale opacity-80 mb-3" />
            )}
            <h1 className="text-[32px] font-serif text-[#D4AF37] uppercase tracking-widest text-center leading-tight">{brandName}</h1>
            <h2 className="text-[11px] font-sans text-slate-300 uppercase tracking-[0.2em] mt-2">{headline}</h2>
          </div>

          <div className="relative p-2">
            <div className="absolute top-0 left-0 w-[20px] h-[20px] border-t-[2px] border-l-[2px] border-[#D4AF37]" />
            <div className="absolute top-0 right-0 w-[20px] h-[20px] border-t-[2px] border-r-[2px] border-[#D4AF37]" />
            <div className="absolute bottom-0 left-0 w-[20px] h-[20px] border-b-[2px] border-l-[2px] border-[#D4AF37]" />
            <div className="absolute bottom-0 right-0 w-[20px] h-[20px] border-b-[2px] border-r-[2px] border-[#D4AF37]" />
            <div className="bg-[#FAF9F6] p-2">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain" />
            </div>
          </div>

          <div className="flex flex-col items-center w-full">
            <h3 className="text-[20px] font-serif text-[#D4AF37] tracking-widest mb-6">{subtext.toUpperCase()}</h3>
            
            {wifiPassword && (
              <div className="flex flex-col items-center text-slate-400">
                <span className="text-[9px] uppercase tracking-[0.1em] font-sans">Complimentary Network</span>
                <span className="text-[12px] font-serif text-[#D4AF37] tracking-widest mt-1">{wifiPassword}</span>
              </div>
            )}
            <div className="w-full flex items-center justify-center mt-6">
              <div className="w-[30px] h-[1px] bg-[#D4AF37]" />
              <div className="w-[6px] h-[6px] rotate-45 bg-[#D4AF37] mx-2" />
              <div className="w-[30px] h-[1px] bg-[#D4AF37]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 9. Modern Glass
export function ModernGlass({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-slate-100 p-[20px] box-border relative overflow-hidden flex items-center justify-center rounded-[24px]">
      {/* Abstract background shapes */}
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full blur-[60px]" style={{ backgroundColor: colorStart, opacity: 0.4 }} />
      <div className="absolute -bottom-20 -right-20 w-[350px] h-[350px] rounded-full blur-[60px]" style={{ backgroundColor: colorEnd, opacity: 0.4 }} />
      <div className="absolute top-[30%] right-[-10%] w-[200px] h-[200px] rounded-full blur-[50px] bg-white opacity-60" />

      {/* Glass card */}
      <div className="w-full h-full bg-white/40 backdrop-blur-2xl rounded-[20px] border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-[30px] flex flex-col items-center justify-between box-border z-10">
        
        <div className="flex flex-col items-center">
          {logoUrl && (
            <div className="w-[60px] h-[60px] rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center mb-4 p-1 backdrop-blur-md">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-full h-full rounded-xl object-cover" />
            </div>
          )}
          <h1 className="text-[26px] font-extrabold text-slate-800 tracking-tight">{brandName}</h1>
          <h2 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mt-1 bg-white/50 px-3 py-1 rounded-full">{headline}</h2>
        </div>

        <div className="bg-white/80 p-4 rounded-[20px] border border-white shadow-sm backdrop-blur-md">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[220px] h-[220px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center w-full gap-3">
          <div className="text-[18px] font-black text-slate-800 tracking-widest">{subtext.toUpperCase()}</div>
          
          {wifiPassword && (
            <div className="w-full bg-white/50 border border-white/60 rounded-2xl p-3 flex justify-between items-center backdrop-blur-md shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5" /> WiFi</span>
              <span className="text-[14px] font-bold text-slate-700">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 10. Polaroid Snapshot
export function PolaroidSnapshot({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#f0f0f0] flex items-center justify-center p-[20px] box-border shadow-inner">
      <div className="w-full h-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex flex-col p-[24px] pb-[60px] box-border relative transform rotate-[-1deg]">
        
        {/* Photo area */}
        <div className="w-full bg-slate-900 aspect-square mb-[24px] p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[280px] h-[280px] object-contain mix-blend-screen opacity-90" />
        </div>

        {/* Text area (marker style) */}
        <div className="flex flex-col items-center flex-grow justify-between font-['Comic_Sans_MS',cursive,sans-serif] text-slate-800">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-[28px] font-bold transform -rotate-1">{brandName}</h1>
            <h2 className="text-[16px] text-slate-500 transform rotate-1 mt-1">{headline}</h2>
          </div>

          <div className="text-[22px] font-bold mt-4 transform -rotate-2">
            #{subtext}
          </div>

          {wifiPassword && (
            <div className="text-[14px] text-slate-600 mt-4 border-t-2 border-dashed border-slate-300 pt-2 w-full text-center">
              wifi: {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 11. Premium Bistro Gold
export function BistroGold({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0c0c0c] text-white flex flex-col relative overflow-hidden p-10 box-border border-2 border-[#c5af7d]/35" style={{ boxSizing: "border-box" }}>
      {/* Import Google Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@200;300;400;500;600&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}} />

      {/* Subtle background glow */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#c5af7d]/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex-grow flex flex-col items-center justify-between z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mt-4">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[50px] h-[50px] rounded-full object-cover border border-[#c5af7d] mb-4 shadow-lg shadow-black/45" />
          )}
          
          <span className="font-montserrat text-[12px] font-light tracking-[0.35em] text-slate-400 uppercase mb-2">
            Welcome To
          </span>
          
          <h1 className="font-cinzel text-[36px] font-normal leading-tight text-[#c5af7d] tracking-[0.18em] uppercase max-w-[360px] break-words">
            {brandName}
          </h1>
          
          <span className="font-montserrat text-[16px] font-medium tracking-[0.25em] text-slate-100 uppercase mt-3">
            {subtext}
          </span>
        </div>

        {/* QR Code Section with Gold Corner Framing */}
        <div className="relative p-5 my-6 flex items-center justify-center">
          {/* Custom Gold Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-[2.5px] border-l-[2.5px] border-[#c5af7d]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-[2.5px] border-r-[2.5px] border-[#c5af7d]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[2.5px] border-l-[2.5px] border-[#c5af7d]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[2.5px] border-r-[2.5px] border-[#c5af7d]" />
          
          <div className="bg-white p-3 rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-[#c5af7d]/10">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain" />
          </div>
        </div>

        {/* Bottom CTA / Wifi Details */}
        <div className="flex flex-col items-center text-center w-full mb-4">
          <span className="font-montserrat text-[11px] font-medium tracking-[0.22em] text-[#c5af7d] uppercase mb-4">
            {headline || "Scan For Digital Menu"}
          </span>

          {wifiPassword && (
            <div className="border border-[#c5af7d]/20 bg-white/[0.02] rounded-full py-1.5 px-6 shadow-inner flex items-center gap-2 max-w-[300px]">
              <span className="font-montserrat text-[9px] font-normal tracking-[0.15em] text-slate-400 uppercase">WiFi:</span>
              <span className="font-montserrat text-[10px] font-semibold tracking-wider text-slate-200">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 12. Vintage Classic
export function VintageClassic({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#f4ebd0] text-[#4a3b32] flex flex-col relative overflow-hidden p-10 box-border border-[12px] border-[#8b7355]/30" style={{ boxSizing: "border-box" }}>
      {/* Import Google Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-lora { font-family: 'Lora', serif; }
      `}} />

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-60 mix-blend-multiply pointer-events-none" />

      <div className="flex-grow flex flex-col items-center justify-between z-10 border-[2px] border-[#8b7355]/40 p-6 relative">
        
        {/* Corner Ornaments */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-[2px] border-l-[2px] border-[#8b7355]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-[2px] border-r-[2px] border-[#8b7355]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-[2px] border-l-[2px] border-[#8b7355]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-[2px] border-r-[2px] border-[#8b7355]" />

        <div className="flex flex-col items-center text-center mt-4">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[60px] h-[60px] rounded-full object-cover border-[3px] border-[#8b7355] mb-4 filter sepia-[0.3]" />
          )}
          
          <h1 className="font-playfair text-[42px] font-bold leading-none tracking-wide text-[#4a3b32] uppercase mb-2 text-center drop-shadow-[1px_1px_0_rgba(255,255,255,0.5)]">
            {brandName}
          </h1>
          
          <div className="flex items-center gap-2 mb-2 opacity-70">
            <div className="w-10 h-[1px] bg-[#8b7355]" />
            <div className="w-2 h-2 rotate-45 bg-[#8b7355]" />
            <div className="w-10 h-[1px] bg-[#8b7355]" />
          </div>

          <h2 className="font-lora text-[14px] italic text-[#6b5847]">
            {headline}
          </h2>
        </div>

        <div className="relative p-2 my-6 bg-white border border-[#8b7355]/30 shadow-[0_4px_15px_rgba(139,115,85,0.2)] transform -rotate-1">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain filter sepia-[0.2] contrast-125 mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center text-center w-full mb-4">
          <h3 className="font-playfair text-[20px] font-bold tracking-widest text-[#4a3b32] uppercase mb-4">
            {subtext}
          </h3>

          {wifiPassword && (
            <div className="font-lora text-[13px] border-t border-b border-[#8b7355]/30 py-2 px-8 flex flex-col items-center">
              <span className="italic text-[#6b5847] mb-1">Guest Network</span>
              <span className="font-bold tracking-widest text-[#4a3b32]">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 13. Retro Vintage
export function RetroVintage({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#d3e3d6] text-[#2c4c3b] flex flex-col relative overflow-hidden p-8 box-border" style={{ boxSizing: "border-box" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=DM+Sans:ital,wght@0,400;0,700;1,400&display=swap');
        .font-abril { font-family: 'Abril Fatface', serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
      `}} />

      <div className="absolute inset-0 border-[20px] border-[#2c4c3b] pointer-events-none" />
      <div className="absolute inset-[24px] border-[2px] border-[#2c4c3b] pointer-events-none" />

      <div className="flex-grow flex flex-col items-center justify-between z-10 pt-10 pb-6 px-6 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] mix-blend-multiply">
        
        <div className="flex flex-col items-center text-center">
          <h2 className="font-dm text-[12px] font-bold tracking-[0.3em] uppercase text-[#2c4c3b] mb-4 border-b-2 border-[#2c4c3b] pb-1">
            EST. 2024
          </h2>
          
          <h1 className="font-abril text-[52px] leading-[0.9] text-[#2c4c3b] uppercase mb-4 text-center">
            {brandName}
          </h1>
          
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[45px] h-[45px] object-contain filter sepia hue-rotate-180 saturate-200 brightness-50" />
          )}
        </div>

        <div className="relative p-3 my-4 bg-[#f9f9f9] border-[3px] border-[#2c4c3b] rounded-md shadow-[4px_4px_0px_#2c4c3b]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[190px] h-[190px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col items-center text-center w-full">
          <div className="font-dm text-[16px] font-bold text-[#2c4c3b] uppercase bg-white border-2 border-[#2c4c3b] px-6 py-2 shadow-[2px_2px_0px_#2c4c3b] mb-4 rotate-2">
            {headline}
          </div>

          <h3 className="font-dm text-[14px] font-bold tracking-widest text-[#2c4c3b] uppercase mb-4">
            — {subtext} —
          </h3>

          {wifiPassword && (
            <div className="font-dm text-[12px] font-bold flex gap-2 items-center bg-[#2c4c3b] text-white px-4 py-2 rounded-full">
              <span className="uppercase tracking-widest opacity-80">WIFI:</span>
              <span className="tracking-wider">{wifiPassword}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
