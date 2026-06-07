const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function test() {
  const fileContent = "dummy content";
  const { data, error } = await supabase.storage.from('menu-items').upload('test-file.txt', fileContent, {
    contentType: 'text/plain',
    upsert: true
  });
  if (error) {
    console.error("Upload error:", error);
  } else {
    console.log("Upload success:", data);
  }
}
test();
