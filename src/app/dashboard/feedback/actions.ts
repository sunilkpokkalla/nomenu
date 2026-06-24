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

  const loyaltyPin = field(formData, "loyaltyPin") || "1234";
  const recoveryOfferText = field(formData, "recoveryOfferText");
  const recoveryMessage = field(formData, "recoveryMessage");

  const { error } = await supabase
    .from("restaurants")
    .update({
      loyalty_pin: loyaltyPin,
      recovery_offer_text: recoveryOfferText,
      recovery_message: recoveryMessage,
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
