import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

async function run() {
  console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("KEY length:", process.env.SUPABASE_SERVICE_ROLE_KEY?.length);
  
  try {
    console.log("Fetching users...");
    const { data: usersData, error: usersError } = await adminSupabase.auth.admin.listUsers({ perPage: 1 });
    if (usersError) {
       console.error("List Users Error:", usersError);
       return;
    }
    
    if (usersData.users.length === 0) {
      console.log("No users found.");
      return;
    }
    
    const targetUser = usersData.users[0];
    console.log("Target user:", targetUser.email);
    
    console.log("Generating link...");
    const { data, error } = await adminSupabase.auth.admin.generateLink({
      type: "magiclink",
      email: targetUser.email!,
    });
    
    console.log("Generate Link Error:", error);
    console.log("Generate Link Data:", data);
  } catch (err) {
    console.error("Caught Exception:", err);
  }
}

run();
