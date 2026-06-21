import crypto from "crypto";

interface StripeRequestInit extends Omit<RequestInit, 'body'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

export async function fetchStripe(endpoint: string, options: StripeRequestInit = {}) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY is missing");

  const url = `https://api.stripe.com/v1${endpoint}`;
  const authHeader = `Basic ${Buffer.from(secretKey + ":").toString("base64")}`;

  const defaultHeaders: HeadersInit = {
    "Authorization": authHeader,
  };

  // If data is passed as a JS object, convert to form-urlencoded because Stripe expects form data
  let body = options.body;
  if (options.body && typeof options.body === "object" && !(options.body instanceof URLSearchParams)) {
    const params = new URLSearchParams();
    
    // Simple recursive function to flatten objects into form data arrays like nested objects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flatten = (obj: any, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const val = obj[key];
        const newPrefix = prefix ? `${prefix}[${key}]` : key;
        
        if (val === null || val === undefined) return;
        
        if (typeof val === 'object' && !Array.isArray(val)) {
          flatten(val, newPrefix);
        } else if (Array.isArray(val)) {
          val.forEach((item, i) => {
            if (typeof item === 'object') {
              flatten(item, `${newPrefix}[${i}]`);
            } else {
              params.append(`${newPrefix}[${i}]`, item);
            }
          });
        } else {
          params.append(newPrefix, val.toString());
        }
      });
    };
    
    flatten(options.body);
    body = params.toString();
    defaultHeaders["Content-Type"] = "application/x-www-form-urlencoded";
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    body: body as BodyInit,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Stripe API Error: ${res.status} ${res.statusText} - ${errText}`);
  }

  return res.json();
}

export function verifyStripeWebhook(payload: string, signatureHeader: string, secret: string): boolean {
  if (!signatureHeader || !secret) return false;

  const signatureParts = signatureHeader.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  if (!signatureParts['t'] || !signatureParts['v1']) return false;

  const timestamp = signatureParts['t'];
  const signature = signatureParts['v1'];

  const signedPayload = `${timestamp}.${payload}`;
  
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  return expectedSignature === signature;
}
