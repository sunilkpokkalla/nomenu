const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim() || env.match(/SUPABASE_SERVICE_KEY=(.*)/)?.[1]?.trim();

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data } = await supabase.from('restaurants').select('id, name, plan');
  console.log("RESTAURANT PLANS:");
  console.log(JSON.stringify(data, null, 2));
}
check();
