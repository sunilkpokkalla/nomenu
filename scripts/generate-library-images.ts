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
      // We replace the exact loremflickr URL with the new local URL
      libraryContent = libraryContent.replace(dish.imageUrl, publicUrl);
      fs.writeFileSync(libraryFilePath, libraryContent);

      processed++;

      // Wait 3 seconds between requests to avoid API rate limits
      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (error: any) {
      console.error(`  ❌ Failed:`, error.message || error);
      console.log(`\n⚠️ Stopping script due to API error. \nDon't worry, progress is saved! You can run this script again later and it will resume exactly where it left off.`);
      process.exit(1);
    }
  }

  console.log(`\n🎉 Success! Generated ${processed} images. (${skipped} were already completed).`);
  console.log("Your Global Dish Library is now 100% AI generated!");
}

run();
