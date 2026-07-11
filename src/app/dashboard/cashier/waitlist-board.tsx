"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Users, Clock, CheckCircle2, XCircle, UserPlus, Phone } from "lucide-react";
import { addWaitlistEntry, updateWaitlistStatus, getWaitlist } from "./actions";
import { FloorPlanBoard } from "./floor-plan-board";

type WaitlistEntry = {
  id: string;
  customer_name: string;
  party_size: number;
  phone_number: string | null;
  quoted_time_minutes: number | null;
  status: 'waiting' | 'seated' | 'cancelled' | 'no_show';
  created_at: string;
};

export function WaitlistBoard({ restaurantId, supabaseUrl, supabaseAnonKey, floorPlans, activeOrders }: { restaurantId: string, supabaseUrl: string, supabaseAnonKey: string, floorPlans: Record<string, unknown>[], activeOrders: Record<string, unknown>[] }) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmLeft, setConfirmLeft] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ customerName: "", partySize: 2, phoneNumber: "", quotedTime: 15 });
  const [seatingEntryId, setSeatingEntryId] = useState<string | null>(null);
  const [seatingError, setSeatingError] = useState<{compositeTableString: string, message: string} | null>(null);
  const router = useRouter();

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

  const handleUpdateStatus = async (id: string, status: 'seated' | 'cancelled' | 'no_show', tableId?: string, tableName?: string) => {
    if (isProcessing) return;
    setIsProcessing(id);
    try {
      await updateWaitlistStatus(id, status, tableId, tableName);
      setEntries(prev => prev.filter(e => e.id !== id));
      if (status === 'seated') {
        setSeatingEntryId(null);
        router.refresh(); // Force a fresh prop fetch to update activeOrders
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    } finally {
      setIsProcessing(null);
    }
  };

  if (loading) return <div className="animate-pulse flex gap-6"><div className="w-96 h-96 bg-slate-100 rounded-2xl" /></div>;

  if (seatingEntryId) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm mb-2">
          <div>
            <h3 className="font-bold text-2xl text-slate-900 tracking-tight">Select Table for Party</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Click an available table to assign the waitlist entry for <b>{entries.find(e => e.id === seatingEntryId)?.customer_name}</b> (Party of {entries.find(e => e.id === seatingEntryId)?.party_size}).
            </p>
          </div>
          <button onClick={() => {
            setSeatingEntryId(null);
            setSeatingError(null);
          }} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
            <XCircle className="w-5 h-5" /> Cancel Seating
          </button>
        </div>
        
        {seatingError && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-amber-800 text-center sm:text-left">{seatingError.message}</p>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setSeatingError(null)}
                className="px-4 py-2 bg-white text-slate-700 font-bold rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleUpdateStatus(seatingEntryId, 'seated', undefined, seatingError.compositeTableString);
                  setSeatingError(null);
                }}
                className="px-4 py-2 bg-amber-500 text-white font-bold rounded-lg shadow-sm hover:bg-amber-600 transition-colors"
              >
                Seat Anyway
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden p-2 sm:p-6">
          <FloorPlanBoard 
            restaurantId={restaurantId}
            initialFloorPlans={floorPlans}
            activeOrders={activeOrders}
            onSelectTable={(selectedTables, compositeTableString) => {
              const entry = entries.find(e => e.id === seatingEntryId);
              if (!entry) return;

              const tableCapacity = selectedTables.reduce((sum, t) => sum + (t.capacity || 0), 0);

              if (tableCapacity > 0 && tableCapacity < entry.party_size) {
                setSeatingError({
                  compositeTableString,
                  message: `Selected tables only seat ${tableCapacity} combined, but this party has ${entry.party_size} people. Are you sure you want to seat them here?`
                });
                return;
              }

              handleUpdateStatus(seatingEntryId, 'seated', undefined, compositeTableString);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/20 mb-2 border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tight">
          <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
            <Clock className="w-8 h-8 text-indigo-600" />
          </div>
          Waitlist <span className="bg-slate-900 text-white px-4 py-1 rounded-full text-lg font-bold ml-2 shadow-sm">{entries.length}</span>
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-6 py-3.5 rounded-2xl font-bold transition-all shadow-xl flex items-center gap-2 hover:-translate-y-0.5 ${
            showAddForm 
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none" 
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20"
          }`}
        >
          {showAddForm ? "Cancel" : <><UserPlus className="w-5 h-5" /> Add Party</>}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/20 mb-4 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Name</label>
              <input 
                type="text" 
                required 
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900 transition-all" 
                placeholder="John Doe"
                value={formData.customerName}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Party Size</label>
              <input 
                type="number" 
                required 
                min="1"
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900 transition-all" 
                value={formData.partySize}
                onChange={e => setFormData({...formData, partySize: parseInt(e.target.value) || 1})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Phone (Optional)</label>
              <input 
                type="tel" 
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900 transition-all" 
                placeholder="(555) 555-5555"
                value={formData.phoneNumber}
                onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Quoted Wait (Mins)</label>
              <input 
                type="number" 
                min="0"
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900 transition-all" 
                value={formData.quotedTime}
                onChange={e => setFormData({...formData, quotedTime: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={isProcessing === "add"}
              className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all hover:-translate-y-0.5 shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              Add to Waitlist
            </button>
          </div>
        </form>
      )}

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-32 bg-white rounded-[3rem] shadow-xl shadow-slate-200/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-white/20" />
          <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 relative z-10 shadow-sm border border-slate-100 rotate-3">
            <Users className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight relative z-10">Waitlist is Empty</h3>
          <p className="text-slate-500 mt-3 max-w-md relative z-10 font-medium leading-relaxed">No one is currently waiting for a table. Add a party to get started.</p>
          {!showAddForm && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="mt-10 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20 flex items-center gap-2 relative z-10"
            >
              <UserPlus className="w-5 h-5" /> Add First Party
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* Entries Mapping Helper */}
          {[entries.slice(0, 15), entries.slice(15)].map((columnEntries, colIndex) => {
            if (columnEntries.length === 0) return null;
            return (
              <div key={colIndex} className="flex flex-col gap-4">
                {columnEntries.map((entry) => {
                  const waitTimeMin = Math.floor((new Date().getTime() - new Date(entry.created_at).getTime()) / 60000);
                  const isOverdue = entry.quoted_time_minutes ? waitTimeMin > entry.quoted_time_minutes : false;

                  return (
                    <div key={entry.id} className="bg-white rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm border border-slate-200">
                      
                      <div className="flex items-center gap-3 flex-1">
                        {/* Status / Wait Time Badge */}
                        <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0 border ${isOverdue ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                          <span className="text-lg font-bold tracking-tighter">{waitTimeMin}</span>
                          <span className="text-[9px] font-bold uppercase leading-none mt-0.5">Min</span>
                        </div>
                        
                        {/* Core Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-slate-900 truncate mb-0.5">{entry.customer_name}</h4>
                          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> {entry.party_size}</span>
                            {entry.phone_number && (
                              <span className="flex items-center gap-1 truncate"><Phone className="w-3.5 h-3.5 text-slate-400" /> {entry.phone_number}</span>
                            )}
                            {entry.quoted_time_minutes && (
                              <span className="flex items-center gap-1 text-slate-400 hidden sm:flex">
                                <Clock className="w-3 h-3" /> Quoted: {entry.quoted_time_minutes}m
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                        <button 
                          onClick={() => handleUpdateStatus(entry.id, 'no_show')}
                          className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 font-semibold hover:bg-orange-100 transition-colors text-xs border border-orange-100"
                        >
                          Left
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(entry.id, 'cancelled')}
                          className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors text-xs border border-slate-200"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => setSeatingEntryId(entry.id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all text-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Seat
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
