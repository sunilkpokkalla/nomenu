import fs from 'fs';
import path from 'path';
import { GLOBAL_DISH_LIBRARY } from '../src/lib/global-dish-library';

const publicImagesDir = path.join(process.cwd(), 'public', 'images', 'library');
const libraryFilePath = path.join(process.cwd(), 'src', 'lib', 'global-dish-library.ts');

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

let libraryContent = fs.readFileSync(libraryFilePath, 'utf8');
let resetCount = 0;

for (const dish of GLOBAL_DISH_LIBRARY) {
  if ((dish.category === 'Beverages' || dish.category === 'Drinks') && dish.imageUrl && !dish.imageUrl.includes('loremflickr')) {
    // Delete the file if it exists
    const slug = slugify(dish.name);
    const fileName = `${slug}.jpg`;
    const localFilePath = path.join(publicImagesDir, fileName);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    // Reset imageUrl in content
    const randomSeed = Math.floor(Math.random() * 1000);
    const placeholderUrl = `https://loremflickr.com/640/480/drink?lock=${randomSeed}`;
    libraryContent = libraryContent.replace(dish.imageUrl, placeholderUrl);
    resetCount++;
  }
}

fs.writeFileSync(libraryFilePath, libraryContent);
console.log(`Reset ${resetCount} beverage images to placeholders.`);
