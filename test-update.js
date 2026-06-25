const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data: feedbackList } = await supabase.from('customer_feedback').select('id').limit(1);
  if (feedbackList.length > 0) {
    const feedbackId = feedbackList[0].id;
    const { error } = await supabase.from('customer_feedback').update({ 
      customer_name: "Test",
      customer_email: "test@test.com",
      customer_phone: "123",
      contact_info: "test"
    }).eq("id", feedbackId);
    console.log(error);
  } else {
    console.log("No feedback found");
  }
}
run();
