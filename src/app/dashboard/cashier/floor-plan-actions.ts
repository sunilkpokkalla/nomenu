"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getOrCreateFloorPlan(restaurantId: string) {
  const supabase = createClient();

  // 1. Check if a floor plan already exists
  const { data: existingPlan, error: planError } = await supabase
    .from("floor_plans")
    .select("*, restaurant_tables(*)")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (existingPlan) {
    return { success: true, floorPlan: existingPlan };
  }

  if (planError && planError.code !== "PGRST116") { // PGRST116 is no rows returned
    return { success: false, error: planError.message };
  }

  // 2. If no plan exists, create a default "Main Floor" plan
  const { data: newPlan, error: insertError } = await supabase
    .from("floor_plans")
    .insert({
      restaurant_id: restaurantId,
      name: "Main Floor",
      width: 800,
      height: 600
    })
    .select()
    .single();

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  return { success: true, floorPlan: { ...newPlan, restaurant_tables: [] } };
}

export async function saveTableLayout(
  floorPlanId: string, 
  tablesToUpsert: any[], 
  tableIdsToDelete: string[]
) {
  const supabase = createClient();

  // 1. Delete removed tables
  if (tableIdsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("restaurant_tables")
      .delete()
      .in("id", tableIdsToDelete);

    if (deleteError) {
      console.error("Failed to delete tables", deleteError);
      return { success: false, error: deleteError.message };
    }
  }

  // 2. Upsert updated/new tables
  if (tablesToUpsert.length > 0) {
    // Add floor_plan_id to any tables that don't have it (new tables)
    const formattedTables = tablesToUpsert.map(t => {
      // Remove ui-specific properties that don't belong in the database
      const { ...dbTable } = t;
      return {
        ...dbTable,
        floor_plan_id: floorPlanId
      };
    });

    const { error: upsertError } = await supabase
      .from("restaurant_tables")
      .upsert(formattedTables, { onConflict: "id" });

    if (upsertError) {
      console.error("Failed to upsert tables", upsertError);
      return { success: false, error: upsertError.message };
    }
  }

  revalidatePath("/dashboard/cashier");
  return { success: true };
}
