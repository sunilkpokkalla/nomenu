const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", "ec1f4d94-9086-48ec-87de-a41e645f1ee1")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
    
  console.log("Data:", data);
  console.log("Error:", error);
}
run();
