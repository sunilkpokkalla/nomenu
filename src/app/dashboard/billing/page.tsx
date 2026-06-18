import { Check, ShieldCheck, Sparkles, Zap, AlertTriangle } from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { SubscriptionButton, PortalButton } from "@/components/dashboard/subscription-buttons";
import { BillingToggle } from "@/components/dashboard/billing-toggle";

const getPlans = (isAnnual: boolean) => [
  {
    id: "pro", // Kept ID for backward compatibility
    name: "Pro",
    price: isAnnual ? "$35" : "$39",
    period: "/mo",
    description: "Unlimited flexibility for high-volume venues.",
    features: [
      "Unlimited Menus & Items",
      "AI Magic Menu Import & AI Writer",
      "Unlimited AI Dish Images ($0.03/image)",
      "Square POS Integration",
      "Private Customer Feedback System",
      "Detailed Scan Analytics & Timezones",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: isAnnual ? "$71" : "$79",
    period: "/mo",
    description: "Real-time ordering for premium venues and groups.",
    features: [
      "Everything in Pro",
      "Interactive Digital Shopping Cart",
      "Real-Time Live Orders Dashboard (KDS)",
      "Digital Receipts & Order Tracking",
      "Manual Payments (Keep 100% Revenue, 0% Fees)",
      "All 8+ Premium Elite Themes",
      "White-labeled Branding",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: isAnnual ? "$107" : "$119",
    period: "/mo",
    description: "Full commerce suite with direct payouts.",
    features: [
      "Everything in Elite",
      "Dine-in, Takeaway & Priority Reserve",
      "Multiple Kitchen Displays (KDS)",
      "Intelligent Order Capacity Pacing",
      "Order & Pay via Apple Pay / Card",
      "Direct Bank Payouts (Stripe Connect)",
      "Dedicated Account Manager",
    ],
  },
];

export default async function BillingPage(
  props: {
    searchParams: Promise<{ message?: string; success?: string; billing?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const isAnnual = searchParams.billing === "annual";
  const plans = getPlans(isAnnual);

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

  // Fetch Free Plan Usage
  let menuCount = 0;
  let orderCount = 0;
  if (currentPlan === "free") {
    const { count: mCount } = await supabase
      .from("menus")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", restaurant.id);
    menuCount = mCount || 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);
    
    const { count: oCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", restaurant.id)
      .gte("created_at", startOfMonth.toISOString());
    orderCount = oCount || 0;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Plans & Billing</h1>
        <p className="mt-2 text-slate-500 font-medium text-base">
          Manage your subscription and billing details. Upgrade to unlock advanced capabilities.
        </p>
      </div>

      {searchParams.success && (
        <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800 shadow-sm">
          {searchParams.success}
        </div>
      )}
      {searchParams.message && (
        <div className="mb-8 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800 shadow-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {searchParams.message}
        </div>
      )}

      {/* Active Plan Dashboard Widget - Minimalist */}
      <div className="mb-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-900 border border-slate-200">
              <Zap className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Current Subscription
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-slate-950 tracking-tight capitalize">{currentPlan} Plan</span>
                <div className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-900"></div>
                  Active
                </div>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Secured by Stripe billing.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center w-full md:w-auto">
             {currentPlan !== "free" ? (
               <PortalButton />
             ) : (
               <div className="text-sm font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg w-full text-center">
                 Free tier limits applied
               </div>
             )}
          </div>
        </div>

        {/* Free Plan Usage Tracker */}
        {currentPlan === "free" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-900">Menus Created</span>
                <span className="text-sm font-bold text-slate-500">{menuCount} / 1</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${menuCount >= 1 ? 'bg-rose-500' : 'bg-slate-900'}`} 
                  style={{ width: `${Math.min((menuCount / 1) * 100, 100)}%` }} 
                />
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-900">Orders This Month</span>
                <span className="text-sm font-bold text-slate-500">{orderCount} / 50</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${orderCount >= 50 ? 'bg-rose-500' : 'bg-slate-900'}`} 
                  style={{ width: `${Math.min((orderCount / 50) * 100, 100)}%` }} 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Monthly/Annual Toggle */}
      <BillingToggle />

      {/* Pricing Bento Grid - Minimalist */}
      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const planTiers: Record<string, number> = { free: 0, pro: 1, elite: 2, enterprise: 3 };
          const currentTier = planTiers[currentPlan.toLowerCase()] || 0;
          const thisTier = planTiers[plan.id.toLowerCase()] || 0;

          const isActive = currentTier === thisTier;
          const isDowngrade = thisTier < currentTier;
          const isElite = plan.id === "elite";
          
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col bg-white text-slate-900 border rounded-2xl transition-all duration-300
                ${isElite ? "border-slate-900 shadow-xl shadow-slate-900/5 md:-mt-4 md:mb-4" : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md"}
                ${isActive && !isElite ? "ring-1 ring-slate-900" : ""}
              `}
            >
              <div className="flex flex-col h-full p-8">
                
                {/* Badges */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold tracking-tight text-slate-950">
                      {plan.name}
                    </h3>
                    <p className="text-sm mt-2 text-slate-500 font-medium leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                  
                  {isElite && !isActive && (
                    <span className="shrink-0 flex items-center gap-1.5 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md shadow-sm">
                      <Sparkles className="w-3 h-3" /> Recommended
                    </span>
                  )}
                  {isActive && (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      Current
                    </span>
                  )}
                </div>

                {/* Pricing */}
                <div className="mb-8 border-b border-slate-100 pb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-950">
                      {plan.price}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">
                      {plan.period}
                    </span>
                  </div>
                  {isAnnual && (
                    <div className="mt-2 text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
                      Billed Annually
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="mt-1 shrink-0 text-slate-400">
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-medium text-slate-600 leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-auto pt-4">
                  {isActive ? (
                    <button disabled className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed">
                      Active Plan
                    </button>
                  ) : currentTier > 0 ? (
                    <PortalButton 
                      text={isDowngrade ? `Downgrade to ${plan.name}` : `Upgrade to ${plan.name}`}
                      variant="card"
                      isElite={isElite}
                    />
                  ) : (
                    <div className="w-full">
                      <SubscriptionButton 
                        planId={plan.id}
                        planName={plan.name}
                        isElite={isElite}
                        isAnnual={isAnnual}
                      />
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
