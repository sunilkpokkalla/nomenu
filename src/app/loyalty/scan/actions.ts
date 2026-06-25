"use server";

import { createClient } from "@/lib/supabase/server";

export async function claimLoyaltyStamp(tokenId: string, storedCards: Record<string, string> = {}) {
  const supabase = await createClient();

  // 1. Fetch token to check expiry
  const { data: token, error: tokenError } = await supabase
    .from("loyalty_scan_tokens")
    .select("id, restaurant_id, expires_at")
    .eq("id", tokenId)
    .single();

  if (tokenError || !token) {
    return { error: "Invalid QR code." };
  }

  const now = new Date();
  const expiresAt = new Date(token.expires_at);

  if (now > expiresAt) {
    return { error: "This QR code has expired. Please ask the staff for a new one." };
  }

  // 2. Mark token as used ATOMICALLY to prevent race conditions (e.g. React double-fires)
  const { data: updatedToken, error: updateError } = await supabase
    .from("loyalty_scan_tokens")
    .update({ is_used: true })
    .eq("id", tokenId)
    .eq("is_used", false)
    .select("id")
    .single();

  if (updateError || !updatedToken) {
    return { error: "This QR code has already been scanned. Please ask the staff for a new one." };
  }

  // Find if customer already has a card for this restaurant in their local storage
  const existingLoyaltyCardId = storedCards[token.restaurant_id];

  // 3. Award the stamp
  if (existingLoyaltyCardId) {
    // Check if the card belongs to this restaurant
    const { data: card, error: cardError } = await supabase
      .from("loyalty_cards")
      .select("id, restaurant_id, stamps, last_stamp_at")
      .eq("id", existingLoyaltyCardId)
      .single();

    if (cardError || !card || card.restaurant_id !== token.restaurant_id) {
      // The card might have been deleted or doesn't match
      return await createNewCard(supabase, token.restaurant_id);
    }

    // Cooldown check: Prevent multiple stamps within 12 hours
    if (card.last_stamp_at) {
      const lastStampTime = new Date(card.last_stamp_at).getTime();
      const nowTime = new Date().getTime();
      const hoursSinceLastStamp = (nowTime - lastStampTime) / (1000 * 60 * 60);
      
      if (hoursSinceLastStamp < 12) {
        return { error: "You've already earned a stamp today! Please wait 12 hours before claiming another." };
      }
    }

    // Add stamp to existing card
    const { error: stampError } = await supabase
      .from("loyalty_cards")
      .update({ 
        stamps: card.stamps + 1,
        last_stamp_at: new Date().toISOString()
      })
      .eq("id", existingLoyaltyCardId);

    if (stampError) {
      console.error("Failed to add stamp to existing card:", stampError);
      return { error: "Failed to add stamp." };
    }

    return { success: true, cardId: existingLoyaltyCardId, restaurantId: token.restaurant_id };

  } else {
    // Create new card for this customer
    return await createNewCard(supabase, token.restaurant_id);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createNewCard(supabase: any, restaurantId: string) {
  const { data: newCard, error: newCardError } = await supabase
    .from("loyalty_cards")
    .insert({
      restaurant_id: restaurantId,
      stamps: 1,
      last_stamp_at: new Date().toISOString()
    })
    .select("id")
    .single();

  if (newCardError || !newCard) {
    console.error("Failed to create new loyalty card:", newCardError);
    return { error: "Failed to create loyalty card." };
  }

  return { success: true, cardId: newCard.id, restaurantId: restaurantId, isNew: true };
}
