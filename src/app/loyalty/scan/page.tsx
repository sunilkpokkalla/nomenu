"use client";

import { useEffect, useState, use, useRef } from "react";
import { claimLoyaltyStamp } from "./actions";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function LoyaltyScanPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const router = useRouter();
  const params = use(searchParams);
  const token = params.token as string;
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Processing your stamp...");
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
        const storedCardsStr = localStorage.getItem('nomenu_loyalty_cards');
        const storedCards = storedCardsStr ? JSON.parse(storedCardsStr) : {};

        const result = await claimLoyaltyStamp(token, storedCards);

        if (result.error) {
          setStatus("error");
          setMessage(result.error);
        } else if (result.success && result.cardId && result.restaurantId) {
          // Update local storage if new
          if ('isNew' in result && result.isNew) {
            storedCards[result.restaurantId] = result.cardId;
            localStorage.setItem('nomenu_loyalty_cards', JSON.stringify(storedCards));
          }

          setStatus("success");
          setMessage("Your card has been stamped! Redirecting...");
          
          setTimeout(() => {
            router.push(`/loyalty/${result.cardId}`);
          }, 1500);
        }
      } catch (err) {
        setStatus("error");
        setMessage("An unexpected error occurred.");
      }
    };

    processStamp();
  }, [token, router]);

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
