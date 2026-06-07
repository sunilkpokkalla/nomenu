const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function test() {
  const { data, error } = await supabase.storage.getBucket('menu-items');
  if (error) {
    console.error("Bucket error:", error);
  } else {
    console.log("Bucket exists:", data.name);
  }
}
test();
