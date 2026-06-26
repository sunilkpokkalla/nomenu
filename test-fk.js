import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  // Try to insert a dummy row to see the exact error
  const { data, error } = await supabase.from('affiliates').insert({
    auth_id: '00000000-0000-0000-0000-000000000000',
    name: 'Test',
    email: 'test@test.com',
    referral_code: 'TEST1234'
  });
  console.log("Error:", error);
}
check();
