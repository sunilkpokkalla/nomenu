const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY);
async function run() {
  const { data, error } = await supabase
          .from("orders")
          .update({
            status: "pending",
            payment_intent_id: "test_pi_123",
          })
          .eq("id", "ddc85c91-122a-4099-84f6-f346433f5c4f")
          .eq("restaurant_id", "3cee9db9-0dd7-4bec-bc8b-483b22daeed2");
  console.log("Update Error:", error);
  console.log("Update Data:", data);
}
run();
