import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!);
async function main() {
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: "sunil@gmail.com", // just an example email, maybe the user's email
  });
  console.log("data:", JSON.stringify(data, null, 2));
}
main();
