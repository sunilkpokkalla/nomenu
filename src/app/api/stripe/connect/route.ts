import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(req: Request) {
  try {
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
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Demo Mode Bypass
    if (process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.STRIPE_SECRET_KEY === "sk_test_placeholder" || !process.env.STRIPE_SECRET_KEY) {
      if (!stripeAccountId) {
        stripeAccountId = "acct_demo_" + Math.random().toString(36).substr(2, 9);
        
        const adminSupabase = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
        );

        const { error: mockUpdateError } = await adminSupabase
          .from("restaurants")
          .update({ stripe_account_id: stripeAccountId })
          .eq("id", restaurant.id);
          
        if (mockUpdateError) {
          return NextResponse.json({ error: "Failed to update database securely." }, { status: 500 });
        }
      }
      return NextResponse.json({ url: `${origin}/dashboard/payouts?success=true` });
    }

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
        // @ts-expect-error: Bypass strict generic type validation
        .update({ stripe_account_id: stripeAccountId })
        .eq("id", restaurant.id);
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
