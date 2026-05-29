import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummyKeyForBuildProcess123", {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(req: Request) {
  try {
    const { restaurantId, items, returnUrl, orderId, tableNumber, customerName } = await req.json();

    if (!restaurantId || !items || !items.length || !orderId) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get the restaurant's stripe_account_id
    const { data: _restaurantData, error: fetchError } = await supabase
      .from("restaurants")
      .select("stripe_account_id, plan")
      .eq("id", restaurantId)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const restaurant = _restaurantData as any;
    if (fetchError || !restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    if (!restaurant.stripe_account_id) {
      return NextResponse.json({ error: "Restaurant has not configured payments." }, { status: 400 });
    }

    // Build line items for Stripe Checkout
    let totalAmountCents = 0;
    const lineItems = items.map((item: {price: number, quantity: number, name: string, id?: string, item_id?: string}) => {
      const unitAmount = Math.round(item.price * 100); // Stripe expects cents
      totalAmountCents += unitAmount * item.quantity;
      
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            metadata: {
              item_id: item.id || item.item_id,
            }
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    // 2.5% Platform Fee
    const applicationFeeAmountCents = Math.round(totalAmountCents * 0.025);

    // Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Apple Pay and Google Pay are included automatically
      line_items: lineItems,
      mode: "payment",
      success_url: `${returnUrl}?success=true`,
      cancel_url: `${returnUrl}?canceled=true`,
      client_reference_id: orderId,
      payment_intent_data: {
        application_fee_amount: applicationFeeAmountCents,
        transfer_data: {
          destination: restaurant.stripe_account_id,
        },
      },
      metadata: {
        restaurant_id: restaurantId,
        order_id: orderId,
        table_number: tableNumber || "",
        customer_name: customerName || "",
        items_json: JSON.stringify(items), // We pass this so the webhook can insert the order into the DB
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
