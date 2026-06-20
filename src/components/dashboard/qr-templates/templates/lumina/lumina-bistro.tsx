import { DottedQRCode } from "../../dotted-qr";
import React from "react";
import { QrTemplateProps } from "../../types";
import { Wifi } from "lucide-react";
import { LuminaFonts } from "./shared";

export function LuminaBistro({ brandName, headline, subtext, wifiPassword, logoUrl, qrDataUrl, qrImageUrl, colorStart, id }: QrTemplateProps) {
  // Use colorStart if available, fallback to a deep blue
  const themeColor = colorStart && colorStart !== '#000000' ? colorStart : '#4F46E5';
  
  return (
    <div
      id={id}
      className="bg-white w-[400px] h-[600px] flex flex-col items-center relative overflow-hidden font-inter border border-slate-200"
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        borderRadius: "40px"
      }}
    >
      <LuminaFonts />

      {/* Top Header Bar */}
      <div 
        className="w-full h-8 absolute top-0 left-0" 
        style={{ backgroundColor: themeColor }}
      />

      <div className="flex-1 flex flex-col w-full h-full p-8 pt-12 items-center justify-between z-10 relative">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          {logoUrl ? (
            <div className="w-[64px] h-[64px] rounded-full overflow-hidden bg-white shadow-md flex items-center justify-center mb-4 border border-slate-100">
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[80%] h-[80%] object-contain" />
            </div>
          ) : (
            <div 
              className="w-[64px] h-[64px] rounded-full flex items-center justify-center mb-4 shadow-md text-white font-outfit font-bold text-2xl"
              style={{ backgroundColor: themeColor }}
            >
              {brandName.charAt(0).toUpperCase()}
            </div>
          )}
          
          <h1 className="font-outfit font-extrabold text-[28px] tracking-tight text-slate-900 leading-none">
            {brandName}
          </h1>
          
          <div className="w-[40px] h-[3px] rounded-full mt-3 mb-6" style={{ backgroundColor: '#F59E0B' }} />
          
          <h2 className="font-outfit font-bold text-[15px] tracking-[0.1em] text-slate-800 uppercase">
            {headline || "Scan to view menu"}
          </h2>
        </div>

        {/* QR Code Container */}
        <div 
          className="bg-white p-6 rounded-[32px] flex items-center justify-center relative shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 my-4"
          style={{ width: "220px", height: "220px" }}
        >
          {qrDataUrl && (
            <DottedQRCode data={qrDataUrl} color="#1E293B" size={170} fallbackSrc={qrImageUrl} />
          )}
        </div>

        {/* Context Badge (Table) */}
        <div className="flex flex-col items-center">
          <div 
            className="px-6 py-1.5 rounded-full text-white font-outfit font-bold text-[14px] tracking-widest uppercase shadow-sm mb-3"
            style={{ backgroundColor: themeColor }}
          >
            {subtext || "Table 5"}
          </div>
          <p className="text-slate-400 font-inter font-medium text-[13px]">
            Camera scan • No app required
          </p>
        </div>

        {/* Utilities Footer */}
        <div className="w-full pt-4">
          {wifiPassword ? (
            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col items-center justify-center gap-1">
              <div className="flex items-center gap-2 text-slate-900 font-outfit font-bold text-[14px]">
                <Wifi size={16} className="text-slate-500" />
                Connect Guest WiFi
              </div>
              <p className="text-slate-500 font-inter font-medium text-[13px]">
                Password: <span className="text-slate-700 font-semibold">{wifiPassword}</span>
              </p>
            </div>
          ) : (
            <div className="h-[68px]" /> // Spacer
          )}
        </div>
        
      </div>
    </div>
  );
}
