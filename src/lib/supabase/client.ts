import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";
import { createMockClient } from "./mock";

export function createClient() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return createMockClient({
      getCookie: (name) => {
        if (typeof window === "undefined") return undefined;
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : undefined;
      },
      setCookie: (name, value) => {
        if (typeof window === "undefined") return;
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000`;
      },
      deleteCookie: (name) => {
        if (typeof window === "undefined") return;
        document.cookie = `${name}=; path=/; max-age=-1`;
      }
    }) as unknown as ReturnType<typeof createBrowserClient<Database>>;
  }

  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}
