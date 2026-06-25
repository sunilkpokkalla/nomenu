"use client";

import { useState, useEffect } from "react";
import { generateLoyaltyToken } from "./actions";
import { QRCodeSVG } from "qrcode.react";
import { Loader2, QrCode, RefreshCw } from "lucide-react";

export function LoyaltyQrGenerator({ restaurantId }: { restaurantId: string }) {
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const generateCode = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await generateLoyaltyToken(restaurantId);
      if (res.error) {
        setError(res.error);
      } else if (res.tokenId) {
        setTokenId(res.tokenId);
        setTimeLeft(180); // 3 minutes
      }
    } catch (err) {
      setError("Failed to generate code.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && tokenId) {
      setTokenId(null);
    }
  }, [timeLeft, tokenId]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Create absolute URL
  const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}/loyalty/scan?token=${tokenId}` : '';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Information */}
        <div className="flex flex-col items-start text-left">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
            <QrCode className="w-8 h-8" />
          </div>
          
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Staff Scanner Terminal</h3>
          <p className="text-slate-500 text-lg mb-6 leading-relaxed">
            Generate a secure, single-use QR code. Ask the customer to scan it with their phone's camera to instantly receive 1 loyalty stamp on their digital card.
          </p>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Secure against fraud and duplicates
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Auto-expires after 3 minutes
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Works without an app installation
            </li>
          </ul>
        </div>

        {/* Right Side: QR Generator */}
        <div className="flex flex-col items-center justify-center bg-slate-50 rounded-3xl p-8 border border-slate-100 min-h-[400px]">
          {!tokenId && !isLoading && (
            <button
              onClick={generateCode}
              className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20 text-lg w-full max-w-xs flex items-center justify-center gap-3"
            >
              <QrCode className="w-5 h-5" />
              Generate Stamp
            </button>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
              <p className="text-slate-500 font-medium">Generating secure token...</p>
            </div>
          )}

          {tokenId && !isLoading && (
            <div className="flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-300 w-full">
              <div className="p-5 bg-white rounded-3xl shadow-xl border border-slate-100">
                <QRCodeSVG value={qrUrl} size={240} className="w-full h-auto max-w-[240px]" />
              </div>
              
              <div className="flex flex-col items-center space-y-2 text-center">
                <p className="text-3xl font-black tracking-tight text-slate-900">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </p>
                <p className="text-sm font-semibold text-rose-500 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100">
                  Auto-expires after 3 minutes
                </p>
              </div>

              <button
                onClick={generateCode}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm mt-4 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Generate New Code
              </button>
            </div>
          )}

          {error && (
            <p className="text-rose-500 font-medium mt-4 text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
