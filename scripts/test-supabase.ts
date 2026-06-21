import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

async function run() {
  const { data, error } = await adminSupabase
    .from("restaurants")
    .select("id, name, slug, menus(slug, name, is_active)")
    .limit(2);
    
  console.log("Error:", error);
  console.log("Data:", JSON.stringify(data, null, 2));
}
run();
