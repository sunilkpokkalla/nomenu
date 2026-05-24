import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  const isDemoEnv = process.env.DEMO_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const hasRealAuthCookie = request.cookies.getAll().some(c => c.name.startsWith("sb-") && c.name.includes("-auth-token"));
  const userCookie = request.cookies.get("nomenu_demo_user")?.value;
  const hasDemoCookie = !!userCookie;

  if (isDemoEnv || (hasDemoCookie && !hasRealAuthCookie)) {
    const isDashboard = pathname.startsWith("/dashboard");
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    if (isDashboard && !userCookie) {
      const responseWithCookie = NextResponse.next({ request });
      responseWithCookie.cookies.set({
        name: "nomenu_demo_user",
        value: "demo@nomenu.com",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return responseWithCookie;
    }

    if (isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      const redirectResponse = NextResponse.redirect(url);
      if (!userCookie) {
        redirectResponse.cookies.set({
          name: "nomenu_demo_user",
          value: "demo@nomenu.com",
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }
      return redirectResponse;
    }

    return response;
  }

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

  // Clear demo cookies in live mode ONLY if a real Supabase session exists
  if (request.cookies.has("nomenu_demo_user") && hasRealAuthCookie) {
    response.cookies.set({
      name: "nomenu_demo_user",
      value: "",
      path: "/",
      maxAge: -1,
    });
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
  const isAuthPage = pathname === "/login" || pathname === "/signup";

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

  return response;
}
