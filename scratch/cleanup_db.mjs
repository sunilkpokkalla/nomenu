import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const idsToDelete = [
    'ae361b88-8a80-4022-b4df-23e533dc0713',
    'b865da84-1e0c-4d22-b51d-fb5cddda45b6',
    '08d71eaa-43e4-479f-ad80-d100b282b84b'
  ];

  for (const id of idsToDelete) {
    const { error } = await supabase.from("restaurants").delete().eq("id", id);
    if (error) {
      console.error("Error deleting", id, error);
    } else {
      console.log("Deleted duplicate restaurant:", id);
    }
  }
}

main();
