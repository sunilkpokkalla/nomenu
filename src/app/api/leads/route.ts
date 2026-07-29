import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
    );

    const { data, error } = await supabase
      .from("nomi_leads")
      .insert([{ email }])
      .select();

    if (error) {
      // If it's a duplicate email error, consider it a success/already registered
      if (error.code === "23505") {
        return NextResponse.json({ success: true, message: "Email already registered" });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to capture lead" },
      { status: 500 }
    );
  }
}
