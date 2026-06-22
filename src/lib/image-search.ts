/**
 * Food image search with Supabase caching.
 * Priority: Cache → Pexels → Unsplash → DuckDuckGo
 *
 * Cache TTL: 30 days. Prevents duplicate API calls and handles outages gracefully.
 * Requires: PEXELS_API_KEY or UNSPLASH_ACCESS_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";

const CACHE_TTL_DAYS = 30;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getCached(query: string): Promise<string | null> {
  try {
    const sb = getSupabase();
    if (!sb) return null;
    const { data } = await sb
      .from("image_cache")
      .select("image_url, expires_at")
      .eq("query", query.toLowerCase())
      .single();
    if (!data) return null;
    if (new Date(data.expires_at) < new Date()) {
      // Expired — delete and return null
      await sb.from("image_cache").delete().eq("query", query.toLowerCase());
      return null;
    }
    return data.image_url;
  } catch {
    return null;
  }
}

async function setCache(query: string, imageUrl: string, source: string): Promise<void> {
  try {
    const sb = getSupabase();
    if (!sb) return;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + CACHE_TTL_DAYS);
    await sb.from("image_cache").upsert({
      query: query.toLowerCase(),
      image_url: imageUrl,
      source,
      expires_at: expiresAt.toISOString(),
    }, { onConflict: "query" });
  } catch (err) {
    console.error("[image-search] Cache write error:", err);
  }
}

/**
 * Search Pexels for a food image (requires PEXELS_API_KEY env var)
 */
async function searchPexels(query: string): Promise<string | null> {
  if (!process.env.PEXELS_API_KEY) return null;
  try {
    const encoded = encodeURIComponent(query + " food dish");
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encoded}&per_page=5&orientation=landscape`,
      { headers: { Authorization: process.env.PEXELS_API_KEY } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photo = data?.photos?.[0];
    return photo?.src?.large || photo?.src?.original || null;
  } catch (err) {
    console.error("[image-search] Pexels error:", err);
    return null;
  }
}

/**
 * Search Unsplash for a food image (requires UNSPLASH_ACCESS_KEY env var)
 */
async function searchUnsplash(query: string): Promise<string | null> {
  if (!process.env.UNSPLASH_ACCESS_KEY) return null;
  try {
    const encoded = encodeURIComponent(query + " food");
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encoded}&per_page=5&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photo = data?.results?.[0];
    if (!photo) return null;
    return photo.urls?.regular || photo.urls?.full || null;
  } catch (err) {
    console.error("[image-search] Unsplash error:", err);
    return null;
  }
}

/**
 * DuckDuckGo image search — no API key needed, best-effort fallback.
 */
async function searchDuckDuckGo(query: string): Promise<string | null> {
  try {
    const encoded = encodeURIComponent(query + " food dish restaurant");
    const htmlRes = await fetch(
      `https://html.duckduckgo.com/html/?q=${encoded}+food+dish`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html",
        },
      }
    );
    if (!htmlRes.ok) return null;
    const html = await htmlRes.text();
    const vqdMatch = html.match(/vqd=([\d-]+)/);
    if (!vqdMatch) return null;
    const vqd = vqdMatch[1];

    const jsonRes = await fetch(
      `https://duckduckgo.com/i.js?q=${encoded}&o=json&vqd=${vqd}&f=,,,,,`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          Referer: "https://duckduckgo.com/",
        },
      }
    );
    if (!jsonRes.ok) return null;
    const data = await jsonRes.json();
    const results: Array<{ image?: string; width?: number; height?: number }> = data?.results || [];
    const good = results.find((r) => r.image && r.width && r.height && r.width > r.height && r.width > 500);
    return good?.image || results[0]?.image || null;
  } catch (err) {
    console.error("[image-search] DuckDuckGo error:", err);
    return null;
  }
}

/**
 * Main export: finds a high-quality food image for the given dish name.
 * Priority: Cache → Pexels → Unsplash → DuckDuckGo
 * Results are cached in Supabase for 30 days.
 */
export async function searchFreeFoodImage(dishName: string): Promise<string | null> {
  const cacheKey = dishName.trim();

  // 1. Check cache first
  const cached = await getCached(cacheKey);
  if (cached) {
    return cached;
  }

  // 2. Try live sources
  let result: string | null = null;
  let source = "";

  const pexels = await searchPexels(dishName);
  if (pexels) { result = pexels; source = "pexels"; }

  if (!result) {
    const unsplash = await searchUnsplash(dishName);
    if (unsplash) { result = unsplash; source = "unsplash"; }
  }

  if (!result) {
    const ddg = await searchDuckDuckGo(dishName);
    if (ddg) { result = ddg; source = "duckduckgo"; }
  }

  // 3. Cache the result (even on success, so future calls skip the API)
  if (result) {
    await setCache(cacheKey, result, source);
  }

  return result;
}
