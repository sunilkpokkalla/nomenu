"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function updateFeedbackStrategy(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!restaurant) {
    redirect("/dashboard?message=Create%20a%20restaurant%20profile%20first");
  }

  const recoveryOfferText = field(formData, "recoveryOfferText");
  const recoveryMessage = field(formData, "recoveryMessage");
  const serviceRecoveryMessage = field(formData, "serviceRecoveryMessage");
  const serviceRecoveryEnabled = formData.get("serviceRecoveryEnabled") === "on";
  const offerManagerVisit = formData.get("offerManagerVisit") === "on";
  const offerCompensation = formData.get("offerCompensation") === "on";
  const managerVisitTimerMinutes = parseInt(formData.get("managerVisitTimerMinutes") as string) || 5;

  const { error } = await supabase
    .from("restaurants")
    .update({
      recovery_offer_text: recoveryOfferText,
      recovery_message: recoveryMessage,
      service_recovery_message: serviceRecoveryMessage,
      service_recovery_enabled: serviceRecoveryEnabled,
      offer_manager_visit: offerManagerVisit,
      offer_compensation: offerCompensation,
      manager_visit_timer_minutes: managerVisitTimerMinutes,
    })
    .eq("id", restaurant.id);

  if (error) {
    redirect(`/dashboard/feedback?tab=strategy&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/feedback");
  redirect("/dashboard/feedback?tab=strategy&success=Strategy%20settings%20updated%20successfully");
}

export async function generateRecoveryStrategy() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name, cuisine_type")
    .eq("owner_id", user.id)
    .single();

  if (!restaurant) return { error: "Restaurant not found" };

  const { generateAiRecoveryStrategy } = await import("@/lib/ai-server");
  const result = await generateAiRecoveryStrategy(restaurant.name, restaurant.cuisine_type || "Restaurant");
  
  if (!result) return { error: "Failed to generate strategy" };
  
  return { success: true, ...result };
}

export async function generateLoyaltyToken(restaurantId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Verify owner
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id")
    .eq("id", restaurantId)
    .eq("owner_id", user.id)
    .single();

  if (!restaurant) return { error: "Unauthorized" };

  const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString(); // 3 minutes

  const { data: token, error } = await supabase
    .from("loyalty_scan_tokens")
    .insert({
      restaurant_id: restaurantId,
      expires_at: expiresAt,
      is_used: false
    })
    .select("id")
    .single();

  if (error || !token) {
    console.error("Failed to generate token", error);
    return { error: "Failed to generate token" };
  }

  return { success: true, tokenId: token.id };
}

export async function updateLoyaltyDesign(
  restaurantId: string, 
  color: string, 
  icon: string, 
  layout: string, 
  rewardText: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Update design
  const { error } = await supabase
    .from("restaurants")
    .update({ 
      loyalty_stamp_color: color,
      loyalty_stamp_icon: icon,
      loyalty_card_layout: layout,
      loyalty_reward_text: rewardText
    })
    .eq("id", restaurantId)
    .eq("owner_id", user.id);

  if (error) {
    console.error("Error updating loyalty design:", error);
    throw new Error("Failed to update loyalty design");
  }

  revalidatePath("/dashboard/feedback");
  return { success: true };
}
