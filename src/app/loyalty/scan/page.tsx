"use client";

import { useEffect, useState, use, useRef } from "react";
import { claimLoyaltyStamp, resolveLoyaltyToken } from "./actions";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Phone } from "lucide-react";

export default function LoyaltyScanPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const router = useRouter();
  const params = use(searchParams);
  const token = params.token as string;
  
  const [status, setStatus] = useState<"loading" | "needs_phone" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Processing your stamp...");
  const [phoneNumber, setPhoneNumber] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No QR code token found.");
      return;
    }

    if (hasRun.current) return;
    hasRun.current = true;

    const processStamp = async () => {
      try {
        const resolveResult = await resolveLoyaltyToken(token);
        if (resolveResult.error || !resolveResult.restaurantId) {
          setStatus("error");
          setMessage(resolveResult.error || "Invalid QR code.");
          return;
        }

        const storedCardsStr = localStorage.getItem('nomenu_loyalty_cards');
        const storedCards = storedCardsStr ? JSON.parse(storedCardsStr) : {};
        const existingCardId = storedCards[resolveResult.restaurantId];

        if (existingCardId) {
          await submitClaim(existingCardId, undefined);
        } else {
          setStatus("needs_phone");
          setMessage("Enter your phone number to retrieve your existing VIP card or create a new one.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An unexpected error occurred.");
      }
    };

    processStamp();
  }, [token]);

  const submitClaim = async (cardId?: string, phone?: string) => {
    setStatus("loading");
    setMessage("Adding your stamp...");
    
    const result = await claimLoyaltyStamp(token, cardId, phone);

    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else if (result.success && result.cardId && result.restaurantId) {
      const storedCardsStr = localStorage.getItem('nomenu_loyalty_cards');
      const storedCards = storedCardsStr ? JSON.parse(storedCardsStr) : {};
      
      storedCards[result.restaurantId] = result.cardId;
      localStorage.setItem('nomenu_loyalty_cards', JSON.stringify(storedCards));

      setStatus("success");
      setMessage("Your card has been stamped! Redirecting...");
      
      setTimeout(() => {
        router.push(`/loyalty/${result.cardId}`);
      }, 1500);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    submitClaim(undefined, phoneNumber.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center flex flex-col items-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Adding Stamp...</h2>
            <p className="text-slate-500">{message}</p>
          </>
        )}
        
        {status === "needs_phone" && (
          <form onSubmit={handlePhoneSubmit} className="w-full flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
              <Phone className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Find Your VIP Card</h2>
            <p className="text-slate-500 mb-6 text-sm">{message}</p>
            
            <input
              type="tel"
              placeholder="e.g. 555-123-4567"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Get My Stamp
            </button>
            <p className="text-xs text-slate-400 mt-4">
              No sign-up needed. We use your phone number to securely retrieve your stamps next time you visit.
            </p>
          </form>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6 animate-in zoom-in" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Stamp Added!</h2>
            <p className="text-slate-500 mb-6">{message}</p>
            <div className="animate-pulse w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-full animate-[progress_1.5s_ease-in-out]"></div>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-rose-500 mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Scan Failed</h2>
            <p className="text-slate-500">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
