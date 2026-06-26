import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// We need an auth token to test RLS, which is hard.
// Let's just create an admin client, and fetch the first affiliate.
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: adminData } = await supabaseAdmin.from('affiliates').select('*').limit(1);
  console.log("Admin can see:", adminData?.length);

  // Use anon client
  const supabaseAnon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data: anonData, error } = await supabaseAnon.from('affiliates').select('*').limit(1);
  console.log("Anon can see:", anonData?.length, "Error:", error);
}
check();
