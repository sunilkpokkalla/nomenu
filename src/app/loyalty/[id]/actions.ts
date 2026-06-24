"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function addStamp(cardId: string, restaurantId: string, pin: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  // 1. Verify the PIN against the restaurant's loyalty_pin
  const { data: restaurant, error: restError } = await supabase
    .from("restaurants")
    .select("loyalty_pin")
    .eq("id", restaurantId)
    .single();

  if (restError || !restaurant) {
    return { error: "Restaurant not found." };
  }

  const expectedPin = restaurant.loyalty_pin || "1234";

  if (pin !== expectedPin) {
    return { error: "Incorrect PIN." };
  }

  // 2. Get the current card
  const { data: card, error: cardError } = await supabase
    .from("loyalty_cards")
    .select("stamps")
    .eq("id", cardId)
    .single();

  if (cardError || !card) {
    return { error: "Card not found." };
  }

  if (card.stamps >= 10) {
    return { error: "Card is already full!" };
  }

  // 3. Increment stamps
  const newStamps = card.stamps + 1;
  const { error: updateError } = await supabase
    .from("loyalty_cards")
    .update({ stamps: newStamps })
    .eq("id", cardId);

  if (updateError) {
    return { error: "Failed to add stamp." };
  }

  revalidatePath(`/loyalty/${cardId}`);
  return { success: true, newStamps };
}
