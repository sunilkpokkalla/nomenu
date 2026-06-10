// generate_local_ai_images.mjs
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// -------------------------------------------------------------
// CONFIGURATION
// -------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials missing in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const libraryPath = path.join(process.cwd(), "src/lib/global-dish-library.ts");
const tmpImgDir = path.join(process.cwd(), "generated_ai_images");
if (!fs.existsSync(tmpImgDir)) fs.mkdirSync(tmpImgDir);

// Adjust this to your local Stable Diffusion CLI command
const STABLE_DIFFUSION_CMD = process.env.STABLE_DIFFUSION_CMD || "sdtxt2img";

function generateImage(prompt, fileName) {
  return new Promise((resolve, reject) => {
    const outPath = path.join(tmpImgDir, `${fileName}.png`);
    const args = [
      "--prompt",
      prompt,
      "--outdir",
      tmpImgDir,
      "--filename",
      fileName,
      "--steps",
      "30",
      "--sampler",
      "ddim",
      "--width",
      "800",
      "--height",
      "600"
    ];
    execFile(STABLE_DIFFUSION_CMD, args, { maxBuffer: 1024 * 1024 * 20 }, (err, stdout, stderr) => {
      if (err) {
        console.error(`Stable Diffusion error for ${prompt}:`, err, stderr);
        return reject(err);
      }
      console.log(`✅ Generated image for ${prompt} → ${outPath}`);
      resolve(outPath);
    });
  });
}

async function uploadToSupabase(localPath, remoteFileName) {
  const fileData = fs.readFileSync(localPath);
  const bucketPath = `library-images/${remoteFileName}`;
  const { data, error } = await supabase.storage.from("menu-items").upload(bucketPath, fileData, {
    contentType: "image/png",
    upsert: true
  });
  if (error) throw new Error(`Supabase upload error: ${error.message}`);
  const { data: publicData } = supabase.storage.from("menu-items").getPublicUrl(bucketPath);
  return publicData.publicUrl;
}

async function main() {
  let libraryContent = fs.readFileSync(libraryPath, "utf8");
  const dishRegex = /name:\s*"([^"]+)"[^}]*?imageUrl:\s*"([^"]+)"/gs;
  const dishes = [...libraryContent.matchAll(dishRegex)];
  console.log(`🔎 Found ${dishes.length} dishes in the library.`);
  const placeholderPattern = /loremflickr\.com|image\.pollinations\.ai/;
  for (let i = 0; i < dishes.length; i++) {
    const [, dishName, currentUrl] = dishes[i];
    if (!placeholderPattern.test(currentUrl)) {
      console.log(`✅ ${dishName} already has a proper image – skipping.`);
      continue;
    }
    const prompt = `High quality food photography of ${dishName}, beautiful plating, dark background, cinematic lighting, hyper realistic`;
    const safeFileName = dishName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const localImgPath = await generateImage(prompt, safeFileName);
    const supabaseUrl = await uploadToSupabase(localImgPath, `${safeFileName}-${Date.now()}.png`);
    console.log(`🗂️ Uploaded ${dishName} → ${supabaseUrl}`);
    const escapedCurrentUrl = currentUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const replaceRegex = new RegExp(`imageUrl:\s*"${escapedCurrentUrl}"`);
    libraryContent = libraryContent.replace(replaceRegex, `imageUrl: "${supabaseUrl}"`);
  }
  fs.writeFileSync(libraryPath, libraryContent, "utf8");
  console.log("📝 Updated GLOBAL_DISH_LIBRARY with new Supabase URLs.");
  fs.rmSync(tmpImgDir, { recursive: true, force: true });
  console.log("🧹 Cleaned temporary image folder.");
}

main()
  .then(() => console.log("🚀 All images generated, uploaded, and library updated!"))
  .catch(err => { console.error("❌ An error occurred:", err); process.exit(1); });
