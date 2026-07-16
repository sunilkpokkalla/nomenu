require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: menu } = await supabase.from("menus").select("id, restaurant_id, display_language").eq("id", "6da76899-a471-47ba-aa0c-015b845492a6").single();
  const res = await fetch("http://localhost:3004/api/menu/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ restaurantId: menu.restaurant_id, menuId: menu.id, languageCode: menu.display_language })
  });
  const data = await res.json();
  console.log("RESPONSE:", JSON.stringify(data, null, 2));
}

run();
