/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Wifi } from "lucide-react";
import { QrTemplateProps } from "./types";

// 1. Classic Portrait (Swiss Editorial)
export function ClassicPortrait({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#FFFFFF] flex flex-col relative overflow-hidden box-border p-8 border-[1px] border-[#E5E5E5]">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
      `}} />
      
      {/* Strict Swiss Grid Lines */}
      <div className="absolute top-8 bottom-8 left-8 w-[1px] bg-[#E5E5E5] pointer-events-none" />
      <div className="absolute top-8 bottom-8 right-8 w-[1px] bg-[#E5E5E5] pointer-events-none" />
      <div className="absolute top-8 left-8 right-8 h-[1px] bg-[#E5E5E5] pointer-events-none" />
      <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-[#E5E5E5] pointer-events-none" />

      <div className="w-full h-full p-6 flex flex-col items-start justify-between box-border bg-white font-inter">
        
        {/* Extreme typographic contrast header */}
        <div className="flex flex-col items-start w-full">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[32px] h-[32px] object-contain mb-8 filter grayscale" />
          )}
          <h2 className="text-[10px] font-semibold text-[#888] uppercase tracking-[0.3em] mb-2">{headline}</h2>
          <h1 className="text-[48px] font-extrabold text-black leading-[0.9] tracking-tighter w-full hyphens-auto break-words">{brandName}</h1>
        </div>

        {/* Minimalist QR placement */}
        <div className="w-full flex justify-end my-8 border-t border-b border-[#E5E5E5] py-4">
          <div className="bg-white p-1">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>
        </div>

        {/* Structured Footer */}
        <div className="flex flex-col items-start w-full">
          <div className="text-[12px] font-medium text-black tracking-widest uppercase mb-6 bg-[#F5F5F5] px-3 py-1">
            {subtext}
          </div>
          
          {wifiPassword && (
            <div className="w-full border-t border-[#E5E5E5] pt-4 mt-auto">
              <div className="flex justify-between items-center w-full">
                <span className="text-[10px] font-semibold text-[#888] uppercase tracking-widest flex items-center gap-2">
                  <Wifi className="w-3 h-3" /> NETWORK
                </span>
                <span className="text-[14px] font-bold text-black tracking-widest">{wifiPassword}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. Instagram Square (Modern Social Card)
export function InstagramSquare({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[500px] h-[500px] bg-[#FAFAFA] flex items-center justify-center relative overflow-hidden p-8 box-border font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;600;700&display=swap');
      `}} />
      
      {/* iOS-style background blur elements */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#FF3366] rounded-full blur-[80px] opacity-20 mix-blend-multiply" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#00C6FF] rounded-full blur-[80px] opacity-20 mix-blend-multiply" />
      
      {/* Main Card */}
      <div className="w-full h-full bg-white/80 backdrop-blur-[40px] rounded-[32px] border border-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-8 flex flex-col justify-between box-border relative z-10">
        
        {/* Header Profile */}
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <div className="w-[48px] h-[48px] rounded-full p-[2px] bg-gradient-to-tr from-[#FF007A] via-[#7928CA] to-[#FF007A]">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-full h-full rounded-full border-2 border-white object-cover bg-white" />
            </div>
          ) : (
            <div className="w-[48px] h-[48px] rounded-full bg-slate-200" />
          )}
          <div className="flex flex-col">
            <h1 className="text-[18px] font-bold text-slate-900 leading-tight">{brandName}</h1>
            <h2 className="text-[13px] text-slate-500 font-medium">{headline}</h2>
          </div>
        </div>

        {/* Centered QR */}
        <div className="w-full flex justify-center py-4">
          <div className="bg-white p-4 rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-slate-100">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <div className="text-[14px] font-bold text-slate-900 tracking-tight">{subtext}</div>
            <div className="text-[12px] text-slate-500">Scan to view</div>
          </div>
          
          {wifiPassword && (
            <div className="bg-black text-white px-4 py-2 rounded-full text-[13px] font-semibold flex items-center gap-2 shadow-md">
              <Wifi className="w-4 h-4" /> 
              {wifiPassword}
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

// 9. Modern Glass (Apple-style Glassmorphism)
export function ModernGlass({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, colorEnd, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#f5f5f7] p-[20px] box-border relative overflow-hidden flex items-center justify-center rounded-[32px] font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600;700&display=swap');
      `}} />

      {/* Dynamic blurred abstract background */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] rounded-full blur-[100px] opacity-70 mix-blend-multiply" style={{ backgroundColor: colorStart || '#007AFF' }} />
      <div className="absolute -bottom-[10%] -right-[10%] w-[80%] h-[80%] rounded-full blur-[100px] opacity-70 mix-blend-multiply" style={{ backgroundColor: colorEnd || '#FF2D55' }} />
      <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] rounded-full blur-[80px] bg-[#FFF200] opacity-50 mix-blend-multiply" />
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay pointer-events-none" />

      {/* Glass card - true specular highlights */}
      <div className="w-full h-full bg-white/30 backdrop-blur-[60px] rounded-[24px] border border-white/60 shadow-[0_30px_60px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] p-[32px] flex flex-col items-center justify-between box-border z-10 relative">
        
        <div className="flex flex-col items-center w-full text-center">
          {logoUrl && (
            <div className="w-[56px] h-[56px] rounded-[16px] bg-white/50 border border-white/80 shadow-[0_8px_16px_rgba(0,0,0,0.05)] flex items-center justify-center mb-6 p-1.5 backdrop-blur-md">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-full h-full rounded-[10px] object-cover" />
            </div>
          )}
          <h1 className="text-[32px] font-bold text-black tracking-tight leading-none mb-2">{brandName}</h1>
          <h2 className="text-[13px] font-semibold text-black/50 uppercase tracking-widest">{headline}</h2>
        </div>

        <div className="bg-white/70 p-5 rounded-[32px] border border-white shadow-[0_20px_40px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] backdrop-blur-md transition-transform hover:scale-[1.02]">
          <div className="bg-white p-2 rounded-[24px] shadow-sm">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply rounded-[16px]" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full gap-4">
          <div className="text-[15px] font-semibold text-black/80 tracking-wide text-center">{subtext}</div>
          
          {wifiPassword && (
            <div className="w-full bg-black/5 border border-white/40 rounded-[16px] p-4 flex justify-between items-center backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              <span className="text-[12px] font-semibold text-black/50 uppercase flex items-center gap-2">
                <Wifi className="w-4 h-4" /> Wi-Fi
              </span>
              <span className="text-[15px] font-bold text-black">{wifiPassword}</span>
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

// 15. Vintage Cloche (Teal & Gold)
export function VintageCloche({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#293531] text-[#D4AF37] flex flex-col relative overflow-hidden box-border p-6 shadow-inner">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Cinzel:wght@400;600&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-cinzel { font-family: 'Cinzel', serif; }
      `}} />

      {/* Corner Ornaments */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-[#D4AF37] rounded-tl-xl opacity-80" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-[#D4AF37] rounded-tr-xl opacity-80" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-[#D4AF37] rounded-bl-xl opacity-80" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-[#D4AF37] rounded-br-xl opacity-80" />
      
      {/* Decorative Corner Swirls (SVGs) */}
      <svg className="absolute top-3 left-3 w-8 h-8 text-[#D4AF37] opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 2 C 2 2, 2 12, 12 12 C 22 12, 22 22, 12 22" />
      </svg>
      <svg className="absolute top-3 right-3 w-8 h-8 text-[#D4AF37] opacity-60 transform scale-x-[-1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 2 C 2 2, 2 12, 12 12 C 22 12, 22 22, 12 22" />
      </svg>
      <svg className="absolute bottom-3 left-3 w-8 h-8 text-[#D4AF37] opacity-60 transform scale-y-[-1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 2 C 2 2, 2 12, 12 12 C 22 12, 22 22, 12 22" />
      </svg>
      <svg className="absolute bottom-3 right-3 w-8 h-8 text-[#D4AF37] opacity-60 transform scale-[-1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 2 C 2 2, 2 12, 12 12 C 22 12, 22 22, 12 22" />
      </svg>

      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between py-6">
        
        {/* Top Section with Cloche */}
        <div className="flex flex-col items-center w-full relative mt-4">
          <div className="relative w-[280px] h-[120px] flex flex-col items-center justify-center">
            {/* Cloche Dome SVG */}
            <svg className="absolute inset-0 w-full h-full text-[#D4AF37]" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 90 C 20 20, 180 20, 180 90" strokeLinecap="round" />
              <path d="M10 90 C 10 110, 40 110, 40 90" strokeLinecap="round" />
              <path d="M190 90 C 190 110, 160 110, 160 90" strokeLinecap="round" />
              <path d="M90 10 C 90 0, 110 0, 110 10 Z" strokeLinecap="round" />
              <path d="M100 20 V35 M85 25 L95 35 M115 25 L105 35" strokeWidth="1.5" />
            </svg>
            
            <div className="z-10 flex flex-col items-center mt-6 text-center">
              <h2 className="font-cinzel text-[11px] font-bold tracking-[0.3em] uppercase text-[#D4AF37] mb-1">{headline}</h2>
              <h1 className="font-playfair text-[44px] font-bold text-white tracking-wide uppercase leading-none drop-shadow-md">{brandName}</h1>
            </div>
          </div>
        </div>

        {/* Center QR Code Container */}
        <div className="bg-white p-3 shadow-[0_15px_30px_rgba(0,0,0,0.4)] mt-8 mb-4 relative flex items-center justify-center">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
          
          {/* Logo overlay on QR */}
          {logoUrl && (
            <div className="absolute w-[45px] h-[45px] bg-[#E88C5D] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[25px] h-[25px] object-contain filter brightness-0 invert" />
            </div>
          )}
        </div>

        {/* Bottom Text Area */}
        <div className="flex flex-col items-center text-center w-full mt-4">
          <h3 className="font-cinzel text-[16px] font-semibold tracking-widest text-[#D4AF37] uppercase">{subtext}</h3>
          
          {wifiPassword && (
            <div className="mt-6 flex items-center gap-2 font-cinzel text-[12px] text-[#D4AF37]/80 tracking-widest border border-[#D4AF37]/30 px-6 py-2 rounded-full">
              <span>WIFI: {wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 16. Chalkboard Elegance
export function ChalkboardMenu({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#1a1a1a] text-white flex flex-col relative overflow-hidden box-border p-5">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400&display=swap');
        .font-caveat { font-family: 'Caveat', cursive; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}} />
      
      {/* Chalkboard Texture Background */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />

      {/* Double Border Frame */}
      <div className="absolute inset-0 m-4 border-2 border-white/80 rounded-sm pointer-events-none" />
      <div className="absolute inset-0 m-6 border border-white/40 rounded-sm pointer-events-none" />

      {/* Decorative Corner Ornaments */}
      <svg className="absolute top-2 left-2 w-12 h-12 text-white/90" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 25 C 10 10, 25 10, 25 10 M10 25 C 10 40, 25 40, 25 40" />
        <circle cx="20" cy="25" r="3" />
        <path d="M30 15 C 20 20, 20 30, 30 35" />
      </svg>
      <svg className="absolute top-2 right-2 w-12 h-12 text-white/90 transform scale-x-[-1]" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 25 C 10 10, 25 10, 25 10 M10 25 C 10 40, 25 40, 25 40" />
        <circle cx="20" cy="25" r="3" />
        <path d="M30 15 C 20 20, 20 30, 30 35" />
      </svg>
      <svg className="absolute bottom-2 left-2 w-12 h-12 text-white/90 transform scale-y-[-1]" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 25 C 10 10, 25 10, 25 10 M10 25 C 10 40, 25 40, 25 40" />
        <circle cx="20" cy="25" r="3" />
        <path d="M30 15 C 20 20, 20 30, 30 35" />
      </svg>
      <svg className="absolute bottom-2 right-2 w-12 h-12 text-white/90 transform scale-[-1]" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 25 C 10 10, 25 10, 25 10 M10 25 C 10 40, 25 40, 25 40" />
        <circle cx="20" cy="25" r="3" />
        <path d="M30 15 C 20 20, 20 30, 30 35" />
      </svg>

      <div className="w-full h-full relative z-10 flex flex-col items-center justify-between py-10 px-8">
        
        {/* Top Hand-drawn Title */}
        <div className="flex flex-col items-center text-center">
          <h2 className="font-montserrat text-[12px] font-light tracking-[0.4em] uppercase text-white/70 mb-2">{headline}</h2>
          <h1 className="font-caveat text-[70px] font-bold text-white tracking-wide leading-none -rotate-2 drop-shadow-sm">{brandName}</h1>
        </div>

        {/* Center QR Code Container */}
        <div className="bg-white p-3 shadow-lg border border-white/20 mt-6 relative flex items-center justify-center transform rotate-1">
          <div className="absolute inset-0 border border-black/10 pointer-events-none m-1" />
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
          
          {/* Circular Logo overlay */}
          {logoUrl && (
            <div className="absolute w-[40px] h-[40px] bg-[#E88C5D] rounded-full flex items-center justify-center shadow-md border-2 border-white">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[20px] h-[20px] object-contain filter brightness-0 invert" />
            </div>
          )}
        </div>

        {/* Cutlery Graphics */}
        <div className="flex justify-center gap-6 mt-8 opacity-90">
          {/* Fork */}
          <svg width="16" height="80" viewBox="0 0 16 80" fill="none" stroke="white" strokeWidth="1.5" className="opacity-80">
            <path d="M3 5 V25 A 5 5 0 0 0 13 25 V5 M8 5 V20 M8 30 V75" />
          </svg>
          {/* Spoon */}
          <svg width="20" height="80" viewBox="0 0 20 80" fill="none" stroke="white" strokeWidth="1.5" className="opacity-80">
            <ellipse cx="10" cy="15" rx="6" ry="10" />
            <path d="M10 25 V75" />
          </svg>
          {/* Knife */}
          <svg width="12" height="80" viewBox="0 0 12 80" fill="none" stroke="white" strokeWidth="1.5" className="opacity-80">
            <path d="M6 5 C 10 5, 10 30, 6 35 V75 H4 V35 C 0 30, 0 5, 6 5 Z" />
          </svg>
        </div>

        {/* Bottom Text Area */}
        <div className="flex flex-col items-center w-full mt-6 text-center">
          <h3 className="font-montserrat text-[14px] font-light tracking-[0.2em] text-white/90 uppercase text-center mb-6">{subtext}</h3>
          
          {/* Flourish */}
          <svg width="150" height="20" viewBox="0 0 150 20" fill="none" stroke="white" strokeWidth="1.5" className="opacity-60 mb-2">
            <path d="M10 10 Q 30 0, 50 10 T 90 10 T 140 10" strokeLinecap="round" />
            <path d="M60 10 Q 70 20, 80 10" strokeLinecap="round" />
          </svg>
          
          {wifiPassword && (
            <div className="font-montserrat text-[11px] font-light tracking-[0.1em] text-white/60 uppercase">
              WIFI: {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
