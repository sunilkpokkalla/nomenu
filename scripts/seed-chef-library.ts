import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { GLOBAL_DISH_LIBRARY } from '../src/lib/global-dish-library';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service_role key to bypass RLS for seeding
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log(`Seeding ${GLOBAL_DISH_LIBRARY.length} items into global_chef_library...`);

  // Clear existing items first to avoid duplicates if run multiple times
  console.log('Clearing existing items...');
  const { error: clearError } = await supabase
    .from('global_chef_library')
    .delete()
    .is('created_by', null); // Only delete seeded items
    
  if (clearError) {
     console.error("Failed to clear table", clearError);
  }

  // Insert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < GLOBAL_DISH_LIBRARY.length; i += batchSize) {
    const batch = GLOBAL_DISH_LIBRARY.slice(i, i + batchSize).map(item => ({
      name: item.name,
      description: item.description,
      category_id: item.category,
      image_url: item.imageUrl
    }));

    const { error } = await supabase.from('global_chef_library').insert(batch);
    if (error) {
      console.error(`Error inserting batch ${i / batchSize}:`, error);
    } else {
      console.log(`Inserted batch ${i / batchSize + 1} (${batch.length} items)`);
    }
  }

  console.log("Seeding complete! ✅");
}

run();
