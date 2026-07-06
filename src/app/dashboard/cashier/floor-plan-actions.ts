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

function generateTemplateTables(template: string, floorPlanId: string) {
  const tables = [];
  let tableCounter = 1;
  const tId = () => crypto.randomUUID();

  if (template === "casual") {
    // 10x 2-tops (square), 8x 4-tops (square), 2x 6-tops (rectangle)
    for (let i = 0; i < 5; i++) {
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `${tableCounter++}`, capacity: 2, shape: "square", x: 100, y: 100 + i * 120, width: 70, height: 70 });
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `${tableCounter++}`, capacity: 2, shape: "square", x: 800, y: 100 + i * 120, width: 70, height: 70 });
    }
    for (let i = 0; i < 8; i++) {
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `${tableCounter++}`, capacity: 4, shape: "square", x: 300 + (i % 2) * 200, y: 150 + Math.floor(i / 2) * 150, width: 90, height: 90 });
    }
    for (let i = 0; i < 2; i++) {
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `${tableCounter++}`, capacity: 6, shape: "rectangle", x: 400, y: 50 + i * 550, width: 140, height: 80 });
    }
  } else if (template === "fine") {
    // 6x 4-tops (circle), 4x 6-tops (circle), 2x 8-tops (large rectangle)
    for (let i = 0; i < 6; i++) {
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `${tableCounter++}`, capacity: 4, shape: "circle", x: 150 + (i % 2) * 500, y: 100 + Math.floor(i / 2) * 200, width: 110, height: 110 });
    }
    for (let i = 0; i < 4; i++) {
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `${tableCounter++}`, capacity: 6, shape: "circle", x: 350, y: 150 + i * 180, width: 130, height: 130 });
    }
    for (let i = 0; i < 2; i++) {
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `${tableCounter++}`, capacity: 8, shape: "rectangle", x: 600, y: 250 + i * 300, width: 160, height: 100 });
    }
  } else if (template === "sports") {
    // 12x Bar Stools (1-top circle), 6x High-tops (2-top circle), 6x Booths (4-top rectangle)
    for (let i = 0; i < 12; i++) {
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `B${i+1}`, capacity: 1, shape: "circle", x: 80 + i * 70, y: 80, width: 50, height: 50 });
    }
    for (let i = 0; i < 6; i++) {
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `${tableCounter++}`, capacity: 2, shape: "circle", x: 200 + (i % 3) * 250, y: 250 + Math.floor(i / 3) * 150, width: 70, height: 70 });
    }
    for (let i = 0; i < 6; i++) {
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `${tableCounter++}`, capacity: 4, shape: "rectangle", x: 100 + (i % 2) * 600, y: 400 + Math.floor(i / 2) * 150, width: 120, height: 80 });
    }
  } else if (template === "cafe") {
    // 8x 2-tops (small circle), 4x 2-tops (square), 2x Communal Tables (8-top rectangle)
    for (let i = 0; i < 8; i++) {
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `${tableCounter++}`, capacity: 2, shape: "circle", x: 100 + (i % 2) * 150, y: 100 + Math.floor(i / 2) * 120, width: 60, height: 60 });
    }
    for (let i = 0; i < 4; i++) {
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `${tableCounter++}`, capacity: 2, shape: "square", x: 500 + (i % 2) * 150, y: 150 + Math.floor(i / 2) * 150, width: 60, height: 60 });
    }
    for (let i = 0; i < 2; i++) {
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `C${i+1}`, capacity: 8, shape: "rectangle", x: 750, y: 200 + i * 250, width: 140, height: 90 });
    }
  } else if (template === "patio") {
    // 6x Communal Picnic (6-top rectangle), 6x 4-tops (square)
    for (let i = 0; i < 6; i++) {
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `P${i+1}`, capacity: 6, shape: "rectangle", x: 300 + (i % 2) * 250, y: 150 + Math.floor(i / 2) * 180, width: 150, height: 80 });
    }
    for (let i = 0; i < 6; i++) {
      tables.push({ id: tId(), floor_plan_id: floorPlanId, table_number: `${tableCounter++}`, capacity: 4, shape: "square", x: 100 + Math.floor(i / 3) * 650, y: 100 + (i % 3) * 200, width: 80, height: 80 });
    }
  }
  
  return tables;
}

export async function addFloorPlanArea(restaurantId: string, name: string, template: string = "blank") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("floor_plans")
    .insert({
      restaurant_id: restaurantId,
      name,
      width: 1000,
      height: 800
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  
  let finalData: Record<string, unknown> = data;
  
  if (template !== "blank") {
    const templateTables = generateTemplateTables(template, data.id);
    if (templateTables.length > 0) {
      await supabase.from("restaurant_tables").insert(templateTables);
      
      const { data: updatedData } = await supabase
        .from("floor_plans")
        .select("*, restaurant_tables(*)")
        .eq("id", data.id)
        .single();
        
      if (updatedData) {
        finalData = updatedData;
      }
    }
  } else {
    // If blank, just attach empty tables array
    finalData = { ...data, restaurant_tables: [] };
  }
  
  revalidatePath("/dashboard/cashier");
  return { success: true, area: finalData };
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
  tableIdsToDelete: string[],
  planName?: string
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
      
      // If the ID starts with 'temp-' or is marked as new, generate a real UUID
      const isTemporary = id && typeof id === 'string' && id.startsWith('temp-');
      const finalId = isTemporary ? crypto.randomUUID() : id;
      
      return {
        ...dbTable,
        id: finalId,
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

  // 3. Update floor plan name if provided
  if (planName) {
    const { error: updateError } = await supabase
      .from("floor_plans")
      .update({ name: planName })
      .eq("id", floorPlanId);

    if (updateError) {
      console.error("Failed to update floor plan name", updateError);
      return { success: false, error: updateError.message };
    }
  }

  revalidatePath("/dashboard/cashier");
  return { success: true };
}
