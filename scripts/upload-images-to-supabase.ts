/**
 * Uploads all /public/images/library/ images to Supabase Storage
 * and updates every row in global_chef_library to use the CDN URL.
 *
 * Run once: npx tsx scripts/upload-images-to-supabase.ts
 */

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "library-images";
const LOCAL_DIR = path.join(process.cwd(), "public", "images", "library");

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
    });
    if (error) throw new Error(`Failed to create bucket: ${error.message}`);
    console.log(`✅ Created bucket: ${BUCKET}`);
  } else {
    console.log(`ℹ️  Bucket already exists: ${BUCKET}`);
  }
}

async function run() {
  await ensureBucket();

  const files = fs.readdirSync(LOCAL_DIR).filter((f) => f.endsWith(".jpg") || f.endsWith(".png") || f.endsWith(".webp"));
  console.log(`\n📦 Uploading ${files.length} images to Supabase Storage...\n`);

  // Get existing files in bucket to skip re-uploads
  const { data: existing } = await supabase.storage.from(BUCKET).list("", { limit: 10000 });
  const existingNames = new Set(existing?.map((f) => f.name) || []);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  const urlMap: Record<string, string> = {};

  for (const file of files) {
    if (existingNames.has(file)) {
      // Already uploaded — just build the CDN URL
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(file);
      urlMap[`/images/library/${file}`] = data.publicUrl;
      skipped++;
      continue;
    }

    const filePath = path.join(LOCAL_DIR, file);
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = file.endsWith(".png") ? "image/png" : file.endsWith(".webp") ? "image/webp" : "image/jpeg";

    const { error } = await supabase.storage.from(BUCKET).upload(file, fileBuffer, {
      contentType,
      upsert: false,
    });

    if (error) {
      console.error(`  ❌ Failed: ${file} — ${error.message}`);
      failed++;
    } else {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(file);
      urlMap[`/images/library/${file}`] = data.publicUrl;
      uploaded++;
      if (uploaded % 50 === 0) console.log(`  ✅ Uploaded ${uploaded}/${files.length - skipped}`);
    }

    await delay(50); // Avoid rate limits
  }

  console.log(`\n📊 Upload complete: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
  console.log(`\n🔄 Updating ${Object.keys(urlMap).length} rows in global_chef_library...\n`);

  // Fetch all rows
  const { data: rows } = await supabase.from("global_chef_library").select("id, image_url");
  let updated = 0;

  for (const row of rows || []) {
    const newUrl = urlMap[row.image_url];
    if (!newUrl || newUrl === row.image_url) continue;

    const { error } = await supabase
      .from("global_chef_library")
      .update({ image_url: newUrl })
      .eq("id", row.id);

    if (!error) updated++;
  }

  console.log(`✅ Updated ${updated} rows with Supabase Storage CDN URLs`);
  console.log(`\n🎉 Done! Your images are now served from Supabase Storage CDN.`);
  console.log(`   Bucket: ${BUCKET}`);
  console.log(`   Base URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`);
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
