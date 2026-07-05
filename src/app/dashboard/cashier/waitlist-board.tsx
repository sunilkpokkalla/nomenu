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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* First Column (1-15) */}
          <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {entries.slice(0, 15).map((entry, index, arr) => {
              const waitTimeMin = Math.floor((new Date().getTime() - new Date(entry.created_at).getTime()) / 60000);
              const isOverdue = entry.quoted_time_minutes ? waitTimeMin > entry.quoted_time_minutes : false;

              return (
                <div key={entry.id} className={`flex items-center justify-between p-3 ${index !== arr.length - 1 ? 'border-b border-slate-100' : ''} ${isOverdue ? 'bg-rose-50/50 hover:bg-rose-50' : 'hover:bg-slate-50'} transition-colors`}>
                  
                  <div className="flex items-center gap-4 flex-1 overflow-hidden">
                    {/* Ultra Compact Wait Time */}
                    <div className={`text-sm font-black w-10 text-center shrink-0 ${isOverdue ? 'text-rose-600' : 'text-slate-600'}`}>
                      {waitTimeMin}m
                    </div>
                    
                    <div className="w-px h-6 bg-slate-200 shrink-0" />

                    {/* Core Info - Table Style */}
                    <div className={`text-sm font-bold w-32 truncate shrink-0 ${isOverdue ? 'text-rose-900' : 'text-slate-900'}`}>
                      {entry.customer_name}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 w-48 shrink-0">
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> {entry.party_size}</span>
                      {entry.phone_number && (
                        <span className="flex items-center gap-1.5 truncate"><Phone className="w-3.5 h-3.5 text-slate-400" /> {entry.phone_number}</span>
                      )}
                    </div>
                    
                    {entry.quoted_time_minutes && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hidden sm:flex shrink-0">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {entry.quoted_time_minutes}m
                      </div>
                    )}
                  </div>

                  {/* Compact Actions */}
                  <div className="flex items-center gap-1 shrink-0 ml-4">
                    <button 
                      onClick={() => handleUpdateStatus(entry.id, 'no_show')}
                      disabled={isProcessing === entry.id}
                      className="px-2 py-1.5 bg-transparent text-slate-600 rounded-md font-medium hover:bg-slate-100 transition-colors disabled:opacity-50 text-xs"
                      title="No Show"
                    >
                      No Show
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(entry.id, 'cancelled')}
                      disabled={isProcessing === entry.id}
                      className="px-2 py-1.5 bg-transparent text-slate-600 rounded-md font-medium hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50 text-xs"
                      title="Cancel"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setSeatingEntryId(entry.id)}
                      disabled={isProcessing === entry.id}
                      className="px-4 py-1.5 bg-emerald-500 text-white rounded-md font-bold flex items-center gap-1.5 hover:bg-emerald-600 transition-colors disabled:opacity-50 shadow-sm text-xs ml-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Seat
                    </button>
                  </div>
                  
                </div>
              );
            })}
          </div>

          {/* Second Column (16+) */}
          {entries.length > 15 && (
            <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
              {entries.slice(15).map((entry, index, arr) => {
                const waitTimeMin = Math.floor((new Date().getTime() - new Date(entry.created_at).getTime()) / 60000);
                const isOverdue = entry.quoted_time_minutes ? waitTimeMin > entry.quoted_time_minutes : false;

                return (
                  <div key={entry.id} className={`flex items-center justify-between p-3 ${index !== arr.length - 1 ? 'border-b border-slate-100' : ''} ${isOverdue ? 'bg-rose-50/50 hover:bg-rose-50' : 'hover:bg-slate-50'} transition-colors`}>
                    
                    <div className="flex items-center gap-4 flex-1 overflow-hidden">
                      {/* Ultra Compact Wait Time */}
                      <div className={`text-sm font-black w-10 text-center shrink-0 ${isOverdue ? 'text-rose-600' : 'text-slate-600'}`}>
                        {waitTimeMin}m
                      </div>
                      
                      <div className="w-px h-6 bg-slate-200 shrink-0" />

                      {/* Core Info - Table Style */}
                      <div className={`text-sm font-bold w-32 truncate shrink-0 ${isOverdue ? 'text-rose-900' : 'text-slate-900'}`}>
                        {entry.customer_name}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs font-medium text-slate-500 w-48 shrink-0">
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> {entry.party_size}</span>
                        {entry.phone_number && (
                          <span className="flex items-center gap-1.5 truncate"><Phone className="w-3.5 h-3.5 text-slate-400" /> {entry.phone_number}</span>
                        )}
                      </div>
                      
                      {entry.quoted_time_minutes && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hidden sm:flex shrink-0">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {entry.quoted_time_minutes}m
                        </div>
                      )}
                    </div>

                    {/* Compact Actions */}
                    <div className="flex items-center gap-1 shrink-0 ml-4">
                      <button 
                        onClick={() => handleUpdateStatus(entry.id, 'no_show')}
                        disabled={isProcessing === entry.id}
                        className="px-2 py-1.5 bg-transparent text-slate-600 rounded-md font-medium hover:bg-slate-100 transition-colors disabled:opacity-50 text-xs"
                        title="No Show"
                      >
                        No Show
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(entry.id, 'cancelled')}
                        disabled={isProcessing === entry.id}
                        className="px-2 py-1.5 bg-transparent text-slate-600 rounded-md font-medium hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50 text-xs"
                        title="Cancel"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => setSeatingEntryId(entry.id)}
                        disabled={isProcessing === entry.id}
                        className="px-4 py-1.5 bg-emerald-500 text-white rounded-md font-bold flex items-center gap-1.5 hover:bg-emerald-600 transition-colors disabled:opacity-50 shadow-sm text-xs ml-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Seat
                      </button>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
