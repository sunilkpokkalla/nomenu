const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data: r, error } = await supabase.from('restaurants').select('*, loyalty_pin_code').eq('slug', 'restaurant').maybeSingle();
  if (error) console.error('Error fetching restaurant:', error);
  else console.log('Restaurant:', r);
}
run();
