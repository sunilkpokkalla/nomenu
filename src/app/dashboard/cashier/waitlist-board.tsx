"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Users, Clock, CheckCircle2, XCircle, UserPlus, Phone } from "lucide-react";
import { addWaitlistEntry, updateWaitlistStatus, getWaitlist } from "./actions";

type WaitlistEntry = {
  id: string;
  customer_name: string;
  party_size: number;
  phone_number: string | null;
  quoted_time_minutes: number | null;
  status: 'waiting' | 'seated' | 'cancelled' | 'no_show';
  created_at: string;
};

export function WaitlistBoard({ restaurantId, supabaseUrl, supabaseAnonKey }: { restaurantId: string; supabaseUrl: string; supabaseAnonKey: string }) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ customerName: "", partySize: 2, phoneNumber: "", quotedTime: 15 });

  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    fetchWaitlist();

    const channel = supabase.channel(`waitlist_${restaurantId}`)
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'waitlist', filter: `restaurant_id=eq.${restaurantId}` }, 
          () => {
             fetchWaitlist();
          }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId, supabaseUrl, supabaseAnonKey]);

  const fetchWaitlist = async () => {
    try {
      const data = await getWaitlist(restaurantId);
      setEntries(data as WaitlistEntry[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || formData.partySize < 1) return;
    
    setIsProcessing("add");
    try {
      await addWaitlistEntry(restaurantId, formData);
      setFormData({ customerName: "", partySize: 2, phoneNumber: "", quotedTime: 15 });
      setShowAddForm(false);
      fetchWaitlist();
    } catch (error) {
      console.error(error);
      alert("Failed to add to waitlist");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'seated' | 'cancelled' | 'no_show') => {
    if (isProcessing) return;
    setIsProcessing(id);
    try {
      await updateWaitlistStatus(id, status);
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    } finally {
      setIsProcessing(null);
    }
  };

  if (loading) return <div className="animate-pulse flex gap-6"><div className="w-96 h-96 bg-slate-100 rounded-2xl" /></div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm mb-2">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Clock className="w-6 h-6 text-indigo-600" />
          </div>
          Waitlist <span className="bg-slate-100 text-slate-600 px-3 py-0.5 rounded-full text-sm font-bold ml-2">{entries.length}</span>
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 hover:scale-[1.02] ${
            showAddForm 
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20"
          }`}
        >
          {showAddForm ? "Cancel" : <><UserPlus className="w-5 h-5" /> Add Party</>}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Name</label>
              <input 
                type="text" 
                required 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900" 
                placeholder="John Doe"
                value={formData.customerName}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Party Size</label>
              <input 
                type="number" 
                required 
                min="1"
                className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900" 
                value={formData.partySize}
                onChange={e => setFormData({...formData, partySize: parseInt(e.target.value) || 1})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Phone (Optional)</label>
              <input 
                type="tel" 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900" 
                placeholder="(555) 555-5555"
                value={formData.phoneNumber}
                onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Quoted Wait (Mins)</label>
              <input 
                type="number" 
                min="0"
                className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900" 
                value={formData.quotedTime}
                onChange={e => setFormData({...formData, quotedTime: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isProcessing === "add"}
              className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              Add to Waitlist
            </button>
          </div>
        </form>
      )}

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 bg-white border border-slate-200/60 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white/20" />
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-sm border border-slate-100 rotate-3">
            <Users className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight relative z-10">Waitlist is Empty</h3>
          <p className="text-slate-500 mt-2 max-w-sm relative z-10 font-medium leading-relaxed">No one is currently waiting for a table. Add a party to get started.</p>
          {!showAddForm && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="mt-8 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-md flex items-center gap-2 relative z-10"
            >
              <UserPlus className="w-4 h-4" /> Add First Party
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {entries.map(entry => {
            const waitTimeMin = Math.floor((new Date().getTime() - new Date(entry.created_at).getTime()) / 60000);
            const isOverdue = entry.quoted_time_minutes ? waitTimeMin > entry.quoted_time_minutes : false;

            return (
              <div key={entry.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className={`p-5 flex items-start justify-between ${isOverdue ? "bg-rose-50 border-b border-rose-100" : "bg-slate-50 border-b border-slate-100"}`}>
                  <div>
                    <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">Party Name</div>
                    <div className={`text-xl font-black ${isOverdue ? "text-rose-900" : "text-slate-900"}`}>{entry.customer_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">Wait Time</div>
                    <div className={`text-xl font-black ${isOverdue ? "text-rose-600" : "text-slate-600"}`}>{waitTimeMin}m</div>
                  </div>
                </div>

                <div className="p-5 flex-1 space-y-3">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><Users className="w-4 h-4 text-slate-500" /></div>
                    Party of {entry.party_size}
                  </div>
                  {entry.phone_number && (
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><Phone className="w-4 h-4 text-slate-500" /></div>
                      {entry.phone_number}
                    </div>
                  )}
                  {entry.quoted_time_minutes && (
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><Clock className="w-4 h-4 text-slate-500" /></div>
                      Quoted: {entry.quoted_time_minutes}m
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(entry.id, 'seated')}
                    disabled={isProcessing === entry.id}
                    className="w-full bg-emerald-500 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark as Seated
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateStatus(entry.id, 'no_show')}
                      disabled={isProcessing === entry.id}
                      className="flex-1 bg-white border border-slate-200 text-slate-600 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors disabled:opacity-50 text-xs"
                    >
                      No Show
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(entry.id, 'cancelled')}
                      disabled={isProcessing === entry.id}
                      className="flex-1 bg-white border border-slate-200 text-rose-500 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors disabled:opacity-50 text-xs"
                    >
                      <XCircle className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
