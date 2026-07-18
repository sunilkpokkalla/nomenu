import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.dev.vars' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function main() {
  const { data: r } = await supabase.from('restaurants').select('slug').limit(1);
  if (!r || r.length === 0) { console.log("NO_REST"); return; }
  const { data: m } = await supabase.from('menus').select('slug').eq('restaurant_id', r[0].id).limit(1);
  console.log(`/${r[0].slug}/${m?.[0]?.slug || 'menu'}`);
}
main();
