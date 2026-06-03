const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY);
async function run() {
  const { data, error } = await supabase.from("restaurants").select("name, stripe_account_id, created_at").eq("owner_id", "ec1f4d94-9086-48ec-87de-a41e645f1ee1").order("created_at", { ascending: true });
  console.log("Restaurants for user:", data);
}
run();
