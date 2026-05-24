"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function login(formData: FormData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const next = getString(formData, "next") || "/dashboard";

  console.log("Login action starting...", { email });

  if (!hasSupabaseEnv()) {
    console.error("Login action: Missing Supabase Env vars");
    redirect("/login?message=Configure%20Supabase%20env%20vars%20first");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  console.log("Login action result:", { user: data?.user?.id, error: error?.message });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  console.log("Login action redirecting to:", next);
  redirect(next);
}

export async function signup(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect("/signup?message=Configure%20Supabase%20env%20vars%20first");
  }

  const supabase = await createClient();
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const restaurantName = getString(formData, "restaurantName");

  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const cleanAppUrl = rawAppUrl.endsWith("/") ? rawAppUrl.slice(0, -1) : rawAppUrl;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        restaurant_name: restaurantName,
      },
      emailRedirectTo: `${cleanAppUrl}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/signup?message=${encodeURIComponent(error.message)}`);
  }

  if (data.user && data.session) {
    if (restaurantName) {
      await supabase.from("restaurants").insert({
        owner_id: data.user.id,
        name: restaurantName,
      });
    }
    revalidatePath("/", "layout");
    redirect("/dashboard");
  } else {
    redirect("/login?message=Account%20created!%20Please%20check%20your%20email%20to%20confirm%20and%20activate%20your%20account.");
  }
}

export async function logout() {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function loginWithGoogle() {
  if (!hasSupabaseEnv()) {
    redirect("/login?message=Configure%20Supabase%20env%20vars%20first");
  }

  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const cleanAppUrl = rawAppUrl.endsWith("/") ? rawAppUrl.slice(0, -1) : rawAppUrl;
  const redirectToUrl = `${cleanAppUrl}/auth/callback`;

  console.log("loginWithGoogle starting...", {
    redirectTo: redirectToUrl
  });
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectToUrl,
    },
  });
  console.log("loginWithGoogle result:", { data, error });

  if (error) {
    console.error("loginWithGoogle error redirecting:", error);
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    console.log("loginWithGoogle redirecting to:", data.url);
    redirect(data.url);
  } else {
    console.warn("loginWithGoogle: No redirect URL returned by Supabase.");
  }
}
