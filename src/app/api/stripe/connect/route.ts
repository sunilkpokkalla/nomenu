import { NextResponse } from "next/server";
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
      .select("id, stripe_account_id")
      .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const restaurant = _restaurantData as any;
    if (fetchError || !restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    let stripeAccountId = restaurant.stripe_account_id;

    // --- DEMO MODE BYPASS ---
    // If we are in demo mode, mock the Stripe Connect flow instantly
    // instead of calling the real Stripe API without valid keys.
    if (process.env.DEMO_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.STRIPE_SECRET_KEY === "sk_test_placeholder" || !process.env.STRIPE_SECRET_KEY) {
      const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      
      // If we don't have a fake account ID yet, save one
      if (!stripeAccountId) {
        stripeAccountId = "acct_demo_" + Math.random().toString(36).substr(2, 9);
        const { error: mockUpdateError } = await supabase
          .from("restaurants")
          // @ts-expect-error: Bypass strict generic type validation
          .update({ stripe_account_id: stripeAccountId })
          .eq("id", restaurant.id);
          
        if (mockUpdateError) {
          console.error("Mock Stripe Update Error:", mockUpdateError);
          return NextResponse.json({ error: "Failed to link bank account. Please check your database permissions." }, { status: 500 });
        }
      }
      
      // Instantly return the success redirect
      return NextResponse.json({ url: `${origin}/dashboard/payouts?success=true` });
    }
    // --- END DEMO MODE BYPASS ---

    // Create a new connected account if it doesn't exist
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      stripeAccountId = account.id;

      // Save it to Supabase
      const { error: updateError } = await supabase
        .from("restaurants")
        // @ts-expect-error: Next.js build bypass until Supabase types are regenerated
        .update({ stripe_account_id: stripeAccountId })
        .eq("id", restaurant.id);

      if (updateError) {
        console.error("Failed to save Stripe account ID:", updateError);
        return NextResponse.json({ error: "Failed to update restaurant" }, { status: 500 });
      }
    }

    // Generate the onboarding link
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
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
