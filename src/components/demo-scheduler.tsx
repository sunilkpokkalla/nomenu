"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, CheckCircle, ChevronRight, Loader2 } from "lucide-react";

// Generate next 7 days (excluding Sunday)
const getAvailableDates = () => {
  const dates = [];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  let count = 0;
  let offset = 1; // start from tomorrow
  
  while (count < 7) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    
    // Skip Sundays
    if (d.getDay() !== 0) {
      dates.push({
        dayName: daysOfWeek[d.getDay()],
        dayNum: d.getDate(),
        month: months[d.getMonth()],
        fullString: d.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      });
      count++;
    }
    offset++;
  }
  return dates;
};

// Available 15-minute time slots (9:00 AM to 5:00 PM)
const TIME_SLOTS = [
  "09:00 AM", "09:15 AM", "09:30 AM", "09:45 AM",
  "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
  "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
  "01:00 PM", "01:15 PM", "01:30 PM", "01:45 PM",
  "02:00 PM", "02:15 PM", "02:30 PM", "02:45 PM",
  "03:00 PM", "03:15 PM", "03:30 PM", "03:45 PM",
  "04:00 PM", "04:15 PM", "04:30 PM", "04:45 PM"
];

export function DemoScheduler() {
  const dates = getAvailableDates();
  
  const [selectedDate, setSelectedDate] = useState<typeof dates[0] | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"date" | "time" | "email" | "success">("date");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDateSelect = (date: typeof dates[0]) => {
    setSelectedDate(date);
    setStep("time");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("email");
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !selectedDate || !selectedTime) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/demo/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          date: selectedDate.fullString,
          time: selectedTime
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setStep("success");
      } else {
        throw new Error(data.error || "Failed to book slot");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "date") {
    return (
      <div className="w-full text-left">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-indigo-600" />
          Step 1: Select a Date
        </h4>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
          {dates.map((d, index) => (
            <button
              key={index}
              onClick={() => handleDateSelect(d)}
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-600 hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all group"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-indigo-500">{d.month}</span>
              <span className="text-2xl font-black text-slate-900 my-1 group-hover:text-indigo-600">{d.dayNum}</span>
              <span className="text-[11px] font-bold text-slate-500">{d.dayName}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "time") {
    return (
      <div className="w-full text-left">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Step 2: Pick a Time
          </h4>
          <button 
            onClick={() => setStep("date")} 
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            ← Back
          </button>
        </div>
        <p className="text-xs text-slate-500 font-bold mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          Selected Date: {selectedDate?.fullString}
        </p>
        <div className="grid grid-cols-3 gap-2 h-64 overflow-y-auto pr-1 select-scrollbar">
          {TIME_SLOTS.map((time, index) => (
            <button
              key={index}
              onClick={() => handleTimeSelect(time)}
              className="py-2.5 px-1 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-indigo-600 hover:bg-indigo-50/30 hover:text-indigo-600 transition-all text-center"
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "email") {
    return (
      <div className="w-full text-left">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            Step 3: Enter Details
          </h4>
          <button 
            onClick={() => setStep("time")} 
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            ← Back
          </button>
        </div>
        
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-5 text-xs text-slate-600 space-y-1">
          <p><strong>Walkthrough:</strong> 15-Minute 1-on-1 Demo</p>
          <p><strong>Date:</strong> {selectedDate?.fullString}</p>
          <p><strong>Time Slot:</strong> {selectedTime}</p>
        </div>

        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Your Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@restaurant.com"
              required
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-white"
            />
          </div>
          
          {error && (
            <p className="text-xs font-bold text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Booking Call...
              </>
            ) : (
              <>
                Confirm Booking
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full text-center py-6 flex flex-col items-center justify-center">
      <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">1-on-1 Demo Scheduled!</h3>
      <p className="text-sm text-slate-500 font-medium max-w-sm mb-6">
        We have reserved your slot for **{selectedTime}** on **{selectedDate?.fullString}**.
      </p>
      <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-left text-xs text-emerald-800 space-y-1">
        <p>✓ Check your email inbox for booking confirmation details.</p>
        <p>✓ A calendar event with a video link will be sent to <strong>{email}</strong> shortly.</p>
      </div>
    </div>
  );
}
