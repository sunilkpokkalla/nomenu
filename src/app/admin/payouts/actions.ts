"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function markAsPaid(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ensure user is an admin
  const adminEmails = (process.env.ADMIN_EMAILS || "admin@nomenu.us").split(",");
  if (!user.email || !adminEmails.includes(user.email)) {
    redirect("/dashboard");
  }

  const affiliateId = formData.get("affiliateId") as string;
  const amountStr = formData.get("amount") as string;
  const amount = parseInt(amountStr, 10);

  if (!affiliateId || isNaN(amount) || amount <= 0) {
    redirect("/admin/payouts?error=Invalid%20amount");
  }

  // Fetch the current paid amount
  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("total_paid_amount")
    .eq("id", affiliateId)
    .single();

  if (affiliate) {
    const newTotal = (affiliate.total_paid_amount || 0) + amount;
    
    const { error } = await supabase
      .from("affiliates")
      .update({ total_paid_amount: newTotal })
      .eq("id", affiliateId);

    if (error) {
      redirect(`/admin/payouts?error=${encodeURIComponent(error.message)}`);
    }
  }

  revalidatePath("/admin/payouts");
  redirect("/admin/payouts");
}
