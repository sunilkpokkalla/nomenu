import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { fetchStripe } from "@/lib/stripe-fetch";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
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
      .select("id, stripe_customer_id, plan, referred_by_code")
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

    let customerId = restaurant.stripe_customer_id;
    if (!customerId) {
      const customer = await fetchStripe("/customers", {
        method: "POST",
        body: {
          email: user.email,
          metadata: {
            restaurant_id: restaurant.id,
          },
        }
      });
      customerId = customer.id;

      // Save customer ID to database
      await supabase
        .from("restaurants")
        .update({ stripe_customer_id: customerId })
        .eq("id", restaurant.id);
    }

    const discounts = [];

    if (isAnnual) {
      if (!restaurant.referred_by_code) {
        // No Referral -> 10% Discount
        const discountId = process.env.STRIPE_ANNUAL_DISCOUNT_COUPON_ID;
        if (discountId) {
          if (discountId.startsWith('promo_')) {
            discounts.push({ promotion_code: discountId });
          } else {
            discounts.push({ coupon: discountId });
          }
        }
      } else {
        // Referred -> 15% Discount
        const referralId = process.env.STRIPE_REFERRAL_COUPON_ID;
        if (referralId) {
          if (referralId.startsWith('promo_')) {
            discounts.push({ promotion_code: referralId });
          } else {
            discounts.push({ coupon: referralId });
          }
        }
      }
    }

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    const origin = `${protocol}://${host}`;

    const sessionBody: any = {
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard/billing?success=Subscription%20updated%20successfully!`,
      cancel_url: `${origin}/dashboard/billing?canceled=true`,
      subscription_data: {
        metadata: {
          restaurant_id: restaurant.id,
          plan_id: planId,
          billing_cycle: billingCycle,
        },
      },
    };

    if (discounts.length > 0) {
      sessionBody.discounts = discounts;
    }

    const session = await fetchStripe("/checkout/sessions", {
      method: "POST",
      body: sessionBody
    });

    if (session.error) {
      console.error("Stripe API Error:", session.error);
      throw new Error(session.error.message || "Failed to create checkout session with Stripe.");
    }

    return NextResponse.json({ 
      url: session.url
    });
  } catch (error: unknown) {
    console.error("Stripe Subscription Checkout Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
