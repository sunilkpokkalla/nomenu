import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { DRINKS_AND_DESSERTS } from '../src/lib/drinks-desserts-library';

dotenv.config({ path: '.env.local' });

if (!process.env.FAL_KEY) {
  console.error("❌ ERROR: FAL_KEY is missing from .env.local!");
  process.exit(1);
}

const publicImagesDir = path.join(process.cwd(), 'public', 'images', 'library');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function run() {
  // Only items whose file doesn't exist on disk yet
  const missing = DRINKS_AND_DESSERTS.filter(dish => {
    const filePath = path.join(process.cwd(), 'public', dish.imageUrl!);
    return !fs.existsSync(filePath);
  });

  console.log(`\n🍹 Generating images for ${missing.length} missing drinks & desserts...`);
  console.log(`Estimated cost: ~$${(missing.length * 0.003).toFixed(2)} USD\n`);

  let processed = 0;

  for (const dish of missing) {
    const localFilePath = path.join(process.cwd(), 'public', dish.imageUrl!);

    let prompt = '';
    if (dish.category === 'Beverages' || dish.category === 'Cocktails') {
      prompt = `A highly professional, hyper-realistic beverage photography studio shot of "${dish.name}". ${dish.description || ''} Served in an elegant glass or appropriate vessel, 85mm lens, shallow depth of field, dramatic studio lighting, sharp focus on the drink, vibrant colors, clean minimal dark background. Absolutely no food, no plates, no text, no words, no logos.`;
    } else {
      prompt = `A highly professional, hyper-realistic food photography studio shot of the dessert "${dish.name}". ${dish.description || ''} Beautifully plated, 85mm lens, shallow depth of field, dramatic studio lighting, sharp focus on the dessert, vibrant appetizing colors, clean minimal background. Absolutely no text, no words, no logos.`;
    }

    console.log(`[${processed + 1}/${missing.length}] Generating: ${dish.name}`);

    let success = false;
    let retries = 0;

    while (!success && retries < 3) {
      try {
        const imgRes = await fetch("https://fal.run/fal-ai/flux/schnell", {
          method: "POST",
          headers: {
            "Authorization": `Key ${process.env.FAL_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt,
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

        if (!imageUrl) throw new Error("No image URL returned from Fal.");

        const imgDownload = await fetch(imageUrl);
        const arrayBuffer = await imgDownload.arrayBuffer();
        fs.writeFileSync(localFilePath, Buffer.from(arrayBuffer));
        console.log(`  ✓ Saved: ${dish.imageUrl}`);

        processed++;
        success = true;
        await delay(800);

      } catch (error: any) {
        const msg = error.message || String(error);
        if (msg.includes('429') || msg.includes('Rate limit')) {
          console.log(`  ⏳ Rate limit — waiting 5s...`);
          await delay(5000);
          retries++;
        } else if (msg.includes('403') || msg.includes('Forbidden')) {
          console.warn(`  ⚠️ Forbidden — skipping ${dish.name}`);
          success = true;
        } else {
          console.error(`  ❌ Error:`, msg);
          process.exit(1);
        }
      }
    }
  }

  console.log(`\n🎉 Done! Generated ${processed} images for drinks & desserts.`);
}

run();
