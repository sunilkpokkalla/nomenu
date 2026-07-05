"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { revalidatePath } from "next/cache";

export async function settleTableTab(restaurantId: string, tableNumber: string, customerName: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Update all unpaid orders for this table + customer
  let query = supabase
    .from("orders")
    // @ts-expect-error: paid_at is not in the generated types yet
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

  // Cancel all unpaid orders for this table + customer
  let query = supabase
    .from("orders")
    .update({ status: "cancelled" })
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

export async function addWaitlistEntry(restaurantId: string, data: { customerName: string; partySize: number; phoneNumber?: string; quotedTime?: number }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

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
    .select("restaurant_id, customer_name")
    .eq("id", waitlistId)
    .single();

  if (fetchError || !entry) throw new Error("Waitlist entry not found");

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

export async function createWalkInTab(restaurantId: string, tableNumber: string, customerName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase.from("orders").insert({
    restaurant_id: restaurantId,
    table_number: tableNumber,
    customer_name: customerName,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("waitlist") as any)
    .select("*")
    .eq("restaurant_id", restaurantId)
    .in("status", ["waiting"])
    .order("created_at", { ascending: true });

  if (error) throw new Error("Failed to fetch waitlist");
  return data;
}
