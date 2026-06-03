import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-05-27.dahlia",
      httpClient: Stripe.createFetchHttpClient(),
    });
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: _restaurantData, error: fetchError } = await supabase
      .from("restaurants")
      .select("id, stripe_account_id")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const restaurant = _restaurantData as { id: string; stripe_account_id: string | null } | null;
    if (fetchError || !restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    let stripeAccountId = restaurant.stripe_account_id;
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    // Real Stripe Connect Flow
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      stripeAccountId = account.id;

      await supabase
        .from("restaurants")
        .update({ stripe_account_id: stripeAccountId })
        .eq("id", restaurant.id);
    } else {
      // Check if they already finished onboarding
      const account = await stripe.accounts.retrieve(stripeAccountId);
      if (account.details_submitted) {
        // Generate a dashboard login link so they can see their money
        const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
        return NextResponse.json({ url: loginLink.url });
      }
    }

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${origin}/dashboard/payouts`,
      return_url: `${origin}/dashboard/payouts?success=true`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
    
  } catch (error: unknown) {
    console.error("Stripe Connect Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
