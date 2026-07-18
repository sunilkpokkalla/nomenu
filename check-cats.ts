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
  const { data: menus } = await supabase.from('menus').select('id').eq('restaurant_id', r[0].id);
  const { data: cats } = await supabase.from('categories').select('id, name').eq('menu_id', menus[0].id);
  const { data: items } = await supabase.from('menu_items').select('id, name, category_id, is_available').eq('restaurant_id', r[0].id);
  
  console.log("Categories:", cats);
  console.log("Items total:", items?.length);
  console.log("Items available:", items?.filter(i => i.is_available).length);
  console.log("Items with valid category:", items?.filter(i => cats?.some(c => c.id === i.category_id)).length);
}
main();
