"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/env";

export async function signupAffiliate(formData: FormData) {
  const supabase = await createClient();
  const { url } = getSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const referralCode = getString(formData, "referralCode").replace(/[^a-zA-Z0-9_-]/g, "").toUpperCase();
  const expertise = getString(formData, "expertise");
  const socialInfluence = getString(formData, "socialInfluence");
  const socialMediaDetails = getString(formData, "socialMediaDetails");
  const sampleVideo = getString(formData, "sampleVideo");
  const location = getString(formData, "location");
  const purpose = getString(formData, "purpose");
  const password = getString(formData, "password");

  if (!name || !email || !referralCode || !password || !expertise || !socialInfluence || !socialMediaDetails || !location || !purpose) {
    redirect("/partners/signup?message=Please%20fill%20in%20all%20required%20fields");
  }

  // 1. Check if referral code is taken
  const { data: existingCode } = await supabase
    .from("affiliates")
    .select("id")
    .ilike("referral_code", referralCode)
    .maybeSingle();

  if (existingCode) {
    redirect("/partners/signup?message=That%20referral%20code%20is%20already%20taken");
  }

  // 2. Sign up the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    let errMsg = authError.message || (authError as unknown as { msg?: string }).msg || "Authentication failed";
    if (typeof errMsg === "object") {
      try { errMsg = JSON.stringify(errMsg); } catch { errMsg = "Authentication error"; }
    }
    if (errMsg === "{}") errMsg = "Authentication failed (empty error)";
    redirect(`/partners/signup?message=${encodeURIComponent(errMsg)}`);
  }

  // 3. Insert into affiliates table using admin client to bypass RLS
  if (authData.user) {
    const supabaseAdmin = createAdminClient(url, serviceRoleKey!);
    
    // Count existing affiliates to determine tier
    const { count } = await supabaseAdmin
      .from("affiliates")
      .select("*", { count: "exact", head: true });
      
    const tier = (count || 0) < 1000 ? "founding" : "standard";

    const { error: insertError } = await supabaseAdmin.from("affiliates").insert({
      auth_id: authData.user.id,
      name,
      email,
      referral_code: referralCode,
      expertise,
      social_influence: socialInfluence,
      social_media_details: sampleVideo ? `${socialMediaDetails}\n\nSample Video: ${sampleVideo}` : socialMediaDetails,
      location,
      purpose,
      status: "pending",
      tier
    });

    if (insertError) {
      // Supabase signUp returns a fake user ID if the email already exists (when secure email enumeration is enabled).
      // This causes a foreign key constraint error (23503) when trying to insert into affiliates with the fake auth_id.
      if (insertError.code === "23503") {
        redirect("/partners/signup?message=An%20account%20with%20this%20email%20already%20exists.%20Please%20log%20in%20or%20use%20a%20different%20email.");
      }
      
      let errMsg = insertError.message || (insertError as unknown as { msg?: string }).msg || (insertError as unknown as { details?: string }).details || "Database insertion failed";
      if (typeof errMsg === "object") {
        try { errMsg = JSON.stringify(errMsg); } catch { errMsg = "Database error"; }
      }
      if (errMsg === "{}") errMsg = "Database insertion failed (empty error)";
      
      redirect(`/partners/signup?message=${encodeURIComponent(errMsg)}`);
    }

    // Send Emails
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

      const adminEmail = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",")[0] : "admin@nomenu.us";

      // Email to Admin
      await transporter.sendMail({
        from: `"NoMenu Partners" <${process.env.SMTP_USER || "noreply@nomenu.us"}>`,
        to: adminEmail,
        subject: "New Partner Application Received",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>New Partner Application</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Expertise:</strong> ${expertise}</p>
            <p><strong>Influence Size:</strong> ${socialInfluence}</p>
            <p><strong>Links:</strong> ${socialMediaDetails}</p>
            ${sampleVideo ? `<p><strong>Sample Video:</strong> <a href="${sampleVideo}">${sampleVideo}</a></p>` : ""}
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Purpose:</strong> ${purpose}</p>
            <p><strong>Requested Code:</strong> ${referralCode}</p>
            <br/>
            <p><a href="${url}/admin/partners">Review Application in Admin Dashboard</a></p>
          </div>
        `,
      });

      // Email to User
      await transporter.sendMail({
        from: `"NoMenu Partners" <${process.env.SMTP_USER || "noreply@nomenu.us"}>`,
        to: email,
        subject: "Your NoMenu Partner Application is Under Review",
        html: `
          <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; color: #334155;">
            <h2 style="color: #0f172a; margin-top: 0;">Application Received</h2>
            <p>Hi ${name},</p>
            <p>Thank you for your interest in joining the elite <strong>NoMenu Partner Program</strong>.</p>
            <p>Our team has successfully received your application. We are currently reviewing your submitted details, including your social influence and strategy, to ensure a strong fit for our network.</p>
            <p><strong>What happens next?</strong><br/>
            Due to the high volume of applications we receive, our partner success team thoroughly evaluates each applicant manually. You can expect to hear back from us with an approval decision within the next <strong>7 to 15 days</strong>.</p>
            <p>If approved, you will receive immediate access to your Partner Dashboard where you can begin tracking your referrals, viewing your commission payouts, and downloading our high-end marketing assets.</p>
            <br/>
            <p style="margin-bottom: 0;">Best regards,</p>
            <p style="margin-top: 5px; font-weight: bold; color: #0f172a;">The NoMenu Partnerships Team</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send partner application emails:", emailErr);
    }

    revalidatePath("/partners/dashboard");
    
    if (authData.session) {
      redirect("/partners/dashboard");
    } else {
      redirect("/partners/login?success=Account created! Please check your email to confirm your account and wait for admin approval.");
    }
  } else {
    redirect("/partners/signup?message=Failed%20to%20create%20account");
  }
}
