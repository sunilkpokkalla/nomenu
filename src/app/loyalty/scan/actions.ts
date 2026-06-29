"use server";

import { createClient } from "@/lib/supabase/server";

export async function resolveLoyaltyToken(tokenId: string) {
  const supabase = await createClient();
  const { data: token, error: tokenError } = await supabase
    .from("loyalty_scan_tokens")
    .select("id, restaurant_id, expires_at, is_used")
    .eq("id", tokenId)
    .single();

  if (tokenError || !token) {
    return { error: "Invalid QR code." };
  }
  if (token.is_used) {
    return { error: "This QR code has already been scanned. Please ask the staff for a new one." };
  }
  if (new Date() > new Date(token.expires_at)) {
    return { error: "This QR code has expired. Please ask the staff for a new one." };
  }
  return { success: true, restaurantId: token.restaurant_id };
}

export async function claimLoyaltyStamp(tokenId: string, cardId?: string, phoneNumber?: string) {
  const supabase = await createClient();

  // 1. Fetch token to check expiry and restaurant_id
  const { data: token, error: tokenError } = await supabase
    .from("loyalty_scan_tokens")
    .select("id, restaurant_id, expires_at, is_used")
    .eq("id", tokenId)
    .single();

  if (tokenError || !token) return { error: "Invalid QR code." };
  if (token.is_used) return { error: "This QR code has already been scanned." };
  if (new Date() > new Date(token.expires_at)) return { error: "This QR code has expired." };

  let targetCardId = cardId;
  let isNewCard = false;

  // 2. Resolve target card
  if (!targetCardId && phoneNumber) {
    // Look for existing card by phone number
    const { data: existingPhoneCard } = await supabase
      .from("loyalty_cards")
      .select("id, last_stamp_at, stamps")
      .eq("restaurant_id", token.restaurant_id)
      .eq("phone_number", phoneNumber)
      .maybeSingle();

    if (existingPhoneCard) {
      targetCardId = existingPhoneCard.id;
    } else {
      // Create new card with phone number
      const { data: newCard, error: newCardError } = await supabase
        .from("loyalty_cards")
        .insert({
          restaurant_id: token.restaurant_id,
          phone_number: phoneNumber,
          stamps: 0,
        })
        .select("id")
        .single();
      
      if (newCardError || !newCard) return { error: `Failed to create loyalty card: ${newCardError?.message || "Unknown error"}` };
      targetCardId = newCard.id;
      isNewCard = true;
    }
  } else if (!targetCardId) {
    // Create new anonymous card
    const { data: newCard, error: newCardError } = await supabase
      .from("loyalty_cards")
      .insert({
        restaurant_id: token.restaurant_id,
        stamps: 0,
      })
      .select("id")
      .single();
      
    if (newCardError || !newCard) return { error: `Failed to create loyalty card: ${newCardError?.message || "Unknown error"}` };
    targetCardId = newCard.id;
    isNewCard = true;
  }

  // 3. Verify card and check cooldown
  if (!isNewCard && targetCardId) {
    const { data: card, error: cardError } = await supabase
      .from("loyalty_cards")
      .select("id, restaurant_id, stamps, last_stamp_at")
      .eq("id", targetCardId)
      .single();

    if (cardError || !card || card.restaurant_id !== token.restaurant_id) {
      return { error: "Invalid loyalty card for this restaurant." };
    }

    if (card.last_stamp_at) {
      const hoursSinceLastStamp = (new Date().getTime() - new Date(card.last_stamp_at).getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastStamp < 12) {
        return { error: "You've already earned a stamp today! Please wait 12 hours before claiming another." };
      }
    }
  }

  // 4. Mark token as used ATOMICALLY to prevent race conditions
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

  // 5. Add stamp to card
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: stampError } = await (supabase as any)
    .rpc('increment_loyalty_stamps', { target_card_id: targetCardId });
    
  if (stampError) {
    // Fallback if RPC doesn't exist
    const { data: currentCard } = await supabase.from("loyalty_cards").select("stamps").eq("id", targetCardId).single();
    const { error: fallbackUpdateError, data: updatedCard } = await supabase
      .from("loyalty_cards")
      .update({ 
        stamps: (currentCard?.stamps || 0) + 1,
        last_stamp_at: new Date().toISOString()
      })
      .eq("id", targetCardId)
      .select()
      .single();
      
    if (fallbackUpdateError) {
      console.error("Update error:", fallbackUpdateError);
      return { error: `Failed to update stamps: ${fallbackUpdateError.message}` };
    }
  }

  return { success: true, cardId: targetCardId, restaurantId: token.restaurant_id, isNew: isNewCard };
}
