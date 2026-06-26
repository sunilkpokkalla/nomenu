import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: users, error: uErr } = await supabase.from('restaurants').select('id, name, slug, referred_by_code').order('created_at', { ascending: false }).limit(10);
  console.log("Recent restaurants:", users);
}
check();
