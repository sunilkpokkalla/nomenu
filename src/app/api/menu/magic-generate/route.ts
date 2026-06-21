import { NextResponse } from "next/server";
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

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
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text?.trim() || "{}";
    const generatedDish = JSON.parse(text);

    return NextResponse.json({ dish: generatedDish });
  } catch (error: unknown) {
    console.error("Magic Generate Error:", error);
    return NextResponse.json({ error: (error as Error).message || "Failed to generate dish" }, { status: 500 });
  }
}
