"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function linkPhoneNumber(cardId: string, phoneNumber: string) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const { data: card, error: cardError } = await supabase
    .from("loyalty_cards")
    .select("id, restaurant_id, phone_number, stamps")
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
    .select("id, stamps")
    .eq("restaurant_id", card.restaurant_id)
    .eq("phone_number", phoneNumber)
    .maybeSingle();

  if (existingPhoneCard) {
    // MERGE LOGIC: Add the anonymous card's stamps to the existing card
    if (card.stamps > 0) {
      await adminClient
        .from("loyalty_cards")
        .update({ stamps: (existingPhoneCard.stamps || 0) + card.stamps })
        .eq("id", existingPhoneCard.id);
    }
    
    // Delete the temporary anonymous card
    await adminClient.from("loyalty_cards").delete().eq("id", cardId);

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

export async function claimActiveReward(cardId: string) {
  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("loyalty_cards")
    .update({ active_reward: null })
    .eq("id", cardId);

  if (error) {
    return { error: "Failed to claim reward." };
  }
  return { success: true };
}
