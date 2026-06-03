import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia",
    httpClient: Stripe.createFetchHttpClient(),
  });
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  // Instantiate supabase inside the handler to prevent build-time crashes on Vercel
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err: unknown) {
    console.error("Webhook signature verification failed:", (err as Error).message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle Webhook Events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Is this a food order or a SaaS subscription upgrade?
    if (session.mode === "subscription") {
      const restaurantId = session.metadata?.restaurant_id;
      const planId = session.metadata?.plan_id;
      if (restaurantId && planId) {
        // Update restaurant plan to active subscription
        const { error: updateError } = await supabase
          .from("restaurants")
          .update({
            plan: planId,
            stripe_subscription_id: session.subscription as string,
          })
          .eq("id", restaurantId);
        if (updateError) {
          console.error("Failed to upgrade SaaS plan:", updateError);
        } else {
          console.log(`Restaurant ${restaurantId} upgraded to ${planId}`);
        }
      }
    } else if (session.mode === "payment") {
      // Retrieve metadata we passed during checkout creation
      const restaurantId = session.metadata?.restaurant_id;
      const orderId = session.metadata?.order_id;

      if (restaurantId && orderId) {
        // Since we pre-inserted the order in the checkout route as 'awaiting_payment',
        // we just need to flip the status to 'pending' and attach the payment intent.
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            status: "pending",
            payment_intent_id: session.payment_intent as string,
          })
          .eq("id", orderId)
          .eq("restaurant_id", restaurantId);

        if (updateError) {
          console.error("Failed to update order status to pending:", updateError);
          return NextResponse.json({ error: "DB Error" }, { status: 500 });
        } else {
          console.log("Order payment confirmed, moved to pending. Order ID:", orderId);
        }
      }
    }
  } else if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    
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
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
