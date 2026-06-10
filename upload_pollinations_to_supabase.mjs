import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const filePath = path.join(process.cwd(), 'src/lib/global-dish-library.ts');
let fileContent = fs.readFileSync(filePath, 'utf8');

// Regex to find the pollinations URLs
const urlRegex = /imageUrl:\s*"(https:\/\/image\.pollinations\.ai\/prompt\/([^"]+))"/g;

let matches = [...fileContent.matchAll(urlRegex)];
console.log(`Found ${matches.length} images to generate and upload.`);

async function processImages() {
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const fullLine = match[0]; // imageUrl: "https..."
    const fullUrl = match[1]; // https://image.pollinations.ai/...
    
    console.log(`[${i + 1}/${matches.length}] Fetching image...`);
    
    try {
      const response = await fetch(fullUrl);
      if (!response.ok) {
        console.error(`Failed to fetch ${fullUrl}`);
        continue;
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const filename = `library-ai-${Date.now()}-${i}.jpg`;
      const bucketPath = `library-images/${filename}`;
      
      console.log(`Uploading to Supabase: ${bucketPath}`);
      
      const { data, error } = await supabase.storage
        .from('menu-items')
        .upload(bucketPath, buffer, {
          contentType: 'image/jpeg',
          upsert: true
        });
        
      if (error) {
        console.error("Upload error:", error);
        continue;
      }
      
      const { data: publicData } = supabase.storage
        .from('menu-items')
        .getPublicUrl(bucketPath);
        
      const newUrl = publicData.publicUrl;
      console.log(`Success! New URL: ${newUrl}`);
      
      // Replace in fileContent
      fileContent = fileContent.replace(fullLine, `imageUrl: "${newUrl}"`);
      
      // Save periodically
      fs.writeFileSync(filePath, fileContent);
      
      // Small delay to prevent rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      console.error("Error processing image:", err);
    }
  }
  
  console.log("Finished uploading all images and updating the global library file.");
}

processImages();
