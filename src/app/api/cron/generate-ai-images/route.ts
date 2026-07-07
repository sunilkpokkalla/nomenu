import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

export const dynamic = 'force-dynamic';

// Note: Use Vercel maxDuration if possible
export const maxDuration = 60; // Up to 60s for Hobby/Pro Vercel

export async function GET(req: Request) {
  try {
    // 1. Verify Cron Secret
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // Allow localhost bypass if no cron secret is set for local testing
      if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "No Gemini API Key" }, { status: 500 });
    }

    // 2. Initialize Service Role Supabase (to bypass RLS for cron)
    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
    );

    // 3. Find one active paid/processing job
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: job, error: jobError } = await (supabase as any)
      .from("ai_image_jobs")
      .select("*")
      .in("status", ["paid", "processing"])
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ message: "No pending AI image jobs." });
    }

    // Mark as processing
    if (job.status !== "processing") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("ai_image_jobs").update({ status: "processing" }).eq("id", job.id);
    }

    // 4. Fetch up to 3 items to process this cycle (to avoid 60s timeout)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: items, error: itemsError } = await (supabase as any)
      .from("menu_items")
      .select("id, name, description")
      .eq("restaurant_id", job.restaurant_id)
      .eq("pending_ai_image", true)
      .limit(3);

    if (itemsError) {
      console.error("Failed to fetch items:", itemsError);
      return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
    }

    // If no more items are pending, mark job as completed
    if (!items || items.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("ai_image_jobs").update({ status: "completed" }).eq("id", job.id);
      return NextResponse.json({ message: `Job ${job.id} completed.` });
    }

    // 5. Initialize processing
    let processedCount = 0;

    for (const item of items) {
      try {
        console.log(`Processing image for: ${item.name}`);
        
        // Step A: Check Global Library (Cache Hit)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: cachedItem } = await (supabase as any)
          .from("global_chef_library")
          .select("image_url")
          .ilike("name", item.name)
          .not("image_url", "is", null)
          .limit(1)
          .maybeSingle();

        if (cachedItem && cachedItem.image_url) {
          console.log(`Cache hit for ${item.name}! Using global library image.`);
          // Update item in database with the free cached image
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from("menu_items")
            .update({ 
              image_url: cachedItem.image_url,
              pending_ai_image: false,
              is_available: true
            })
            .eq("id", item.id);
            
          processedCount++;
          continue; // Skip the Gemini generation!
        }

        console.log(`Cache miss. Generating new AI image for: ${item.name}`);
        
        // Use Fal.ai (Flux) via REST to generate the food photo
        const prompt = `A highly professional, hyper-realistic food photography studio shot of a delicious single serving of "${item.name}". ${item.description || ''} Beautifully plated, 85mm lens, shallow depth of field, dramatic studio lighting, sharp focus on the food, vibrant appetizing colors, clean minimal background. Absolutely no text, no words, no logos.`;
        
        const imgRes = await fetch("https://fal.run/fal-ai/flux/schnell", {
          method: "POST",
          headers: {
            "Authorization": `Key ${process.env.FAL_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: prompt,
            image_size: "square_hd",
            num_images: 1,
            num_inference_steps: 4
          })
        });

        if (!imgRes.ok) {
          throw new Error(`Fal API error: ${imgRes.statusText} - ${await imgRes.text()}`);
        }

        const response = await imgRes.json();
        const imageUrl = response.images?.[0]?.url;
        
        if (imageUrl) {
          const imageRes = await fetch(imageUrl);
          const arrayBuffer = await imageRes.arrayBuffer();
          const fileName = `ai_generated/${job.restaurant_id}/${item.id}_${uuidv4()}.jpg`;

          // Upload to Supabase Storage
          const { error: uploadError } = await supabase
            .storage
            .from("item-images")
            .upload(fileName, arrayBuffer, {
              contentType: "image/jpeg",
              upsert: true
            });

          if (uploadError) {
            console.error(`Failed to upload image for ${item.name}:`, uploadError);
            continue;
          }

          // Get Public URL
          const { data: publicUrlData } = supabase
            .storage
            .from("item-images")
            .getPublicUrl(fileName);

          const publicUrl = publicUrlData.publicUrl;

          // Contribute to the crowdsourced global library
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any)
              .from("global_chef_library")
              .insert({
                name: item.name,
                description: item.description || null,
                category_id: null,
                image_url: publicUrl
              });
          } catch (libraryErr) {
            console.error("Failed to add to global library:", libraryErr);
          }

          // Update item in database
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from("menu_items")
            .update({ 
              image_url: publicUrl,
              pending_ai_image: false,
              is_available: true // Enable the item now that it has an image
            })
            .eq("id", item.id);
            
          processedCount++;
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (genError: any) {
        const errMsg = genError?.message || String(genError);
        console.error(`Failed to generate image for ${item.name}:`, errMsg);
        
        // If we hit the Google API rate limit (10 RPM), stop this cron job batch immediately.
        // The remaining pending items will simply be processed in the next cron minute.
        if (genError?.status === 429 || genError?.status === "RESOURCE_EXHAUSTED" || errMsg.includes('Quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
          console.log("Rate limit hit, pausing cron batch until next run.");
          break;
        }
        
        // Otherwise continue to the next item so one random failure doesn't block the rest
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${processedCount} images for job ${job.id}`
    });

  } catch (error: unknown) {
    console.error("Cron Generate AI Images Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
