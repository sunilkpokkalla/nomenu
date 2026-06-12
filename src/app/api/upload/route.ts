import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's restaurant
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
      
    const restaurantId = restaurant?.id || "unassigned";

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    // Structure: restaurant_id/folder/filename
    const finalPath = `${restaurantId}/${folder}/${fileName}`;

    const { error: uploadError } = await adminClient.storage
      .from("menu-items")
      .upload(finalPath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message || "Failed to upload image" }, { status: 500 });
    }

    const { data } = adminClient.storage.from("menu-items").getPublicUrl(finalPath);

    return NextResponse.json({ publicUrl: data.publicUrl });
  } catch (error) {
    console.error("Upload processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
