export function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://placeholder.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  console.log("Supabase Env check:", {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    urlLength: url.length,
    urlStart: url.substring(0, 15),
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    anonKeyLength: anonKey.length,
    anonKeyStart: anonKey.substring(0, 15),
  });

  return { url, anonKey };
}

