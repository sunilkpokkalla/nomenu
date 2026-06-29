"use server";

import { createClient } from "@/lib/supabase/server";

export async function linkPhoneNumber(cardId: string, phoneNumber: string) {
  const supabase = await createClient();

  const { data: card, error: cardError } = await supabase
    .from("loyalty_cards")
    .select("id, restaurant_id, phone_number")
    .eq("id", cardId)
    .single();

  if (cardError || !card) {
    return { error: "Loyalty card not found." };
  }

  if (card.phone_number) {
    return { error: "This card is already linked to a phone number." };
  }

  if (!card.restaurant_id) {
    return { error: "Loyalty card is missing a restaurant." };
  }

  // Check if another card already has this phone number for this restaurant
  const { data: existingPhoneCard } = await supabase
    .from("loyalty_cards")
    .select("id")
    .eq("restaurant_id", card.restaurant_id)
    .eq("phone_number", phoneNumber)
    .maybeSingle();

  if (existingPhoneCard) {
    return { success: true, alreadyLinked: true, existingCardId: existingPhoneCard.id };
  }

  const { error: updateError } = await supabase
    .from("loyalty_cards")
    .update({ phone_number: phoneNumber })
    .eq("id", cardId);

  if (updateError) {
    return { error: "Failed to link phone number." };
  }

  return { success: true };
}
