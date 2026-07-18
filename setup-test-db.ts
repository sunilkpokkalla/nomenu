import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.dev.vars' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function main() {
  const { data, error } = await supabase.from('restaurants').update({ plan: 'enterprise' }).eq('slug', 'velvet-fork');
  console.log("Updated plan to enterprise for velvet-fork", error ? error : "Success");
}
main();
