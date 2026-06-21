import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createClient } from "@supabase/supabase-js";
import { verifyStripeWebhook } from "@/lib/stripe-fetch";

export async function POST(req: Request) {
  // Notice we use a different secret for connect webhooks!
  const endpointSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET!;

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
    console.error("Connect Webhook signature verification failed:", (err as Error).message);
    return NextResponse.json({ error: "Connect Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    // In Direct Charges, the order metadata comes directly from the session
    if (session.mode === "payment") {
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
          console.error("Failed to update order status to pending via connect webhook:", updateError);
          return NextResponse.json({ error: "DB Error" }, { status: 500 });
        }
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
