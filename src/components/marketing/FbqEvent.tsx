'use client';

import { useEffect } from 'react';

export function FbqEvent({ 
  eventName, 
  params = {}, 
  eventId 
}: { 
  eventName: string; 
  params?: Record<string, unknown>; 
  eventId?: string; 
}) {
  useEffect(() => {
    if (!eventName) {
      console.warn('[Meta Pixel] Skipping event track call: eventName is missing or empty.');
      return;
    }
    if (typeof window !== 'undefined' && ('fbq' in window)) {
      if (eventId) {
        // @ts-expect-error - fbq is dynamically injected by Meta
        window.fbq('track', eventName, params, { eventID: eventId });
      } else {
        // @ts-expect-error - fbq is dynamically injected by Meta
        window.fbq('track', eventName, params);
      }
    }
  }, [eventName, params, eventId]);
  return null;
}

