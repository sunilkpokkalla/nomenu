"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updatePaypalEmail(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const paypalEmail = formData.get("paypalEmail");
  if (typeof paypalEmail !== "string") {
    throw new Error("Invalid PayPal email");
  }

  const { error } = await supabase
    .from("restaurants")
    .update({ paypal_email: paypalEmail.trim() || null })
    .eq("owner_id", user.id);

  if (error) {
    throw new Error("Failed to save PayPal email");
  }

  revalidatePath("/dashboard/referrals");
}
