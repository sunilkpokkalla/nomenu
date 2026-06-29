import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

export type UserRole = "owner" | "manager" | "kitchen" | "waitstaff" | "kitchen_waitstaff";

export async function getUserRole(
  supabase: SupabaseClient<Database>,
  userId: string,
  restaurantId: string
): Promise<UserRole | null> {
  // First, check if they are the owner
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("owner_id")
    .eq("id", restaurantId)
    .single();

  if (restaurant?.owner_id === userId) {
    return "owner";
  }

  // If not owner, check if they are staff
  const { data: staff } = await supabase
    .from("restaurant_staff")
    .select("role")
    .eq("restaurant_id", restaurantId)
    .eq("auth_id", userId)
    .eq("status", "active")
    .single();

  if (staff?.role) {
    return staff.role as UserRole;
  }

  return null;
}

export function hasPermission(
  role: UserRole | null,
  requiredRoles: UserRole[]
): boolean {
  if (!role) return false;
  if (role === "owner") return true; // Owner always has permission
  return requiredRoles.includes(role);
}

export async function getActiveRestaurant(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  // First check if they own a restaurant
  const { data: ownedRestaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (ownedRestaurant) {
    return ownedRestaurant;
  }

  // If not an owner, check if they are active staff
  const { data: staffRecord } = await supabase
    .from("restaurant_staff")
    .select("restaurant_id, role")
    .eq("auth_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (staffRecord) {
    const { data: staffRestaurant } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", staffRecord.restaurant_id)
      .maybeSingle();
      
    if (staffRestaurant) {
      // Attach role to the restaurant object for convenience
      return { ...staffRestaurant, _staffRole: staffRecord.role as UserRole };
    }
  }

  return null;
}
