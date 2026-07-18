import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

export const maxDuration = 30; // 30s max duration

export async function POST(req: Request) {
  try {
    const { restaurantId, menuId, languageCode } = await req.json();

    if (!restaurantId || !menuId || !languageCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    if (!langObj) {
      return NextResponse.json({ error: "Unsupported language code" }, { status: 400 });
    }

    const targetLanguageName = langObj.name;

    const supabase = await createClient();

    // 1. Fetch the menu setting and restaurant plan
    const { data: menu, error: mError } = await supabase
      .from("menus")
      .select("display_language, restaurants!inner(plan)")
      .eq("id", menuId)
      .eq("restaurant_id", restaurantId)
      .single();

    if (mError || !menu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plan = (menu.restaurants as any)?.plan || "free";
    const allowedPlans = ["pro", "elite", "enterprise"];
    
    if (!allowedPlans.includes(plan)) {
      return NextResponse.json({ error: "AI Translations require a Pro, Elite, or Enterprise plan." }, { status: 403 });
    }

    if (menu.display_language !== languageCode) {
      return NextResponse.json({ error: "Requested language does not match the menu's configured display language" }, { status: 403 });
    }

    // 2. Fetch categories and items for THIS menu only
    const menuIds = [menuId];

    const { data: categories, error: cError } = await supabase
      .from("categories")
      .select("id, name, translations")
      .in("menu_id", menuIds);
      
    if (cError) throw cError;

    // Items are linked to categories
    const categoryIds = categories?.map((c) => c.id) || [];
    const { data: items, error: iError } = await supabase
      .from("menu_items")
      .select("id, name, description, translations")
      .in("category_id", categoryIds);

    if (iError) throw iError;

    // 3. Find missing translations
    const missingCategories = categories?.filter((c) => {
      const trans = c.translations as Record<string, Record<string, string>> | null;
      return !trans || !trans[languageCode] || !trans[languageCode].name;
    }) || [];

    const missingItems = items?.filter((i) => {
      const trans = i.translations as Record<string, Record<string, string>> | null;
      return !trans || !trans[languageCode] || !trans[languageCode].name;
    }) || [];

    // If nothing to translate, return the current DB state
    if (missingCategories.length === 0 && missingItems.length === 0) {
      return returnTranslatedPayload(categories || [], items || [], languageCode);
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    // 4. Batch Gemini request
    const payloadToTranslate = {
      categories: missingCategories.map(c => ({ id: c.id, name: c.name })),
      items: missingItems.map(i => ({ id: i.id, name: i.name, description: i.description || "" }))
    };

    const prompt = `You are a professional culinary translator and restaurant menu expert.
Translate the following dish names and descriptions from English into ${targetLanguageName}.
You MUST translate all dish names and descriptions into ${targetLanguageName}. Do not leave them in English unless it is a specific trademarked brand name.
Return a pure JSON object. Do NOT wrap it in markdown blockquotes or backticks.
The JSON must EXACTLY match this structure, substituting translations where appropriate.
{
  "categories": [
    { "id": "uuid", "name": "translated name" }
  ],
  "items": [
    { "id": "uuid", "name": "translated name", "description": "translated description (keep short)" }
  ]
}
Here is the English data to translate:
${JSON.stringify(payloadToTranslate, null, 2)}
`;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!res.ok) throw new Error(`Gemini API error: ${res.statusText}`);
    const textResponse = await res.json();
    let text = textResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";
    
    // Sometimes gemini might wrap in markdown despite prompt
    if (text.startsWith("```json")) text = text.replace(/^```json\n/, "").replace(/\n```$/, "");
    if (text.startsWith("```")) text = text.replace(/^```\n/, "").replace(/\n```$/, "");

    let translatedData;
    try {
      translatedData = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini translation JSON", text);
      // Fallback to empty to avoid crashing the whole page, returning current state
      translatedData = { categories: [], items: [] };
    }

    // 5. Save the translations back to Supabase in parallel
    const updatePromises: PromiseLike<unknown>[] = [];

    // Update Categories
    if (translatedData.categories && Array.isArray(translatedData.categories)) {
      for (const tCat of translatedData.categories) {
        const original = missingCategories.find(c => c.id === tCat.id);
        if (original) {
          const currentTrans = (original.translations as Record<string, Record<string, string>>) || {};
          currentTrans[languageCode] = { name: tCat.name };
          
          updatePromises.push(
            supabase.from("categories")
              .update({ translations: currentTrans })
              .eq("id", tCat.id)
              .then(res => res)
          );
        }
      }
    }

    // Update Items
    if (translatedData.items && Array.isArray(translatedData.items)) {
      for (const tItem of translatedData.items) {
        const original = missingItems.find(i => i.id === tItem.id);
        if (original) {
          const currentTrans = (original.translations as Record<string, Record<string, string>>) || {};
          currentTrans[languageCode] = { name: tItem.name, description: tItem.description };
          
          updatePromises.push(
            supabase.from("menu_items")
              .update({ translations: currentTrans })
              .eq("id", tItem.id)
              .then(res => res)
          );
        }
      }
    }

    // Await all database writes in parallel
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }

    // 6. Refetch and return the full map
    const { data: updatedCategories } = await supabase
      .from("categories")
      .select("id, name, translations")
      .in("menu_id", menuIds);
      
    const { data: updatedItems } = await supabase
      .from("menu_items")
      .select("id, name, description, translations")
      .in("category_id", categoryIds);

    return returnTranslatedPayload(updatedCategories || [], updatedItems || [], languageCode);

  } catch (error: unknown) {
    console.error("Translate Error:", error);
    return NextResponse.json({ error: (error as Error).message || "Failed to translate menu" }, { status: 500 });
  }
}

function returnTranslatedPayload(categories: Record<string, unknown>[], items: Record<string, unknown>[], languageCode: string) {
  const result = {
    categories: {} as Record<string, Record<string, string>>,
    items: {} as Record<string, Record<string, string>>
  };

  categories.forEach(c => {
    const t = (c.translations as Record<string, Record<string, string>>)?.[languageCode];
    if (t) result.categories[c.id as string] = t;
  });

  items.forEach(i => {
    const t = (i.translations as Record<string, Record<string, string>>)?.[languageCode];
    if (t) result.items[i.id as string] = t;
  });

  return NextResponse.json({ translations: result });
}
