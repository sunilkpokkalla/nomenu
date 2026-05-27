"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }

  return { success: true };
}
