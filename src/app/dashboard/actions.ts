"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slugify";
import type { Database } from "@/types/database";

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

async function getRestaurantForUser(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return restaurant;
}

export async function createRestaurant(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = field(formData, "name");
  if (!name) {
    redirect("/dashboard?message=Restaurant%20name%20is%20required");
  }

  const { error } = await supabase.from("restaurants").insert({
    owner_id: user.id,
    name,
    cuisine_type: field(formData, "cuisineType"),
    address: field(formData, "address"),
    phone: field(formData, "phone"),
    currency: field(formData, "currency") ?? "USD",
    timezone: field(formData, "timezone") ?? "UTC",
    primary_color: "#2563EB",
    accent_color: "#F59E0B",
    theme_style: "minimalist",
  });

  if (error) {
    redirect(`/dashboard?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// MENU ACTIONS
export async function createMenu(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const restaurant = await getRestaurantForUser(supabase, user.id);
  if (!restaurant) {
    redirect("/dashboard?message=Create%20a%20restaurant%20profile%20first");
  }

  const name = field(formData, "name");
  if (!name) {
    redirect("/dashboard/menus?message=Menu%20name%20is%20required");
  }

  const description = field(formData, "description");
  const isActive = formData.get("isActive") === "true";
  const menuType = field(formData, "menuType");
  const taxRate = parseFloat(field(formData, "taxRate") || "0") || 0;
  const serviceCharge = parseFloat(field(formData, "serviceCharge") || "0") || 0;
  const serviceChargeType = field(formData, "serviceChargeType") || "percentage";
  const locationLabel = field(formData, "locationLabel") || "Table";

  const currentPlan = restaurant.plan || "free";
  if (currentPlan === "free" || currentPlan === "starter") {
    const { count: menuCount } = await supabase
      .from("menus")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurant.id);
      
    const limit = currentPlan === "free" ? 1 : 3;
    if (menuCount !== null && menuCount >= limit) {
      redirect(`/dashboard/menus?message=${currentPlan === "free" ? "Free" : "Starter"}%20plan%20is%20limited%20to%20${limit}%20menu(s).%20Upgrade%20your%20plan%20to%20create%20more.`);
    }
  }

  // 1. Prevent exact duplicate Name + Location Label
  const { data: existingDuplicate } = await supabase
    .from("menus")
    .select("id")
    .eq("restaurant_id", restaurant.id)
    .ilike("name", name)
    .ilike("location_label", locationLabel)
    .maybeSingle();

  if (existingDuplicate) {
    redirect(`/dashboard/menus?message=A%20menu%20named%20'${encodeURIComponent(name)}'%20with%20location%20'${encodeURIComponent(locationLabel)}'%20already%20exists.`);
  }

  // 2. Auto-generate unique slug to prevent URL crashes
  const baseSlug = slugify(name);
  let finalSlug = baseSlug;
  let counter = 2;
  
  while (true) {
    const { data: collision } = await supabase
      .from("menus")
      .select("id")
      .eq("restaurant_id", restaurant.id)
      .eq("slug", finalSlug)
      .maybeSingle();
      
    if (!collision) break; // Unique slug found
    
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  const { error } = await supabase.from("menus").insert({
    restaurant_id: restaurant.id,
    name,
    slug: finalSlug,
    description,
    is_active: isActive,
    menu_type: menuType,
    tax_rate: taxRate,
    service_charge: serviceCharge,
    service_charge_type: serviceChargeType,
    location_label: locationLabel,
  });

  if (error) {
    redirect(`/dashboard/menus?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/menus");
  redirect("/dashboard/menus");
}

export async function editMenu(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const menuId = field(formData, "menuId");
  if (!menuId) {
    redirect("/dashboard/menus?message=Menu%20ID%20is%20required");
  }

  const restaurant = await getRestaurantForUser(supabase, user.id);
  if (!restaurant) {
    redirect("/dashboard?message=Create%20a%20restaurant%20profile%20first");
  }

  const name = field(formData, "name");
  if (!name) {
    redirect("/dashboard/menus?message=Menu%20name%20is%20required");
  }

  const description = field(formData, "description");
  const isActive = formData.get("isActive") === "true";
  const menuType = field(formData, "menuType");
  const taxRate = parseFloat(field(formData, "taxRate") || "0") || 0;
  const serviceCharge = parseFloat(field(formData, "serviceCharge") || "0") || 0;
  const serviceChargeType = field(formData, "serviceChargeType") || "percentage";
  const locationLabel = field(formData, "locationLabel") || "Table";

  // First, verify the menu belongs to this restaurant
  const { data: existingMenu } = await supabase
    .from("menus")
    .select("id")
    .eq("id", menuId)
    .eq("restaurant_id", restaurant.id)
    .single();

  if (!existingMenu) {
    redirect("/dashboard/menus?message=Unauthorized%20or%20menu%20not%20found");
  }

  // 1. Prevent renaming to an exact duplicate Name + Location Label
  const { data: existingDuplicate } = await supabase
    .from("menus")
    .select("id")
    .eq("restaurant_id", restaurant.id)
    .ilike("name", name)
    .ilike("location_label", locationLabel)
    .neq("id", menuId)
    .maybeSingle();

  if (existingDuplicate) {
    redirect(`/dashboard/menus?message=A%20menu%20named%20'${encodeURIComponent(name)}'%20with%20location%20'${encodeURIComponent(locationLabel)}'%20already%20exists.`);
  }

  // 2. Auto-generate unique slug to prevent URL crashes
  const baseSlug = slugify(name);
  let finalSlug = baseSlug;
  let counter = 2;
  
  while (true) {
    const { data: collision } = await supabase
      .from("menus")
      .select("id")
      .eq("restaurant_id", restaurant.id)
      .eq("slug", finalSlug)
      .neq("id", menuId)
      .maybeSingle();
      
    if (!collision) break; // Unique slug found
    
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  const { error } = await supabase
    .from("menus")
    .update({
      name,
      slug: finalSlug,
      description,
      is_active: isActive,
      menu_type: menuType,
      tax_rate: taxRate,
      service_charge: serviceCharge,
      service_charge_type: serviceChargeType,
      location_label: locationLabel,
    })
    .eq("id", menuId);

  if (error) {
    redirect(`/dashboard/menus?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/menus");
  revalidatePath(`/dashboard/menus/${menuId}/customize`);
  revalidatePath("/dashboard/items");
  redirect("/dashboard/menus");
}


export async function toggleMenuStatus(menuId: string, currentStatus: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("menus")
    .update({ is_active: !currentStatus })
    .eq("id", menuId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/menus");
  revalidatePath("/dashboard");
}

export async function deleteMenu(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const menuId = field(formData, "menuId");
  if (!menuId) {
    redirect("/dashboard/menus?message=Menu%20ID%20is%20required");
  }

  const { error } = await supabase.from("menus").delete().eq("id", menuId);

  if (error) {
    redirect(`/dashboard/menus?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/menus");
  redirect("/dashboard/menus");
}

// MENU ITEM ACTIONS
export async function createMenuItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const restaurant = await getRestaurantForUser(supabase, user.id);
  if (!restaurant) {
    redirect("/dashboard?message=Create%20a%20restaurant%20profile%20first");
  }

  const name = field(formData, "name");
  const priceStr = field(formData, "price");
  let categoryId = field(formData, "categoryId");
  const newCategoryName = field(formData, "newCategoryName");
  const menuId = field(formData, "menuId");

  if (!name || !priceStr) {
    redirect(menuId ? `/dashboard/items?menuId=${menuId}&message=Name%20and%20Price%20are%20required` : "/dashboard/items?message=Name%20and%20Price%20are%20required");
  }

  const price = parseFloat(priceStr);
  if (isNaN(price)) {
    redirect(menuId ? `/dashboard/items?menuId=${menuId}&message=Invalid%20price%20format` : "/dashboard/items?message=Invalid%20price%20format");
  }

  const currentPlan = restaurant.plan || "free";
  if (currentPlan === "free" || currentPlan === "starter") {
    const { count: itemCount } = await supabase
      .from("menu_items")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurant.id);
      
    const limit = currentPlan === "free" ? 30 : 50;
    if (itemCount !== null && itemCount >= limit) {
      redirect(`/dashboard/items?message=${currentPlan === "free" ? "Free" : "Starter"}%20plan%20is%20limited%20to%20${limit}%20items.%20Upgrade%20your%20plan%20to%20add%20more.`);
    }
  }

  // If a new category is specified and no existing category was selected, create it or use existing
  if (newCategoryName && menuId && !categoryId) {
    const { data: existingCat } = await supabase
      .from("categories")
      .select("id")
      .eq("menu_id", menuId)
      .ilike("name", newCategoryName.trim())
      .maybeSingle();

    if (existingCat) {
      categoryId = existingCat.id;
    } else {
      const { data: newCat, error: catErr } = await supabase
        .from("categories")
        .insert({
          menu_id: menuId,
          name: newCategoryName.trim(),
          sort_order: 10,
        })
        .select()
        .single();

      if (catErr) {
        redirect(`/dashboard/items?message=${encodeURIComponent(catErr.message)}`);
      }

      if (newCat) {
        categoryId = newCat.id;
      }
    }
  }

  if (!categoryId) {
    redirect(menuId ? `/dashboard/items?menuId=${menuId}&message=Category%20is%20required` : "/dashboard/items?message=Category%20is%20required");
  }

  const description = field(formData, "description");
  const isAvailable = formData.get("isAvailable") === "true";
  const isPopular = formData.get("isPopular") === "true";
  const isVegetarian = formData.get("isVegetarian") === "true";
  const isVegan = formData.get("isVegan") === "true";
  const isGlutenFree = formData.get("isGlutenFree") === "true";
  const isSpicy = formData.get("isSpicy") === "true";
  const imageUrl = field(formData, "imageUrl");

  const insertPayload: Database["public"]["Tables"]["menu_items"]["Insert"] = {
    category_id: categoryId,
    restaurant_id: restaurant.id,
    name,
    description,
    price,
    is_available: isAvailable,
    is_popular: isPopular,
    is_vegetarian: isVegetarian,
    is_vegan: isVegan,
    is_gluten_free: isGlutenFree,
    is_spicy: isSpicy,
    image_url: imageUrl || null,
  };

  const caloriesStr = field(formData, "calories");
  if (caloriesStr) {
    const calories = parseInt(caloriesStr, 10);
    if (!isNaN(calories)) {
      insertPayload.calories = calories;
    }
  }

  const { error } = await supabase.from("menu_items").insert(insertPayload);

  if (error) {
    redirect(menuId ? `/dashboard/items?menuId=${menuId}&message=${encodeURIComponent(error.message)}` : `/dashboard/items?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/items");
  redirect(menuId ? `/dashboard/items?menuId=${menuId}` : `/dashboard/items`);
}

export async function editMenuItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const restaurant = await getRestaurantForUser(supabase, user.id);
  if (!restaurant) {
    redirect("/dashboard?message=Create%20a%20restaurant%20profile%20first");
  }

  const itemId = field(formData, "itemId");
  if (!itemId) {
    redirect("/dashboard/items?message=Item%20ID%20is%20required");
  }

  const name = field(formData, "name");
  const priceStr = field(formData, "price");
  let categoryId = field(formData, "categoryId");
  const newCategoryName = field(formData, "newCategoryName");
  const menuId = field(formData, "menuId");

  if (!name || !priceStr) {
    redirect(menuId ? `/dashboard/items?menuId=${menuId}&message=Name%20and%20Price%20are%20required` : "/dashboard/items?message=Name%20and%20Price%20are%20required");
  }

  const price = parseFloat(priceStr);
  if (isNaN(price)) {
    redirect(menuId ? `/dashboard/items?menuId=${menuId}&message=Invalid%20price%20format` : "/dashboard/items?message=Invalid%20price%20format");
  }

  // If a new category is specified and no existing category was selected, create it or use existing
  if (newCategoryName && menuId && !categoryId) {
    const { data: existingCat } = await supabase
      .from("categories")
      .select("id")
      .eq("menu_id", menuId)
      .ilike("name", newCategoryName.trim())
      .maybeSingle();

    if (existingCat) {
      categoryId = existingCat.id;
    } else {
      const { data: newCat, error: catErr } = await supabase
        .from("categories")
        .insert({
          menu_id: menuId,
          name: newCategoryName.trim(),
          sort_order: 10,
        })
        .select()
        .single();

      if (catErr) {
        redirect(`/dashboard/items?message=${encodeURIComponent(catErr.message)}`);
      }

      if (newCat) {
        categoryId = newCat.id;
      }
    }
  }

  if (!categoryId) {
    redirect(menuId ? `/dashboard/items?menuId=${menuId}&message=Category%20is%20required` : "/dashboard/items?message=Category%20is%20required");
  }

  const description = field(formData, "description");
  const isAvailable = formData.get("isAvailable") === "true";
  const isPopular = formData.get("isPopular") === "true";
  const isVegetarian = formData.get("isVegetarian") === "true";
  const isVegan = formData.get("isVegan") === "true";
  const isGlutenFree = formData.get("isGlutenFree") === "true";
  const isSpicy = formData.get("isSpicy") === "true";
  const imageUrl = field(formData, "imageUrl");

  const updatePayload: Database["public"]["Tables"]["menu_items"]["Update"] = {
    category_id: categoryId,
    name,
    description,
    price,
    is_available: isAvailable,
    is_popular: isPopular,
    is_vegetarian: isVegetarian,
    is_vegan: isVegan,
    is_gluten_free: isGlutenFree,
    is_spicy: isSpicy,
    image_url: imageUrl || null,
  };

  const caloriesStr = field(formData, "calories");
  if (caloriesStr) {
    const calories = parseInt(caloriesStr, 10);
    if (!isNaN(calories)) {
      updatePayload.calories = calories;
    }
  } else {
    updatePayload.calories = null;
  }

  const { error } = await supabase.from("menu_items").update(updatePayload).eq("id", itemId).eq("restaurant_id", restaurant.id);

  if (error) {
    redirect(menuId ? `/dashboard/items?menuId=${menuId}&message=${encodeURIComponent(error.message)}` : `/dashboard/items?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/items");
  redirect(menuId ? `/dashboard/items?menuId=${menuId}` : `/dashboard/items`);
}

export async function toggleMenuItemStatus(itemId: string, currentStatus: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: !currentStatus })
    .eq("id", itemId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/items");
  revalidatePath("/dashboard");
}

export async function deleteMenuItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const itemId = field(formData, "itemId");
  if (!itemId) {
    redirect("/dashboard/items?message=Item%20ID%20is%20required");
  }

  const { error } = await supabase.from("menu_items").delete().eq("id", itemId);

  const menuId = field(formData, "menuId");

  if (error) {
    redirect(menuId ? `/dashboard/items?menuId=${menuId}&message=${encodeURIComponent(error.message)}` : `/dashboard/items?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/items");
}

// QR CODE ACTIONS
export async function createQrCode(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const restaurant = await getRestaurantForUser(supabase, user.id);
  if (!restaurant) {
    redirect("/dashboard?message=Create%20a%20restaurant%20profile%20first");
  }

  const label = field(formData, "label");
  const menuId = field(formData, "menuId");
  const mode = field(formData, "mode") || "dine_in";
  const locationZone = mode === "dine_in" ? (field(formData, "location_zone") || "Main Dining") : null;

  if (!label || !menuId) {
    redirect("/dashboard/qrcodes?message=Label%20and%20Menu%20are%20required");
  }

  const currentPlan = restaurant.plan || "free";
  if (currentPlan === "free" || currentPlan === "starter") {
    const { count: qrCount } = await supabase
      .from("qr_codes")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurant.id);
      
    const limit = currentPlan === "free" ? 1 : 3;
    if (qrCount !== null && qrCount >= limit) {
      redirect(`/dashboard/qrcodes?message=${currentPlan === "free" ? "Free" : "Starter"}%20plan%20is%20limited%20to%20${limit}%20QR%20codes.%20Upgrade%20your%20plan%20to%20create%20more.`);
    }
  }

  // Check for duplicate labels in the SAME ZONE
  let existingLabelQuery = supabase
    .from("qr_codes")
    .select("id")
    .eq("restaurant_id", restaurant.id)
    .ilike("label", label);
    
  if (locationZone) {
    existingLabelQuery = existingLabelQuery.eq("location_zone", locationZone);
  } else {
    existingLabelQuery = existingLabelQuery.is("location_zone", null).eq("mode", mode);
  }

  const { data: existingLabel } = await existingLabelQuery.single();

  if (existingLabel) {
    redirect(`/dashboard/qrcodes?message=A%20QR%20code%20with%20label%20"${encodeURIComponent(label)}"%20already%20exists`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentZones = (restaurant as any).location_zones || [];
  if (locationZone && !currentZones.includes(locationZone)) {
    await supabase.from("restaurants").update({
      location_zones: [...currentZones, locationZone]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any).eq("id", restaurant.id);
  }

  const { error } = await supabase.from("qr_codes").insert({
    restaurant_id: restaurant.id,
    menu_id: menuId,
    label,
    location_zone: locationZone,
    scan_count: 0,
    mode,
  });

  if (error) {
    redirect(`/dashboard/qrcodes?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/qrcodes");
  redirect("/dashboard/qrcodes");
}

export async function deleteQrCode(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const qrCodeId = field(formData, "qrCodeId");
  if (!qrCodeId) {
    redirect("/dashboard/qrcodes?message=QR%20Code%20ID%20is%20required");
  }

  const { error } = await supabase.from("qr_codes").delete().eq("id", qrCodeId);

  if (error) {
    redirect(`/dashboard/qrcodes?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/qrcodes");
  redirect("/dashboard/qrcodes");
}

export async function updateRestaurantSettings(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const restaurant = await getRestaurantForUser(supabase, user.id);
  if (!restaurant) {
    redirect("/dashboard?message=Create%20a%20restaurant%20profile%20first");
  }

  const name = field(formData, "name");
  if (!name) {
    redirect("/dashboard/settings?message=Restaurant%20name%20is%20required");
  }

  const slug = field(formData, "slug")?.toLowerCase().replace(/[^a-z0-9-]/g, "") || null;
  if (!slug) {
    redirect("/dashboard/settings?message=Restaurant%20URL%20slug%20is%20required");
  }

  const { error } = await supabase
    .from("restaurants")
    .update({
      name,
      slug,
      cuisine_type: field(formData, "cuisineType"),
      address: field(formData, "address"),
      phone: field(formData, "phone"),
      currency: field(formData, "currency") ?? "USD",
      timezone: field(formData, "timezone") ?? "UTC",
      prep_time_minutes: parseInt(field(formData, "prepTimeMinutes") || "20", 10),
      max_takeaway_per_slot: parseInt(field(formData, "maxTakeawayPerSlot") || "5", 10),
      max_reserve_per_slot: parseInt(field(formData, "maxReservePerSlot") || "2", 10),
      closing_time: (field(formData, "closingTime") || "23:00") + ":00",
    })
    .eq("id", restaurant.id);

  if (error) {
    if (error.code === '23505') {
       redirect(`/dashboard/settings?message=That%20URL%20slug%20is%20already%20taken.`);
    }
    redirect(`/dashboard/settings?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  redirect("/dashboard/settings?success=Settings%20updated%20successfully");
}

export async function updateRestaurantBranding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const restaurant = await getRestaurantForUser(supabase, user.id);
  if (!restaurant) {
    redirect("/dashboard?message=Create%20a%20restaurant%20profile%20first");
  }

  const primaryColor = field(formData, "primaryColor") ?? "#2563EB";
  const accentColor = field(formData, "accentColor") ?? "#F59E0B";
  const themeStyle = field(formData, "themeStyle") ?? "minimalist";
  const wifiPassword = field(formData, "wifiPassword");

  // Premium theme style gating
  const isPremiumTheme = themeStyle !== "minimalist";
  const currentPlan = restaurant.plan || "free";
  if (isPremiumTheme && currentPlan === "free") {
    redirect("/dashboard/customize?message=Upgrade%20to%20Growth%20or%20Pro%20plan%20to%20use%20premium%2520layouts.");
  }

  const { error } = await supabase
    .from("restaurants")
    .update({
      primary_color: primaryColor,
      accent_color: accentColor,
      theme_style: themeStyle,
      wifi_password: wifiPassword,
    })
    .eq("id", restaurant.id);

  if (error) {
    redirect(`/dashboard/customize?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/customize");
  revalidatePath("/dashboard");
  redirect("/dashboard/customize?success=Branding%20updated%20successfully");
}

export async function updateRestaurantPlan(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const restaurant = await getRestaurantForUser(supabase, user.id);
  if (!restaurant) {
    redirect("/dashboard?message=Create%20a%20restaurant%20profile%20first");
  }

  const plan = field(formData, "plan");
  if (!plan) {
    redirect("/dashboard/billing?message=Plan%20is%20required");
  }

  const { error } = await supabase
    .from("restaurants")
    .update({
      plan: plan,
    })
    .eq("id", restaurant.id);

  if (error) {
    redirect(`/dashboard/billing?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/billing");
  revalidatePath("/dashboard");
  redirect("/dashboard/billing?success=Plan%20updated%20successfully");
}

export async function updateMenuBranding(menuId: string, formData: FormData, redirectTo?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const useCustomDesign = formData.get("use_custom_design") === "true";
  
  let design_config = null;
  if (useCustomDesign) {
    design_config = {
      primary_color: formData.get("primaryColor") as string,
      accent_color: formData.get("accentColor") as string,
      theme_style: formData.get("themeStyle") as string,
    };
  }

  const { error } = await supabase
    .from("menus")
    .update({ design_config })
    .eq("id", menuId);

  const targetPath = redirectTo || `/dashboard/menus/${menuId}/customize`;
  const paramChar = targetPath.includes('?') ? '&' : '?';

  if (error) {
    redirect(`${targetPath}${paramChar}message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(targetPath.split('?')[0]);
  redirect(`${targetPath}${paramChar}success=Menu%20design%20updated%20successfully`);
}

export async function importCategoriesAndItems(
  sourceMenuId: string,
  targetMenuId: string,
  categoryIdsToImport: string[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const restaurant = await getRestaurantForUser(supabase, user.id);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  if (!categoryIdsToImport || categoryIdsToImport.length === 0) {
    throw new Error("No categories selected for import");
  }

  for (const oldCatId of categoryIdsToImport) {
    // 1. Fetch old category
    const { data: oldCat } = await supabase
      .from("categories")
      .select("*")
      .eq("id", oldCatId)
      .single();

    if (!oldCat) continue;

    // 2. Insert new category into target menu
    const { data: newCat, error: catError } = await supabase
      .from("categories")
      .insert({
        menu_id: targetMenuId,
        name: oldCat.name,
        description: oldCat.description,
        sort_order: oldCat.sort_order,
      })
      .select()
      .single();

    if (catError || !newCat) {
      console.error("Failed to clone category", catError);
      await supabase.from("menus").delete().eq("id", targetMenuId); // Rollback
      redirect(`/dashboard/menus?message=${encodeURIComponent("Failed to clone category. Rolled back.")}`);
    }

    // 3. Fetch old items
    const { data: oldItems } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_id", oldCatId);

    if (!oldItems || oldItems.length === 0) continue;

    // 4. Insert new items linked to new category
    const itemsToInsert = oldItems.map(item => {
      const { id, created_at, category_id, ...itemData } = item;
      return {
        ...itemData,
        category_id: newCat.id,
      };
    });

    const { error: itemsError } = await supabase
      .from("menu_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Failed to clone items", itemsError);
      await supabase.from("menus").delete().eq("id", targetMenuId); // Rollback
      redirect(`/dashboard/menus?message=${encodeURIComponent("Failed to clone items. Rolled back.")}`);
    }
  }

  revalidatePath("/dashboard/items");
  return { success: true };
}

export async function deleteCategory(formData: FormData) {
  const categoryId = formData.get("categoryId") as string;
  if (!categoryId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    redirect(`/dashboard/items?message=${encodeURIComponent("Failed to delete category")}`);
  }

  revalidatePath("/dashboard/items");
}

export async function updateCategory(formData: FormData) {
  const categoryId = formData.get("categoryId") as string;
  const name = formData.get("name") as string;
  if (!categoryId || !name || name.trim() === "") return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("categories")
    .update({ name: name.trim() })
    .eq("id", categoryId);

  if (error) {
    console.error("Failed to update category:", error);
    return { error: "Failed to update category" };
  }

  revalidatePath("/dashboard/items");
}

export async function importSpecificItems(
  targetMenuId: string,
  itemIdsToImport: string[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!itemIdsToImport || itemIdsToImport.length === 0) {
    throw new Error("No items selected for import");
  }

  // Fetch all selected items
  const { data: itemsToImport, error: fetchError } = await supabase
    .from("menu_items")
    .select("*, categories!inner(name)")
    .in("id", itemIdsToImport);

  if (fetchError || !itemsToImport) {
    console.error("Failed to fetch items to import", fetchError);
    throw new Error("Failed to fetch items to import");
  }

  // Fetch existing categories in target menu
  const { data: targetCategories, error: targetCatError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("menu_id", targetMenuId);

  if (targetCatError) {
    console.error("Failed to fetch target categories", targetCatError);
    throw new Error("Failed to fetch target categories");
  }

  // Create a map of category names to their ID in the target menu
  const targetCategoryMap = new Map<string, string>();
  targetCategories?.forEach(c => targetCategoryMap.set(c.name, c.id));

  // Process and insert items
  const newItemsToInsert = [];

  for (const item of itemsToImport) {
    // The inner join gives us the category name as a related object, but since it's an array of joined records, it can be slightly messy
    // Supabase JS client usually returns it as: categories: { name: string }
    const catData = item.categories as unknown as { name: string };
    const categoryName = catData?.name || "Imported Items";

    let targetCategoryId = targetCategoryMap.get(categoryName);

    // If category doesn't exist in target menu, create it
    if (!targetCategoryId) {
      const { data: newCat, error: createCatErr } = await supabase
        .from("categories")
        .insert({
          menu_id: targetMenuId,
          name: categoryName,
          sort_order: 10,
        })
        .select("id")
        .single();

      if (createCatErr || !newCat) {
        console.error("Failed to create missing category", createCatErr);
        continue; // Skip item if we can't place it in a category
      }
      
      targetCategoryId = newCat.id;
      targetCategoryMap.set(categoryName, targetCategoryId);
    }

    // Prepare item for insertion
    const { id, created_at, category_id, categories, ...cleanItemData } = item;
    newItemsToInsert.push({
      ...cleanItemData,
      category_id: targetCategoryId,
    });
  }

  // Batch insert all the cloned items
  if (newItemsToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("menu_items")
      .insert(newItemsToInsert);

    if (insertError) {
      console.error("Failed to clone individual items", insertError);
      throw new Error("Failed to clone individual items");
    }
  }

  revalidatePath("/dashboard/items");
  return { success: true };
}

export async function updateLocationZones(restaurantId: string, zones: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Ensure unique zones and at least one default
  const cleanZones = Array.from(new Set(zones.filter(z => z.trim().length > 0)));
  if (cleanZones.length === 0) {
    cleanZones.push("Main Dining");
  }

  const { error } = await supabase
    .from("restaurants")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update({ location_zones: cleanZones } as any)
    .eq("id", restaurantId)
    .eq("owner_id", user.id);

  if (error) {
    console.error("Failed to update location zones", error);
    throw new Error("Failed to update location zones");
  }

  revalidatePath("/dashboard/qrcodes");
}

function levenshteinDistance(a: string, b: string): number {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
      }
    }
  }
  return matrix[b.length][a.length];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findClosestMatch(itemName: string, globalMatches: any[]): any | null {
  if (!globalMatches || globalMatches.length === 0) return null;
  
  const searchName = itemName.toLowerCase();
  
  // Try exact match first
  const exact = globalMatches.find(m => m.name.toLowerCase() === searchName);
  if (exact) return exact;
  
  // Try partial match (e.g. "Caviar" in "Caviar Tartlet" or "Gougère" in "Gougères")
  const partial = globalMatches.find(m => 
    m.name.toLowerCase().includes(searchName) || 
    searchName.includes(m.name.toLowerCase())
  );
  if (partial) return partial;

  // Try Levenshtein distance for typos/plurals
  let bestMatch = null;
  let minDistance = Infinity;

  for (const match of globalMatches) {
    const dist = levenshteinDistance(searchName, match.name.toLowerCase());
    // Max allowable distance is 3 for small typos like plurals
    if (dist < minDistance && dist <= 3) {
      minDistance = dist;
      bestMatch = match;
    }
  }

  return bestMatch;
}

export async function applyMenuTemplate(menuId: string, restaurantId: string, templateId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Import the templates
  const { MENU_TEMPLATES } = await import("@/lib/templates");
  const template = MENU_TEMPLATES.find(t => t.id === templateId);

  if (!template) {
    throw new Error("Template not found");
  }

  // Double check ownership
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id")
    .eq("id", restaurantId)
    .eq("owner_id", user.id)
    .single();

  if (!restaurant) {
    throw new Error("Unauthorized or restaurant not found");
  }

  // 0. Fetch high-quality images from the global chef library
  // Fetch ALL global matches to allow for fuzzy searching
  const { data: globalMatches } = await supabase
    .from('global_chef_library')
    .select('name, image_url, description');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allLibraryItems = (globalMatches as any[]) || [];

  // 1. Create categories
  for (let i = 0; i < template.categories.length; i++) {
    const category = template.categories[i];
    
    // Insert category
    const { data: newCategory, error: categoryError } = await supabase
      .from("categories")
      .insert({
        menu_id: menuId,
        name: category.name,
        sort_order: i,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      .select("id")
      .single();

    if (categoryError || !newCategory) {
      console.error("Failed to insert category", categoryError);
      continue;
    }

    // 2. Create items for this category
    const itemsToInsert = category.items.map(item => {
      const matchedItem = findClosestMatch(item.name, allLibraryItems);
      
      return {
        restaurant_id: restaurantId,
        category_id: newCategory.id,
        name: item.name,
        description: matchedItem?.description || item.description,
        price: item.price,
        is_available: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image_url: matchedItem?.image_url || (item as any).imageUrl || `https://loremflickr.com/800/600/food,${encodeURIComponent(item.name.split(' ')[0])}?lock=${Math.floor(Math.random() * 100000)}`
      };
    });

    if (itemsToInsert.length > 0) {
      const { error: itemsError } = await supabase
        .from("menu_items")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(itemsToInsert as any[]);

      if (itemsError) {
        console.error("Failed to insert items", itemsError);
      }
    }
  }

  revalidatePath("/dashboard/items");
  revalidatePath("/dashboard/menus");
  revalidatePath(`/dashboard/menus/${menuId}/customize`);
}
