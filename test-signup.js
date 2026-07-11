require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function test() {
  const { error } = await supabase.from("affiliates").insert({
    auth_id: "d7b45aaf-0073-4846-b9f2-85cb7a7be4bc", // my test user
    name: "Test Name",
    email: "test@test.com",
    referral_code: "TEST1234",
    expertise: "Testing",
    social_influence: "10",
    social_media_details: "none",
    location: "US",
    purpose: "Testing",
    status: "pending",
    tier: "founding"
  });
  console.log("Insert Error:", error);
}
test();
