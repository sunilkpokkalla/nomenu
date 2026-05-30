"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
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

  const { error } = await supabase.from("menus").insert({
    restaurant_id: restaurant.id,
    name,
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
    redirect("/dashboard/items?message=Name%20and%20Price%20are%20required");
  }

  const price = parseFloat(priceStr);
  if (isNaN(price)) {
    redirect("/dashboard/items?message=Invalid%20price%20format");
  }

  const currentPlan = restaurant.plan || "free";
  if (currentPlan === "free" || currentPlan === "starter") {
    const { count: itemCount } = await supabase
      .from("menu_items")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurant.id);
      
    const limit = currentPlan === "free" ? 20 : 25;
    if (itemCount !== null && itemCount >= limit) {
      redirect(`/dashboard/items?message=${currentPlan === "free" ? "Free" : "Starter"}%20plan%20is%20limited%20to%20${limit}%20items.%20Upgrade%20your%20plan%20to%20add%20more.`);
    }
  }

  // If a new category is specified, create it first
  if (newCategoryName && menuId) {
    const { data: newCat, error: catErr } = await supabase
      .from("categories")
      .insert({
        menu_id: menuId,
        name: newCategoryName,
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

  if (!categoryId) {
    redirect("/dashboard/items?message=Category%20is%20required");
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
    redirect(`/dashboard/items?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/items");
  redirect("/dashboard/items");
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
    redirect("/dashboard/items?message=Name%20and%20Price%20are%20required");
  }

  const price = parseFloat(priceStr);
  if (isNaN(price)) {
    redirect("/dashboard/items?message=Invalid%20price%20format");
  }

  // If a new category is specified, create it first
  if (newCategoryName && menuId) {
    const { data: newCat, error: catErr } = await supabase
      .from("categories")
      .insert({
        menu_id: menuId,
        name: newCategoryName,
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

  if (!categoryId) {
    redirect("/dashboard/items?message=Category%20is%20required");
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
    redirect(`/dashboard/items?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/items");
  redirect("/dashboard/items");
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

  if (error) {
    redirect(`/dashboard/items?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/items");
  redirect("/dashboard/items");
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

  const { error } = await supabase.from("qr_codes").insert({
    restaurant_id: restaurant.id,
    menu_id: menuId,
    label,
    scan_count: 0,
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

  const { error } = await supabase
    .from("restaurants")
    .update({
      name,
      cuisine_type: field(formData, "cuisineType"),
      address: field(formData, "address"),
      phone: field(formData, "phone"),
      currency: field(formData, "currency") ?? "USD",
      timezone: field(formData, "timezone") ?? "UTC",
    })
    .eq("id", restaurant.id);

  if (error) {
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

export async function updateMenuBranding(menuId: string, formData: FormData) {
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

  if (error) {
    redirect(`/dashboard/customize?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/customize");
  redirect(`/dashboard/customize?success=Menu design updated successfully`);
}
