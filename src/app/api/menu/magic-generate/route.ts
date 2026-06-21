import { NextResponse } from "next/server";
import { GoogleGenAI } from '@google/genai';
import { fal } from "@fal-ai/client";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30; // Vercel max duration for longer image generation

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's restaurant and check credits
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id, magic_credits")
      .eq("owner_id", user.id)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    if (restaurant.magic_credits <= 0) {
      return NextResponse.json({ 
        error: "Out of Magic Credits", 
        code: "OUT_OF_CREDITS" 
      }, { status: 403 });
    }

    // Step 1: Generate the Dish Details (Text) using Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are an expert, world-class culinary chef and restaurant consultant.
    The user wants to add a dish to their menu based on the search query: "${query}".
    
    Return a pure JSON object representing the dish template. Do not include markdown formatting or backticks.
    The JSON must match exactly this structure:
    {
      "name": "The authentic, appetizing name of the dish",
      "description": "A very short, appetizing, 1 to 2 sentence description. Do not use the word 'delicious'.",
      "category": "Choose one: Starters, Main Courses, Sides, Desserts, or Drinks",
      "cuisines": ["array", "of", "relevant", "cuisine", "tags", "in", "lowercase"],
      "isVegetarian": boolean,
      "isVegan": boolean,
      "isGlutenFree": boolean,
      "isSpicy": boolean
    }`;
    
    const textResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = textResponse.text?.trim() || "{}";
    const generatedDish = JSON.parse(text);

    // Step 2: Generate the Image using Fal AI (Flux Schnell for fast, high-quality images)
    try {
      if (process.env.FAL_KEY) {
        const imagePrompt = `Professional high-end food photography of ${generatedDish.name}, ${generatedDish.description}, served on a beautiful plate, cinematic lighting, highly detailed, appetizing, restaurant quality, 4k`;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = await fal.subscribe("fal-ai/flux/schnell", {
          input: {
            prompt: imagePrompt,
            image_size: "landscape_4_3",
            num_inference_steps: 4
          }
        });
        
        if (result.data && result.data.images && result.data.images.length > 0) {
          generatedDish.imageUrl = result.data.images[0].url;
        }
      } else {
        console.warn("FAL_KEY is not set. Skipping image generation.");
      }
    } catch (imageError) {
      console.error("Fal AI Image Generation Error:", imageError);
      // We don't want to fail the whole request just because the image failed
    }

    // Step 3: Deduct 1 Magic Credit
    const { error: updateError } = await supabase
      .from("restaurants")
      .update({ magic_credits: restaurant.magic_credits - 1 })
      .eq("id", restaurant.id);

    if (updateError) {
      console.error("Failed to deduct credit:", updateError);
      // We still return the dish even if credit deduction fails, 
      // but ideally this shouldn't happen.
    }

    return NextResponse.json({ dish: generatedDish });
  } catch (error: unknown) {
    console.error("Magic Generate Error:", error);
    return NextResponse.json({ error: (error as Error).message || "Failed to generate dish" }, { status: 500 });
  }
}
