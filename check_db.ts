import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.rpc('increment_loyalty_stamps', { target_card_id: 'fake-id' });
  console.log("RPC Error:", error);
  console.log("RPC Data:", data);
  
  // also check cards
  const { data: cards } = await supabase.from('loyalty_cards').select('*').limit(3).order('created_at', { ascending: false });
  console.log("Recent cards:", cards);
}

check();
