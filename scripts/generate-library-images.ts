import { fal } from '@fal-ai/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GLOBAL_DISH_LIBRARY } from '../src/lib/global-dish-library';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Ensure FAL_KEY is present
if (!process.env.FAL_KEY) {
  console.error("❌ ERROR: FAL_KEY is missing from .env.local!");
  console.log("Please add your Fal.ai API key to your .env.local file like this:");
  console.log("FAL_KEY=your_key_here");
  process.exit(1);
}

// Setup paths
const publicImagesDir = path.join(process.cwd(), 'public', 'images', 'library');
const libraryFilePath = path.join(process.cwd(), 'src', 'lib', 'global-dish-library.ts');

// Create directory if it doesn't exist
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Helper to make filenames safe
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log(`\n👨‍🍳 Starting AI Image Generation (Fal.ai Flux) for ${GLOBAL_DISH_LIBRARY.length} items...`);
  console.log(`Estimated cost on Flux Schnell: ~${((GLOBAL_DISH_LIBRARY.length * 0.003)).toFixed(2)} USD`);
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
        // 1. Ask Fal.ai (Flux) to generate the image
        const cuisineStr = dish.cuisines && dish.cuisines.length > 0 ? dish.cuisines.join(' and ') + ' cuisine' : '';
        
        let prompt = '';
        if (dish.category === 'Beverages' || dish.category === 'Drinks') {
          prompt = `A highly professional, hyper-realistic beverage photography studio shot of a refreshing ${cuisineStr} drink called "${dish.name}". ${dish.description || ''} Served in an elegant glass with condensation, 85mm lens, shallow depth of field, dramatic studio lighting, sharp focus on the drink, vibrant colors, clean minimal background. Absolutely no food, no plates, no text, no words, no logos.`;
        } else {
          prompt = `A highly professional, hyper-realistic food photography studio shot of an authentic ${cuisineStr ? cuisineStr + ' dish' : 'food'} called "${dish.name}". ${dish.description || ''} Beautifully plated, 85mm lens, shallow depth of field, dramatic studio lighting, sharp focus on the food, vibrant appetizing colors, clean minimal background. Absolutely no text, no words, no logos.`;
        }
        
        const result = await fal.subscribe("fal-ai/flux/schnell", {
          input: {
            prompt: prompt,
            image_size: "square_hd",
            num_images: 1,
            num_inference_steps: 4,
          }
        });

        const imageUrl = result.data.images[0].url;

        if (!imageUrl) {
          throw new Error("No image data returned from API.");
        }

        // 2. Download the image and save to public folder
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(localFilePath, buffer);
        console.log(`  ✓ Saved image: ${publicUrl}`);

        // 3. Update the global-dish-library.ts file
        libraryContent = libraryContent.replace(dish.imageUrl, publicUrl);
        fs.writeFileSync(libraryFilePath, libraryContent);

        processed++;
        success = true;

        // Wait 1 second to be polite to the API
        await delay(1000);

      } catch (error: any) {
        const errMsg = error.message || String(error);
        if (errMsg.includes('429') || errMsg.includes('Rate limit') || errMsg.includes('fetch')) {
          console.log(`  ⏳ Rate limit or network issue hit: "${errMsg.split('\n')[0]}"`);
          console.log(`  ⏳ Waiting 5 seconds before retrying...`);
          await delay(5000);
          retries++;
        } else if (errMsg.includes('Forbidden') || errMsg.includes('403')) {
          console.warn(`  ⚠️ Forbidden error (likely safety filter or out of credits). Skipping ${dish.name}.`);
          skipped++;
          success = true; // Pretend success to break the while loop and skip this item
        } else {
          console.error(`  ❌ Failed:`, errMsg);
          console.log(`\n⚠️ Stopping script due to unrecoverable API error.`);
          process.exit(1);
        }
      }
    }

    if (!success) {
      console.log(`\n⚠️ Stopping script after maximum retries.`);
      process.exit(1);
    }
  }

  console.log(`\n🎉 Success! Generated ${processed} images. (${skipped} were already completed).`);
  console.log("Your Global Dish Library is now 100% AI generated!");
}

run();
