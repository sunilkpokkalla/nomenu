import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummyKeyForBuildProcess123", {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(req: Request) {
  try {
    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "Missing planId" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the restaurant for this user
    const { data: _restaurantData, error: fetchError } = await supabase
      .from("restaurants")
      .select("id, stripe_customer_id, plan")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const restaurant = _restaurantData as any;
    if (fetchError || !restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // Demo Mode Override: Bypass Stripe completely
    if (process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.STRIPE_SECRET_KEY === "sk_test_placeholder" || !process.env.STRIPE_SECRET_KEY) {
      // Use Service Role to bypass RLS, because users are strictly forbidden from modifying their own 'plan' column!
      const adminSupabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
      );

      // Instantly upgrade the user in the database
      const { error: mockUpdateError } = await adminSupabase
        .from("restaurants")
        .update({ plan: planId.toLowerCase() })
        .eq("id", restaurant.id);
        
      if (mockUpdateError) {
        console.error("Admin DB Update Error:", mockUpdateError);
        return NextResponse.json({ error: "Failed to upgrade plan securely." }, { status: 500 });
      }
        
      const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return NextResponse.json({ url: `${origin}/dashboard/billing?success=Demo%20Upgrade%20Successful!%20Plan%20set%20to%20${planId}` });
    }

    // Map plans to Stripe Price IDs
    const priceMap: Record<string, string | undefined> = {
      pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
      elite: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE,
      enterprise: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE,
    };

    const priceId = priceMap[planId.toLowerCase()];

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan or missing price ID in environment variables." }, { status: 400 });
    }

    // Create or retrieve Stripe Customer
    let customerId = restaurant.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          restaurant_id: restaurant.id,
        },
      });
      customerId = customer.id;

      // Save customer ID to database
      await supabase
        .from("restaurants")
        .update({ stripe_customer_id: customerId })
        .eq("id", restaurant.id);
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard/billing?success=Subscription%20updated%20successfully!`,
      cancel_url: `${origin}/dashboard/billing?canceled=true`,
      metadata: {
        restaurant_id: restaurant.id,
        plan_id: planId, // Let the webhook know what plan this is for
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe Subscription Checkout Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
