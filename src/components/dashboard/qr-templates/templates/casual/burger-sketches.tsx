import React from "react";
import { QrTemplateProps } from "../../types";
import { Phone } from "lucide-react";

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
