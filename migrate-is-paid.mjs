import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addIsPaidColumn() {
  const { data, error } = await supabase.rpc('execute_sql', {
    sql_string: `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT false;`
  });
  if (error) {
     console.error("RPC execute_sql failed (which is normal if it doesn't exist). Error:", error.message);
  } else {
     console.log("Migration executed successfully:", data);
  }
}

addIsPaidColumn();
