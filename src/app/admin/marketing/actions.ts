"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
export type CampaignAudience = "free_users" | "pro_users" | "custom" | "nomi_leads";
export type CampaignTemplate =
  | "custom"
  | "soulful_pitch"
  | "pro_upgrade"
  | "serverless_seamless"
  | "modern_qr"
  | "revenue_booster"
  | "investor_deck"
  | "onboarding_guide"
  | "welcome_discount_15"
  | "kds_kitchen_display"
  | "happy_hour_promo"
  | "multi_location"
  | "review_booster"
  | "loyalty_rewards";

export async function fetchNomiLeadsAction() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) throw new Error("Not logged in");
    
    const adminEmails = (process.env.ADMIN_EMAILS || "admin@nomenu.us").split(",");
    if (!adminEmails.includes(user.email)) {
      throw new Error("Unauthorized");
    }

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
    );

    const { data: leads, error } = await adminSupabase
      .from("nomi_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, leads };
  } catch (error) {
    console.error("Fetch leads error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch leads" };
  }
}

export async function deleteNomiLeadsAction(ids: string[]) {
  try {
    if (!ids || ids.length === 0) {
      return { success: false, error: "No lead IDs provided" };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) throw new Error("Not logged in");
    
    const adminEmails = (process.env.ADMIN_EMAILS || "admin@nomenu.us").split(",");
    if (!adminEmails.includes(user.email)) {
      throw new Error("Unauthorized");
    }

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
    );

    const { error } = await adminSupabase
      .from("nomi_leads")
      .delete()
      .in("id", ids);

    if (error) throw error;

    return { success: true, message: `Successfully deleted ${ids.length} lead(s).` };
  } catch (error) {
    console.error("Delete leads error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete leads" };
  }
}

export async function sendCampaignAction(formData: FormData) {
  const audience = formData.get("audience") as CampaignAudience;
  const templateType = formData.get("template") as CampaignTemplate;
  const customEmails = formData.get("customEmails") as string;
  const subject = formData.get("subject") as string;
  const messageBody = formData.get("message") as string;

  try {
    // 1. Verify caller is an Admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) throw new Error("Not logged in");
    
    const adminEmails = (process.env.ADMIN_EMAILS || "admin@nomenu.us").split(",");
    if (!adminEmails.includes(user.email)) {
      throw new Error("Unauthorized");
    }

    // 2. Initialize Service Role Client
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
    );

    // 3. Resolve target emails
    let emails: string[] = [];
    
    if (audience === "free_users" || audience === "pro_users") {
      const isPro = audience === "pro_users";
      const { data: restaurants, error } = await adminSupabase
        .from("restaurants")
        .select("owner_id")
        .eq("subscription_status", isPro ? "active" : "inactive")
        .not("owner_id", "is", null);

      if (!error && restaurants) {
        const ownerIds = [...new Set(restaurants.map(r => r.owner_id as string))];
        const userResponses = await Promise.all(
          ownerIds.map(id => adminSupabase.auth.admin.getUserById(id))
        );

        emails = userResponses
          .map(res => res.data?.user?.email)
          .filter((email): email is string => !!email);
      }
    } else if (audience === "nomi_leads") {
      const { data: leads, error } = await adminSupabase
        .from("nomi_leads")
        .select("email")
        .order("created_at", { ascending: false });

      if (!error && leads) {
        emails = leads.map(l => l.email);
      }
    } else if (audience === "custom" && customEmails) {
      // Split by comma or newline
      emails = customEmails.split(/[,\n]+/).map(e => e.trim()).filter(e => e.includes("@"));
    }

    if (emails.length === 0) {
      return { success: false, error: "No valid email addresses found." };
    }

    // 5. Send emails
    let sentCount = 0;
    for (const email of emails) {
      try {
        await sendEmail({
          to: email,
          subject: subject,
          html: messageBody,
        });
        sentCount++;
      } catch (err) {
        console.error("Failed to send email to " + email + ":", err);
      }
    }

    return { success: true, count: sentCount, message: `Successfully sent ${sentCount} emails.` };
  } catch (error) {
    console.error("Campaign error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to send campaign" };
  }
}
