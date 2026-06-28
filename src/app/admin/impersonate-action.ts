"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function generateImpersonationOtp(userId: string) {
  console.log("--> generateImpersonationOtp CALLED for userId:", userId);
  try {
    // 1. Verify caller is an Admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) return { success: false, error: "Not logged in" };
    
    const adminEmails = (process.env.ADMIN_EMAILS || "admin@nomenu.us").split(",");
    if (!adminEmails.includes(user.email)) {
      return { success: false, error: "Unauthorized: Not an admin" };
    }

    // 2. Initialize Service Role Client
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    if (!serviceKey) return { success: false, error: "Missing Supabase Service Key in environment" };

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey
    );

    // 3. Get the target user's email
    const { data: targetUser, error: fetchError } = await adminSupabase.auth.admin.getUserById(userId);
    if (fetchError || !targetUser?.user?.email) {
      return { success: false, error: "Failed to find user email for impersonation: " + (fetchError?.message || "No email") };
    }

    // 4. Generate the magic link and extract OTP
    const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
      type: "magiclink",
      email: targetUser.user.email,
    });

    if (linkError || !linkData.properties?.hashed_token) {
      return { success: false, error: `Failed to generate magic link: ${linkError?.message}` };
    }

    return { success: true, email: targetUser.user.email, otp: linkData.properties.hashed_token };
  } catch (err: unknown) {
    console.error("--> generateImpersonationOtp error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown server error occurred" };
  }
}
