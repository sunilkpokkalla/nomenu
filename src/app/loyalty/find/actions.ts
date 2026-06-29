"use server";

import { createClient } from "@/lib/supabase/server";

export async function findLoyaltyCardsByPhone(phoneNumber: string) {
  if (!phoneNumber || phoneNumber.trim().length < 5) {
    return { error: "Please enter a valid phone number." };
  }

  const supabase = await createClient();

  const { data: cards, error } = await supabase
    .from("loyalty_cards")
    .select(`
      id,
      stamps,
      restaurants (
        name,
        logo_url,
        primary_color,
        loyalty_stamp_color,
        loyalty_stamp_icon
      )
    `)
    .eq("phone_number", phoneNumber.trim());

  if (error) {
    console.error("Error finding loyalty cards:", error);
    return { error: "Failed to search for VIP cards. Please try again." };
  }

  if (!cards || cards.length === 0) {
    return { error: "No VIP cards found for this phone number." };
  }

  // Filter out any cards that might have a broken restaurant reference
  const validCards = cards.filter(card => card.restaurants);

  if (validCards.length === 0) {
    return { error: "No VIP cards found for this phone number." };
  }

  return { success: true, cards: validCards };
}
