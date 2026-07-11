"use client";

import React from "react";
import { X, Search, Star, Leaf, Flame, Sparkles , Wifi } from "lucide-react";
import { useCart } from "../cart-context";
import { useMenuLogic } from "../use-menu-logic";
import { MenuThemeProps } from "../types";
import { FeedbackFAB } from "../feedback-fab";
import Image from "next/image";
import { getCurrencySymbol } from "@/lib/currency-options";

export function PopDinerTheme(props: MenuThemeProps) {
  const { restaurant, categories, items, tableNumber, qrCodeId } = props;
  const { addToCart } = useCart();
  
  const {
    state,
    setters,
    refs,
    handlers,
    computed
  } = useMenuLogic(categories, items);

  const { searchQuery, activeCategory, filterVeg, filterVegan, filterGF, filterSpicy, selectedItem, orderQuantity, layoutMode, orderNotes } = state;
  const { filteredItems } = computed;
  const { categoryRefs, categoryNavRef } = refs;

  const currencySign = getCurrencySymbol(restaurant.currency);

  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const canFeedback = currentPlan !== "free";
  const canOrder = currentPlan === "elite" || currentPlan === "enterprise";

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900 font-sans pb-32 selection:bg-rose-500 selection:text-white">
      {/* Diner Header */}
      <header className="relative w-full pt-16 pb-12 px-6 border-b-[8px] border-slate-900 bg-amber-300">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10 bg-white p-8 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <div className="mb-4 inline-block bg-rose-500 text-white font-black uppercase tracking-widest text-xs px-4 py-1 rounded-full border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-2">
            Welcome To
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-rose-500 mb-4 uppercase drop-shadow-[4px_4px_0px_rgba(15,23,42,1)]" style={{ WebkitTextStroke: '2px #0f172a' }}>
            {restaurant.name}
          </h1>

          <div className="text-sm sm:text-base font-bold uppercase tracking-wider text-sky-600 mb-8 border-b-4 border-sky-200 pb-2">
            {restaurant.cuisine_type || "Classic American Diner"}
          </div>
          
          {/* Diner Search */}
          <div className="w-full max-w-md relative group">
            <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-rose-500" />
            <input 
              type="text" 
              placeholder="Search the menu..." 
              value={searchQuery}
              onChange={(e) => setters.setSearchQuery(e.target.value)}
              className="w-full bg-white border-4 border-slate-900 text-slate-900 pl-12 pr-4 py-3 font-bold rounded-full focus:outline-none focus:border-rose-500 focus:shadow-[4px_4px_0px_0px_rgba(225,29,72,1)] transition-all placeholder-slate-400"
            />
          </div>
        </div>
      
        {restaurant.wifi_password && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm opacity-80 font-sans tracking-wide">
            <Wifi className="w-4 h-4" /> <span>{restaurant.wifi_password}</span>
          </div>
        )}
      </header>

      {/* Chunky Sticky Navigation */}
      <div className="sticky top-0 z-40 bg-sky-400 border-b-4 border-slate-900 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div ref={categoryNavRef} className="flex overflow-x-auto hide-scrollbar gap-3 pb-1 justify-start md:justify-center">
            {categories.map(cat => (
              <button
                key={cat.id}
                id={`nav-pill-${cat.id}`}
                onClick={() => handlers.scrollToCategory(cat.id)}
                className={`shrink-0 whitespace-nowrap px-6 py-2 rounded-full font-black text-sm uppercase transition-all border-2 border-slate-900 ${
                  activeCategory === cat.id 
                    ? "bg-rose-500 text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -translate-y-1" 
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content - Diner Grid Layout */}
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-24">
        {categories.map(cat => {
          const catItems = filteredItems.filter(i => i.category_id === cat.id);
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} id={`cat-${cat.id}`} ref={el => { categoryRefs.current[cat.id] = el; }} className="scroll-mt-32">
              
              <div className="flex items-center gap-4 mb-10">
                <div className="h-2 flex-grow bg-slate-900 rounded-full"></div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase text-slate-900 bg-amber-300 px-6 py-2 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] rotate-1">
                  {cat.name}
                </h2>
                <div className="h-2 flex-grow bg-slate-900 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {catItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    onClick={() => setters.setSelectedItem(item)}
                    className="group cursor-pointer bg-white rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-[12px_12px_0px_0px_rgba(225,29,72,1)] hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {item.image_url && (
                      <div className="w-full aspect-video relative overflow-hidden border-b-4 border-slate-900 bg-sky-100">
                        <Image 
                          src={item.image_url} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          fill 
                        />
                        <div className="absolute top-4 right-4 bg-amber-300 text-slate-900 font-black px-4 py-2 rounded-full border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rotate-3">
                          {currencySign}{item.price.toFixed(2)}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6 flex flex-col flex-grow relative">
                      {!item.image_url && (
                         <div className="absolute top-6 right-6 bg-amber-300 text-slate-900 font-black px-4 py-2 rounded-full border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rotate-3">
                           {currencySign}{item.price.toFixed(2)}
                         </div>
                      )}
                      
                      <h3 className={`font-black text-2xl text-slate-900 mb-2 pr-24 ${!item.image_url ? 'leading-tight' : ''}`}>
                        {item.name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.is_popular && <span className="text-[10px] uppercase tracking-wider bg-rose-500 text-white px-2 py-1 rounded-md font-bold border-2 border-slate-900">Popular</span>}
                        {item.is_vegetarian && <span className="text-[10px] uppercase tracking-wider bg-emerald-400 text-slate-900 px-2 py-1 rounded-md font-bold border-2 border-slate-900">Veg</span>}
                        {item.is_spicy && <span className="text-[10px] uppercase tracking-wider bg-orange-500 text-white px-2 py-1 rounded-md font-bold border-2 border-slate-900">Spicy</span>}
                      </div>

                      {item.description && (
                        <p className="text-slate-600 font-medium leading-relaxed mb-6">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="mt-auto">
                        <button className="w-full bg-sky-400 text-slate-900 font-black uppercase py-3 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:bg-rose-500 group-hover:text-white transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Pop Diner Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(225,29,72,1)] flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setters.setSelectedItem(null)} 
              className="absolute top-4 right-4 bg-white text-slate-900 border-4 border-slate-900 hover:bg-rose-500 hover:text-white p-2 rounded-full z-20 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-colors"
            >
              <X size={24} strokeWidth={3} />
            </button>
            
            <div className="overflow-y-auto flex-grow flex flex-col">
              {selectedItem.image_url && (
                <div className="w-full aspect-video relative bg-sky-100 border-b-4 border-slate-900 shrink-0">
                  <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" fill />
                </div>
              )}

              <div className="p-8 flex flex-col flex-grow">
                <div className="mb-6">
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 uppercase">
                    {selectedItem.name}
                  </h2>
                  <div className="text-3xl font-black text-rose-500 drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]">
                    {currencySign}{selectedItem.price.toFixed(2)}
                  </div>
                </div>
                
                {selectedItem.description && (
                  <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">
                    {selectedItem.description}
                  </p>
                )}

                {canOrder && (
                  <div className="space-y-6 max-w-sm w-full mt-auto">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                      <button onClick={() => setters.setOrderQuantity(Math.max(1, orderQuantity - 1))} className="w-12 h-12 bg-sky-400 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-sky-300 transition-colors flex items-center justify-center font-black text-2xl rounded-xl active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(15,23,42,1)]">-</button>
                      <span className="text-3xl font-black text-slate-900 w-12 text-center">{orderQuantity}</span>
                      <button onClick={() => setters.setOrderQuantity(orderQuantity + 1)} className="w-12 h-12 bg-rose-500 text-white border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-rose-400 transition-colors flex items-center justify-center font-black text-2xl rounded-xl active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(15,23,42,1)]">+</button>
                    </div>

                    {/* Preferences */}
                    <div>
                      <textarea 
                        value={orderNotes}
                        onChange={(e) => setters.setOrderNotes(e.target.value)}
                        placeholder="Any special requests? Tell the chef!"
                        className="w-full bg-slate-50 border-4 border-slate-900 text-slate-900 p-4 font-medium focus:outline-none focus:bg-white rounded-2xl resize-none h-24 placeholder-slate-400 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.05)]"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-slate-100 border-t-4 border-slate-900">
                <button 
                  onClick={() => {
                    if (canOrder) {
                      addToCart(selectedItem, orderQuantity, orderNotes);
                    }
                    setters.setSelectedItem(null);
                  }}
                  className="w-full py-4 bg-amber-300 text-slate-900 font-black uppercase text-lg border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] rounded-2xl hover:bg-amber-400 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
                >
                  {canOrder ? `Add to Order — ${currencySign}${(selectedItem.price * orderQuantity).toFixed(2)}` : "Back to menu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {canFeedback && <FeedbackFAB restaurantId={restaurant.id} tableNumber={tableNumber} qrCodeId={qrCodeId} />}
    </div>
  );
}
