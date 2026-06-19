const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim() || env.match(/SUPABASE_SERVICE_KEY=(.*)/)?.[1]?.trim();

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { error } = await supabase.from('restaurants').update({ plan: 'elite' }).neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) {
    console.error("Error updating plans:", error);
  } else {
    console.log("SUCCESS: Upgraded all restaurants to elite.");
  }
}
run();
