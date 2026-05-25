"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitFeedback(
  restaurantId: string, 
  rating: number, 
  comment?: string,
  customerName?: string,
  contactInfo?: string,
  tableNumber?: string,
  qrCodeId?: string
) {
  const supabase = await createClient();

  // Basic validation
  if (!restaurantId) return { error: "Restaurant ID is required." };
  if (rating < 1 || rating > 5) return { error: "Rating must be between 1 and 5." };

  const { error } = await supabase.from("customer_feedback").insert({
    restaurant_id: restaurantId,
    rating,
    // @ts-ignore
    comment: comment?.trim() || null,
    // @ts-ignore
    customer_name: customerName?.trim() || null,
    // @ts-ignore
    contact_info: contactInfo?.trim() || null,
    // @ts-ignore
    table_number: tableNumber?.trim() || null,
    // @ts-ignore
    qr_code_id: qrCodeId?.trim() || null,
  });

  if (error) {
    console.error("Error submitting feedback:", error);
    return { error: "Failed to submit feedback. Please try again." };
  }

  return { success: true };
}
