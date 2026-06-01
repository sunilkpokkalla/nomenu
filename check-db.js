const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.log("No service role key found. Using anon key.");
}

const supabase = createClient(supabaseUrl, supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  const { data: users, error: usersErr } = await supabase.auth.admin.listUsers();
  if (usersErr) {
    console.log("Could not list users (likely anon key):", usersErr.message);
  } else {
    console.log(`Found ${users.users.length} users in auth.users`);
    users.users.forEach(u => console.log(`- ID: ${u.id}, Email: ${u.email}, Provider: ${u.app_metadata.provider}`));
  }

  const { data: restaurants, error: restErr } = await supabase.from('restaurants').select('id, name, owner_id, created_at');
  if (restErr) {
    console.log("Could not list restaurants:", restErr.message);
  } else {
    console.log(`Found ${restaurants.length} restaurants in DB:`);
    restaurants.forEach(r => console.log(`- ID: ${r.id}, Name: ${r.name}, Owner: ${r.owner_id}`));
  }
}
run();
