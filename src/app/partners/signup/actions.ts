"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

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
  const paypalEmail = getString(formData, "paypalEmail");
  const referralCode = getString(formData, "referralCode").replace(/[^a-zA-Z0-9_-]/g, "").toUpperCase();
  const password = getString(formData, "password");

  if (!name || !email || !referralCode || !password) {
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
    redirect(`/partners/signup?message=${encodeURIComponent(authError.message)}`);
  }

  // 3. Insert into affiliates table using admin client to bypass RLS
  if (authData.user) {
    const supabaseAdmin = createAdminClient(url, serviceRoleKey!);
    const { error: insertError } = await supabaseAdmin.from("affiliates").insert({
      auth_id: authData.user.id,
      name,
      email,
      paypal_email: paypalEmail || null,
      referral_code: referralCode,
    });

    if (insertError) {
      // Supabase signUp returns a fake user ID if the email already exists (when secure email enumeration is enabled).
      // This causes a foreign key constraint error (23503) when trying to insert into affiliates with the fake auth_id.
      if (insertError.code === "23503") {
        redirect("/partners/signup?message=An%20account%20with%20this%20email%20already%20exists.%20Please%20log%20in%20or%20use%20a%20different%20email.");
      }
      redirect(`/partners/signup?message=${encodeURIComponent(insertError.message)}`);
    }

    revalidatePath("/partners/dashboard");
    redirect("/partners/dashboard");
  } else {
    redirect("/partners/signup?message=Failed%20to%20create%20account");
  }
}
