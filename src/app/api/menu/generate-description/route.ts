import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { name, type = 'item' } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const prompt = type === 'menu' 
      ? `Write a very short, appetizing, 1 to 2 sentence description for a restaurant menu named "${name}" (e.g. Lunch Menu, Dinner Menu). Keep it professional, enticing, and do not use quotes.`
      : `Write a very short, accurate, 1 to 2 sentence restaurant menu description for a dish named "${name}". Keep it professional and appetizing, but strictly respect the authentic culinary profile of the dish. Do not hallucinate flavors (e.g., do not call a plain steamed dish "spicy" or a savory dish "sweet"). Do not include the name of the dish in the description. Do not use quotes.`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.statusText}`);
    }

    const responseData = await res.json();
    const description = responseData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    return NextResponse.json({ description });
  } catch (error: unknown) {
    console.error("AI Description Error:", error);
    return NextResponse.json({ error: (error as Error).message || "Failed to generate description" }, { status: 500 });
  }
}
