"use server";

import { cookies, headers } from "next/headers";
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

  if (!hasSupabaseEnv()) {
    console.error("Login action: Missing Supabase Env vars");
    redirect("/login?message=Configure%20Supabase%20env%20vars%20first");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
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

  const headersList = await headers();
  const origin = headersList.get("origin");
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
  
  let cleanAppUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  
  if (origin) {
    cleanAppUrl = origin;
  } else if (host) {
    cleanAppUrl = `${protocol}://${host}`;
  } else if (cleanAppUrl.endsWith("/")) {
    cleanAppUrl = cleanAppUrl.slice(0, -1);
  }

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
    let errorMessage = error.message;
    if (errorMessage.toLowerCase().includes("user already registered")) {
      errorMessage = "Account already exists! Please log in instead.";
    }
    redirect(`/signup?message=${encodeURIComponent(errorMessage)}`);
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

  const headersList = await headers();
  const origin = headersList.get("origin");
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
  
  let cleanAppUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  
  if (origin) {
    cleanAppUrl = origin;
  } else if (host) {
    cleanAppUrl = `${protocol}://${host}`;
  } else if (cleanAppUrl.endsWith("/")) {
    cleanAppUrl = cleanAppUrl.slice(0, -1);
  }

  const redirectToUrl = `${cleanAppUrl}/auth/callback`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectToUrl,
    },
  });

  if (error) {
    console.error("loginWithGoogle error redirecting:", error);
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  } else {
    console.warn("loginWithGoogle: No redirect URL returned by Supabase.");
  }
}

export async function forgotPassword(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect("/forgot-password?message=Configure%20Supabase%20env%20vars%20first");
  }

  const email = getString(formData, "email");
  if (!email) {
    redirect("/forgot-password?message=Please%20provide%20a%20valid%20email%20address");
  }

  const headersList = await headers();
  const origin = headersList.get("origin");
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
  
  let cleanAppUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  
  if (origin) {
    cleanAppUrl = origin;
  } else if (host) {
    cleanAppUrl = `${protocol}://${host}`;
  } else if (cleanAppUrl.endsWith("/")) {
    cleanAppUrl = cleanAppUrl.slice(0, -1);
  }
  const redirectTo = `${cleanAppUrl}/auth/callback?next=/reset-password`;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    redirect(`/forgot-password?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/forgot-password?message=Check%20your%20email%20for%20a%20password%20reset%20link.");
}

export async function resetPassword(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect("/reset-password?message=Configure%20Supabase%20env%20vars%20first");
  }

  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");

  if (!password) {
    redirect("/reset-password?message=Password%20is%20required");
  }

  if (password !== confirmPassword) {
    redirect("/reset-password?message=Passwords%20do%20not%20match");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirect(`/reset-password?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Password%20has%20been%20reset%20successfully.%20Please%20log%20in%20with%20your%20new%20password.");
}
