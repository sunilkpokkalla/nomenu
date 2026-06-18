"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function bulkInsertMenuData(
  menuId: string, 
  restaurantId: string, 
  data: { 
    categories: { 
      name: string; 
      description?: string; 
      items: { name: string; description?: string; price: number; imageUrl?: string }[]; 
    }[]; 
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify ownership
  const { data: menu } = await supabase
    .from("menus")
    .select("restaurant_id")
    .eq("id", menuId)
    .single();
    
  if (!menu || menu.restaurant_id !== restaurantId) {
    throw new Error("Unauthorized to modify this menu");
  }
  
  // Insert data
  let categorySortOrder = 0;
  for (const cat of data.categories) {
    const { data: category, error: catError } = await supabase
      .from("categories")
      .insert({
        menu_id: menuId,
        name: cat.name,
        description: cat.description || null,
        sort_order: categorySortOrder++
      })
      .select("id")
      .single();
      
    if (catError || !category) throw new Error(catError?.message || "Failed to create category");
    
    if (cat.items && cat.items.length > 0) {
       const itemsToInsert = cat.items.map((item, index) => ({
         category_id: category.id,
         restaurant_id: restaurantId,
         name: item.name,
         description: item.description || null,
         price: item.price || 0,
         image_url: item.imageUrl || null,
         sort_order: index
       }));
       
       const { error: itemsError } = await supabase.from("menu_items").insert(itemsToInsert);
       if (itemsError) throw new Error(itemsError.message);
    }
  }
  
  revalidatePath(`/dashboard/menus/${menuId}/customize`);
  return { success: true };
}

export async function createPremiumMagicImportJob(
  menuId: string, 
  restaurantId: string, 
  data: { 
    categories: { 
      name: string; 
      description?: string; 
      items: { name: string; description?: string; price: number; imageUrl?: string }[]; 
    }[]; 
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify ownership
  const { data: menu } = await supabase
    .from("menus")
    .select("restaurant_id")
    .eq("id", menuId)
    .single();
    
  if (!menu || menu.restaurant_id !== restaurantId) {
    throw new Error("Unauthorized to modify this menu");
  }

  // Count total items
  let totalItems = 0;
  for (const cat of data.categories) {
    if (cat.items) totalItems += cat.items.length;
  }

  // Calculate amount ($0.30 per item)
  const amountCents = totalItems * 30;

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Insert the job first using admin client to bypass RLS
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: job, error: jobError } = await (adminSupabase as any)
    .from("ai_image_jobs")
    .insert({
      restaurant_id: restaurantId,
      menu_id: menuId,
      status: "pending_payment",
      total_items: totalItems,
      amount_cents: amountCents
    })
    .select("id")
    .single();

  if (jobError || !job) {
    console.error("Job Creation Error:", jobError);
    throw new Error("Failed to create AI image job: " + (jobError?.message || "Unknown error"));
  }

  // Insert categories and items (with pending_ai_image = true)
  let categorySortOrder = 0;
  for (const cat of data.categories) {
    const { data: category, error: catError } = await supabase
      .from("categories")
      .insert({
        menu_id: menuId,
        name: cat.name,
        description: cat.description || null,
        sort_order: categorySortOrder++
      })
      .select("id")
      .single();
      
    if (catError || !category) throw new Error(catError?.message || "Failed to create category");
    
    if (cat.items && cat.items.length > 0) {
       const itemsToInsert = cat.items.map((item, index) => ({
         category_id: category.id,
         restaurant_id: restaurantId,
         name: item.name,
         description: item.description || null,
         price: item.price || 0,
         image_url: item.imageUrl || null,
         sort_order: index,
         pending_ai_image: true,
         is_available: false // Hide until images are generated
       }));
       
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       const { error: itemsError } = await (supabase as any).from("menu_items").insert(itemsToInsert);
       if (itemsError) throw new Error(itemsError.message);
    }
  }
  
  return { success: true, jobId: job.id };
}
