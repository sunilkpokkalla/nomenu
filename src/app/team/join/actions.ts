"use server";

import { createAdminClient } from "@/lib/supabase/server-admin";
import { redirect } from "next/navigation";

export async function acceptInvite(formData: FormData, token: string, email: string) {
  const password = formData.get("password") as string;

  if (!password || password.length < 6) {
    redirect(`/team/join?token=${token}&message=Password%20must%20be%20at%20least%206%20characters`);
  }

  const supabaseAdmin = createAdminClient();

  // Create the user using admin auth (so they don't have to confirm email)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    console.error("Auth error:", authError);
    // If the user already exists, maybe they just need to log in? Or we update password?
    // Let's assume if it fails, maybe user exists. We can still link them.
    if (authError.message.includes("already registered")) {
       // We can just try to update their password? Or tell them to log in.
       // The simplest flow is tell them to log in.
       redirect(`/team/join?token=${token}&message=Account%20already%20exists.%20Please%20login.`);
    } else {
      redirect(`/team/join?token=${token}&message=${encodeURIComponent(authError.message)}`);
    }
  }

  const userId = authData.user?.id;

  if (!userId) {
    redirect(`/team/join?token=${token}&message=Failed%20to%20create%20user`);
  }

  // Update the staff record
  const { error: updateError } = await supabaseAdmin
    .from("restaurant_staff")
    .update({
      auth_id: userId,
      status: "active",
    })
    .eq("id", token);

  if (updateError) {
    console.error("Error updating staff status:", updateError);
    redirect(`/team/join?token=${token}&message=Failed%20to%20activate%20invitation`);
  }

  // They are successfully created. We will redirect them to login so they can authenticate.
  redirect("/login?message=Account%20created%20successfully.%20Please%20log%20in.");
}
