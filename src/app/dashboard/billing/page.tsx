import { Check, CreditCard, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { updateRestaurantPlan } from "@/app/dashboard/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

const PLANS = [
  {
    id: "free",
    name: "Free Starter",
    price: "$0",
    description: "Perfect for testing or small pop-up menus.",
    features: [
      "1 Active Digital Menu",
      "Up to 20 Menu Items",
      "3 Generated QR Codes",
      "Standard Guest View",
      "Basic Weekly Scan Statistics",
    ],
  },
  {
    id: "growth",
    name: "Growth Plan",
    price: "$29",
    period: "/mo",
    description: "Ideal for growing full-service restaurants.",
    features: [
      "Unlimited Digital Menus",
      "Unlimited Menu Items",
      "Unlimited QR Code Generation",
      "Full Theme Customization (Colors, Brand logo)",
      "Detailed Analytics (Device types, Locations, Scans)",
      "Priority Customer Support",
    ],
  },
  {
    id: "pro",
    name: "Pro Premium",
    price: "$79",
    period: "/mo",
    description: "Designed for premium venues and multi-location groups.",
    features: [
      "Everything in Growth",
      "Multi-Location Restaurant Profiles",
      "White-labeled Branding (No 'Powered by NoMenu')",
      "Stripe Table-side Payments (Beta)",
      "24/7 Dedicated Account Manager",
    ],
  },
];

export default async function BillingPage(
  props: {
    searchParams: Promise<{ message?: string; success?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const supabase = createClient();
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
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Billing & Subscriptions</h1>
        <p className="mt-1 text-slate-600">
          Manage your subscription plans, upgrade features, and unlock custom restaurant branding options.
        </p>
      </div>

      {searchParams.success && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {searchParams.success}
        </div>
      )}
      {searchParams.message && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {searchParams.message}
        </div>
      )}

      {/* Plan Status Alert */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="font-semibold text-slate-900 flex items-center gap-2">
                Active Plan: <span className="capitalize text-primary font-extrabold">{currentPlan}</span>
                <Badge variant="success">Active</Badge>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Your restaurant is linked to the {currentPlan} subscription. Custom coloring and detailed analytics require a paid tier.
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium border bg-white px-3 py-1.5 rounded-lg shadow-sm">
            <CreditCard className="h-3.5 w-3.5" /> Next billing date: N/A (Demo mode)
          </div>
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isActive = currentPlan.toLowerCase() === plan.id.toLowerCase();
          return (
            <Card
              key={plan.id}
              className={`flex flex-col relative overflow-hidden transition-all duration-300 ${
                isActive ? "border-primary shadow-lg ring-1 ring-primary" : "hover:border-slate-300 hover:shadow-md"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Current
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="min-h-[40px] mt-1.5">{plan.description}</CardDescription>
                <div className="mt-4 flex items-baseline gap-1 text-slate-950">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-sm font-semibold text-slate-500">{plan.period}</span>}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col pt-0">
                <hr className="mb-5" />
                <ul className="space-y-3.5 text-xs text-slate-600 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-4">
                  {isActive ? (
                    <Button className="w-full" variant="outline" disabled>
                      Plan Active
                    </Button>
                  ) : (
                    <form action={updateRestaurantPlan}>
                      <input type="hidden" name="plan" value={plan.id} />
                      <Button
                        type="submit"
                        className="w-full"
                        variant={plan.id === "growth" ? "default" : "secondary"}
                      >
                        {plan.id === "free" ? "Downgrade Plan" : `Upgrade to ${plan.name}`}
                      </Button>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
