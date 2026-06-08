import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  if (!hasSupabaseEnv()) {
    if (pathname.startsWith("/dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set(
        "message",
        "Add Supabase env vars before opening the dashboard.",
      );
      return NextResponse.redirect(url);
    }

    return response;
  }

  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password";

  if (isDashboard && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Multi-tenant routing
  const hostname = request.headers.get("host") || "";
  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const rootDomain = rawAppUrl.replace(/^https?:\/\//, "").split("/")[0]; // Extract domain

  const isApiOrInternal = pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico");
  
  if (
    hostname !== rootDomain && 
    !hostname.includes("vercel.app") && 
    !hostname.startsWith("localhost:") && // Ignore plain localhost:3000
    !isApiOrInternal &&
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/signup")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/_sites/${hostname}${pathname}`;
    const rewriteRes = NextResponse.rewrite(url);
    
    // Copy cookies from original response to rewritten response
    response.cookies.getAll().forEach((cookie) => {
      rewriteRes.cookies.set(cookie);
    });
    return rewriteRes;
  }

  return response;
}
