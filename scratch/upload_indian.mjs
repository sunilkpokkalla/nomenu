import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const libPath = path.resolve('./src/lib/global-dish-library.ts');
const content = fs.readFileSync(libPath, 'utf-8');
const match = content.match(/export const GLOBAL_DISH_LIBRARY: LibraryDish\[\] = (\[[\s\S]*\]);/);
const arrayStr = match[1];
const dishes = eval(`(${arrayStr})`);

const imagesToUpload = [
  { name: "Samosa", file: "public/library-images/library-samosa.png" },
  { name: "Onion Bhaji", file: "public/library-images/library-onion-bhaji.png" },
  { name: "Chicken Tikka", file: "public/library-images/library-chicken-tikka.png" },
  { name: "Paneer Tikka", file: "public/library-images/library-paneer-tikka.png" },
];

async function run() {
  let modified = false;
  
  for (const item of imagesToUpload) {
    const dish = dishes.find(d => d.name === item.name);
    if (!dish) {
      console.log(`Dish not found: ${item.name}`);
      continue;
    }
    
    console.log(`Uploading ${item.name}...`);
    const buffer = fs.readFileSync(item.file);
    const fileName = path.basename(item.file);
    const filePath = `library-images/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('menu-items')
      .upload(filePath, buffer, {
        contentType: 'image/png',
        upsert: true
      });
      
    if (error) {
      console.error(`Error uploading ${item.name}:`, error);
      continue;
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('menu-items')
      .getPublicUrl(filePath);
      
    dish.imageUrl = publicUrlData.publicUrl;
    console.log(`  Success: ${dish.imageUrl}`);
    modified = true;
  }
  
  if (modified) {
    const newArrayStr = JSON.stringify(dishes, null, 2);
    const newContent = content.replace(match[1], newArrayStr);
    fs.writeFileSync(libPath, newContent);
    console.log("Updated global-dish-library.ts");
  }
}

run();
