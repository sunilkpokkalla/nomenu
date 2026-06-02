import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummyKeyForBuildProcess123", {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the restaurant for this user
    const { data: _restaurantData, error: fetchError } = await supabase
      .from("restaurants")
      .select("id, stripe_customer_id")
      .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const restaurant = _restaurantData as any;
    if (fetchError || !restaurant || !restaurant.stripe_customer_id) {
      return NextResponse.json({ error: "No active billing profile found" }, { status: 404 });
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Demo Mode Override: Bypass Stripe completely
    if (process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.STRIPE_SECRET_KEY === "sk_test_placeholder" || !process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ url: `${origin}/dashboard/billing?info=Demo%20Portal:%20In%20production%20this%20opens%20Stripe` });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: restaurant.stripe_customer_id,
      return_url: `${origin}/dashboard/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: unknown) {
    console.error("Stripe Portal Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
