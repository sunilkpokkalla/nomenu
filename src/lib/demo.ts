import { User } from "@supabase/supabase-js";

export function isDemoUser(user: User | null | undefined): boolean {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === "demo@nomenu.com";
}
