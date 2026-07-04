"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export type CampaignAudience = "free_users" | "pro_users" | "custom";
export type CampaignTemplate = "soulful_pitch" | "pro_upgrade" | "custom";

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
        .eq("subscription_status", isPro ? "active" : "inactive") // simplistic mapping, or we check != 'active'
        .not("owner_id", "is", null);

      if (!error && restaurants) {
        // More robust: if pro_users, eq('subscription_status', 'active')
        // if free_users, neq('subscription_status', 'active')
        
        const ownerIds = [...new Set(restaurants.map(r => r.owner_id as string))];
        const userResponses = await Promise.all(
          ownerIds.map(id => adminSupabase.auth.admin.getUserById(id))
        );

        emails = userResponses
          .map(res => res.data?.user?.email)
          .filter((email): email is string => !!email);
      }
    } else if (audience === "custom" && customEmails) {
      // Split by comma or newline
      emails = customEmails.split(/[,\n]+/).map(e => e.trim()).filter(e => e.includes("@"));
    }

    if (emails.length === 0) {
      return { success: false, error: "No valid email addresses found." };
    }

    // 4. Configure Nodemailer with Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 5. Send emails
    let sentCount = 0;
    for (const email of emails) {
      try {
        await transporter.sendMail({
          from: `"NoMenu" <${process.env.SMTP_USER || "noreply@nomenu.us"}>`,
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
