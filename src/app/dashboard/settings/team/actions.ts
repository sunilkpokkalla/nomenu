"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function inviteStaff(formData: FormData, restaurantId: string) {
  const email = formData.get("email") as string;
  const role = formData.get("role") as "manager" | "kitchen" | "waitstaff" | "kitchen_waitstaff";

  if (!email || !role || !restaurantId) {
    redirect("/dashboard/settings/team?message=Missing%20required%20fields");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if owner
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("owner_id, name")
    .eq("id", restaurantId)
    .single();

  if (!restaurant || restaurant.owner_id !== user.id) {
    redirect("/dashboard");
  }

  // Check if email already exists in staff
  const { data: existingStaff } = await supabase
    .from("restaurant_staff")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .eq("email", email)
    .maybeSingle();

  if (existingStaff) {
    redirect("/dashboard/settings/team?message=User%20is%20already%20invited%20or%20active");
  }

  // We use admin client because RLS might prevent inserting unauthenticated staff
  const adminAuthClient = createAdminClient();

  const { data: newStaff, error: insertError } = await adminAuthClient
    .from("restaurant_staff")
    .insert({
      restaurant_id: restaurantId,
      email,
      role,
      status: "invited",
    })
    .select()
    .single();

  if (insertError || !newStaff) {
    console.error("Error inserting staff:", insertError);
    redirect("/dashboard/settings/team?message=Failed%20to%20invite%20staff");
  }

  // Send email via nodemailer
  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/team/join?token=${newStaff.id}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.zoho.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"NoMenu" <${process.env.SMTP_USER || "noreply@nomenu.us"}>`,
      to: email,
      subject: `You've been invited to join ${restaurant.name} on NoMenu`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Join your team on NoMenu</h2>
          <p>You have been invited to join <strong>${restaurant.name}</strong> as a <strong>${role}</strong>.</p>
          <p>Click the link below to set up your account and access the dashboard:</p>
          <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Join Team</a>
          <p style="margin-top: 30px; font-size: 12px; color: #64748b;">If you did not expect this invitation, please ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send invite email:", error);
    // Continue even if email fails, so they can theoretically manually copy the link if needed, or we just error out.
    // For now we just log it.
  }

  revalidatePath("/dashboard/settings/team");
  redirect("/dashboard/settings/team?success=Invitation%20sent%20successfully");
}
