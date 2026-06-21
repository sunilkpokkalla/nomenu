import { fal } from "@fal-ai/client";
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { MENU_TEMPLATES } from '../src/lib/templates';
import { GLOBAL_DISH_LIBRARY } from '../src/lib/global-dish-library';

dotenv.config({ path: '.env.local' });

const publicImagesDir = path.join(process.cwd(), 'public', 'images', 'library');
const templatesFile = path.join(process.cwd(), 'src', 'lib', 'templates.ts');
const globalLibraryFile = path.join(process.cwd(), 'src', 'lib', 'global-dish-library.ts');

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function run() {
  const libraryItems = new Set(GLOBAL_DISH_LIBRARY.map(d => d.name.toLowerCase()));
  
  const allTemplateItems: any[] = [];
  const missingItems: any[] = [];

  MENU_TEMPLATES.forEach(template => {
    template.categories.forEach(cat => {
      cat.items.forEach(item => {
        allTemplateItems.push(item);
        if (!libraryItems.has(item.name.toLowerCase())) {
          if (!missingItems.find(m => m.name.toLowerCase() === item.name.toLowerCase())) {
            missingItems.push({ ...item, templateCategory: cat.name });
          }
        }
      });
    });
  });

  console.log(`Found ${missingItems.length} missing items to generate.`);

  for (let i = 0; i < missingItems.length; i++) {
    const item = missingItems[i];
    const slug = slugify(item.name);
    const fileName = `${slug}.jpg`;
    const localFilePath = path.join(publicImagesDir, fileName);

    console.log(`[${i + 1}/${missingItems.length}] Processing: ${item.name}`);

    if (!fs.existsSync(localFilePath)) {
      const prompt = "A highly professional, hyper-realistic food photography studio shot of " + item.name + ". " + item.description + ". Beautifully plated. Appetizing colors, 85mm lens, depth of field. Absolutely no text, no words, no logos.";
      
      let success = false;
      let retries = 0;

      while (!success && retries < 3) {
        try {
          const result = await fal.subscribe("fal-ai/flux/schnell", {
            input: {
              prompt,
              image_size: "square_hd",
              num_images: 1,
              num_inference_steps: 4,
            }
          });

          const imageUrl = result.data.images[0].url;
          const response = await fetch(imageUrl);
          const arrayBuffer = await response.arrayBuffer();
          fs.writeFileSync(localFilePath, Buffer.from(arrayBuffer));
          
          console.log("  ✓ Saved image: " + fileName);
          success = true;
        } catch (err) {
          retries++;
          console.log("  ! Error on " + item.name + ", retry " + retries + "/3");
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    } else {
      console.log("  ✓ Image already exists: " + fileName);
    }
  }

  const templateDishesCode = "// Generated automatically to merge template items into the global library\n" +
    "export const TEMPLATE_DISHES = " + JSON.stringify(missingItems.map(item => ({
    name: item.name,
    category: item.templateCategory || "Template Items",
    description: item.description,
    imageUrl: "/images/library/" + slugify(item.name) + ".jpg"
  })), null, 2) + ";\n";

  fs.writeFileSync(path.join(process.cwd(), 'src', 'lib', 'template-dishes.ts'), templateDishesCode);
  console.log("✓ Created src/lib/template-dishes.ts");

  let templatesContent = fs.readFileSync(templatesFile, 'utf-8');
  
  const lines = templatesContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('name:') && line.includes('imageUrl: "https://loremflickr')) {
      const nameMatch = line.match(/name:\s*"([^"]+)"/);
      if (nameMatch) {
        const slug = slugify(nameMatch[1]);
        lines[i] = line.replace(/imageUrl:\s*"https:\/\/loremflickr\.com[^"]+"/, 'imageUrl: "/images/library/' + slug + '.jpg"');
      }
    }
  }
  
  fs.writeFileSync(templatesFile, lines.join('\n'));
  console.log("✓ Updated src/lib/templates.ts to use local images");
  
  console.log("🎉 All done! Now you just need to manually import TEMPLATE_DISHES into global-dish-library.ts");
}

run().catch(console.error);
