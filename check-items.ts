import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.dev.vars' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function main() {
  const { data: r } = await supabase.from('restaurants').select('id, slug').eq('slug', 'velvet-fork').limit(1);
  const { data: m } = await supabase.from('menu_items').select('id, name').eq('restaurant_id', r[0].id);
  console.log("Items:", m?.length);
}
main();
