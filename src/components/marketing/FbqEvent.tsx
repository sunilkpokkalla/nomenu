'use client';

import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FbqEvent({ eventName, params = {} }: { eventName: string, params?: Record<string, unknown> }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && ('fbq' in window)) {
      // @ts-expect-error - fbq is dynamically injected
      window.fbq('track', eventName, params);
    }
  }, [eventName, params]);
  return null;
}
