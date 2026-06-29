const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf-8');
const url = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const key = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1];

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase
    .from("loyalty_cards")
    .select("*, restaurants(id, name)")
    .limit(5);
  console.log("Error:", error);
  console.log("Data:", JSON.stringify(data, null, 2));
}

test();
