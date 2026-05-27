"use server";

import { createClient } from "@supabase/supabase-js";

export async function submitFeedback(
  restaurantId: string, 
  rating: number, 
  comment?: string,
  customerName?: string,
  contactInfo?: string,
  tableNumber?: string,
  qrCodeId?: string
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // Basic validation
  if (!restaurantId) return { error: "Restaurant ID is required." };
  if (rating < 1 || rating > 5) return { error: "Rating must be between 1 and 5." };

  const { error } = await supabase.from("customer_feedback").insert({
    restaurant_id: restaurantId,
    rating,
    comment: comment?.trim() || null,
    customer_name: customerName?.trim() || null,
    contact_info: contactInfo?.trim() || null,
    table_number: tableNumber?.trim() || null,
    qr_code_id: qrCodeId?.trim() || null,
  });

  if (error) {
    console.error("Error submitting feedback:", error);
    return { error: "Failed to submit feedback. Please try again." };
  }

  return { success: true };
}

export async function submitOrder(data: {
  restaurantId: string;
  tableNumber: string | null;
  customerName: string | null;
  totalAmount: number;
  items: {
    menu_item_id: string;
    quantity: number;
    price_at_time_of_order: number;
    customer_notes: string | null;
  }[];
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // 1. Insert Order
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: order, error: orderError } = await (supabase.from("orders") as any)
    .insert({
      restaurant_id: data.restaurantId,
      table_number: data.tableNumber,
      customer_name: data.customerName,
      total_amount: data.totalAmount,
      status: "pending"
    })
    .select("id, daily_order_number")
    .single();

  if (orderError || !order) {
    console.error("Error creating order:", orderError);
    return { error: "Failed to place order. Please try again." };
  }

  // 2. Insert Order Items
  const itemsToInsert = data.items.map(item => ({
    order_id: order.id,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    price_at_time_of_order: item.price_at_time_of_order,
    customer_notes: item.customer_notes
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);

  if (itemsError) {
    console.error("Error adding order items:", itemsError);
    // Ideally we'd rollback the order here, but for simplicity we return an error
    return { error: "Order placed, but some items failed to save." };
  }

  return { success: true, orderId: order.id, dailyOrderNumber: order.daily_order_number };
}
