import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const clientId = process.env.SQUARE_APPLICATION_ID;
    
    if (!clientId) {
      return NextResponse.redirect(
        new URL("/dashboard/integrations?error=Square App ID not configured by platform owner", request.url)
      );
    }

    const state = user.id; // We use the user's ID as the state to know who the tokens belong to when Square calls us back
    
    // Scopes needed to read their catalog
    const scopes = "ITEMS_READ";
    const environment = process.env.NODE_ENV === "production" ? "connect.squareup.com" : "connect.squareup.com"; // Change to connect.squareupsandbox.com for testing if needed

    const authorizationUrl = `https://${environment}/oauth2/authorize?client_id=${clientId}&scope=${scopes}&session=false&state=${state}`;

    return NextResponse.redirect(authorizationUrl);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Square connect error:", error);
    return NextResponse.redirect(
      new URL(`/dashboard/integrations?error=Failed to connect to Square: ${error.message}`, request.url)
    );
  }
}
