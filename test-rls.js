const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function test() {
  const { data, error } = await supabase.rpc('get_policies', {});
  // if rpc doesn't exist, we can just query pg_policies
  if (error) {
    const { data: policies, error: dbError } = await supabase.from('pg_policies').select('*').eq('tablename', 'objects');
    if (dbError) {
       console.log("Could not fetch policies via postgrest. Trying direct SQL? We can't do direct SQL easily without connection string.");
       // Let's just assume we can't easily fetch it via standard REST if it's pg_policies (not exposed by default)
    } else {
       console.log(policies);
    }
  } else {
    console.log(data);
  }
}
test();
