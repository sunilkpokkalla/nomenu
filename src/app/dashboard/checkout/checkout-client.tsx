"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, Lock, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/billing?success=Subscription%20updated%20successfully!`,
      },
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message || "An error occurred during payment processing.");
      setIsLoading(false);
    } else {
      router.push("/dashboard/billing?success=Subscription%20updated%20successfully!");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      
      {error && (
        <div className="text-sm font-medium text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100">
          {error}
        </div>
      )}
      
      <button
        disabled={!stripe || isLoading}
        className="w-full rounded-xl bg-slate-950 px-4 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg hover:bg-black hover:scale-[1.02] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        {isLoading ? "Processing..." : "Subscribe Securely"}
      </button>

      <div className="flex justify-center pt-2">
        <Link href="/dashboard/billing" className="text-sm text-slate-500 hover:text-slate-900 font-medium flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Plans
        </Link>
      </div>
    </form>
  );
}

export function CheckoutClient({ planId, planName, isAnnual }: { planId: string, planName: string, isAnnual: boolean }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSecret() {
      try {
        const res = await fetch("/api/stripe/subscription-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId, isAnnual }),
        });
        const data = await res.json();
        
        if (data.isPaid) {
          // 100% discount or free trial applied, no payment needed
          window.location.href = `/dashboard/checkout/success?session_id=${data.subscriptionId}`;
          return;
        }

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error(data.error || "Failed to initialize checkout.");
        }
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchSecret();
  }, [planId, isAnnual]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Initializing Secure Checkout...</p>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="text-center py-8">
        <div className="text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100 font-medium mb-6">
          {error || "Failed to load checkout."}
        </div>
        <Link href="/dashboard/billing" className="inline-flex items-center gap-2 text-sm font-bold bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-xl shadow-sm hover:bg-slate-50 transition-all hover:scale-[1.02]">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Link>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ 
      clientSecret, 
      appearance: { 
        theme: 'stripe',
        variables: {
          colorPrimary: '#0f172a',
          colorBackground: '#ffffff',
          colorText: '#0f172a',
          colorDanger: '#e11d48',
          fontFamily: 'Inter, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px',
        }
      } 
    }}>
      <CheckoutForm />
    </Elements>
  );
}
