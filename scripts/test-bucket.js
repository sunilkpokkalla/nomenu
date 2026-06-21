const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBucket() {
  const { data, error } = await supabase.storage.getBucket('menu-items');
  if (error) {
    console.error("❌ Error fetching bucket:", error.message);
  } else {
    console.log("✅ Bucket 'menu-items' exists and is accessible!");
    console.log("Bucket details:", data);
  }
}

testBucket();
