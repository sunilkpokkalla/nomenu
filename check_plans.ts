import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { data, error } = await supabase.from('restaurants').select('id, plan');
  if (error) console.error(error);
  
  let needsUpdate = 0;
  for (const r of data || []) {
    if (r.plan && r.plan !== r.plan.toLowerCase()) {
      needsUpdate++;
      console.log(`Updating ${r.id} from ${r.plan} to ${r.plan.toLowerCase()}`);
      await supabase.from('restaurants').update({ plan: r.plan.toLowerCase() }).eq('id', r.id);
    }
  }
  console.log(`Updated ${needsUpdate} records.`);
}
run();
