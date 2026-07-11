import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createClient } from "@supabase/supabase-js";
import { verifyStripeWebhook, fetchStripe } from "@/lib/stripe-fetch";
import { getAffiliatePayout } from "@/lib/affiliate";

export async function POST(req: Request) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  // Instantiate supabase inside the handler to prevent build-time crashes on Vercel
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;

  try {
    if (!verifyStripeWebhook(payload, signature, endpointSecret)) {
      throw new Error("Invalid signature");
    }
    event = JSON.parse(payload);
  } catch (err: unknown) {
    console.error("Webhook signature verification failed:", (err as Error).message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle Webhook Events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    // Is this a SaaS subscription upgrade?
    if (session.mode === "subscription") {
      const restaurantId = session.metadata?.restaurant_id;
      const planId = session.metadata?.plan_id?.toLowerCase();
      if (restaurantId && planId) {
        // Fetch current plan to see if it's an upgrade
        const { data: restaurant } = await supabase
          .from("restaurants")
          .select("plan, magic_credits, referred_by_code")
          .eq("id", restaurantId)
          .single();

        if (restaurant && restaurant.plan !== planId) {
          let bonus = 0;
          if (planId === "pro") bonus = 25;
          else if (planId === "elite") bonus = 50;
          else if (planId === "enterprise") bonus = 75;

          const newCredits = (restaurant.magic_credits || 0) + bonus;

          const { error: updateError } = await supabase
            .from("restaurants")
            .update({
              plan: planId,
              stripe_subscription_id: session.subscription as string,
              magic_credits: newCredits
            })
            .eq("id", restaurantId);
          if (updateError) {
            console.error("Failed to upgrade SaaS plan:", updateError);
          } else {
            console.log(`Restaurant ${restaurantId} upgraded to ${planId}. Added ${bonus} magic credits.`);
          }
        }
      }
    } else if (session.mode === "payment") {
      const orderId = session.metadata?.order_id;
      if (orderId) {
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            status: "pending",
            is_paid: true,
            paid_at: new Date().toISOString(),
            payment_intent_id: session.payment_intent as string,
          })
          .eq("id", orderId);
        
        if (updateError) {
          console.error("Failed to update order status:", updateError);
        } else {
          console.log(`Order ${orderId} marked as pending (paid).`);
        }
      }
      
      const type = session.metadata?.type;
      const jobId = session.metadata?.job_id;
      
      if (type === "magic_credits") {
        const restaurantId = session.metadata?.restaurant_id;
        if (restaurantId) {
          // Add 20 magic credits to the restaurant
          const { data: restaurant } = await supabase
            .from("restaurants")
            .select("magic_credits")
            .eq("id", restaurantId)
            .single();
            
          const currentCredits = restaurant?.magic_credits || 0;
          
          const { error: updateError } = await supabase
            .from("restaurants")
            .update({ magic_credits: currentCredits + 20 })
            .eq("id", restaurantId);
            
          if (updateError) {
            console.error("Failed to add magic credits:", updateError);
          } else {
            console.log(`Added 20 magic credits to restaurant ${restaurantId}`);
          }
        }
      } else if (type === "ai_image_generation" && jobId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from("ai_image_jobs")
          .update({ status: "paid" })
          .eq("id", jobId);
          
        if (updateError) {
          console.error("Failed to mark ai image job as paid:", updateError);
        } else {
          console.log(`AI Image Job ${jobId} marked as paid.`);
        }
      }
    }
  } else if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
    const subscription = event.data.object;
    
    // If subscription was canceled or past due, downgrade to free
    if (subscription.status === "canceled" || subscription.status === "unpaid") {
      const { error } = await supabase
        .from("restaurants")
        .update({ 
          plan: "free",
          is_annual_plan: false,
          subscription_start_date: null
        })
        .eq("stripe_subscription_id", subscription.id);
      
      if (error) {
        console.error("Failed to downgrade canceled subscription:", error);
      } else {
        console.log(`Downgraded subscription ${subscription.id} to free`);
      }
    } else if (subscription.status === "active") {
      let planId = subscription.metadata?.plan_id?.toLowerCase();
      const restaurantId = subscription.metadata?.restaurant_id;
      
      // CRITICAL FIX: The Stripe Customer Portal changes the Price ID, but DOES NOT update metadata.
      // We must resolve the actual plan from the current Price ID to handle upgrades/downgrades properly.
      let isAnnual = false;
      const currentPriceId = subscription.items?.data?.[0]?.price?.id;
      if (currentPriceId) {
        if (currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL) {
          planId = "pro";
          isAnnual = currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL;
        } else if (currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE || currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_ANNUAL) {
          planId = "elite";
          isAnnual = currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_ANNUAL;
        } else if (currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE || currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL) {
          planId = "enterprise";
          isAnnual = currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL;
        }
      }
      
      if (restaurantId && planId) {
        const { data: restaurant } = await supabase
          .from("restaurants")
          .select("plan, magic_credits")
          .eq("id", restaurantId)
          .single();
          
        if (restaurant && restaurant.plan !== planId) {
          let bonus = 0;
          if (planId === "pro") bonus = 25;
          else if (planId === "elite") bonus = 50;
          else if (planId === "enterprise") bonus = 75;
          
          const newCredits = (restaurant.magic_credits || 0) + bonus;
          
          const { error: updateError } = await supabase
            .from("restaurants")
            .update({
              plan: planId,
              is_annual_plan: isAnnual,
              subscription_start_date: new Date().toISOString(),
              magic_credits: newCredits,
              stripe_subscription_id: subscription.id,
            })
            .eq("id", restaurantId);
            
          if (!updateError) {
            console.log(`Upgraded restaurant ${restaurantId} to ${planId}. Added ${bonus} magic credits.`);
          }
        }
      }
    }
  } else if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;
    
    // Only process for subscription invoices
    if (invoice.subscription && invoice.charge) {
      const subscriptionId = invoice.subscription;
      
      // We need to fetch the subscription to get metadata
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("id, owner_id, plan, billing_cycle, referred_by_code, magic_credits")
        .eq("stripe_subscription_id", subscriptionId)
        .single();
        
      if (restaurant) {
        // Grant Monthly Magic Credits on Subscription Renewals
        if (invoice.billing_reason === "subscription_cycle" && restaurant.plan) {
          let renewalBonus = 0;
          if (restaurant.plan === "pro") renewalBonus = 25;
          else if (restaurant.plan === "elite") renewalBonus = 50;
          else if (restaurant.plan === "enterprise") renewalBonus = 75;

          if (renewalBonus > 0) {
            const newCredits = (restaurant.magic_credits || 0) + renewalBonus;
            const { error: creditError } = await supabase
              .from("restaurants")
              .update({ magic_credits: newCredits })
              .eq("id", restaurant.id);
              
            if (!creditError) {
              console.log(`Monthly renewal: Added ${renewalBonus} magic credits to restaurant ${restaurant.id}.`);
            } else {
              console.error(`Failed to add monthly credits for ${restaurant.id}:`, creditError);
            }
          }
        }
      }
        
      if (restaurant && restaurant.referred_by_code) {
        // Prevent self-referrals and free-plan referrers
        const { data: referrerRestaurant } = await supabase
          .from("restaurants")
          .select("owner_id, plan")
          .eq("slug", restaurant.referred_by_code)
          .maybeSingle();
          
        if (referrerRestaurant) {
          if (referrerRestaurant.owner_id === restaurant.owner_id) {
            console.log(`Self-referral blocked for restaurant ${restaurant.id}.`);
            return NextResponse.json({ received: true });
          }
          
          // Must have a paid plan to earn referral payouts
          if (referrerRestaurant.plan === "free") {
            console.log(`Referrer ${restaurant.referred_by_code} is on a free plan. Payout blocked.`);
            return NextResponse.json({ received: true });
          }
        }

        // Calculate payout
        const payoutAmount = getAffiliatePayout(restaurant.plan, restaurant.billing_cycle);
        
        if (payoutAmount > 0) {
          // Check if this is a standard affiliate (one-time bounty limit)
          const { data: affiliate } = await supabase
            .from("affiliates")
            .select("tier")
            .eq("referral_code", restaurant.referred_by_code)
            .maybeSingle();

          if (affiliate && affiliate.tier === "standard") {
            const { count } = await supabase
              .from("affiliate_payouts")
              .select("*", { count: "exact", head: true })
              .eq("referrer_code", restaurant.referred_by_code)
              .eq("referred_restaurant_id", restaurant.id);
              
            if (count && count > 0) {
              console.log(`Standard partner ${restaurant.referred_by_code} already received bounty for ${restaurant.id}. Skipping.`);
              return NextResponse.json({ received: true });
            }
          }

          // Create pending payout with 60-day hold
          const clearsAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
          
          await supabase.from("affiliate_payouts").insert({
            referrer_code: restaurant.referred_by_code,
            referred_restaurant_id: restaurant.id,
            amount: payoutAmount,
            status: "pending",
            clears_at: clearsAt
          });
          
          console.log(`Recorded pending $${payoutAmount} payout for code ${restaurant.referred_by_code} with 60-day hold.`);
        }
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
