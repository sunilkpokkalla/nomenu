import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { targetMenuId } = body;

    if (!targetMenuId) {
      return NextResponse.json({ error: "targetMenuId is required" }, { status: 400 });
    }

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("*")
      .eq("owner_id", user.id)
      .single();

    if (!restaurant || !restaurant.square_access_token) {
      return NextResponse.json({ error: "Square is not connected" }, { status: 400 });
    }

    // Fetch the entire catalog (items and categories)
    const squareEnv = process.env.NODE_ENV === "production" ? "connect.squareup.com" : "connect.squareup.com";
    const res = await fetch(`https://${squareEnv}/v2/catalog/list?types=ITEM,CATEGORY`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${restaurant.square_access_token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error(`Square API error: ${res.statusText} - ${await res.text()}`);
    }

    const page = await res.json();

    if (!page.objects || page.objects.length === 0) {
      return NextResponse.json({ message: "No items found in Square catalog." });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const squareCategories = page.objects.filter((obj: any) => obj.type === "CATEGORY");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const squareItems = page.objects.filter((obj: any) => obj.type === "ITEM");

    let importedCount = 0;

    // A mapping from Square Category ID to Nomenu Category ID
    const categoryMap: Record<string, string> = {};

    // 1. Process Categories
    for (const sqCat of squareCategories) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const catData = (sqCat as any).category_data;
      if (!catData?.name || !sqCat.id) continue;

      // Check if category already exists in this menu
      const { data: existingCat } = await supabase
        .from("categories")
        .select("id")
        .eq("menu_id", targetMenuId)
        .eq("name", catData.name)
        .maybeSingle();

      if (existingCat) {
        categoryMap[sqCat.id] = existingCat.id;
      } else {
        // Create new category
        const { data: newCat, error: catError } = await supabase
          .from("categories")
          .insert({
            menu_id: targetMenuId,
            name: catData.name,
            // You can add more fields if needed
          })
          .select("id")
          .single();

        if (newCat) {
          categoryMap[sqCat.id] = newCat.id;
        }
      }
    }

    // 2. Process Items
    for (const sqItem of squareItems) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const itemData = (sqItem as any).item_data;
      if (!itemData || !itemData.name) continue;

      // Find the Nomenu category ID corresponding to this item's Square category
      let nomenuCategoryId = itemData.category_id ? categoryMap[itemData.category_id] : null;

      // If item had no category or mapping failed, put it in an "Uncategorized" bucket
      if (!nomenuCategoryId) {
        const { data: defaultCat } = await supabase
          .from("categories")
          .select("id")
          .eq("menu_id", targetMenuId)
          .eq("name", "Square Imports")
          .maybeSingle();

        if (defaultCat) {
          nomenuCategoryId = defaultCat.id;
        } else {
          const { data: newDefaultCat } = await supabase
            .from("categories")
            .insert({ menu_id: targetMenuId, name: "Square Imports" })
            .select("id")
            .single();
          nomenuCategoryId = newDefaultCat?.id || null;
        }
      }

      if (!nomenuCategoryId) continue;

      // Extract price from the first variation
      let price = 0;
      if (itemData.variations && itemData.variations.length > 0) {
        const varData = itemData.variations[0].item_variation_data;
        if (varData && varData.price_money && varData.price_money.amount) {
          // Square stores amounts in cents, so convert to dollars
          price = Number(varData.price_money.amount) / 100;
        }
      }

      // Check if item already exists to prevent duplicates
      const { data: existingItem } = await supabase
        .from("menu_items")
        .select("id")
        .eq("category_id", nomenuCategoryId)
        .eq("name", itemData.name)
        .maybeSingle();

      if (!existingItem) {
        await supabase.from("menu_items").insert({
          category_id: nomenuCategoryId,
          restaurant_id: restaurant.id,
          name: itemData.name,
          description: itemData.description || null,
          price: price,
          is_available: true,
        });
        importedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully imported ${importedCount} items from Square!`,
      importedCount 
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Square Sync API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to sync Square catalog" }, { status: 500 });
  }
}
