"use server";

import { createAdminClient } from "@/lib/supabase/server-admin";

export async function sendLoyaltyReward(feedbackId: string, rewardMessage: string, customerContact: string | null, restaurantId: string, customerName: string | null) {
  const adminClient = createAdminClient();

  // Try to find if they have a loyalty card linked to this contact info
  let targetCardId = null;

  if (customerContact) {
    // Look for existing card by phone number or email (contact_info)
    const { data: existingPhoneCard } = await adminClient
      .from("loyalty_cards")
      .select("id")
      .eq("restaurant_id", restaurantId)
      .eq("phone_number", customerContact.replace(/[^\d+]/g, ''))
      .maybeSingle();

    if (existingPhoneCard) {
      targetCardId = existingPhoneCard.id;
    }
  }

  // Also check if the feedback itself was explicitly linked to a card
  if (!targetCardId) {
    const { data: feedback } = await adminClient
      .from("customer_feedback")
      .select("id")
      // Currently customer_feedback doesn't store loyalty_card_id, but if it does in the future, we can check it here.
      .eq("id", feedbackId)
      .single();
  }

  if (targetCardId) {
    // They have a loyalty card! Add the active reward to their VIP card
    const { error: updateError } = await adminClient
      .from("loyalty_cards")
      .update({ active_reward: rewardMessage })
      .eq("id", targetCardId);

    if (updateError) {
      return { error: "Failed to apply reward to loyalty card." };
    }

    return { success: true, method: "loyalty_card" };
  } else if (customerContact && customerContact.includes('@')) {
    // Fallback: No loyalty card, but they gave an email.
    // In the future, this is where we trigger Resend. For now, we return that we need to use mailto.
    return { success: true, method: "email" };
  } else {
    // No contact info and no loyalty card.
    return { success: true, method: "none" };
  }
}

export async function resolveManagerRequest(feedbackId: string, notes: string) {
  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("customer_feedback")
    .update({ 
      resolution_notes: notes
    })
    .eq("id", feedbackId);

  if (error) {
    console.error("resolveManagerRequest Error:", error);
    return { error: "Failed to resolve request.", details: error };
  }
  return { success: true };
}
