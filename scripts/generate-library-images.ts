import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GLOBAL_DISH_LIBRARY } from '../src/lib/global-dish-library';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Setup paths
const publicImagesDir = path.join(process.cwd(), 'public', 'images', 'library');
const libraryFilePath = path.join(process.cwd(), 'src', 'lib', 'global-dish-library.ts');

// Create directory if it doesn't exist
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper to make filenames safe
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log(`\n👨‍🍳 Starting AI Image Generation for ${GLOBAL_DISH_LIBRARY.length} items...`);
  console.log(`Estimated cost: ~${((GLOBAL_DISH_LIBRARY.length * 0.03)).toFixed(2)} USD`);
  console.log(`Images will be saved to: /public/images/library/\n`);

  let libraryContent = fs.readFileSync(libraryFilePath, 'utf8');
  let processed = 0;
  let skipped = 0;

  for (const dish of GLOBAL_DISH_LIBRARY) {
    // Only generate for items that still have the loremflickr placeholder
    if (!dish.imageUrl || !dish.imageUrl.includes('loremflickr')) {
      skipped++;
      continue;
    }

    const slug = slugify(dish.name);
    const fileName = `${slug}.jpg`;
    const localFilePath = path.join(publicImagesDir, fileName);
    const publicUrl = `/images/library/${fileName}`;

    console.log(`[${processed + skipped + 1}/${GLOBAL_DISH_LIBRARY.length}] Generating: ${dish.name}`);

    let success = false;
    let retries = 0;

    while (!success && retries < 3) {
      try {
        // 1. Ask Google Imagen 4 to generate the image
        const prompt = `A highly professional, hyper-realistic food photography studio shot of a delicious single serving of "${dish.name}". ${dish.description || ''} Beautifully plated, 85mm lens, shallow depth of field, dramatic studio lighting, sharp focus on the food, vibrant appetizing colors, clean minimal background. Absolutely no text, no words, no logos.`;
        
        const response = await ai.models.generateImages({
          model: 'imagen-4.0-fast-generate-001',
          prompt: prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1'
          }
        });

        const base64Image = response.generatedImages?.[0]?.image?.imageBytes;

        if (!base64Image) {
          throw new Error("No image data returned from API.");
        }

        // 2. Save the image to the public folder
        const buffer = Buffer.from(base64Image, 'base64');
        fs.writeFileSync(localFilePath, buffer);
        console.log(`  ✓ Saved image: ${publicUrl}`);

        // 3. Update the global-dish-library.ts file
        libraryContent = libraryContent.replace(dish.imageUrl, publicUrl);
        fs.writeFileSync(libraryFilePath, libraryContent);

        processed++;
        success = true;

        // Wait 6.5 seconds to safely stay under the 10 requests per minute quota
        await delay(6500);

      } catch (error: any) {
        const errMsg = error.message || String(error);
        if (error?.status === 429 || error?.status === "RESOURCE_EXHAUSTED" || errMsg.includes('Quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
          console.log(`  ⏳ Rate limit hit. Google API says: "${errMsg.split('\n')[0]}"`);
          console.log(`  ⏳ Waiting 30 seconds before retrying...`);
          await delay(30000);
          retries++;
        } else {
          console.error(`  ❌ Failed:`, errMsg);
          console.log(`\n⚠️ Stopping script due to unrecoverable API error.`);
          process.exit(1);
        }
      }
    }

    if (!success) {
      console.log(`\n⚠️ Stopping script after maximum rate limit retries.`);
      process.exit(1);
    }
  }

  console.log(`\n🎉 Success! Generated ${processed} images. (${skipped} were already completed).`);
  console.log("Your Global Dish Library is now 100% AI generated!");
}

run();
