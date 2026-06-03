const { createClient } = require("@supabase/supabase-js");

async function test() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  );

  try {
    const res = await supabase.from("qr_codes").select("*").eq("id", "invalid-uuid-string").maybeSingle();
    console.log("Response:", res);
  } catch (err) {
    console.error("Exception thrown!", err);
  }
}

test();
