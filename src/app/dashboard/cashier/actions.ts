"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { revalidatePath } from "next/cache";
import { getActiveRestaurant } from "@/lib/rbac";

export async function settleTableTab(restaurantId: string, tableNumber: string, customerName: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const restaurant = await getActiveRestaurant(supabase, user.id);
  if (!restaurant || restaurant.id !== restaurantId) {
    throw new Error("Unauthorized");
  }

  // Update all unpaid orders for this table + customer
  const adminSupabase = createAdminClient();
  let query = adminSupabase
    .from("orders")
    .update({ is_paid: true, paid_at: new Date().toISOString() })
    .eq("restaurant_id", restaurantId)
    .eq("table_number", tableNumber)
    .eq("is_paid", false)
    .is("customer_phone", null); // dine-in only

  if (customerName && customerName !== "Anonymous") {
    query = query.eq("customer_name", customerName);
  } else {
    query = query.is("customer_name", null);
  }

  const { error } = await query;

  if (error) {
    throw new Error("Failed to settle table tab");
  }

  return true;
}

export async function voidTableTab(restaurantId: string, tableNumber: string, customerName: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const restaurant = await getActiveRestaurant(supabase, user.id);
  if (!restaurant || restaurant.id !== restaurantId) {
    throw new Error("Unauthorized");
  }

  // Cancel all unpaid orders for this table + customer and track when it was cleared
  const adminSupabase = createAdminClient();
  let query = adminSupabase
    .from("orders")
    .update({ status: "cancelled", paid_at: new Date().toISOString() })
    .eq("restaurant_id", restaurantId)
    .eq("table_number", tableNumber)
    .eq("is_paid", false)
    .is("customer_phone", null); // dine-in only

  if (customerName && customerName !== "Anonymous") {
    query = query.eq("customer_name", customerName);
  } else {
    query = query.is("customer_name", null);
  }

  const { error } = await query;

  if (error) {
    throw new Error("Failed to void table tab");
  }

  return true;
}

export async function removeTableFromTab(orderId: string, tableToRemove: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Fetch the order
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("table_number, restaurant_id")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    throw new Error("Failed to fetch order");
  }

  const restaurant = await getActiveRestaurant(supabase, user.id);
  if (!restaurant || restaurant.id !== order.restaurant_id) {
    throw new Error("Unauthorized");
  }

  if (!order.table_number) return true;

  // Split and remove
  const tables = order.table_number.split(',').map((s: string) => s.trim());
  const updatedTables = tables.filter((t: string) => t !== tableToRemove);

  if (updatedTables.length === 0) {
    // If they removed the last table, just void the tab instead
    return voidTableTab(
      // We don't have restaurant_id or customer_name easily here without another fetch
      // Let's just update the status to cancelled directly for this order ID
      '', '', '' 
    ).catch(async () => {
      const adminSupabase = createAdminClient();
      await adminSupabase.from("orders").update({ 
        status: "cancelled", 
        table_number: null,
        paid_at: new Date().toISOString() 
      }).eq("id", orderId);
    });
  }

  // Update order with new table string
  const adminSupabase = createAdminClient();
  const { error: updateError } = await adminSupabase
    .from("orders")
    .update({ table_number: updatedTables.join(', ') })
    .eq("id", orderId);

  if (updateError) {
    throw new Error("Failed to update tables");
  }

  revalidatePath("/dashboard/cashier");
  return true;
}

export async function addWaitlistEntry(restaurantId: string, data: { customerName: string; partySize: number; phoneNumber?: string; quotedTime?: number }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const restaurant = await getActiveRestaurant(supabase, user.id);
  if (!restaurant || restaurant.id !== restaurantId) {
    throw new Error("Unauthorized");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("waitlist") as any).insert({
    restaurant_id: restaurantId,
    customer_name: data.customerName,
    party_size: data.partySize,
    phone_number: data.phoneNumber || null,
    quoted_time_minutes: data.quotedTime || null,
    status: 'waiting'
  });

  if (error) throw new Error("Failed to add to waitlist");
  return true;
}

export async function updateWaitlistStatus(waitlistId: string, status: 'waiting' | 'seated' | 'cancelled' | 'no_show', tableId?: string, tableName?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Fetch the entry first to get the restaurant_id and customer name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entry, error: fetchError } = await (supabase.from("waitlist") as any)
    .select("restaurant_id, customer_name, party_size")
    .eq("id", waitlistId)
    .single();

  if (fetchError || !entry) throw new Error("Waitlist entry not found");

  const restaurant = await getActiveRestaurant(supabase, user.id);
  if (!restaurant || restaurant.id !== entry.restaurant_id) {
    throw new Error("Unauthorized");
  }

  const adminSupabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (adminSupabase.from("waitlist") as any)
    .update({ 
      status,
      ...(tableId ? { table_id: tableId } : {})
    })
    .eq("id", waitlistId);

  if (error) {
    console.error("Waitlist Update Error:", error);
    throw new Error(`Failed to update waitlist status: ${error.message}`);
  }

  // If seated, open a blank tab (order) so the table shows as occupied
  if (status === 'seated' && tableName) {
    const adminSupabase = createAdminClient();
    const { error: insertError } = await adminSupabase.from("orders").insert({
      restaurant_id: entry.restaurant_id,
      table_number: tableName,
      customer_name: entry.customer_name,
      party_size: entry.party_size,
      total_amount: 0,
      status: "pending",
      is_paid: false
    });
    
    if (insertError) {
      console.error("Order Insert Error:", insertError);
      throw new Error(`Failed to create order: ${insertError.message}`);
    }
  }

  revalidatePath("/dashboard/cashier");
  return true;
}

export async function createWalkInTab(restaurantId: string, tableNumber: string, customerName: string, partySize: number = 2) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const restaurant = await getActiveRestaurant(supabase, user.id);
  if (!restaurant || restaurant.id !== restaurantId) {
    throw new Error("Unauthorized");
  }

  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase.from("orders").insert({
    restaurant_id: restaurantId,
    table_number: tableNumber,
    customer_name: customerName,
    party_size: partySize,
    total_amount: 0,
    status: "pending",
    is_paid: false
  });

  if (error) throw new Error("Failed to create walk-in tab");

  revalidatePath("/dashboard/cashier");
  return true;
}

export async function getWaitlist(restaurantId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const restaurant = await getActiveRestaurant(supabase, user.id);
  if (!restaurant || restaurant.id !== restaurantId) {
    throw new Error("Unauthorized");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("waitlist") as any)
    .select("*")
    .eq("restaurant_id", restaurantId)
    .in("status", ["waiting"])
    .order("created_at", { ascending: true });

  if (error) throw new Error("Failed to fetch waitlist");
  return data;
}
