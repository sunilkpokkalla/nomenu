import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { SubscriptionButton, PortalButton } from "@/components/dashboard/subscription-buttons";

const PLANS = [
  {
    id: "pro", // Kept ID for backward compatibility
    name: "Pro Plan",
    price: "$39",
    period: "/mo",
    description: "Unlimited flexibility for high-volume venues.",
    features: [
      "Unlimited Menus & Items",
      "Unlimited Location QR Codes",
      "Full Brand & Theme Customization",
      "Private Customer Feedback System",
      "Detailed Scan Analytics & Timezones",
      "24/7 Priority Email Support",
    ],
  },
  {
    id: "elite",
    name: "Elite Plan",
    price: "$79",
    period: "/mo",
    description: "Real-time ordering for premium venues and groups.",
    features: [
      "Everything in Pro",
      "Interactive Digital Shopping Cart",
      "Real-Time Live Orders Dashboard",
      "Digital Receipts & Order Tracking",
      "All 8+ Premium Elite Themes",
      "White-labeled Branding",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: "$119",
    period: "/mo",
    description: "Full commerce suite with direct payouts.",
    features: [
      "Everything in Elite",
      "Order & Pay via Apple Pay / Card",
      "Direct Bank Payouts (Stripe Connect)",
      "2.5% Platform Transaction Fee",
      "Dedicated Account Manager",
      "Custom API Access & Webhooks",
    ],
  },
];

export default async function BillingPage(
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

  const currentPlan = restaurant.plan || "free";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Plans & Billing</h1>
        <p className="mt-2 text-slate-600 font-medium">
          Scale your venue's capabilities. Upgrade to unlock powerful analytics, custom themes, and digital ordering features.
        </p>
      </div>

      {searchParams.success && (
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
          {searchParams.success}
        </div>
      )}
      {searchParams.message && (
        <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-800 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
          {searchParams.message}
        </div>
      )}

      {/* Active Plan Dashboard Widget */}
      <div className="mb-12 relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-1 shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <ShieldCheck className="w-64 h-64 rotate-12" />
        </div>
        <div className="relative rounded-[1.75rem] bg-slate-50 border border-slate-100 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden z-10">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 rotate-3">
              <ShieldCheck className="h-8 w-8 -rotate-3" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Current Subscription
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-slate-900 tracking-tight capitalize">{currentPlan} Plan</span>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  Active
                </div>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Secured by Stripe billing.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-end w-full md:w-auto">
             {currentPlan !== "free" ? (
               <div className="scale-105 origin-right">
                 <PortalButton />
               </div>
             ) : (
               <div className="text-sm font-bold text-slate-400 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
                 Free tier limits applied
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Pricing Bento Grid */}
      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto items-end">
        {PLANS.map((plan) => {
          const isActive = currentPlan.toLowerCase() === plan.id.toLowerCase();
          const isElite = plan.id === "elite";
          
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col transition-all duration-500 group
                ${isElite 
                  ? "bg-white text-slate-900 shadow-2xl shadow-indigo-500/10 rounded-[2.5rem] p-1 z-10 md:scale-105" 
                  : "bg-white text-slate-900 shadow-sm border border-slate-200 rounded-[2rem] hover:shadow-md hover:border-slate-300"
                }
                ${isActive && !isElite ? "ring-2 ring-emerald-500 ring-offset-2" : ""}
                ${isElite && !isActive ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-500" : ""}
              `}
            >
              {/* Internal padding container for Elite border gradient effect */}
              <div className={`flex flex-col h-full rounded-[2.25rem] p-8 ${isElite ? "bg-white border-none relative overflow-hidden" : ""}`}>
                
                {/* Elite Sparkle Effects */}
                {isElite && (
                  <>
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
                  </>
                )}

                {/* Badges */}
                <div className="flex justify-between items-start mb-6 z-10">
                  <div className="flex flex-col">
                    <h3 className={`text-2xl font-black tracking-tight text-slate-900`}>
                      {plan.name}
                    </h3>
                    <p className={`text-xs mt-1 font-medium ${isElite ? "text-indigo-600/80" : "text-slate-500"}`}>
                      {plan.description}
                    </p>
                  </div>
                  
                  {isElite && !isActive && (
                    <span className="shrink-0 flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-indigo-500/20">
                      <Sparkles className="w-3 h-3" /> Recommended
                    </span>
                  )}
                  {isActive && (
                    <span className={`shrink-0 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${isElite ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                      Current Plan
                    </span>
                  )}
                </div>

                {/* Pricing */}
                <div className="mb-8 z-10">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black tracking-tighter text-slate-900`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm font-bold text-slate-400`}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8 flex-1 z-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${isElite ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                      <span className={`text-sm font-medium leading-snug ${isElite ? "text-slate-700 font-semibold" : "text-slate-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-auto z-10 pt-4 border-t border-slate-100">
                  {isActive ? (
                    <button disabled className={`w-full py-4 rounded-xl text-sm font-black tracking-widest uppercase transition-all ${isElite ? "bg-slate-100 text-slate-400" : "bg-slate-100 text-slate-400"}`}>
                      Active Plan
                    </button>
                  ) : (
                    <div className="w-full relative group/btn">
                      {isElite && (
                         <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-30 group-hover/btn:opacity-100 transition duration-500"></div>
                      )}
                      <div className="relative">
                        <SubscriptionButton 
                          planId={plan.id}
                          planName={plan.name}
                          isElite={plan.id === "elite"}
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
