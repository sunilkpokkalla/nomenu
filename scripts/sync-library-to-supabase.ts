import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { GLOBAL_DISH_LIBRARY } from '../src/lib/global-dish-library';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for bulk inserts bypassing RLS
);

async function run() {
  console.log(`Preparing to sync ${GLOBAL_DISH_LIBRARY.length} items to Supabase...`);

  // Supabase bulk upsert or insert
  // Since we want to update the image_url based on name, we should check if name is unique
  // Or we can just delete all and insert? Deleting all might be dangerous if there are foreign keys.
  // Let's just upsert using 'name' as the conflict resolution key, assuming it's unique.
  // Actually, we can fetch all, then update the ones that exist by ID, and insert the rest.

  const { data: existingItems, error: fetchErr } = await supabase.from('global_chef_library').select('id, name');
  
  if (fetchErr) {
    console.error("Failed to fetch existing items:", fetchErr);
    return;
  }

  const existingMap = new Map(existingItems.map(item => [item.name.toLowerCase(), item.id]));

  const toInsert: any[] = [];
  const toUpdate: any[] = [];

  for (const dish of GLOBAL_DISH_LIBRARY) {
    const existingId = existingMap.get(dish.name.toLowerCase());
    if (existingId) {
      toUpdate.push({
        id: existingId,
        name: dish.name,
        description: dish.description || null,
        category_id: dish.category || null,
        image_url: dish.imageUrl || null,
      });
    } else {
      toInsert.push({
        name: dish.name,
        description: dish.description || null,
        category_id: dish.category || null,
        image_url: dish.imageUrl || null,
      });
    }
  }

  console.log(`Found ${toUpdate.length} items to update.`);
  console.log(`Found ${toInsert.length} new items to insert.`);

  // Process updates in chunks of 100
  let updatedCount = 0;
  for (let i = 0; i < toUpdate.length; i += 100) {
    const chunk = toUpdate.slice(i, i + 100);
    const { error: updateErr } = await supabase.from('global_chef_library').upsert(chunk);
    if (updateErr) {
      console.error("Error updating chunk:", updateErr);
    } else {
      updatedCount += chunk.length;
      console.log(`Updated ${updatedCount}/${toUpdate.length}`);
    }
  }

  // Process inserts in chunks of 100
  let insertedCount = 0;
  for (let i = 0; i < toInsert.length; i += 100) {
    const chunk = toInsert.slice(i, i + 100);
    const { error: insertErr } = await supabase.from('global_chef_library').insert(chunk);
    if (insertErr) {
      console.error("Error inserting chunk:", insertErr);
    } else {
      insertedCount += chunk.length;
      console.log(`Inserted ${insertedCount}/${toInsert.length}`);
    }
  }

  console.log('🎉 Sync complete!');
}

run().catch(console.error);
