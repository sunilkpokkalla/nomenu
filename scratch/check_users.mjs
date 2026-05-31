import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: users, error } = await supabase.auth.admin.listUsers();
  console.log("Users:", users.users.map(u => ({ id: u.id, email: u.email })));
}

main();
