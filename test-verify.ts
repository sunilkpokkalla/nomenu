import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!
);

const clientSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function test() {
  const email = "admin@nomenu.us"; // Test email
  const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
    type: "magiclink",
    email: email
  });
  console.log("Generated Link Data:", linkData?.properties?.email_otp);
  
  if (linkData?.properties?.email_otp) {
    const { data: verifyData, error: verifyError } = await clientSupabase.auth.verifyOtp({
      email,
      token: linkData.properties.email_otp,
      type: "magiclink"
    });
    console.log("Verify Data session:", verifyData.session ? "Success" : "No session");
    console.log("Verify Error:", verifyError);
  }
}

test();
