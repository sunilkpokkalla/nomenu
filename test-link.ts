import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
);

async function test() {
  const { data, error } = await adminSupabase.auth.admin.generateLink({
    type: "magiclink",
    email: "admin@nomenu.us", // use a known email
    options: {
      redirectTo: "http://localhost:3002/dashboard"
    }
  });
  console.log("Data properties:", data.properties);
  console.log("Error:", error);
}

test();
