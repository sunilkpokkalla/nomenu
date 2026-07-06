export async function generateAiDescription(name: string, type: 'menu' | 'item' | 'reward' = 'item'): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not configured.");
    return null;
  }

  let prompt = "";
  if (type === 'menu') {
    prompt = `Write a very short, appetizing, 1 to 2 sentence description for a restaurant menu named "${name}" (e.g. Lunch Menu, Dinner Menu). Keep it professional, enticing, and do not use quotes.`;
  } else if (type === 'reward') {
    prompt = `Write an exciting, punchy 1 to 2 sentence loyalty program reward description for winning a "${name}". Congratulate the customer for earning 10 stamps, keep it enthusiastic and encouraging. Do not use quotes.`;
  } else {
    prompt = `Write a very short, accurate, 1 to 2 sentence restaurant menu description for a dish named "${name}". Keep it professional and appetizing, but strictly respect the authentic culinary profile of the dish. Do not hallucinate flavors (e.g., do not call a plain steamed dish "spicy" or a savory dish "sweet"). Do not include the name of the dish in the description. Do not use quotes.`;
  }

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

export async function generateAiRecoveryStrategy(restaurantName: string, cuisine: string = "Restaurant"): Promise<{ initialMessage: string, offer: string, resolutionMessage: string } | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not configured.");
    return null;
  }

  const prompt = `You are a hospitality expert writing a service recovery strategy for a ${cuisine} named "${restaurantName}". 
Write a short "Initial Apology Message" (e.g. 'We are so sorry your experience wasn't perfect. Our manager has been alerted and is looking into this immediately.'), a short "Apology Offer" (e.g. 'A complimentary dessert on your next visit'), and a short "Resolution Follow-up Message" that will be shown to customers who leave a 1 to 3 star review. The resolution message MUST include the exact placeholder {contact} where we will insert the customer's phone/email to tell them the restaurant will reach out to them. (e.g. 'Our manager will contact you shortly at {contact} to personally apologize and make this right.'). Keep it empathetic, highly professional, and brief. Return ONLY valid JSON in this format: { "initialMessage": "...", "offer": "...", "resolutionMessage": "..." }`;

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
