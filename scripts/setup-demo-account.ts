import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function setupDemoAccount() {
  const demoEmail = "demo@nomenu.com";
  const demoPassword = "Demo@123";

  console.log("Creating/verifying demo user...");

  // 1. Try to create the user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: demoEmail,
    password: demoPassword,
    email_confirm: true,
  });

  let userId = authData?.user?.id;

  if (authError) {
    if (authError.message.includes("already registered") || authError.status === 422) {
      console.log("Demo user already exists. Fetching ID...");
      // Fetch user ID
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error("Failed to list users:", listError);
        return;
      }
      const existingUser = usersData.users.find(u => u.email === demoEmail);
      if (existingUser) {
        userId = existingUser.id;
        // Optionally update password to ensure it matches
        await supabase.auth.admin.updateUserById(userId, { password: demoPassword });
      } else {
        console.error("Could not find demo user despite it existing.");
        return;
      }
    } else {
      console.error("Failed to create user:", authError);
      return;
    }
  }

  if (!userId) {
    console.error("User ID not available.");
    return;
  }

  console.log(`Demo user ready. ID: ${userId}`);

  // 2. Ensure they have a restaurant
  const { data: restaurantData, error: restaurantError } = await supabase
    .from("restaurants")
    .select("id")
    .eq("owner_id", userId)
    .single();

  let restaurantId = restaurantData?.id;

  if (!restaurantId) {
    console.log("Creating a sample restaurant for demo user...");
    const { data: insertData, error: insertError } = await supabase
      .from("restaurants")
      .insert({
        owner_id: userId,
        name: "NoMenu Demo Lounge",
        slug: "nomenu-demo",
        primary_color: "#1e40af", // blue-800
        plan: "enterprise",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Failed to create restaurant:", insertError);
      return;
    }
    restaurantId = insertData.id;
    
    // Create a default menu
    console.log("Creating default menu...");
    const { data: menuData } = await supabase
      .from("menus")
      .insert({
        restaurant_id: restaurantId,
        name: "Demo Menu",
        slug: "demo",
        is_active: true,
      })
      .select("id")
      .single();
      
    if (menuData) {
      // Create a category
      const { data: categoryData } = await supabase
        .from("categories")
        .insert({
          menu_id: menuData.id,
          name: "Signature Cocktails",
          sort_order: 0,
        })
        .select("id")
        .single();
        
      if (categoryData) {
        // Create some items
        await supabase.from("menu_items").insert([
          {
            category_id: categoryData.id,
            name: "Smoked Old Fashioned",
            description: "Bourbon, bitters, smoked with cherry wood.",
            price: 18.0,
            sort_order: 0,
          },
          {
            category_id: categoryData.id,
            name: "Espresso Martini",
            description: "Vodka, fresh espresso, coffee liqueur.",
            price: 16.0,
            sort_order: 1,
          }
        ]);
      }
    }
  }

  console.log("Demo account setup complete! You can log in with demo@nomenu.com / Demo@123");
}

setupDemoAccount().catch(console.error);
