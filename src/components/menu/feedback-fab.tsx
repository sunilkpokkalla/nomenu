"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Star, X, CheckCircle2, Search, Clock } from "lucide-react";
import { submitFeedback } from "@/app/menu/[id]/actions";
import { PhoneInputField } from "@/components/ui/phone-input";
import { LoyaltyCardUI } from "@/app/loyalty/[id]/loyalty-card-ui";
import Link from "next/link";

interface FeedbackFABProps {
  restaurantId: string;
  tableNumber?: string;
  qrCodeId?: string;
}

type EscalationState = 'INITIAL' | 'ASK_MANAGER' | 'TIMER_RUNNING' | 'MANAGER_CHECK' | 'RESOLVED_SUCCESS' | 'RESOLVED_COMPENSATION';

export function FeedbackFAB({ restaurantId, tableNumber, qrCodeId }: FeedbackFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loyaltyCardId, setLoyaltyCardId] = useState<string | null>(null);
  const [loyaltyStamps, setLoyaltyStamps] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [loyaltyConfig, setLoyaltyConfig] = useState<any>(null);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [recoveryOffer, setRecoveryOffer] = useState<string>("");
  const [recoveryMessage, setRecoveryMessage] = useState<string>("");
  const [isLoyaltyEligible, setIsLoyaltyEligible] = useState<boolean>(false);
  const [hasSubmittedContact, setHasSubmittedContact] = useState<boolean>(false);
  
  // Real-time Service Recovery Flow
  const [escalationState, setEscalationState] = useState<EscalationState>('INITIAL');
  const [timerLeft, setTimerLeft] = useState(300);

  // New Service Recovery state
  const [serviceRecoveryEnabled, setServiceRecoveryEnabled] = useState<boolean>(false);
  const [serviceRecoveryMessage, setServiceRecoveryMessage] = useState<string | null>(null);
  const [offerManagerVisit, setOfferManagerVisit] = useState<boolean>(true);
  const [offerCompensation, setOfferCompensation] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (escalationState === 'TIMER_RUNNING' && timerLeft > 0) {
      interval = setInterval(() => {
        setTimerLeft((prev) => prev - 1);
      }, 1000);
    } else if (escalationState === 'TIMER_RUNNING' && timerLeft <= 0) {
      setEscalationState('MANAGER_CHECK');
    }
    return () => clearInterval(interval);
  }, [escalationState, timerLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    let existingLoyaltyCardId = undefined;
    try {
      const storedCards = JSON.parse(localStorage.getItem('nomenu_loyalty_cards') || '{}');
      if (storedCards[restaurantId]) {
        existingLoyaltyCardId = storedCards[restaurantId];
      }
    } catch (e) {
      console.error("Failed to read loyalty cards from local storage", e);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await submitFeedback(restaurantId, rating, comment, customerName, `${customerEmail} | ${customerPhone}`, tableNumber, qrCodeId, existingLoyaltyCardId || undefined, feedbackId || undefined) as any;

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setIsSuccess(true);
      if (result.feedbackId) {
        setFeedbackId(result.feedbackId);
      }

      if (result.isLoyaltyEligible) {
        setIsLoyaltyEligible(true);
        grantStamp(result);
      } else {
        setIsSuccess(true);
      }

      // If they get a recovery offer
      if (result.recoveryOfferText) {
        setRecoveryOffer(result.recoveryOfferText);
      }
      
      if (result.recoveryMessage) {
        setRecoveryMessage(result.recoveryMessage);
      }
      
      // Update new service recovery options
      if (result.serviceRecoveryEnabled && rating <= 3) {
        setServiceRecoveryEnabled(true);
        if (result.serviceRecoveryMessage) setServiceRecoveryMessage(result.serviceRecoveryMessage);
        if (result.offerManagerVisit !== undefined) setOfferManagerVisit(result.offerManagerVisit);
        if (result.offerCompensation !== undefined) setOfferCompensation(result.offerCompensation);
        if (result.managerVisitTimerMinutes !== undefined) setTimerLeft(result.managerVisitTimerMinutes * 60);
        
        if (result.offerManagerVisit) {
          setEscalationState('ASK_MANAGER');
        } else if (result.offerCompensation) {
          setEscalationState('RESOLVED_COMPENSATION');
        } else {
          setEscalationState('RESOLVED_SUCCESS');
        }
      } else {
        setEscalationState('RESOLVED_SUCCESS');
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grantStamp = (result: any) => {
    if (result.loyaltyCardId) {
      setLoyaltyCardId(result.loyaltyCardId);
      try {
        const storedCards = JSON.parse(localStorage.getItem('nomenu_loyalty_cards') || '{}');
        storedCards[restaurantId] = result.loyaltyCardId;
        localStorage.setItem('nomenu_loyalty_cards', JSON.stringify(storedCards));
      } catch (e) {
        console.error("Failed to save loyalty card to local storage", e);
      }
    }
    setLoyaltyStamps(result.loyaltyStamps || 1);
    if (result.loyaltyConfig) {
      setLoyaltyConfig(result.loyaltyConfig);
    }
    setIsSuccess(true);
  };

  return (
    <>
      {/* Floating Action Buttons Stack */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {loyaltyCardId ? (
          <Link
            href={`/loyalty/${loyaltyCardId}`}
            className="bg-amber-500 text-white px-5 py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-amber-400 transition-all flex items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-500 gap-2 font-bold ring-4 ring-amber-500/20"
            aria-label="View VIP Card"
          >
            <Star className="w-5 h-5 fill-white" />
            VIP Card
          </Link>
        ) : (
          <Link
            href="/loyalty/find"
            className="bg-white text-slate-700 px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-slate-50 transition-all flex items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-500 gap-1.5 text-sm font-semibold border border-slate-200"
            aria-label="Find VIP Card"
          >
            <Search className="w-4 h-4 text-slate-400" />
            Find VIP Card
          </Link>
        )}
        
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-500"
          aria-label="Leave Feedback"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
              <h3 className="font-semibold text-slate-800">
                Feedback & Loyalty
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area - Scrollable */}
            <div className="overflow-y-auto flex-grow p-6 overscroll-contain">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                  {rating >= 4 ? (
                    <>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Thank you!</h4>
                      <p className="text-slate-500 mb-6">Your feedback helps us improve.</p>
                      
                      {loyaltyCardId && loyaltyConfig ? (
                        <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-500 delay-150 fill-mode-both">
                          <h5 className="font-bold text-slate-900 text-lg mb-1">
                            {loyaltyStamps > 1 ? "You earned a stamp!" : "You unlocked a VIP Card!"}
                          </h5>
                          <p className="text-slate-500 text-xs mb-4">
                            As a thank you for your {rating}-star review.
                          </p>
                          <div className="w-full max-w-[340px] origin-top scale-95">
                             <LoyaltyCardUI 
                               cardId={loyaltyCardId}
                               restaurantId={restaurantId}
                               stamps={loyaltyStamps}
                               restaurantName={loyaltyConfig.name}
                               restaurantLogo={loyaltyConfig.logo_url}
                               primaryColor={loyaltyConfig.primary_color || "#000000"}
                               stampColor={loyaltyConfig.loyalty_stamp_color || "amber"}
                               stampIcon={loyaltyConfig.loyalty_stamp_icon || "star"}
                               layout={loyaltyConfig.loyalty_card_layout || "classic"}
                               rewardText={loyaltyConfig.loyalty_reward_text}
                             />
                          </div>
                          <Link 
                            href={`/loyalty/${loyaltyCardId}`}
                            className="block w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-center mt-2"
                          >
                            View Digital VIP Card
                          </Link>
                        </div>
                      ) : isLoyaltyEligible && !loyaltyCardId ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 w-full animate-in zoom-in-95 duration-500 delay-150 fill-mode-both">
                          <div className="flex justify-center mb-3">
                            <Star className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse" />
                          </div>
                          <h5 className="font-bold text-amber-900 text-lg mb-2 text-center">You unlocked a VIP Card!</h5>
                          <p className="text-amber-700 text-sm mb-4 text-center">
                            As a thank you for your {rating}-star review, you've earned a loyalty stamp! Please provide your details to claim your card.
                          </p>
                          <div className="space-y-3 mb-4">
                            <input
                              type="text"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              placeholder="Full Name"
                              required
                              className="w-full rounded-xl border-amber-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400"
                            />
                            <input
                              type="email"
                              value={customerEmail}
                              onChange={(e) => setCustomerEmail(e.target.value)}
                              placeholder="Email Address"
                              required
                              className="w-full rounded-xl border-amber-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400"
                            />
                            <PhoneInputField
                              value={customerPhone}
                              onChange={(val) => setCustomerPhone(val || "")}
                              placeholder="Phone Number"
                              required
                              className="w-full rounded-xl border border-amber-200 bg-white p-2.5 text-sm text-slate-900 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400"
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={async () => {
                              if (!customerName || !customerEmail || !customerPhone) {
                                alert("Please fill out all fields to claim your card.");
                                return;
                              }
                              if (feedbackId) {
                                const { claimLoyaltyCard } = await import("@/app/menu/[id]/actions");
                                const res = await claimLoyaltyCard({
                                  feedbackId,
                                  restaurantId,
                                  name: customerName,
                                  email: customerEmail,
                                  phone: customerPhone
                                });
                                if (res.success) {
                                  setLoyaltyCardId(res.loyaltyCardId || null);
                                  setLoyaltyStamps(res.loyaltyStamps || 1);
                                  if (res.loyaltyConfig) setLoyaltyConfig(res.loyaltyConfig);
                                } else {
                                  alert(res.error || "Failed to claim card.");
                                }
                              }
                            }}
                            className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-center"
                          >
                            Claim My Card
                          </button>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="space-y-6 w-full animate-in zoom-in-95 duration-500">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <MessageSquare className="w-8 h-8 text-slate-400" />
                      </div>
                      
                      {!hasSubmittedContact ? (
                        <>
                          <div className="text-center">
                            <h4 className="text-xl font-bold text-slate-900 mb-2">We're so sorry.</h4>
                            <p className="text-slate-600 text-sm">
                              {serviceRecoveryEnabled && serviceRecoveryMessage ? serviceRecoveryMessage : (
                                "We clearly missed the mark today, and we want to make it right. Please let us know how we can fix this:"
                              )}
                            </p>
                          </div>
                          
                          <div className="pt-4 border-t border-slate-100 space-y-4">
                            {escalationState === 'ASK_MANAGER' && (
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                              <p className="text-sm font-bold text-slate-900 mb-2">Speak to a manager now?</p>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (feedbackId) {
                                      await import("@/app/menu/[id]/actions").then(m => m.summonManager(feedbackId, tableNumber || ""));
                                    }
                                    setEscalationState('TIMER_RUNNING');
                                  }}
                                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow transition-colors text-sm"
                                >
                                  Yes, please
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (offerCompensation) {
                                      setEscalationState('RESOLVED_COMPENSATION');
                                    } else {
                                      setEscalationState('RESOLVED_SUCCESS');
                                    }
                                  }}
                                  className="flex-1 bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl border border-slate-200 transition-colors text-sm"
                                >
                                  No thanks
                                </button>
                              </div>
                            </div>
                          )}

                          {escalationState === 'TIMER_RUNNING' && (
                            <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center space-y-4">
                              <Clock className="w-12 h-12 text-red-400 mx-auto animate-pulse" />
                              <div>
                                <p className="text-sm font-bold text-red-900">A manager is on their way to {tableNumber ? `Table ${tableNumber}` : 'your table'}.</p>
                                <p className="text-3xl font-mono font-black text-red-600 mt-2">
                                  {Math.floor(timerLeft / 60).toString().padStart(2, '0')}:
                                  {(timerLeft % 60).toString().padStart(2, '0')}
                                </p>
                              </div>
                            </div>
                          )}

                          {escalationState === 'MANAGER_CHECK' && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                              <p className="text-sm font-bold text-slate-900 mb-2">Did a manager make it to your table?</p>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEscalationState('RESOLVED_SUCCESS')}
                                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl shadow transition-colors text-sm"
                                >
                                  Yes, they did
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (offerCompensation) {
                                      setEscalationState('RESOLVED_COMPENSATION');
                                    } else {
                                      setEscalationState('RESOLVED_SUCCESS');
                                    }
                                  }}
                                  className="flex-1 bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl border border-slate-200 transition-colors text-sm"
                                >
                                  No, they didn't
                                </button>
                              </div>
                            </div>
                          )}

                          {escalationState === 'RESOLVED_COMPENSATION' && (
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center space-y-4">
                              <p className="text-sm font-bold text-amber-900">We're sorry we couldn't make it to your table. Please accept this:</p>
                              {recoveryOffer && (
                                <div className="bg-white border border-amber-200 border-dashed rounded-xl p-3">
                                  <span className="font-mono text-sm font-bold tracking-widest text-amber-800 uppercase">{recoveryOffer}</span>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={async () => {
                                  if (feedbackId) {
                                    await import("@/app/menu/[id]/actions").then(m => m.submitRecoveryRequest(feedbackId, 'compensation', recoveryOffer));
                                    setHasSubmittedContact(true);
                                  }
                                }}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl shadow transition-colors text-sm"
                              >
                                Claim Compensation
                              </button>
                            </div>
                          )}

                          {(escalationState === 'RESOLVED_SUCCESS' || escalationState === 'RESOLVED_COMPENSATION' || escalationState === 'INITIAL') && (
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Want us to contact you later?</p>
                                <p className="text-xs text-slate-500 mb-2">Leave your phone number or email and we will contact you personally.</p>
                                <div className="flex gap-2">
                                  <PhoneInputField
                                    value={customerPhone}
                                    onChange={(val) => setCustomerPhone(val || "")}
                                    placeholder="Phone Number"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-sm focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400"
                                  />
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      if (customerPhone && feedbackId) {
                                        await import("@/app/menu/[id]/actions").then(m => {
                                          m.updateFeedbackContact(feedbackId, customerPhone);
                                          m.submitRecoveryRequest(feedbackId, 'contact_later');
                                        });
                                        setHasSubmittedContact(true);
                                      }
                                    }}
                                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-colors"
                                  >
                                    Send
                                  </button>
                                </div>
                            </div>
                          )}
                        </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          {escalationState === 'RESOLVED_COMPENSATION' && recoveryOffer && (
                            <div className="bg-slate-100 border border-slate-200 border-dashed rounded-xl p-4 text-center">
                              <span className="font-mono text-base font-bold tracking-widest text-slate-800 uppercase">{recoveryOffer}</span>
                              <p className="text-xs text-slate-500 mt-2">Show this to your server</p>
                            </div>
                          )}
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-sm text-slate-600">
                              <strong>Thank you.</strong> {recoveryMessage ? recoveryMessage.replace('{contact}', customerPhone || customerEmail) : "We will be in touch shortly."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Star Rating */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={async () => {
                            setRating(star);
                            if (!feedbackId) {
                              try {
                                const { initFeedback } = await import("@/app/menu/[id]/actions");
                                const res = await initFeedback(restaurantId, star, tableNumber || undefined, qrCodeId || undefined);
                                if (res.feedbackId) {
                                  setFeedbackId(res.feedbackId);
                                }
                              } catch (e) {
                                console.error("Failed to init feedback early", e);
                              }
                            }
                          }}
                          className="p-1 focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-10 h-10 transition-colors ${
                              (hoverRating || rating) >= star
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-100 text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-500 h-5">
                      {rating === 1 && "Poor"}
                      {rating === 2 && "Fair"}
                      {rating === 3 && "Good"}
                      {rating === 4 && "Very Good"}
                      {rating === 5 && "Excellent!"}
                    </span>
                  </div>

                  {/* Comment */}
                  <div className="space-y-2">
                    <label htmlFor="comment" className="block text-sm font-medium text-slate-700">
                      {rating > 0 && rating <= 3 
                        ? "What went wrong?" 
                        : "Additional feedback (optional)"}
                    </label>
                    <textarea
                      id="comment"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={
                        rating > 0 && rating <= 3 
                          ? "Please describe the issue clearly. We will do our best to make it right."
                          : "Tell us what you liked or what we can improve..."
                      }
                      className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-400 transition-colors resize-none"
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label htmlFor="customerName" className="block text-sm font-medium text-slate-700">
                        Name (optional)
                      </label>
                      <input
                        type="text"
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-400 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label htmlFor="customerEmail" className="block text-sm font-medium text-slate-700">
                          Email (optional)
                        </label>
                        <input
                          type="email"
                          id="customerEmail"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-400 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="customerPhone" className="block text-sm font-medium text-slate-700">
                          Phone (optional)
                        </label>
                        <PhoneInputField
                          id="customerPhone"
                          value={customerPhone}
                          onChange={(val) => setCustomerPhone(val || "")}
                          placeholder="Phone Number"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
