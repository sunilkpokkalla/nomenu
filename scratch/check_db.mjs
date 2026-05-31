import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: restaurants, error } = await supabase.from("restaurants").select("id, owner_id, name, cuisine_type, created_at").order("created_at", { ascending: true });
  console.log("Restaurants:", restaurants);
}

main();
