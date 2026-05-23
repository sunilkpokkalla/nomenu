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

  if (email === "demo@nomenu.com") {
    const cookieStore = await cookies();
    cookieStore.set("nomenu_demo_user", email, { path: "/" });
    revalidatePath("/", "layout");
    redirect(next);
  }

  if (!hasSupabaseEnv()) {
    redirect("/login?message=Configure%20Supabase%20env%20vars%20first");
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

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

  const supabase = createClient();
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const restaurantName = getString(formData, "restaurantName");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        restaurant_name: restaurantName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/signup?message=${encodeURIComponent(error.message)}`);
  }

  if (data.user && data.session && restaurantName) {
    await supabase.from("restaurants").insert({
      owner_id: data.user.id,
      name: restaurantName,
    });
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  if (cookieStore.get("nomenu_demo_user")?.value) {
    cookieStore.delete("nomenu_demo_user");
    revalidatePath("/", "layout");
    redirect("/login");
  }

  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
