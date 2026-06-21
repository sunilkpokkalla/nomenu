import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // This is the user's ID
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard/integrations?error=${encodeURIComponent(errorDescription || error)}`, request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/dashboard/integrations?error=Invalid response from Square", request.url)
      );
    }

    const clientId = process.env.SQUARE_APPLICATION_ID;
    const clientSecret = process.env.SQUARE_APPLICATION_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        new URL("/dashboard/integrations?error=Square App ID or Secret not configured", request.url)
      );
    }

    const squareEnv = process.env.NODE_ENV === "production" ? "connect.squareup.com" : "connect.squareup.com";
    const res = await fetch(`https://${squareEnv}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: "authorization_code"
      })
    });

    if (!res.ok) {
      throw new Error(`Square OAuth error: ${res.statusText} - ${await res.text()}`);
    }
    const tokenData = await res.json();

    if (!tokenData.access_token || !tokenData.merchant_id) {
      throw new Error("Missing access token or merchant ID in Square response");
    }

    // Save tokens to the database
    const supabase = await createClient();
    
    // Validate that the user who initiated the flow (state) is the current logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== state) {
      return NextResponse.redirect(
        new URL("/dashboard/integrations?error=Authentication mismatch. Please try again.", request.url)
      );
    }

    // We must find the restaurant belonging to this user
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (!restaurant) {
      return NextResponse.redirect(
        new URL("/dashboard?message=Restaurant not found", request.url)
      );
    }

    // Update the restaurant with the Square tokens
    const { error: updateError } = await supabase
      .from("restaurants")
      .update({
        square_access_token: tokenData.access_token,
        square_refresh_token: tokenData.refresh_token || null,
        square_merchant_id: tokenData.merchant_id,
      })
      .eq("id", restaurant.id);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      throw new Error("Failed to save Square integration to database");
    }

    return NextResponse.redirect(
      new URL("/dashboard/integrations?success=Square successfully connected!", request.url)
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Square callback error:", error);
    return NextResponse.redirect(
      new URL(`/dashboard/integrations?error=${encodeURIComponent(error.message || "Failed to finalize Square connection")}`, request.url)
    );
  }
}
