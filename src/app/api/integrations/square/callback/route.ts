import { NextResponse } from "next/server";
import { SquareClient, SquareEnvironment } from "square";
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

    // Initialize Square Client
    const squareClient = new SquareClient({
      environment: process.env.NODE_ENV === "production" ? SquareEnvironment.Production : SquareEnvironment.Production, // or Sandbox
    });

    // Exchange the authorization code for an access token
    const response = await squareClient.oAuth.obtainToken({
      clientId: clientId,
      clientSecret: clientSecret,
      code: code,
      grantType: "authorization_code",
    });

    const tokenData = response;

    if (!tokenData.accessToken || !tokenData.merchantId) {
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
        square_access_token: tokenData.accessToken,
        square_refresh_token: tokenData.refreshToken || null,
        square_merchant_id: tokenData.merchantId,
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
