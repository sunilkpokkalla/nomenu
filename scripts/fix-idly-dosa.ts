import { fal } from "@fal-ai/client";
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { GLOBAL_DISH_LIBRARY } from '../src/lib/global-dish-library';

dotenv.config({ path: '.env.local' });

const publicImagesDir = path.join(process.cwd(), 'public', 'images', 'library');

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function getVisualOverride(name: string): string {
  let desc = "";
  const lowerName = name.toLowerCase();

  // Dosa logic
  if (lowerName.includes("dosa")) {
    desc += "large, thin, crispy golden-brown Indian savory crepe (Dosa) folded on a plate. ";
    if (lowerName.includes("masala")) desc += "Stuffed with a spiced yellow potato curry. ";
    if (lowerName.includes("paneer")) desc += "Stuffed with spiced Indian cottage cheese (paneer). ";
    if (lowerName.includes("chicken")) desc += "Stuffed with spiced chicken curry. ";
    if (lowerName.includes("onion")) desc += "Topped with chopped roasted onions. ";
    if (lowerName.includes("chocolate")) desc += "Drizzled with rich chocolate sauce. ";
    if (lowerName.includes("egg")) desc += "Coated with a cooked omelette layer on the inside. ";
    if (lowerName.includes("ghee")) desc += "Roasted in rich clarified butter (ghee) giving it a glossy golden finish. ";
    if (lowerName.includes("karam")) desc += "Smeared with a bright red spicy chili-garlic paste (karam) on the inside. ";
  }
  
  // Idly logic
  else if (lowerName.includes("idly")) {
    if (lowerName.includes("mini")) {
      desc += "small bite-sized round white steamed rice cakes (Mini Idly). ";
    } else if (lowerName.includes("thatte")) {
      desc += "single large, flat, plate-sized round white steamed rice cake (Thatte Idly). ";
    } else {
      desc += "soft, round, fluffy white steamed rice cakes (Idly). ";
    }

    if (lowerName.includes("sambar")) {
      desc += "Submerged and floating in a bowl of hot, flavorful brown/orange lentil stew (Sambar). ";
    } else {
      desc += "Served on a plate. ";
      if (lowerName.includes("ghee")) desc += "Generously drizzled and glistening with clarified butter (ghee). ";
      if (lowerName.includes("karam")) desc += "Heavily coated in a bright red, spicy dry lentil-chili powder (Karam Podi). ";
    }
  }

  return desc + "Served alongside small bowls of white coconut chutney and red tomato chutney. Highly professional, hyper-realistic food photography, 85mm lens, beautiful plating, appetizing colors. Absolutely no text, no words, no logos.";
}

async function fixIdlyAndDosa() {
  const targets = GLOBAL_DISH_LIBRARY.filter(d => 
    d.name.toLowerCase().includes('idly') || d.name.toLowerCase().includes('dosa')
  );

  console.log(`Found ${targets.length} Idly/Dosa dishes to fix.`);

  for (let i = 0; i < targets.length; i++) {
    const dish = targets[i];
    const slug = slugify(dish.name);
    const fileName = `${slug}.jpg`;
    const localFilePath = path.join(publicImagesDir, fileName);

    console.log(`[${i + 1}/${targets.length}] Fixing: ${dish.name}`);
    
    const visualDesc = getVisualOverride(dish.name);
    
    let success = false;
    let retries = 0;

    while (!success && retries < 3) {
      try {
        const result = await fal.subscribe("fal-ai/flux/schnell", {
          input: {
            prompt: visualDesc,
            image_size: "square_hd",
            num_images: 1,
            num_inference_steps: 4,
          }
        });

        const imageUrl = result.data.images[0].url;
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        fs.writeFileSync(localFilePath, Buffer.from(arrayBuffer));
        
        console.log(`  ✓ Saved fixed image: ${fileName}`);
        success = true;
      } catch (err) {
        retries++;
        console.log(`  ! Error on ${dish.name}, retry ${retries}/3`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }
  
  console.log('🎉 Done fixing Idly and Dosa images!');
}

fixIdlyAndDosa().catch(console.error);
