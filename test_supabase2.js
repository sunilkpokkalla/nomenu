const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function test() {
  const { data, error } = await supabase
      .from("restaurants")
      .select("stripe_account_id, plan, prep_time_minutes, currency, is_annual_plan, subscription_start_date")
      .limit(1);
  console.log('Error:', error);
  console.log('Data:', data);
}
test();
