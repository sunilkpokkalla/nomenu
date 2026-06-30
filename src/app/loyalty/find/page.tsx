"use client";

import { useState } from "react";
import { findLoyaltyCardsByPhone } from "./actions";
import { Search, Loader2, Sparkles, ChevronRight, Phone, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type VIPCard = any; 

export default function FindLoyaltyPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [cards, setCards] = useState<VIPCard[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setStatus("loading");
    setErrorMsg("");
    setCards([]);

    try {
      const result = await findLoyaltyCardsByPhone(phoneNumber);
      
      if (result.error) {
        setStatus("error");
        setErrorMsg(result.error);
      } else if (result.success && result.cards) {
        setStatus("success");
        setCards(result.cards);
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("An unexpected error occurred. Please try again.");
    }
  };

  const handleRestoreCard = (cardId: string, restaurantId: string) => {
    // 1. Save it to local storage to "restore" it on their device
    const storedCardsStr = localStorage.getItem('nomenu_loyalty_cards');
    const storedCards = storedCardsStr ? JSON.parse(storedCardsStr) : {};
    storedCards[restaurantId] = cardId;
    localStorage.setItem('nomenu_loyalty_cards', JSON.stringify(storedCards));

    // 2. Navigate to the card page
    router.push(`/loyalty/${cardId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-100 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-10 -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-500 rounded-full blur-3xl opacity-10 -ml-16 -mb-16 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-100 to-fuchsia-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-white">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Find My VIP Cards</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Lost your membership link? Enter your phone number below to retrieve your VIP cards across all NoMenu restaurants.
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4 relative z-10">
          <div>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="Phone Number (e.g. 555-123-4567)"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 text-slate-900 font-medium transition-shadow placeholder:font-normal"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Find My Cards
              </>
            )}
          </button>
        </form>

        {status === "error" && (
          <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {status === "success" && cards.length > 0 && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Your VIP Cards</h3>
            <div className="space-y-3">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleRestoreCard(card.id, card.restaurants.id)}
                  className="w-full bg-white border border-slate-200 hover:border-indigo-300 p-4 rounded-2xl flex items-center justify-between group transition-all hover:shadow-md text-left"
                >
                  <div className="flex items-center gap-4">
                    {card.restaurants.logo_url ? (
                      <img 
                        src={card.restaurants.logo_url} 
                        alt={card.restaurants.name}
                        className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-100"
                      />
                    ) : (
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                        style={{ backgroundColor: card.restaurants.primary_color || '#4f46e5' }}
                      >
                        {card.restaurants.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{card.restaurants.name}</h4>
                      <p className="text-sm font-medium text-slate-500 mt-0.5">
                        {card.stamps} {card.stamps === 1 ? 'Stamp' : 'Stamps'} Collected
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center transition-colors shrink-0">
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center relative z-10">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors font-medium">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
