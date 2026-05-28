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
  menuId: string;
  tableNumber: string | null;
  customerName: string | null;
  totalAmount: number; // We'll recalculate this, but keep the signature for backwards compatibility
  items: {
    menu_item_id: string;
    quantity: number;
    price_at_time_of_order: number; // Ignored, recalculated securely
    customer_notes: string | null;
  }[];
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // 1. Strict Server-Side Validation
  if (!data.restaurantId) return { error: "Restaurant ID is required." };
  if (!data.items || data.items.length === 0) return { error: "Order must contain at least one item." };
  if (data.items.length > 100) return { error: "Order exceeds maximum item limit." };
  
  const safeTableNumber = data.tableNumber ? data.tableNumber.substring(0, 50).trim() : null;
  const safeCustomerName = data.customerName ? data.customerName.substring(0, 100).trim() : null;

  // 2. Fetch secure prices from the database for all requested items
  const menuItemIds = data.items.map(i => i.menu_item_id);
  
  const { data: realMenuItems, error: menuError } = await supabase
    .from("menu_items")
    .select("id, price, restaurant_id")
    .in("id", menuItemIds);

  if (menuError || !realMenuItems || realMenuItems.length === 0) {
    console.error("Error fetching menu items:", menuError);
    return { error: "Failed to validate order items. Please try again." };
  }

  // 2.5 Fetch Menu to get Tax and Service Charge
  const { data: menuData } = await supabase
    .from("menus")
    .select("tax_rate, service_charge, service_charge_type")
    .eq("id", data.menuId)
    .single();

  const taxRate = menuData?.tax_rate || 0;
  const serviceCharge = menuData?.service_charge || 0;
  const serviceChargeType = menuData?.service_charge_type || "percentage";

  // 3. Recalculate Total and Build Secure Item List
  let secureSubtotal = 0;
  const secureItemsToInsert: {
    menu_item_id: string;
    quantity: number;
    price_at_time_of_order: number;
    customer_notes: string | null;
  }[] = [];

  for (const item of data.items) {
    const realItem = realMenuItems.find(ri => ri.id === item.menu_item_id);
    
    // Validate the item exists and belongs to the correct restaurant
    if (!realItem || realItem.restaurant_id !== data.restaurantId) {
      return { error: "Invalid item in order." };
    }

    // Validate quantity
    const safeQty = Math.max(1, Math.min(100, Math.floor(item.quantity)));
    const safeNotes = item.customer_notes ? item.customer_notes.substring(0, 500).trim() : null;

    secureSubtotal += Number(realItem.price) * safeQty;

    secureItemsToInsert.push({
      // order_id gets attached after order insertion
      menu_item_id: item.menu_item_id,
      quantity: safeQty,
      price_at_time_of_order: realItem.price, // Use real price from DB
      customer_notes: safeNotes
    });
  }

  // Calculate final amount with taxes and fees
  const taxAmount = secureSubtotal * (taxRate / 100);
  const serviceFeeAmount = serviceChargeType === "flat" ? Number(serviceCharge) : secureSubtotal * (Number(serviceCharge) / 100);
  const secureTotalAmount = secureSubtotal + taxAmount + serviceFeeAmount;

  // 4. Insert Order Securely
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: order, error: orderError } = await (supabase.from("orders") as any)
    .insert({
      restaurant_id: data.restaurantId,
      table_number: safeTableNumber,
      customer_name: safeCustomerName,
      total_amount: secureTotalAmount,
      status: "pending"
    })
    .select("id, daily_order_number")
    .single();

  if (orderError || !order) {
    console.error("Error creating order:", orderError);
    return { error: "Failed to place order. Please try again." };
  }

  // 5. Insert Order Items Securely
  const itemsWithOrderId = secureItemsToInsert.map(item => ({
    ...item,
    order_id: order.id
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsWithOrderId);

  if (itemsError) {
    console.error("Error adding order items:", itemsError);
    // Best effort rollback
    await supabase.from("orders").delete().eq("id", order.id);
    return { error: "Order placed, but some items failed to save." };
  }

  return { success: true, orderId: order.id, dailyOrderNumber: order.daily_order_number };
}
