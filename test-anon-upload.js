const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const fileContent = "dummy content anon";
  const { data, error } = await supabase.storage.from('menu-items').upload('test-anon-file.txt', fileContent, {
    contentType: 'text/plain',
    upsert: true
  });
  if (error) {
    console.error("Anon Upload error:", error);
  } else {
    console.log("Anon Upload success:", data);
  }
}
test();
