"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function toggleFeatureFlag(restaurantId: string, flag: string, isEnabled: boolean) {
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  // Get current flags
  const { data: restaurant } = await adminSupabase
    .from("restaurants")
    .select("feature_flags")
    .eq("id", restaurantId)
    .single();

  const currentFlags = restaurant?.feature_flags || {};
  const newFlags = { ...currentFlags, [flag]: isEnabled };

  // Update
  await adminSupabase
    .from("restaurants")
    .update({ feature_flags: newFlags })
    .eq("id", restaurantId);

  revalidatePath("/admin/settings");
}
