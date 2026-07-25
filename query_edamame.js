const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY);
async function check() {
  const { data, error } = await supabase.from('menu_items').select('restaurant_id, name, price').ilike('name', '%Edamame%');
  console.log(data);
}
check();
