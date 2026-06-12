"use client";

import { useState } from "react";
import { Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface SupportFormProps {
  userEmail: string;
  restaurantName: string;
}

export function SupportForm({ userEmail, restaurantName }: SupportFormProps) {
  const [subject, setSubject] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [urgency, setUrgency] = useState("Normal");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          urgency,
          message,
          userEmail,
          restaurantName,
          contactNumber
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send ticket.");
      }

      setStatus("success");
      setSubject("");
      setMessage("");
      setUrgency("Normal");
      setContactNumber("");
      
    } catch (err) {
      console.error(err);
      setStatus("error");
      const errMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setErrorMessage(errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Ticket Sent Successfully!</h3>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          Our support team has received your request and will get back to you at <strong className="text-slate-700">{userEmail}</strong> as soon as possible.
        </p>
        <button 
          onClick={() => setStatus("idle")}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-8 rounded-xl transition-colors"
        >
          Submit Another Ticket
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {status === "error" && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-rose-900">Failed to send ticket</h4>
            <p className="text-sm text-rose-700 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 opacity-60">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">From Email</label>
          <input 
            type="email" 
            disabled 
            value={userEmail} 
            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed font-medium"
          />
        </div>
        
        <div className="space-y-2 opacity-60">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Restaurant</label>
          <input 
            type="text" 
            disabled 
            value={restaurantName} 
            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed font-medium"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Subject <span className="text-rose-500">*</span></label>
        <input 
          type="text" 
          required
          placeholder="Briefly describe the issue..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-white border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-slate-900 font-medium transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Contact Number (Optional)</label>
          <input 
            type="tel" 
            placeholder="e.g. +1 (555) 000-0000"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="w-full bg-white border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-slate-900 font-medium transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Urgency</label>
          <select 
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full bg-white border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-slate-900 font-medium transition-all appearance-none"
          >
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Detailed Message <span className="text-rose-500">*</span></label>
        <textarea 
          required
          rows={6}
          placeholder="Please provide as much detail as possible..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-white border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-slate-900 font-medium transition-all resize-none"
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !subject || !message}
          className="bg-indigo-600 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending Ticket...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Support Ticket
            </>
          )}
        </button>
      </div>

    </form>
  );
}
