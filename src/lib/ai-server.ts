export async function generateAiDescription(name: string, type: 'menu' | 'item' = 'item'): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not configured.");
    return null;
  }

  const prompt = type === 'menu' 
    ? `Write a very short, appetizing, 1 to 2 sentence description for a restaurant menu named "${name}" (e.g. Lunch Menu, Dinner Menu). Keep it professional, enticing, and do not use quotes.`
    : `Write a very short, accurate, 1 to 2 sentence restaurant menu description for a dish named "${name}". Keep it professional and appetizing, but strictly respect the authentic culinary profile of the dish. Do not hallucinate flavors (e.g., do not call a plain steamed dish "spicy" or a savory dish "sweet"). Do not include the name of the dish in the description. Do not use quotes.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (!res.ok) {
      console.error(`Gemini API error: ${res.statusText}`);
      return null;
    }

    const responseData = await res.json();
    const description = responseData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    return description;
  } catch (error) {
    console.error("AI Description Generation Error:", error);
    return null;
  }
}

export async function generateAiRecoveryStrategy(restaurantName: string, cuisine: string = "Restaurant"): Promise<{ offer: string, message: string } | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not configured.");
    return null;
  }

  const prompt = `You are a hospitality expert writing a service recovery strategy for a ${cuisine} named "${restaurantName}". 
Write a short "Apology Offer" (e.g. 'A complimentary dessert on your next visit') and a short "Follow-up Message" that will be shown to customers who leave a 1 to 3 star review. The message MUST include the exact placeholder {contact} where we will insert their phone/email. Keep it empathetic, highly professional, and brief. Return ONLY valid JSON in this format: { "offer": "...", "message": "..." }`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });
    
    if (!res.ok) {
      console.error(`Gemini API error: ${res.statusText}`);
      return null;
    }

    const responseData = await res.json();
    const text = responseData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    if (text) {
      return JSON.parse(text);
    }
    return null;
  } catch (error) {
    console.error("AI Recovery Strategy Generation Error:", error);
    return null;
  }
}
