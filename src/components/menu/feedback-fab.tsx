"use client";

import { useState } from "react";
import { MessageSquare, Star, X, CheckCircle2 } from "lucide-react";
import { submitFeedback } from "@/app/menu/[id]/actions";

interface FeedbackFABProps {
  restaurantId: string;
  tableNumber?: string;
  qrCodeId?: string;
}

export function FeedbackFAB({ restaurantId, tableNumber, qrCodeId }: FeedbackFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loyaltyCardId, setLoyaltyCardId] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const result = await submitFeedback(restaurantId, rating, comment, customerName, contactInfo, tableNumber, qrCodeId);

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setIsSuccess(true);
      if (result.feedbackId) {
        setFeedbackId(result.feedbackId);
      }
      if (result.loyaltyCardId) {
        setLoyaltyCardId(result.loyaltyCardId);
        // Save to browser memory
        try {
          const storedCards = JSON.parse(localStorage.getItem('nomenu_loyalty_cards') || '{}');
          storedCards[restaurantId] = result.loyaltyCardId;
          localStorage.setItem('nomenu_loyalty_cards', JSON.stringify(storedCards));
        } catch (e) {
          console.error("Failed to save loyalty card to local storage", e);
        }
      }
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-slate-900 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-500"
        aria-label="Leave Feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg text-slate-900">How was your experience?</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                  {rating >= 4 ? (
                    <>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Thank you!</h4>
                      <p className="text-slate-500 mb-6">Your feedback helps us improve.</p>
                      
                      {loyaltyCardId && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 w-full animate-in zoom-in-95 duration-500 delay-150 fill-mode-both">
                          <div className="flex justify-center mb-3">
                            <Star className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse" />
                          </div>
                          <h5 className="font-bold text-amber-900 text-lg mb-2">You unlocked a VIP Card!</h5>
                          <p className="text-amber-700 text-sm mb-4">
                            As a thank you for your {rating}-star review, click below to claim your digital loyalty card.
                          </p>
                          <a 
                            href={`/loyalty/${loyaltyCardId}`}
                            className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-center"
                          >
                            Claim My Card
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-6 w-full animate-in zoom-in-95 duration-500">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <MessageSquare className="w-8 h-8 text-slate-400" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">We're so sorry.</h4>
                      <p className="text-slate-600 text-sm">
                        We clearly missed the mark today, and we want to make it right. Please give us a second chance on your next visit with this discount code:
                      </p>
                      
                      <div className="bg-slate-100 border border-slate-200 border-dashed rounded-xl p-4 text-center">
                        <span className="font-mono text-lg font-bold tracking-widest text-slate-800 uppercase">MAKEITRIGHT15</span>
                        <p className="text-xs text-slate-500 mt-2">Show this to your server for 15% off</p>
                      </div>

                      {!contactInfo ? (
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                          <p className="text-sm font-semibold text-slate-900">Want the manager to reach out?</p>
                          <p className="text-xs text-slate-500">Leave your phone number or email and we will contact you personally.</p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={contactInfo}
                              onChange={(e) => setContactInfo(e.target.value)}
                              placeholder="Email or Phone"
                              className="flex-1 rounded-xl border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-400"
                            />
                            <button
                              type="button"
                              onClick={async () => {
                                if (contactInfo && feedbackId) {
                                  await import("@/app/menu/[id]/actions").then(m => m.updateFeedbackContact(feedbackId, contactInfo));
                                  alert("Thank you. A manager will reach out soon.");
                                  setIsOpen(false);
                                }
                              }}
                              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-colors"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-sm text-slate-600">
                            <strong>Thank you.</strong> Our manager has been notified and will reach out to you at {contactInfo} to apologize personally.
                          </p>
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
                          onClick={() => setRating(star)}
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
                      Additional feedback (optional)
                    </label>
                    <textarea
                      id="comment"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us what you liked or what we can improve..."
                      className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-400 transition-colors resize-none"
                    />
                  </div>

                  {/* Optional Contact Info */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500 font-medium">
                      Want us to follow up? Leave your details below (Optional).
                    </p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-400 transition-colors"
                      />
                      <input
                        type="text"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="Email or Phone Number"
                        className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-400 transition-colors"
                      />
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
