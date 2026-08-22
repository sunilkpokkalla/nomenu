import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { fetchStripe } from "@/lib/stripe-fetch";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { planId, isAnnual, promoCode, inviteDate } = await req.json();

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
      .select("id, stripe_customer_id, plan, referred_by_code, created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const restaurant = _restaurantData as any;
    if (fetchError || !restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const billingCycle = isAnnual ? "annual" : "monthly";
    const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");
    const normalizedPromo = (promoCode || restaurant.referred_by_code || "").toUpperCase().trim();
    let is75PercentOff = normalizedPromo === "INVITE75" || normalizedPromo === "75OFF" || normalizedPromo === "VIP75";
    let is50PercentOff = normalizedPromo === "HALFPRICE" || normalizedPromo === "50OFF";

    // 7-day rule for VIP invite: If invite is older than 7 days, step down from 75% OFF to 50% OFF
    if (is75PercentOff) {
      const inviteTime = inviteDate ? new Date(inviteDate).getTime() : new Date(restaurant.created_at || Date.now()).getTime();
      const SevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      const isWithin7Days = (Date.now() - inviteTime) <= SevenDaysMs;

      if (!isWithin7Days) {
        // Invite is older than 7 days -> Step down to 50% OFF
        is75PercentOff = false;
        is50PercentOff = true;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lineItems: any[] = [];

    if (isTestMode) {
      // Dynamic inline test price mapping to bypass needing exact pre-created test price IDs in Stripe dashboard
      const planPrices: Record<string, Record<string, { amount: number; name: string }>> = {
        pro: {
          monthly: { amount: 3900, name: "Pro Plan (Monthly)" },
          annual: { amount: 42000, name: "Pro Plan (Annual)" },
        },
        elite: {
          monthly: { amount: 7900, name: "Elite Plan (Monthly)" },
          annual: { amount: 85200, name: "Elite Plan (Annual)" },
        },
        enterprise: {
          monthly: { amount: 11900, name: "Enterprise Plan (Monthly)" },
          annual: { amount: 128400, name: "Enterprise Plan (Annual)" },
        },
      };

      const selectedPrice = planPrices[planId.toLowerCase()]?.[billingCycle];
      if (!selectedPrice) {
        return NextResponse.json({ error: "Invalid plan or billing cycle." }, { status: 400 });
      }

      // Apply 75% or 50% discount if promo is used
      let finalAmount = selectedPrice.amount;
      let displayName = selectedPrice.name;

      if (is75PercentOff) {
        finalAmount = Math.round(selectedPrice.amount * 0.25);
        displayName = `${selectedPrice.name} (75% OFF - VIP 7-Day Invite)`;
      } else if (is50PercentOff) {
        finalAmount = Math.round(selectedPrice.amount * 0.5);
        displayName = `${selectedPrice.name} (50% OFF - Invite Special)`;
      }

      lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: displayName,
            },
            unit_amount: finalAmount,
            recurring: {
              interval: isAnnual ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ];
    } else {
      // Map plans to Stripe Price IDs (Production Live mode)
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

      const priceId = priceMap[planId.toLowerCase()]?.[billingCycle];

      if (!priceId) {
        if (isAnnual) {
          return NextResponse.json({ error: `Annual pricing for ${planId} is not yet configured. Please select Monthly billing or contact support.` }, { status: 400 });
        }
        return NextResponse.json({ error: "Invalid plan or missing price ID in environment variables." }, { status: 400 });
      }

      lineItems = [
        {
          price: priceId,
          quantity: 1,
        },
      ];
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

    // Apply discounts in live production mode (works for both annual and promo codes)
    if (!isTestMode) {
      if (is75PercentOff) {
        const discount75 = process.env.STRIPE_75OFF_COUPON_ID || process.env.STRIPE_REFERRAL_COUPON_ID;
        if (discount75) {
          if (discount75.startsWith('promo_')) {
            discounts.push({ promotion_code: discount75 });
          } else {
            discounts.push({ coupon: discount75 });
          }
        }
      } else if (is50PercentOff) {
        const discount50 = process.env.STRIPE_50OFF_COUPON_ID || process.env.STRIPE_REFERRAL_COUPON_ID;
        if (discount50) {
          if (discount50.startsWith('promo_')) {
            discounts.push({ promotion_code: discount50 });
          } else {
            discounts.push({ coupon: discount50 });
          }
        }
      } else if (isAnnual) {
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
    }

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    const origin = `${protocol}://${host}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionBody: any = {
      customer: customerId,
      mode: "subscription",
      allow_promotion_codes: discounts.length === 0 ? true : undefined,
      metadata: {
        restaurant_id: restaurant.id,
        plan_id: planId,
        billing_cycle: billingCycle,
        promo_code: normalizedPromo || undefined,
      },
      line_items: lineItems,
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

    let session = await fetchStripe("/checkout/sessions", {
      method: "POST",
      body: sessionBody
    });

    // If Stripe returns a coupon error (e.g. coupon_applies_to_nothing), fallback gracefully by enabling allow_promotion_codes and retrying
    if (session.error) {
      const isCouponError = session.error.code === "coupon_applies_to_nothing" || 
                            session.error.message?.toLowerCase().includes("coupon") || 
                            session.error.message?.toLowerCase().includes("discount");

      if (isCouponError && sessionBody.discounts) {
        console.warn("Stripe Coupon Error detected, falling back to allow_promotion_codes:", session.error.message);
        delete sessionBody.discounts;
        sessionBody.allow_promotion_codes = true;

        session = await fetchStripe("/checkout/sessions", {
          method: "POST",
          body: sessionBody
        });
      }
    }

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
