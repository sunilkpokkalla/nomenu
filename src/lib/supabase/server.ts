import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";
import { createMockClient } from "./mock";

export async function createClient() {
  const cookieStore = await cookies();
  const isDemoEnv = process.env.DEMO_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const hasDemoCookie = !!cookieStore.get("nomenu_demo_user")?.value;

  if (isDemoEnv || hasDemoCookie) {
    return createMockClient({
      getCookie: (name) => cookieStore.get(name)?.value,
      setCookie: (name, value) => {
        try {
          cookieStore.set({ name, value, path: "/" });
        } catch {
          // Ignore error on server components
        }
      },
      deleteCookie: (name) => {
        try {
          cookieStore.set({ name, value: "", path: "/", maxAge: -1 });
        } catch {
          // Ignore error on server components
        }
      }
    }) as unknown as ReturnType<typeof createServerClient<Database>>;
  }

  const { url, anonKey } = getSupabaseEnv();

  return createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Components cannot set cookies. Middleware refreshes them.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Server Components cannot set cookies. Middleware refreshes them.
          }
        },
      },
    },
  );
}
