import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const redirectUrl = new URL(next, request.url);
      return NextResponse.redirect(redirectUrl);
    } else {
      console.error("Auth callback exchange error:", error.message);
      
      let errorMessage = error.message;
      // The dreaded PKCE error usually happens when opening a link on a different device or clicking an old link
      if (errorMessage.includes("PKCE") || errorMessage.includes("code verifier")) {
        errorMessage = "Account already exists or link expired. Please log in to continue.";
      }
      
      return NextResponse.redirect(new URL(`/login?message=${encodeURIComponent(errorMessage)}`, request.url));
    }
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
