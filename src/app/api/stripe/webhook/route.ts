import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// We use the service key because webhooks aren't authenticated by a user
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-05-27.dahlia",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err: unknown) {
    console.error("Webhook signature verification failed:", (err as Error).message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Retrieve metadata we passed during checkout creation
    const restaurantId = session.metadata?.restaurant_id;
    const orderId = session.metadata?.order_id;
    const tableNumber = session.metadata?.table_number;
    const customerName = session.metadata?.customer_name;
    const itemsJsonStr = session.metadata?.items_json;

    if (restaurantId && itemsJsonStr && orderId) {
      const items = JSON.parse(itemsJsonStr);
      
      // Calculate total
      const totalAmount = (session.amount_total || 0) / 100;
      
      // 1. Insert the order
      const { error: orderError } = await supabase
        .from("orders")
        .insert({
          id: orderId,
          restaurant_id: restaurantId,
          table_number: tableNumber || null,
          customer_name: customerName || null,
          status: "pending",
          total_amount: totalAmount,
          payment_intent_id: session.payment_intent as string,
        });

      if (orderError) {
        console.error("Failed to insert order into DB:", orderError);
        return NextResponse.json({ error: "DB Error" }, { status: 500 });
      }

      // 2. Insert the order items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orderItems = items.map((i: any) => ({
        order_id: orderId,
        menu_item_id: i.menu_item_id || i.id,
        quantity: i.quantity,
        price_at_time_of_order: i.price_at_time_of_order || i.price || 0,
        customer_notes: i.customer_notes || i.notes || null,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Failed to insert order items:", itemsError);
      } else {
        console.log("Order successfully created for restaurant:", restaurantId, "Order ID:", orderId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
