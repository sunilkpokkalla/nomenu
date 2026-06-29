"use server";

import { createClient } from "@/lib/supabase/server";

export async function fetchFeedbackOrderDetails(restaurantId: string, tableNumber: string, feedbackDate: string) {
  const supabase = await createClient();

  // Look for the latest order for this table that was created before the feedback
  // and within the last 4 hours of the feedback.
  const fbDate = new Date(feedbackDate);
  const fourHoursAgo = new Date(fbDate.getTime() - 4 * 60 * 60 * 1000);

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*, menu_items(name))')
    .eq('restaurant_id', restaurantId)
    .eq('table_number', tableNumber)
    .lte('created_at', fbDate.toISOString())
    .gte('created_at', fourHoursAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching matching order:", error);
    return null;
  }

  return order;
}
