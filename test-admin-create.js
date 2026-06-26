import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'skpokkalla@gmail.com',
    password: 'Password123!',
    email_confirm: true
  });
  console.log("Data:", data);
  console.log("Error:", error);
}
check();
