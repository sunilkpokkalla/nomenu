"use client";

import { useState } from "react";
import { Star, Lock, Gift, CheckCircle2, X } from "lucide-react";
import { addStamp } from "./actions";

interface LoyaltyCardUIProps {
  cardId: string;
  restaurantId: string;
  stamps: number;
  restaurantName: string;
  restaurantLogo?: string | null;
  primaryColor: string;
}

export function LoyaltyCardUI({ cardId, restaurantId, stamps: initialStamps, restaurantName, primaryColor }: LoyaltyCardUIProps) {
  const [stamps, setStamps] = useState(initialStamps);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFull = stamps >= 10;

  const handleStamp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const result = await addStamp(cardId, restaurantId, pin);

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setStamps(result.newStamps || stamps + 1);
      setIsModalOpen(false);
      setPin("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">VIP Loyalty Card</h1>
        <p className="text-slate-500">Show this card to your server to earn stamps.</p>
      </div>

      {/* The Credit Card */}
      <div 
        className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, #000 100%)` }}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] hover:translate-x-[200%] transition-transform duration-1000" />
        
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
            <div className="text-white font-bold text-xl tracking-tight drop-shadow-md">
              {restaurantName}
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white/90 text-xs font-semibold tracking-wider">
              VIP MEMBER
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-white/80 text-xs font-medium uppercase tracking-widest">
              10 Stamps = 1 Free Item
            </div>
            
            {/* Stamp Grid */}
            <div className="grid grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`relative w-full aspect-square rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                    i < stamps 
                      ? "border-amber-400 bg-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.4)]" 
                      : "border-white/20 bg-white/5"
                  }`}
                >
                  {i < stamps ? (
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400 animate-in zoom-in duration-300" />
                  ) : i === 9 ? (
                    <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Area */}
      {isFull ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-500">
          <div className="flex justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-green-900">Reward Unlocked!</h2>
          <p className="text-green-700 text-sm">
            You've collected 10 stamps! Show this screen to your server to claim your free menu item (under $20).
          </p>
        </div>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4 text-slate-400" />
          Staff: Add Stamp
        </button>
      )}

      {/* Add to Home Screen Hint */}
      <div className="bg-slate-100 rounded-xl p-4 text-center space-y-1">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Don't lose your card!</p>
        <p className="text-xs text-slate-500">
          Tap the <strong>Share</strong> icon at the bottom of your screen and select <strong>"Add to Home Screen"</strong> to save this card as an app!
        </p>
      </div>

      {/* PIN Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" /> Staff Verification
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setPin("");
                  setError("");
                }}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleStamp} className="space-y-6">
                <div className="space-y-2 text-center">
                  <p className="text-sm text-slate-500 mb-4">
                    Please enter the restaurant's 4-digit Loyalty PIN to add a stamp.
                  </p>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-3xl tracking-[1em] rounded-xl border-slate-200 bg-slate-50 p-4 text-slate-900 focus:border-primary focus:ring-primary transition-colors"
                    placeholder="••••"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || pin.length !== 4}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Verifying..." : "Add Stamp"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
