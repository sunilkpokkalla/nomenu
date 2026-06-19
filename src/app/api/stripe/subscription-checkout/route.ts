import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-05-27.dahlia",
      httpClient: Stripe.createFetchHttpClient(),
    });
    const { planId, isAnnual } = await req.json();

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



    // Map plans to Stripe Price IDs
    const priceMap: Record<string, Record<string, string | undefined>> = {
      pro: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
        annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL,
      },
      elite: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE,
        annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_ANNUAL,
      },
      enterprise: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE,
        annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL,
      },
    };

    const billingCycle = isAnnual ? "annual" : "monthly";
    const priceId = priceMap[planId.toLowerCase()]?.[billingCycle];

    if (!priceId) {
      if (isAnnual) {
        return NextResponse.json({ error: `Annual pricing for ${planId} is not yet configured. Please select Monthly billing or contact support.` }, { status: 400 });
      }
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

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        restaurant_id: restaurant.id,
        plan_id: planId,
      },
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentIntent = (invoice as any).payment_intent as Stripe.PaymentIntent;

    if (!paymentIntent || !paymentIntent.client_secret) {
      throw new Error("Failed to create payment intent. Please try again.");
    }

    return NextResponse.json({ 
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error: unknown) {
    console.error("Stripe Subscription Checkout Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
