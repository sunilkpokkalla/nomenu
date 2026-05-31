import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const libPath = path.resolve('./src/lib/global-dish-library.ts');
const content = fs.readFileSync(libPath, 'utf-8');

const match = content.match(/export const GLOBAL_DISH_LIBRARY: LibraryDish\[\] = (\[[\s\S]*\]);/);
if (!match) {
  console.error("Could not find array");
  process.exit(1);
}

const arrayStr = match[1];
let dishes;
try {
  dishes = eval(`(${arrayStr})`);
} catch (e) {
  console.error("Failed to parse array", e);
  process.exit(1);
}

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log(`Found ${dishes.length} dishes to process...`);
  
  for (let i = 0; i < dishes.length; i++) {
    const dish = dishes[i];
    console.log(`[${i+1}/${dishes.length}] Processing ${dish.name}...`);
    
    if (dish.imageUrl && dish.imageUrl.includes('supabase.co')) {
      console.log(`  Already has Supabase URL, skipping.`);
      continue;
    }

    const prompt = `A delicious high quality professional food photography shot of ${dish.name}, ${dish.cuisines[0] || 'global'} cuisine, restaurant plating, clean background, highly appetizing`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=${Math.abs(dish.name.length * 42)}`;
    
    try {
      console.log(`  Fetching image...`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const fileName = `library-${dish.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`;
      const filePath = `library-images/${fileName}`;
      
      console.log(`  Uploading to Supabase...`);
      const { data, error } = await supabase.storage
        .from('menu-items')
        .upload(filePath, buffer, {
          contentType: 'image/jpeg',
          upsert: true
        });
        
      if (error) {
        throw error;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('menu-items')
        .getPublicUrl(filePath);
        
      dish.imageUrl = publicUrlData.publicUrl;
      console.log(`  Success: ${dish.imageUrl}`);
      
      const newArrayStr = JSON.stringify(dishes, null, 2);
      const newContent = content.replace(match[1], newArrayStr);
      fs.writeFileSync(libPath, newContent);
      
    } catch (e) {
      console.error(`  Error processing ${dish.name}:`, e.message);
    }
    
    console.log(`  Waiting 3 seconds...`);
    await delay(1500);
  }
  
  console.log("Done!");
}

run();
