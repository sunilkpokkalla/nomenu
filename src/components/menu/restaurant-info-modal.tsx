"use client";

import React, { useState } from "react";
import { Info, MapPin, Phone, Wifi, Copy, CheckCircle2, X } from "lucide-react";

interface RestaurantInfoModalProps {
  restaurant: {
    address?: string | null;
    phone?: string | null;
    wifi_password?: string | null;
    primary_color?: string | null;
  };
}

export function RestaurantInfoModal({ restaurant }: RestaurantInfoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  const hasInfo = restaurant.address || restaurant.phone || restaurant.wifi_password;

  if (!hasInfo) return null;

  const handleCopyWifi = () => {
    if (restaurant.wifi_password) {
      navigator.clipboard.writeText(restaurant.wifi_password);
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    }
  };

  const primaryColor = restaurant.primary_color || "#1A1A1A";

  return (
    <>
      {/* Subtle Info Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-40 p-2 bg-white/80 backdrop-blur-sm text-[#1A1A1A] hover:bg-black hover:text-white rounded-full shadow-sm transition-colors"
        aria-label="Restaurant Information"
      >
        <Info size={20} strokeWidth={1.5} />
      </button>

      {/* Bottom Sheet Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-all pointer-events-auto">
          {/* Backdrop Click to Close */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-sm mx-auto bg-[#FDFBF7] rounded-t-3xl sm:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] sm:shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 sm:zoom-in-95 pointer-events-auto duration-300">
            
            {/* Header & Close Button */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#EAE3D2]">
              <h3 className="text-xl font-normal tracking-wide text-[#1A1A1A]">Restaurant Info</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 -mr-2 text-[#666666] hover:text-[#1A1A1A] hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-6 py-6 space-y-8 font-sans">
              
              {/* Address */}
              {restaurant.address && (
                <div className="flex gap-4">
                  <div className="mt-0.5 shrink-0">
                    <MapPin size={20} className="text-[#666666]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-widest uppercase text-[#999999] mb-1">Location</h4>
                    <p className="text-[#1A1A1A] text-sm leading-relaxed mb-3 pr-4">
                      {restaurant.address}
                    </p>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs font-medium tracking-wide uppercase transition-colors"
                      style={{ color: primaryColor }}
                    >
                      Open in Maps &rarr;
                    </a>
                  </div>
                </div>
              )}

              {/* Phone */}
              {restaurant.phone && (
                <div className="flex gap-4">
                  <div className="mt-0.5 shrink-0">
                    <Phone size={20} className="text-[#666666]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-widest uppercase text-[#999999] mb-1">Phone</h4>
                    <a 
                      href={`tel:${restaurant.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-[#1A1A1A] text-sm hover:underline"
                    >
                      {restaurant.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Wi-Fi */}
              {restaurant.wifi_password && (
                <div className="flex gap-4">
                  <div className="mt-0.5 shrink-0">
                    <Wifi size={20} className="text-[#666666]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-xs tracking-widest uppercase text-[#999999] mb-1">Guest Wi-Fi</h4>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#1A1A1A] text-sm font-medium">Password:</span>
                      <div className="flex items-center justify-between bg-white border border-[#EAE3D2] rounded-lg p-3 shadow-sm mt-1">
                        <span className="font-mono text-sm tracking-tight text-[#1A1A1A] truncate pr-4">
                          {restaurant.wifi_password}
                        </span>
                        <button 
                          onClick={handleCopyWifi}
                          className="shrink-0 p-2 -m-2 text-[#666666] hover:text-[#1A1A1A] transition-colors"
                          title="Copy Password"
                        >
                          {copiedWifi ? (
                            <CheckCircle2 size={16} className="text-emerald-500" strokeWidth={2} />
                          ) : (
                            <Copy size={16} strokeWidth={1.5} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
