import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CreditCard, ArrowRight, Building2, ShieldCheck, Banknote } from "lucide-react";
import Link from "next/link";
import { ConnectBankButton } from "./connect-bank-button";

export default async function PayoutsPage(
  props: {
    searchParams: Promise<{ message?: string; success?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!restaurant) {
    redirect("/dashboard?message=Please%20set%20up%20your%20restaurant%20first");
  }

  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const isEnterprise = currentPlan === "enterprise";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payments & Payouts</h1>
        <p className="mt-2 text-lg text-slate-600">
          Manage your Stripe Connect integration and direct bank payouts.
        </p>
      </div>

      {!isEnterprise ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <CreditCard className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Upgrade to Enterprise</h2>
          <p className="text-slate-600 max-w-lg mx-auto mb-8">
            Direct bank payouts, Apple Pay support, and 2.5% platform fees are exclusively available on the Enterprise plan. Upgrade to unlock the full commerce suite.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-[1.02]"
          >
            View Pricing Plans
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Main Action Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Building2 className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Link Bank Account</h2>
                    <p className="text-sm text-slate-500">Powered securely by Stripe Connect</p>
                  </div>
                </div>

                {searchParams.success ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 flex items-start gap-4">
                    <ShieldCheck className="w-6 h-6 text-green-600 shrink-0" />
                    <div>
                      <h3 className="font-bold mb-1">Account Connected Successfully!</h3>
                      <p className="text-sm text-green-700 mb-4">
                        Your restaurant is now able to accept live payments via Apple Pay, Google Pay, and Credit Cards directly on your digital menus.
                      </p>
                      <ConnectBankButton isAlreadyConnected={true} />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-slate-600 mb-8 max-w-lg">
                      {(restaurant as unknown as { stripe_account_id: string | null }).stripe_account_id 
                        ? "Your bank account is securely linked! Click below to open your Stripe Express Dashboard to view your balance, see recent payouts, and update your banking details."
                        : "To start accepting Apple Pay and credit card orders on your digital menu, you need to securely link your business bank account. Funds are routed directly to you."}
                    </p>
                    <ConnectBankButton isAlreadyConnected={!!(restaurant as unknown as { stripe_account_id: string | null }).stripe_account_id} />
                  </>
                )}
              </div>
            </div>

            {/* Information Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">Transaction Fees</h3>
                <p className="text-sm text-slate-600">
                  Nomenu charges a 2.5% platform fee per order. Standard Stripe processing fees (typically 2.9% + 30¢) also apply.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">Payout Schedule</h3>
                <p className="text-sm text-slate-600">
                  Payouts are automatically transferred to your linked bank account on a 2-day rolling basis by Stripe.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sm:col-span-2">
                <h3 className="font-semibold text-slate-900 mb-2">Automatic Refunds</h3>
                <p className="text-sm text-slate-600">
                  When you cancel a paid order directly from your Kitchen Display System (KDS), the customer's payment is automatically and fully refunded via Stripe. Refunded amounts are automatically deducted from your pending payouts without needing to log into the Stripe Dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                Secure Onboarding
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Nomenu does not store your SSN, EIN, or bank routing numbers. All financial and identity verification is handled directly by Stripe's bank-grade secure infrastructure.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
