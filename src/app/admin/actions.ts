"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function generateImpersonationOtp(userId: string) {
  // 1. Verify caller is an Admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) throw new Error("Not logged in");
  
  const adminEmails = (process.env.ADMIN_EMAILS || "support@nomenu.us,sunil@nomenu.us").split(",");
  if (process.env.NODE_ENV !== 'development' && !adminEmails.includes(user.email)) {
    throw new Error("Unauthorized");
  }

  // 2. Initialize Service Role Client
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  // 3. Get the target user's email
  const { data: targetUser, error: fetchError } = await adminSupabase.auth.admin.getUserById(userId);
  if (fetchError || !targetUser?.user?.email) {
    throw new Error("Failed to find user email for impersonation");
  }

  // 4. Generate the magic link and extract OTP
  const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
    type: "magiclink",
    email: targetUser.user.email,
  });

  if (linkError || !linkData.properties?.email_otp) {
    throw new Error(`Failed to generate magic link: ${linkError?.message}`);
  }

  return { email: targetUser.user.email, otp: linkData.properties.email_otp };
}
