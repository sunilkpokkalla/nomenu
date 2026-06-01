const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function run() {
  const qrCodeId = "9453b5de-2896-4868-a0dc-a4a98b6f63cd";
  const restaurantId = "3cee9db9-0dd7-4bec-bc8b-483b22daeed2"; // MahaRaja

  console.log("Attempting insert...");
  const { error } = await supabaseAdmin.from("menu_scans").insert({
    qr_code_id: qrCodeId,
    restaurant_id: restaurantId,
    device_type: "Desktop",
    country: "US",
  });
  console.log("Insert Error:", error);
}
run();
