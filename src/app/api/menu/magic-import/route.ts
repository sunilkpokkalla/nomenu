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

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    const mimeType = file.type;

    const prompt = `
      You are an expert menu digitizer.
      Extract all categories, items, descriptions, and prices from this menu image/PDF.
      
      RULES:
      1. Return ONLY valid JSON.
      2. Prices MUST be numbers (e.g., 12.99, not "$12.99"). If price is missing, use 0.
      3. Do your best to categorize items logically if categories are not explicit.
      4. Ensure spelling and capitalization are correct.
      5. Include a description if one is present on the menu.
      
      Output Schema Requirements:
      {
        "categories": [
          {
            "name": "Category Name (e.g. Appetizers, Mains, Drinks)",
            "description": "Optional category description",
            "items": [
              {
                "name": "Item Name",
                "description": "Item description (leave empty string if none)",
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

    // The AI might wrap the JSON in markdown code blocks despite the responseMimeType, so we strip it.
    const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedJson = JSON.parse(cleanJsonString);

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

    // Apply loremflickr placeholders dynamically, or match from library
    const formattedData = {
      ...parsedJson,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories: parsedJson.categories?.map((cat: any) => ({
        ...cat,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: cat.items?.map((item: any) => {
          const matchedItem = matchMap.get(item.name.toLowerCase());
          
          return {
            ...item,
            imageUrl: matchedItem?.image_url || `https://loremflickr.com/800/600/food,${encodeURIComponent(item.name.split(' ')[0])}?lock=${Math.floor(Math.random() * 100000)}`,
            description: item.description || matchedItem?.description || ""
          };
        }) || []
      })) || []
    };

    return NextResponse.json(formattedData);

  } catch (error: unknown) {
    console.error("Magic Import Error:", error);
    return NextResponse.json({ error: (error as Error).message || "Failed to process menu" }, { status: 500 });
  }
}
