"use client";

import React, { useState } from "react";
import { MapPin, Phone, Wifi, CheckCircle2 } from "lucide-react";

interface RestaurantInfoPillsProps {
  restaurant: {
    address?: string | null;
    phone?: string | null;
    wifi_password?: string | null;
  };
}

export function RestaurantInfoPills({ restaurant }: RestaurantInfoPillsProps) {
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

  // Base pill class: using current color for borders/text to blend into ANY theme gracefully,
  // with a very subtle background for contrast.
  const pillClass = "flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-current/20 bg-current/5 hover:bg-current/10 backdrop-blur-sm text-current transition-all text-xs font-bold tracking-wide";

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4 z-20 relative px-4">
      
      {/* Location */}
      {restaurant.address && (
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={pillClass}
        >
          <MapPin size={12} strokeWidth={2.5} className="opacity-70" />
          <span>Map</span>
        </a>
      )}

      {/* Phone */}
      {restaurant.phone && (
        <a 
          href={`tel:${restaurant.phone.replace(/[^0-9+]/g, '')}`}
          className={pillClass}
        >
          <Phone size={12} strokeWidth={2.5} className="opacity-70" />
          <span>Call</span>
        </a>
      )}

      {/* Wi-Fi */}
      {restaurant.wifi_password && (
        <button 
          onClick={handleCopyWifi}
          className={pillClass}
          title="Copy Wi-Fi Password"
        >
          {copiedWifi ? (
            <CheckCircle2 size={12} strokeWidth={2.5} className="text-emerald-500" />
          ) : (
            <Wifi size={12} strokeWidth={2.5} className="opacity-70" />
          )}
          <span>{copiedWifi ? "Copied!" : "Wi-Fi"}</span>
        </button>
      )}

    </div>
  );
}
