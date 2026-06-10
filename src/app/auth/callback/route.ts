import { NextResponse } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash,
    });
    if (!error) {
      const redirectUrl = new URL(next, request.url);
      return NextResponse.redirect(redirectUrl);
    } else {
      console.error("Auth callback verifyOtp error:", error.message);
      let errorMessage = error.message;
      if (errorMessage.includes("expired") || errorMessage.includes("invalid")) {
        errorMessage = "Verification link expired or invalid. Please request a new one.";
      }
      return NextResponse.redirect(new URL(`/login?message=${encodeURIComponent(errorMessage)}`, request.url));
    }
  }

  if (code) {
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
