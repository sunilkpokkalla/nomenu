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
      const planId = session.metadata?.plan_id;
      if (restaurantId && planId) {
        // Fetch current plan to see if it's an upgrade
        const { data: restaurant } = await supabase
          .from("restaurants")
          .select("plan, magic_credits, referred_by_code")
          .eq("id", restaurantId)
          .single();

        if (restaurant && restaurant.plan !== planId) {
          let bonus = 0;
          if (planId === "pro") bonus = 10;
          else if (planId === "elite") bonus = 25;
          else if (planId === "enterprise") bonus = 50;

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
            
            // Calculate and log affiliate payout (Legacy - actual payout happens in invoice.payment_succeeded)
            if (restaurant.referred_by_code) {
              const billingCycle = session.metadata?.billing_cycle || "monthly";
              const payoutAmount = getAffiliatePayout(planId, billingCycle);
              
              if (payoutAmount > 0) {
                const { error: payoutError } = await supabase
                  .from("affiliate_payouts")
                  .insert({
                    referrer_code: restaurant.referred_by_code,
                    referred_restaurant_id: restaurantId,
                    amount: payoutAmount,
                    status: "pending"
                  });
                  
                if (payoutError) {
                  console.error("Failed to record affiliate payout:", payoutError);
                } else {
                  console.log(`Recorded $${payoutAmount} payout for code ${restaurant.referred_by_code}`);
                }
              }
            }
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
        .update({ plan: "free" })
        .eq("stripe_subscription_id", subscription.id);
      
      if (error) {
        console.error("Failed to downgrade canceled subscription:", error);
      } else {
        console.log(`Downgraded subscription ${subscription.id} to free`);
      }
    } else if (subscription.status === "active") {
      let planId = subscription.metadata?.plan_id;
      const restaurantId = subscription.metadata?.restaurant_id;
      
      // CRITICAL FIX: The Stripe Customer Portal changes the Price ID, but DOES NOT update metadata.
      // We must resolve the actual plan from the current Price ID to handle upgrades/downgrades properly.
      const currentPriceId = subscription.items?.data?.[0]?.price?.id;
      if (currentPriceId) {
        if (currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL) {
          planId = "pro";
        } else if (currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE || currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_ANNUAL) {
          planId = "elite";
        } else if (currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE || currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL) {
          planId = "enterprise";
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
          if (planId === "pro") bonus = 5;
          else if (planId === "elite") bonus = 10;
          else if (planId === "enterprise") bonus = 25;
          
          const newCredits = (restaurant.magic_credits || 0) + bonus;
          
          const { error: updateError } = await supabase
            .from("restaurants")
            .update({
              plan: planId,
              stripe_subscription_id: subscription.id,
              magic_credits: newCredits
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
        .select("id, plan, billing_cycle, referred_by_code")
        .eq("stripe_subscription_id", subscriptionId)
        .single();
        
      if (restaurant && restaurant.referred_by_code) {
        // Calculate payout
        const payoutAmount = getAffiliatePayout(restaurant.plan, restaurant.billing_cycle);
        
        if (payoutAmount > 0) {
          // Look up affiliate
          const { data: affiliate } = await supabase
            .from("affiliates")
            .select("stripe_account_id, total_paid_amount, tier")
            .eq("referral_code", restaurant.referred_by_code)
            .single();
            
          if (affiliate && affiliate.stripe_account_id) {
            // Tier-based payout limit: Standard gets one-time bounty, Founding gets lifetime recurring
            if (affiliate.tier === "standard") {
              const { count } = await supabase
                .from("affiliate_payouts")
                .select("*", { count: "exact", head: true })
                .eq("referrer_code", restaurant.referred_by_code)
                .eq("referred_restaurant_id", restaurant.id)
                .eq("status", "paid");
                
              if (count && count > 0) {
                console.log(`Standard partner ${restaurant.referred_by_code} already received one-time bounty for restaurant ${restaurant.id}. Skipping payout.`);
                // Return successfully since we properly processed this event by skipping it
                return NextResponse.json({ received: true });
              }
            }
            
            try {
              // Execute Stripe Transfer from the charge
              await fetchStripe("/transfers", {
                method: "POST",
                body: {
                  amount: payoutAmount * 100, // Convert to cents
                  currency: "usd",
                  destination: affiliate.stripe_account_id,
                  source_transaction: invoice.charge as string,
                  description: `Commission for referring restaurant ${restaurant.id}`,
                }
              });
              console.log(`Successfully transferred $${payoutAmount} to ${affiliate.stripe_account_id}`);
              
              // Mark as paid in our database
              const newTotalPaid = (affiliate.total_paid_amount || 0) + payoutAmount;
              await supabase
                .from("affiliates")
                .update({ total_paid_amount: newTotalPaid })
                .eq("referral_code", restaurant.referred_by_code);
                
              // Log the payout to enforce standard tier limit
              await supabase.from("affiliate_payouts").insert({
                referrer_code: restaurant.referred_by_code,
                referred_restaurant_id: restaurant.id,
                amount: payoutAmount,
                status: "paid"
              });
                
            } catch (transferError) {
              console.error("Failed to execute Stripe Transfer:", transferError);
            }
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
