import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: restaurants } = await supabase.from("restaurants").select("id, name, created_at");
  for (const r of restaurants) {
    const { count: menuCount } = await supabase.from("menus").select("*", { count: "exact" }).eq("restaurant_id", r.id);
    const { count: itemCount } = await supabase.from("menu_items").select("*", { count: "exact" }).eq("restaurant_id", r.id);
    console.log(`Restaurant ${r.id} (${r.name}): ${menuCount} menus, ${itemCount} items`);
  }
}

main();
