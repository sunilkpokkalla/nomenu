export function hasSupabaseEnv() {
  return Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
      process.env.DEMO_MODE === "true" ||
      process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  );
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://placeholder.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return { url, anonKey };
}

