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

    // Pre-insert the order into the database securely via Service Role
    // This avoids hitting the 500-character Stripe metadata limit with items_json
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
    );

    const totalAmount = totalAmountCents / 100;
    
    const { error: orderError } = await adminSupabase.from("orders").insert({
      id: orderId,
      restaurant_id: restaurantId,
      table_number: tableNumber || null,
      customer_name: customerName || null,
      status: "awaiting_payment", // Will be flipped to 'pending' by the webhook
      total_amount: totalAmount,
      payment_intent_id: null,
    });

    if (orderError) {
      console.error("Failed to pre-insert order:", orderError);
      return NextResponse.json({ error: "Failed to initialize order" }, { status: 500 });
    }

    // Insert items
    const orderItems = items.map((i: { id?: string; menu_item_id?: string; quantity: number; price?: number; price_at_time_of_order?: number; notes?: string; customer_notes?: string; [key: string]: unknown }) => ({
      order_id: orderId,
      menu_item_id: i.menu_item_id || i.id,
      quantity: i.quantity,
      price_at_time_of_order: i.price_at_time_of_order || i.price || 0,
      customer_notes: i.customer_notes || i.notes || null,
    }));
    
    const { error: itemsError } = await adminSupabase.from("order_items").insert(orderItems);
    if (itemsError) {
      console.error("Failed to pre-insert order items:", itemsError);
    }

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
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
