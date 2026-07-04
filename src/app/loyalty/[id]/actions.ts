"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function consolidateLoyaltyCards(restaurantId: string, phoneNumber: string) {
  const adminClient = createAdminClient();

  // 1. Fetch all cards for this phone number and restaurant
  const { data: cards, error } = await adminClient
    .from("loyalty_cards")
    .select("id, stamps, created_at, active_reward")
    .eq("restaurant_id", restaurantId)
    .eq("phone_number", phoneNumber)
    .order("stamps", { ascending: false }) // Prioritize card with most stamps
    .order("created_at", { ascending: true }); // Then oldest card

  if (error || !cards || cards.length === 0) {
    return null;
  }

  if (cards.length === 1) {
    return cards[0].id;
  }

  // 2. We have duplicates. The first one is our master card.
  const masterCard = cards[0];
  let totalExtraStamps = 0;
  const duplicateIds = [];
  let activeReward = masterCard.active_reward;

  for (let i = 1; i < cards.length; i++) {
    totalExtraStamps += (cards[i].stamps || 0);
    duplicateIds.push(cards[i].id);
    if (!activeReward && cards[i].active_reward) {
       activeReward = cards[i].active_reward;
    }
  }

  // 3. Update master card
  const updateData: { stamps?: number; active_reward?: string | null } = {};
  if (totalExtraStamps > 0) {
    updateData.stamps = masterCard.stamps + totalExtraStamps;
  }
  if (activeReward !== masterCard.active_reward) {
    updateData.active_reward = activeReward || null;
  }

  if (Object.keys(updateData).length > 0) {
    await adminClient
      .from("loyalty_cards")
      .update(updateData)
      .eq("id", masterCard.id);
  }

  // 4. Delete duplicate cards
  if (duplicateIds.length > 0) {
    await adminClient
      .from("loyalty_cards")
      .delete()
      .in("id", duplicateIds);
  }

  return masterCard.id;
}

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
    // If it's already linked to this exact number, just run consolidation
    if (card.phone_number === phoneNumber && card.restaurant_id) {
       const consolidatedId = await consolidateLoyaltyCards(card.restaurant_id, phoneNumber);
       return { success: true, alreadyLinked: true, existingCardId: consolidatedId };
    }
    return { error: "This card is already linked to a phone number." };
  }

  if (!card.restaurant_id) {
    return { error: "Loyalty card is missing a restaurant." };
  }

  // 1. Assign the phone number to the current card first
  const { error: updateError } = await adminClient
    .from("loyalty_cards")
    .update({ phone_number: phoneNumber })
    .eq("id", cardId);

  if (updateError) {
    return { error: "Failed to link phone number." };
  }

  // 2. Immediately run the aggressive consolidation
  const consolidatedId = await consolidateLoyaltyCards(card.restaurant_id, phoneNumber);

  // If the consolidated ID is different from our cardId, it means our card was merged and deleted
  if (consolidatedId && consolidatedId !== cardId) {
    return { success: true, alreadyLinked: true, existingCardId: consolidatedId };
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
