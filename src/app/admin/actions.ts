"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";


export async function sendMarketingEmailAction() {
  // 1. Verify caller is an Admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) throw new Error("Not logged in");
  
  const adminEmails = (process.env.ADMIN_EMAILS || "admin@nomenu.us").split(",");
  if (process.env.NODE_ENV !== 'development' && !adminEmails.includes(user.email)) {
    throw new Error("Unauthorized");
  }

  // 2. Initialize Service Role Client
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
  );

  // 3. Get free tier restaurants
  const { data: freeRestaurants, error } = await adminSupabase
    .from("restaurants")
    .select("owner_id, name")
    .neq("subscription_status", "active")
    .not("owner_id", "is", null);

  if (error || !freeRestaurants) {
    throw new Error("Failed to fetch free tier restaurants");
  }

  // 4. Get unique emails
  const ownerIds = [...new Set(freeRestaurants.map(r => r.owner_id as string))];
  const userResponses = await Promise.all(
    ownerIds.map(id => adminSupabase.auth.admin.getUserById(id))
  );

  const emails = userResponses
    .map(res => res.data?.user?.email)
    .filter((email): email is string => !!email);

  if (emails.length === 0) {
    return { success: true, count: 0, message: "No free tier users found." };
  }

  // 5. Configure Nodemailer with Zoho SMTP
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

  // 6. Send emails
  let sentCount = 0;
  for (const email of emails) {
    try {
      await transporter.sendMail({
        from: `"NoMenu" <${process.env.SMTP_USER || "noreply@nomenu.us"}>`,
        to: email,
        subject: "Unlock Premium Themes & Custom Domains for Your Digital Menu",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Take your restaurant's brand to the next level.</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              You have already set up your digital menu, but did you know you can completely transform how it looks to your guests?
            </p>
            <ul style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              <li><strong>Premium Themes:</strong> Access luxury, vibrant, and cinematic menu designs.</li>
              <li><strong>Custom Domains:</strong> Use your own website link instead of nomenu.us.</li>
              <li><strong>No Watermarks:</strong> Remove the "Powered by Nomenu" branding from the bottom of your menus.</li>
              <li><strong>Advanced Analytics:</strong> See exactly what your guests are tapping on.</li>
            </ul>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Stand out from the competition and provide a world-class dining experience.
            </p>
            <div style="text-align: center; margin-top: 32px;">
              <a href="${domain}/dashboard/billing" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Upgrade to Pro Today</a>
            </div>
          </div>
        `,
      });
      sentCount++;
    } catch (err) {
      console.error("Failed to send email to " + email + ":", err);
    }
  }

  return { success: true, count: sentCount, message: "Sent " + sentCount + " emails." };
}
