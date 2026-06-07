/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Wifi } from "lucide-react";
import { QrTemplateProps } from "./types";

// Helper to inject Google Fonts
const MinimalistFonts = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;900&family=Space+Grotesk:wght@300;400;600;700&family=Outfit:wght@300;400;600;800&display=swap');
    .font-inter { font-family: 'Inter', sans-serif; }
    .font-space { font-family: 'Space Grotesk', sans-serif; }
    .font-outfit { font-family: 'Outfit', sans-serif; }
  `}} />
);

// 1. Swiss Grid
export function SwissGrid({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-white text-black flex flex-col relative overflow-hidden p-[20px] box-border border-[1px] border-slate-100">
      <MinimalistFonts />
      <div className="w-full h-full border-[1px] border-black flex flex-col">
        
        {/* Top Header */}
        <div className="w-full border-b-[1px] border-black p-4 flex justify-between items-start h-[100px]">
          <div className="flex flex-col">
            <h1 className="font-inter text-[28px] font-black leading-none uppercase tracking-tighter">{brandName}</h1>
            <h2 className="font-inter text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-2">{headline}</h2>
          </div>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain grayscale" />
          )}
        </div>

        {/* Center QR Grid */}
        <div className="flex-grow flex items-center justify-center p-8 bg-[#f9f9f9]">
          <div className="w-[280px] h-[280px] bg-white border-[1px] border-black p-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-full h-full object-contain mix-blend-multiply" />
          </div>
        </div>

        {/* Bottom Info Grid */}
        <div className="w-full h-[120px] border-t-[1px] border-black flex">
          <div className="w-1/2 border-r-[1px] border-black p-4 flex flex-col justify-between bg-black text-white">
            <span className="font-inter text-[10px] uppercase tracking-widest text-slate-400">Scan to View</span>
            <span className="font-inter text-[18px] font-bold leading-tight">{subtext}</span>
          </div>
          <div className="w-1/2 p-4 flex flex-col justify-between">
            <span className="font-inter text-[10px] uppercase tracking-widest text-slate-500">Network</span>
            <span className="font-inter text-[14px] font-bold">{wifiPassword || "N/A"}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// 2. Pure Whitespace
export function PureWhitespace({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-white text-[#1a1a1a] flex flex-col relative overflow-hidden box-border">
      <MinimalistFonts />
      <div className="w-full h-full p-12 flex flex-col items-center justify-center relative">
        
        <div className="absolute top-12 left-12 flex items-center gap-4">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[24px] h-[24px] object-contain grayscale" />
          )}
          <h1 className="font-outfit text-[16px] font-semibold tracking-wide">{brandName}</h1>
        </div>

        <div className="mb-12 mt-8">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply opacity-90" />
        </div>

        <div className="text-center flex flex-col items-center w-full">
          <h2 className="font-outfit text-[22px] font-light tracking-tight mb-2">{headline}</h2>
          <h3 className="font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-outfit text-[13px] text-slate-500 bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
              WiFi <span className="font-semibold text-slate-800 ml-2">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 3. Negative Space
export function NegativeSpace({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#111] text-white flex flex-col relative overflow-hidden box-border">
      <MinimalistFonts />
      <div className="absolute top-0 right-0 w-[80%] h-full bg-white clip-path-diagonal" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
      
      <div className="w-full h-full relative z-10 flex flex-col p-10 justify-between">
        
        <div className="w-full max-w-[200px]">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain filter brightness-0 invert mb-6" />
          )}
          <h1 className="font-space text-[42px] font-bold leading-none uppercase tracking-tighter mix-blend-difference text-white">{brandName}</h1>
        </div>

        <div className="self-end bg-white p-4 shadow-2xl mr-4 border border-slate-100">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain" />
        </div>

        <div className="flex flex-col text-right items-end text-[#111]">
          <h2 className="font-space text-[18px] font-bold mb-1">{headline}</h2>
          <h3 className="font-inter text-[12px] text-slate-500 uppercase tracking-widest mb-4">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-space text-[14px] font-semibold flex items-center gap-2 text-slate-800">
              <Wifi className="w-4 h-4" /> {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 4. Bauhaus
export function Bauhaus({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#F5F5DC] text-[#222] flex flex-col relative overflow-hidden box-border">
      <MinimalistFonts />
      <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full mix-blend-multiply opacity-80" style={{ backgroundColor: colorStart }} />
      <div className="absolute bottom-[-20px] right-[-20px] w-[150px] h-[150px] rounded-sm mix-blend-multiply opacity-80 bg-[#FF3B30]" />
      
      <div className="w-full h-full relative z-10 p-10 flex flex-col justify-between">
        <div className="flex justify-between items-center w-full">
          <h1 className="font-inter text-[24px] font-bold tracking-tighter uppercase">{brandName}</h1>
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain grayscale mix-blend-multiply" />
          )}
        </div>

        <div className="w-full flex justify-center py-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] border-[4px] border-[#222] rotate-[15deg] pointer-events-none" />
          <div className="bg-[#FAF9F6] p-4 border-[2px] border-[#222] shadow-[8px_8px_0_0_rgba(34,34,34,1)]">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="w-full bg-[#222] text-white p-6 -mx-10 -mb-10 w-[calc(100%+80px)] flex justify-between items-end">
          <div className="flex flex-col">
            <h3 className="font-space text-[12px] uppercase tracking-widest text-slate-400 mb-1">{subtext}</h3>
            <h2 className="font-inter text-[20px] font-bold">{headline}</h2>
          </div>
          
          {wifiPassword && (
            <div className="font-space text-[14px] bg-white text-[#222] px-4 py-2 font-bold transform -skew-x-12">
              WIFI: {wifiPassword}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 5. The Exhibition
export function TheExhibition({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#EEEEEE] text-[#111] flex flex-col relative overflow-hidden box-border p-[30px]">
      <MinimalistFonts />
      <div className="w-full h-full bg-white shadow-2xl p-8 flex flex-col">
        
        <div className="flex justify-between w-full mb-12">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[30px] h-[30px] object-contain grayscale opacity-80" />
          )}
          <span className="font-inter text-[10px] text-slate-400 tracking-widest uppercase">Exhibit A</span>
        </div>

        <div className="flex-grow flex flex-col justify-center items-center w-full pb-10">
          <div className="w-full aspect-square border border-slate-200 bg-slate-50 flex items-center justify-center p-6 mb-8">
            <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          
          <h1 className="font-outfit text-[28px] font-bold leading-none mb-2 w-full">{brandName}</h1>
          <h2 className="font-inter text-[14px] text-slate-500 w-full mb-1">{headline}</h2>
          <h3 className="font-inter text-[12px] text-slate-400 w-full">{subtext}</h3>
        </div>

        {wifiPassword && (
          <div className="w-full border-t border-slate-200 pt-4 flex justify-between items-center">
            <span className="font-inter text-[10px] text-slate-400 tracking-widest uppercase">Network</span>
            <span className="font-space text-[12px] font-bold">{wifiPassword}</span>
          </div>
        )}

      </div>
    </div>
  );
}

// 6. Typographic Hierarchy
export function TypographicHierarchy({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#000] text-[#fff] flex flex-col relative overflow-hidden box-border p-12 justify-between">
      <MinimalistFonts />
      
      <div className="flex flex-col w-full">
        {logoUrl && (
          <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[36px] h-[36px] object-contain filter brightness-0 invert mb-8" />
        )}
        <h1 className="font-inter text-[64px] font-black leading-[0.8] tracking-tighter break-words">{brandName}</h1>
        <h2 className="font-space text-[16px] text-slate-400 mt-6 max-w-[200px]">{headline}</h2>
      </div>

      <div className="self-end bg-white p-2">
        <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain mix-blend-multiply" />
      </div>

      <div className="w-full flex justify-between items-end border-b border-white/30 pb-4">
        <h3 className="font-inter text-[14px] font-bold uppercase tracking-widest text-white">{subtext}</h3>
        {wifiPassword && (
          <div className="font-space text-[14px] text-slate-300">
            WIFI: <span className="text-white font-bold">{wifiPassword}</span>
          </div>
        )}
      </div>

    </div>
  );
}

// 7. Outline Minimal
export function OutlineMinimal({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-white text-[#222] flex flex-col relative overflow-hidden box-border">
      <MinimalistFonts />
      <div className="w-full h-full p-6 border-[8px] border-white relative z-10">
        <div className="w-full h-full border-[2px] rounded-[30px] p-8 flex flex-col justify-between" style={{ borderColor: colorStart }}>
          
          <div className="flex justify-between items-center w-full">
            <h1 className="font-outfit text-[22px] font-semibold" style={{ color: colorStart }}>{brandName}</h1>
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[30px] h-[30px] object-contain" />
            )}
          </div>

          <div className="w-full flex justify-center items-center py-8">
            <div className="p-4 rounded-[24px] border-[2px]" style={{ borderColor: colorStart }}>
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain rounded-xl mix-blend-multiply" />
            </div>
          </div>

          <div className="flex flex-col text-center items-center w-full">
            <h2 className="font-inter text-[18px] font-bold mb-2">{headline}</h2>
            <h3 className="font-inter text-[12px] text-slate-500 uppercase tracking-widest mb-6">{subtext}</h3>
            
            {wifiPassword && (
              <div className="font-outfit text-[12px] font-semibold border rounded-full px-6 py-2 flex items-center gap-2" style={{ borderColor: colorStart, color: colorStart }}>
                <Wifi className="w-3 h-3" /> {wifiPassword}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// 8. Editorial
export function Editorial({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#F7F5F0] text-[#1A1A1A] flex flex-col relative overflow-hidden box-border p-12">
      <MinimalistFonts />
      
      <div className="flex flex-col w-full h-full justify-between">
        
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain grayscale opacity-80" />
            )}
            <div className="h-[1px] flex-grow bg-[#1A1A1A]" />
          </div>
          <h2 className="font-space text-[12px] uppercase tracking-[0.2em] mb-2">{subtext}</h2>
          <h1 className="font-outfit text-[46px] font-light leading-none tracking-tight">{brandName}</h1>
        </div>

        <div className="self-center my-8 bg-white p-6 shadow-xl w-fit">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[180px] h-[180px] object-contain mix-blend-multiply" />
        </div>

        <div className="flex flex-col w-full border-l-[2px] border-[#1A1A1A] pl-6">
          <h3 className="font-inter text-[16px] font-semibold mb-2">{headline}</h3>
          <p className="font-inter text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed mb-4 max-w-[200px]">
            Scan the code above to view our digital experience.
          </p>
          
          {wifiPassword && (
            <div className="font-space text-[13px] font-bold mt-auto">
              WIFI / {wifiPassword}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 9. Data Minimal
export function DataMinimal({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-slate-50 text-slate-900 flex flex-col relative overflow-hidden box-border font-space">
      <MinimalistFonts />
      
      {/* Top Bar */}
      <div className="w-full bg-slate-900 text-white p-3 flex justify-between items-center text-[10px] uppercase tracking-widest">
        <span>ID: {brandName.substring(0,4).toUpperCase()}</span>
        <span>SYS_ACTIVE</span>
      </div>

      <div className="flex-grow p-10 flex flex-col justify-between w-full h-full">
        
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[40px] h-[40px] object-contain grayscale mb-6" />
            )}
            <h1 className="text-[28px] font-bold uppercase tracking-tighter leading-none">{brandName}</h1>
            <h2 className="text-[12px] text-slate-500 mt-2">[{subtext}]</h2>
          </div>
        </div>

        <div className="w-full flex justify-center py-8 border-y border-slate-200 border-dashed my-8">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply" />
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase">Action</span>
            <span className="text-[14px] font-semibold">{headline}</span>
          </div>
          {wifiPassword && (
            <div className="flex flex-col border-l border-slate-200 pl-4">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1"><Wifi className="w-3 h-3"/> Network</span>
              <span className="text-[14px] font-semibold">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 10. Zen Center
export function ZenCenter({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-white text-slate-800 flex flex-col relative overflow-hidden box-border items-center justify-center p-12 text-center">
      <MinimalistFonts />
      
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full border border-slate-100 bg-slate-50/50" />
      
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full">
        
        <div className="flex flex-col items-center">
          {logoUrl && (
            <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[30px] h-[30px] object-contain grayscale opacity-60 mb-6" />
          )}
          <h1 className="font-inter text-[24px] font-bold tracking-[0.2em] uppercase text-slate-900">{brandName}</h1>
        </div>

        <div className="p-2 border border-slate-200 rounded-[20px] bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
          <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[200px] h-[200px] object-contain mix-blend-multiply rounded-xl opacity-90" />
        </div>

        <div className="flex flex-col items-center w-full">
          <h2 className="font-outfit text-[18px] text-slate-700 mb-2">{headline}</h2>
          <h3 className="font-inter text-[11px] text-slate-400 uppercase tracking-widest mb-8">{subtext}</h3>
          
          {wifiPassword && (
            <div className="font-inter text-[11px] font-medium tracking-widest text-slate-500 flex flex-col gap-1">
              <span>WIFI CONNECT</span>
              <span className="text-slate-900">{wifiPassword}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
