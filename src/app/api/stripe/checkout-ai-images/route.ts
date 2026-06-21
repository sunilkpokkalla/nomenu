import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { fetchStripe } from "@/lib/stripe-fetch";

export async function POST(req: Request) {
  try {
    
    const { jobId, returnUrl } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Get the job
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: _job, error: fetchError } = await (supabase as any)
      .from("ai_image_jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const job = _job as any;

    if (fetchError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    
    if (job.status !== "pending_payment") {
      return NextResponse.json({ error: "Job already paid or processing" }, { status: 400 });
    }

    // Construct safe URLs for redirect
    const successUrl = new URL(returnUrl);
    successUrl.searchParams.set("success", "true");
    successUrl.searchParams.set("ai_job_id", jobId);
    
    const cancelUrl = new URL(returnUrl);
    cancelUrl.searchParams.set("canceled", "true");

    // Create the Checkout Session
    // This is a direct charge to the platform, so we do NOT pass a stripeAccount parameter.
    const session = await fetchStripe("/checkout/sessions", {
      method: "POST",
      body: {
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Premium AI Image Generation",
                description: `Generate ${job.total_items} unique HD photos using Google Imagen AI.`,
              },
              unit_amount: job.amount_cents,
            },
            quantity: 1,
          }
        ],
        mode: "payment",
        success_url: successUrl.toString(),
        cancel_url: cancelUrl.toString(),
        client_reference_id: job.id,
        metadata: {
          type: "ai_image_generation",
          job_id: job.id,
          restaurant_id: job.restaurant_id,
          menu_id: job.menu_id
        }
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
