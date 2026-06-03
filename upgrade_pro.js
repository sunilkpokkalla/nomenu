const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY);
async function run() {
  const { data, error } = await supabase.from("restaurants").update({ plan: "pro" }).eq("owner_id", "ec1f4d94-9086-48ec-87de-a41e645f1ee1");
  console.log("Upgraded:", error ? error : "Success");
}
run();
