import { NextResponse } from "next/server";
import { generateAiDescription } from "@/lib/ai-server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limit: 10 requests per minute per IP
  const ip = getClientIp(req);
  const { allowed, remaining, resetAt } = checkRateLimit(`desc:${ip}`, {
    maxRequests: 10,
    windowMs: 60 * 1000,
  });

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before generating more descriptions." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const { name, type = "item" } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const description = await generateAiDescription(name, type);

    if (!description && process.env.GEMINI_API_KEY) {
      throw new Error("Failed to generate description");
    }

    return NextResponse.json(
      { description: description || "" },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (error: unknown) {
    console.error("AI Description Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to generate description" },
      { status: 500 }
    );
  }
}
