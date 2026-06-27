import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { fetchStripe } from "@/lib/stripe-fetch";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: _affiliateData, error: fetchError } = await supabase
      .from("affiliates")
      .select("id, stripe_account_id")
      .eq("auth_id", user.id)
      .maybeSingle();

    const affiliate = _affiliateData as { id: string; stripe_account_id: string | null } | null;
    if (fetchError || !affiliate) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 });
    }

    let stripeAccountId = affiliate.stripe_account_id;
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    // Real Stripe Connect Flow
    if (!stripeAccountId) {
      const account = await fetchStripe("/accounts", {
        method: "POST",
        body: {
          type: "express",
          email: user.email,
          capabilities: {
            transfers: { requested: true },
          },
        }
      });
      stripeAccountId = account.id;

      await supabase
        .from("affiliates")
        .update({ stripe_account_id: stripeAccountId })
        .eq("id", affiliate.id);
    } else {
      // Check if they already finished onboarding
      const account = await fetchStripe(`/accounts/${stripeAccountId}`);
      if (account.details_submitted) {
        // Generate a dashboard login link so they can see their money
        const loginLink = await fetchStripe(`/accounts/${stripeAccountId}/login_links`, {
          method: "POST"
        });
        return NextResponse.json({ url: loginLink.url });
      }
    }

    const accountLink = await fetchStripe("/account_links", {
      method: "POST",
      body: {
        account: stripeAccountId,
        refresh_url: `${origin}/partners/dashboard`,
        return_url: `${origin}/partners/dashboard?success=true`,
        type: "account_onboarding",
      }
    });

    return NextResponse.json({ url: accountLink.url });
    
  } catch (error: unknown) {
    console.error("Stripe Partner Connect Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
