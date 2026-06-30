import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60; // Allow more time for AI processing

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const restaurantId = formData.get("restaurantId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Determine limits for free plan
    let maxAllowedItems = Infinity;
    if (restaurantId) {
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("plan")
        .eq("id", restaurantId)
        .single();
      
      const plan = restaurant?.plan || "free";
      if (plan === "free" || plan === "starter") {
        const { count: itemCount } = await supabase
          .from("menu_items")
          .select("id", { count: "exact", head: true })
          .eq("restaurant_id", restaurantId);
        
        const limit = plan === "free" ? 30 : 50;
        maxAllowedItems = Math.max(0, limit - (itemCount || 0));
      }
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    const mimeType = file.type;

    let prompt = `
      You are an expert menu digitizer and a world-class culinary copywriter.
      Extract all categories, items, descriptions, and prices from this menu image/PDF.
      
      RULES:
      1. Return ONLY valid JSON.
      2. Prices MUST be numbers (e.g., 12.99, not "$12.99"). If price is missing, use 0.
      3. Do your best to categorize items logically if categories are not explicit.
      4. Ensure spelling and capitalization are correct.
      5. DESCRIPTIONS: If the physical menu provides a description, use it exactly as written. If the physical menu does NOT provide a description for an item, YOU MUST use your culinary knowledge to invent a highly appetizing, short 1-2 sentence description for it. NO item should ever have an empty description.
    `;
    
    if (maxAllowedItems !== Infinity) {
      prompt += `\n      CRITICAL RULE: You are STRICTLY LIMITED to extracting a MAXIMUM of ${maxAllowedItems} items total across all categories. If the menu contains more than ${maxAllowedItems} items, only extract the first ${maxAllowedItems} items and completely ignore the rest. DO NOT exceed this limit.`;
    }

    prompt += `
      Output Schema Requirements:
      {
        "categories": [
          {
            "name": "Category Name (e.g. Appetizers, Mains, Drinks)",
            "description": "Optional category description",
            "items": [
              {
                "name": "Item Name",
                "description": "The extracted or AI-generated appetizing description",
                "price": 10.50
              }
            ]
          }
        ]
      }
    `;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.statusText} - ${await res.text()}`);
    }

    const responseData = await res.json();
    const responseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error("AI returned an empty response.");
    }

    const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedJson = JSON.parse(cleanJsonString);

    // Enforce limits by hard truncating
    if (maxAllowedItems !== Infinity && parsedJson.categories) {
      let currentTotal = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const cat of parsedJson.categories) {
        if (cat.items) {
          const remaining = maxAllowedItems - currentTotal;
          if (remaining <= 0) {
            cat.items = [];
          } else if (cat.items.length > remaining) {
            cat.items = cat.items.slice(0, remaining);
            currentTotal += remaining;
          } else {
            currentTotal += cat.items.length;
          }
        }
      }
      // Remove any categories that ended up empty due to truncation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parsedJson.categories = parsedJson.categories.filter((cat: any) => cat.items && cat.items.length > 0);
    }

    // Fetch potential matches from global crowdsourced library
    const allItemNames: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parsedJson.categories?.forEach((c: any) => c.items?.forEach((i: any) => allItemNames.push(i.name)));
    
    const { data: globalMatches } = await supabase
      .from('global_chef_library')
      .select('name, image_url, description')
      .in('name', allItemNames);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matchMap = new Map<string, any>();
    if (globalMatches) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      globalMatches.forEach((m: any) => {
        if (!matchMap.has(m.name.toLowerCase())) {
           matchMap.set(m.name.toLowerCase(), m);
        }
      });
    }

    // Apply image mappings asynchronously
    const categories = parsedJson.categories || [];
    
    // Process categories sequentially to prevent overwhelming APIs
    for (const cat of categories) {
      if (!cat.items) continue;
      
      // Process items concurrently within the category
      await Promise.all(cat.items.map(async (item: { name: string; description?: string; imageUrl?: string | null; price?: number }) => {
        const matchedItem = matchMap.get(item.name.toLowerCase());
        let finalImageUrl = matchedItem?.image_url || null;
        
        // ----------------------------------------------------
        // FALLBACK: Unsplash and Pexels
        // ----------------------------------------------------
        if (!finalImageUrl) {
          try {
            const searchQuery = encodeURIComponent(item.name + " food plate");
            
            // 1. Try Unsplash First
            if (process.env.UNSPLASH_API_KEY) {
              const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=1&client_id=${process.env.UNSPLASH_API_KEY}`);
              if (unsplashRes.ok) {
                const uData = await unsplashRes.json();
                if (uData.results && uData.results.length > 0) {
                  finalImageUrl = uData.results[0].urls.regular;
                }
              }
            }
            
            // 2. Try Pexels Second (if Unsplash didn't work or isn't configured)
            if (!finalImageUrl && process.env.PEXELS_API_KEY) {
              const pexelsRes = await fetch(`https://api.pexels.com/v1/search?query=${searchQuery}&per_page=1`, {
                headers: { Authorization: process.env.PEXELS_API_KEY }
              });
              if (pexelsRes.ok) {
                const pData = await pexelsRes.json();
                if (pData.photos && pData.photos.length > 0) {
                  finalImageUrl = pData.photos[0].src.large;
                }
              }
            }
          } catch (fallbackErr) {
            console.error("Fallback image fetch failed for", item.name, fallbackErr);
          }
        }
        
        item.imageUrl = finalImageUrl;
        item.description = item.description || matchedItem?.description || "";
      }));
    }

    const formattedData = {
      ...parsedJson,
      categories: categories
    };

    return NextResponse.json(formattedData);

  } catch (error: unknown) {
    console.error("Magic Import Error:", error);
    return NextResponse.json({ error: (error as Error).message || "Failed to process menu" }, { status: 500 });
  }
}
