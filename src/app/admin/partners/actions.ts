"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export async function approvePartnerAction(affiliateId: string, email: string, formData?: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) throw new Error("Not logged in");

  const adminEmails = (process.env.ADMIN_EMAILS || "admin@nomenu.us").split(",");
  if (process.env.NODE_ENV !== 'development' && !adminEmails.includes(user.email)) {
    throw new Error("Unauthorized");
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  const { error } = await adminSupabase
    .from("affiliates")
    .update({ status: "approved" })
    .eq("id", affiliateId);

  if (error) {
    throw new Error("Failed to approve partner: " + error.message);
  }

  // Send Approval Email
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const domain = process.env.NEXT_PUBLIC_APP_URL || "https://nomenu.us";

    await transporter.sendMail({
      from: `"NoMenu Partners" <${process.env.SMTP_USER || "noreply@nomenu.us"}>`,
      to: email,
      subject: "Welcome! Your Partner Application is Approved",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>You're Approved!</h2>
          <p>Congratulations! We have reviewed your application and are excited to welcome you to the NoMenu Partner Program.</p>
          <p>You can now log in to your dashboard to get your tracking link, connect your bank account, and track your earnings.</p>
          <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
            <a href="${domain}/partners/login" style="display: inline-block; background-color: #f59e0b; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Go to Dashboard</a>
          </div>
          <p>We look forward to working with you!</p>
          <p>Best,<br/>The NoMenu Team</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send approval email:", err);
  }

  revalidatePath("/admin/partners");
}

export async function rejectPartnerAction(affiliateId: string, formData?: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) throw new Error("Not logged in");

  const adminEmails = (process.env.ADMIN_EMAILS || "admin@nomenu.us").split(",");
  if (process.env.NODE_ENV !== 'development' && !adminEmails.includes(user.email)) {
    throw new Error("Unauthorized");
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  const { error } = await adminSupabase
    .from("affiliates")
    .update({ status: "rejected" })
    .eq("id", affiliateId);

  if (error) {
    throw new Error("Failed to reject partner: " + error.message);
  }

  revalidatePath("/admin/partners");
}
