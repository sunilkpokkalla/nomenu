require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
);

async function checkSchema() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Query Error:", error);
  } else {
    console.log("Columns:", data && data.length > 0 ? Object.keys(data[0]) : "No rows, cannot infer all columns if strict");
  }
}

checkSchema();
