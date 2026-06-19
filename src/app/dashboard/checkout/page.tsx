import { redirect } from "next/navigation";
import { CheckoutClient } from "./checkout-client";
import { createClient } from "@/lib/supabase/server";

export default async function CheckoutPage(
  props: {
    searchParams: Promise<{ planId?: string; planName?: string; annual?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const { planId, planName, annual } = searchParams;

  if (!planId || !planName) {
    redirect("/dashboard/billing");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("plan")
    .eq("owner_id", user.id)
    .single();

  if (!restaurant) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Secure Checkout</h1>
        <p className="mt-2 text-slate-500 font-medium text-base">
          Complete your upgrade to the <span className="font-bold text-slate-900">{planName}</span> plan.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-10">
          <CheckoutClient 
            planId={planId} 
            planName={planName} 
            isAnnual={annual === "true"} 
          />
        </div>
      </div>
    </div>
  );
}
