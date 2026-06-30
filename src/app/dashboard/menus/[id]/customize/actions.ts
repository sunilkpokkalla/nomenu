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

  // 0. Check Limits Before Anything Else
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("plan")
    .eq("id", restaurantId)
    .single();
    
  const currentPlan = restaurant?.plan || "free";
  if (currentPlan === "free" || currentPlan === "starter") {
    const { count: itemCount } = await supabase
      .from("menu_items")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId);
      
    const limit = currentPlan === "free" ? 30 : 50;
    
    let itemsToImport = 0;
    data.categories.forEach(c => { itemsToImport += (c.items?.length || 0) });

    if (itemCount !== null && (itemCount + itemsToImport) > limit) {
      return { success: false, error: `Your ${currentPlan === "free" ? "Free" : "Starter"} plan is limited to ${limit} items. This AI import has ${itemsToImport} items and would exceed your limit. Please upgrade.` };
    }
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

  // Fetch restaurant magic credits securely
  const { data: restData } = await supabase
    .from("restaurants")
    .select("magic_credits")
    .eq("id", restaurantId)
    .single();
    
  const magicCredits = restData?.magic_credits || 0;
  
  // Calculate how many items actually need to be paid for
  const payableItems = Math.max(0, totalItems - magicCredits);
  
  // Deduct credits used
  const creditsUsed = Math.min(totalItems, magicCredits);
  if (creditsUsed > 0) {
    const { error: deductError } = await supabase
      .from("restaurants")
      .update({ magic_credits: magicCredits - creditsUsed })
      .eq("id", restaurantId);
      
    if (deductError) {
      console.error("Failed to deduct magic credits", deductError);
    }
  }

  // Calculate amount ($0.25 per payable item)
  let amountCents = payableItems * 25;
  
  // Stripe enforces a strict minimum charge of $0.50 USD
  if (amountCents > 0 && amountCents < 50) {
    amountCents = 50;
  }
  
  const status = amountCents === 0 ? "paid" : "pending_payment";

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
      status: status,
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
  
  return { success: true, jobId: job.id, checkoutBypassed: status === "paid" };
}
