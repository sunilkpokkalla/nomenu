import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const libPath = path.resolve('./src/lib/global-dish-library.ts');

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log("Starting background AI Chef Library image population...");
  
  // 1. Read library
  let content = fs.readFileSync(libPath, 'utf-8');
  let match = content.match(/export const GLOBAL_DISH_LIBRARY: LibraryDish\[\] = (\[[\s\S]*\]);/);
  if (!match) throw new Error("Could not find array");
  
  let dishes;
  try {
    dishes = eval(`(${match[1]})`);
  } catch (e) {
    throw new Error("Failed to parse array");
  }

  // 2. Filter missing
  const missingDishes = dishes.filter(d => !d.imageUrl || !d.imageUrl.includes('supabase.co'));
  console.log(`Found ${missingDishes.length} dishes missing images out of ${dishes.length} total.`);

  let successCount = 0;
  
  // 3. Process
  for (let i = 0; i < missingDishes.length; i++) {
    const dish = missingDishes[i];
    console.log(`[${i+1}/${missingDishes.length}] Processing ${dish.name}...`);
    
    const prompt = `A delicious high quality professional food photography shot of ${dish.name}, ${dish.cuisines[0] || 'global'} cuisine, restaurant plating, clean background, highly appetizing`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=${Math.abs(dish.name.length * 42)}`;
    
    try {
      // Fetch image
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Compress to WebP
      const compressedBuffer = await sharp(buffer)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();
        
      const fileName = `library-${dish.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.webp`;
      const filePath = `library-images/${fileName}`;
      
      // Upload
      const { error: uploadError } = await supabase.storage
        .from('menu-items')
        .upload(filePath, compressedBuffer, {
          contentType: 'image/webp',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from('menu-items')
        .getPublicUrl(filePath);
        
      // Update original array reference
      const originalDish = dishes.find(d => d.name === dish.name);
      if (originalDish) {
        originalDish.imageUrl = publicUrlData.publicUrl;
      }
      
      successCount++;
      console.log(`  Success: ${publicUrlData.publicUrl}`);
      
      // Save every 10 items
      if (successCount % 10 === 0) {
        console.log(`  -> Saving intermediate progress to global-dish-library.ts...`);
        const newArrayStr = JSON.stringify(dishes, null, 2);
        const currentContent = fs.readFileSync(libPath, 'utf-8');
        const currentMatch = currentContent.match(/export const GLOBAL_DISH_LIBRARY: LibraryDish\[\] = (\[[\s\S]*\]);/);
        if (currentMatch) {
          const newContent = currentContent.replace(currentMatch[1], newArrayStr);
          fs.writeFileSync(libPath, newContent);
        }
      }
      
    } catch (e) {
      console.error(`  Error processing ${dish.name}:`, e.message);
    }
    
    // Strict delay to avoid ban
    await delay(3000);
  }
  
  // Final save
  console.log(`Finished processing. Saving final updates...`);
  const newArrayStr = JSON.stringify(dishes, null, 2);
  const currentContent = fs.readFileSync(libPath, 'utf-8');
  const currentMatch = currentContent.match(/export const GLOBAL_DISH_LIBRARY: LibraryDish\[\] = (\[[\s\S]*\]);/);
  if (currentMatch) {
    const newContent = currentContent.replace(currentMatch[1], newArrayStr);
    fs.writeFileSync(libPath, newContent);
  }
  
  console.log(`Done! Successfully updated ${successCount} images.`);
}

run();
