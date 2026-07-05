"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getOrCreateFloorPlans(restaurantId: string) {
  const supabase = await createClient();

  // 1. Fetch all floor plans for this restaurant
  const { data: existingPlans, error: planError } = await supabase
    .from("floor_plans")
    .select("*, restaurant_tables(*)")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: true });

  if (planError && planError.code !== "PGRST116") {
    return { success: false, error: planError.message };
  }

  // 2. If no plans exist, create a default "Main Floor" plan
  if (!existingPlans || existingPlans.length === 0) {
    const { data: newPlan, error: insertError } = await supabase
      .from("floor_plans")
      .insert({
        restaurant_id: restaurantId,
        name: "Main Floor",
        width: 1000,
        height: 800
      })
      .select("*, restaurant_tables(*)")
      .single();

    if (insertError) {
      return { success: false, error: insertError.message };
    }
    
    return { success: true, floorPlans: [newPlan] };
  }

  return { success: true, floorPlans: existingPlans };
}

export async function addFloorPlanArea(restaurantId: string, name: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("floor_plans")
    .insert({
      restaurant_id: restaurantId,
      name,
      width: 1000,
      height: 800
    })
    .select("*, restaurant_tables(*)")
    .single();

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/dashboard/cashier");
  return { success: true, area: data };
}

export async function deleteFloorPlanArea(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("floor_plans")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/dashboard/cashier");
  return { success: true };
}

export async function saveTableLayout(
  floorPlanId: string, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tablesToUpsert: any[], 
  tableIdsToDelete: string[]
) {
  const supabase = await createClient();

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
    const formattedTables = tablesToUpsert.map(t => {
      const { isNew, id, ...dbTable } = t;
      
      // If the ID starts with 'temp-' or is marked as new, we let the DB generate a new UUID
      const isTemporary = id && typeof id === 'string' && id.startsWith('temp-');
      
      return {
        ...dbTable,
        ...(isTemporary ? {} : { id }),
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
