import crypto from 'crypto';

interface MetaEventData {
  eventName: string;
  eventId: string;
  email?: string;
  phone?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  sourceUrl?: string;
  value?: number;
  currency?: string;
}

/**
 * Hashes a string using SHA-256 as required by Meta CAPI for PII (email, phone, etc.)
 */
const hashData = (data: string): string => {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
};

/**
 * Sends an event to the Meta Conversions API
 */
export async function sendMetaServerEvent(data: MetaEventData) {
  const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

  // If we don't have the required credentials, gracefully exit (useful for dev/staging)
  if (!PIXEL_ID || !ACCESS_TOKEN || ACCESS_TOKEN === 'your_meta_capi_access_token_here') {
    console.log('[Meta CAPI] Skipping event tracking because token/pixel ID is missing.');
    return;
  }

  const timestamp = Math.floor(Date.now() / 1000);

  // Build the user data object
  const userData: Record<string, string | string[] | undefined> = {
    client_ip_address: data.clientIpAddress,
    client_user_agent: data.clientUserAgent,
  };

  // Hash PII if provided
  if (data.email) userData.em = [hashData(data.email)];
  if (data.phone) userData.ph = [hashData(data.phone)];

  // Build custom data for purchases
  let customData = {};
  if (data.value && data.currency) {
    customData = {
      value: data.value,
      currency: data.currency,
    };
  }

  const payload = {
    data: [
      {
        event_name: data.eventName,
        event_time: timestamp,
        action_source: 'website',
        event_id: data.eventId,
        event_source_url: data.sourceUrl,
        user_data: userData,
        custom_data: customData,
      },
    ],
  };

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('[Meta CAPI] Error response from Facebook:', result);
    } else {
      console.log(`[Meta CAPI] Successfully sent ${data.eventName} (${data.eventId})`);
    }
  } catch (error) {
    console.error('[Meta CAPI] Failed to send event to Facebook:', error);
  }
}
