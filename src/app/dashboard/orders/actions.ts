"use server";

import { createClient } from "@/lib/supabase/server";
import { fetchStripe } from "@/lib/stripe-fetch";

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();

  // If the status is 'cancelled', attempt to refund via Stripe first
  if (status === "cancelled") {
    // 1. Fetch the order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("payment_intent_id, restaurant_id")
      .eq("id", orderId)
      .single();

    if (orderError) {
      console.error("Error fetching order for cancellation:", orderError);
      throw new Error("Failed to fetch order details for cancellation");
    }

    if (order && order.payment_intent_id) {
      // 2. Fetch the restaurant's stripe_account_id
      const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .select("stripe_account_id")
        .eq("id", order.restaurant_id)
        .single();

      if (restaurantError || !restaurant?.stripe_account_id) {
        console.error("Error fetching restaurant stripe account for refund:", restaurantError);
        throw new Error("Could not find Stripe account for this restaurant");
      }

      // 3. Issue the refund via Stripe
      try {
        await fetchStripe("/refunds", {
          method: "POST",
          headers: {
            "Stripe-Account": restaurant.stripe_account_id
          },
          body: {
            payment_intent: order.payment_intent_id
          }
        });
        console.log(`Successfully refunded payment intent ${order.payment_intent_id} for order ${orderId}`);
      } catch (stripeError: unknown) {
        console.error("Stripe Refund Error:", stripeError);
        // Do not throw an error if the charge has already been refunded (Stripe handles idempotency)
        // Otherwise, throw so the user knows the refund failed.
        const errorMessage = (stripeError as Error).message || "";
        if (!errorMessage.includes("has already been refunded")) {
           throw new Error("Failed to process refund: " + errorMessage);
        }
      }
    }
  }

  // 4. Update the order status in Supabase
  const updateData: { status: string; ended_at?: string | null } = { status };
  if (["completed", "cancelled", "cancelled_by_customer", "cancelled_by_restaurant"].includes(status)) {
    updateData.ended_at = new Date().toISOString();
  } else {
    updateData.ended_at = null;
  }

  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }

  return { success: true };
}

export async function toggleOrderPaymentStatus(orderId: string, isPaid: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ is_paid: isPaid })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order payment status:", error);
    throw new Error("Failed to update order payment status");
  }

  return { success: true };
}
