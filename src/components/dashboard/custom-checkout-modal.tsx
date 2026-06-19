"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, X, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

// Initialize Stripe outside of component to avoid recreating the object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
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
      redirect: "if_required", // Prevent redirect if possible to handle success immediately
    });

    if (submitError) {
      setError(submitError.message || "An error occurred during payment processing.");
      setIsLoading(false);
    } else {
      onSuccess();
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
    </form>
  );
}

export function CustomCheckoutModal({ 
  isOpen, 
  onClose, 
  clientSecret, 
  planName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  clientSecret: string | null; 
  planName: string;
}) {
  const router = useRouter();

  if (!isOpen || !clientSecret) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-slate-100 animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 p-2 rounded-full"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="p-6 sm:p-8">
          <div className="mb-6 pr-8">
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">Upgrade to {planName}</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">Enter your card details below. We never store your raw card data.</p>
          </div>

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
            <CheckoutForm onSuccess={() => {
              onClose();
              // Refresh the page to show new billing status
              router.push("/dashboard/billing?success=Subscription%20updated%20successfully!");
              router.refresh();
            }} />
          </Elements>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <Lock className="h-3 w-3" />
            Secured by Stripe
          </div>
        </div>
      </div>
    </div>
  );
}
