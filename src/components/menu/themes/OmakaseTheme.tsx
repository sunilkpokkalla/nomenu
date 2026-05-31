"use client";

import React from "react";
import { Leaf, Flame, Sparkles, Info, X } from "lucide-react";
import { useCart } from "../cart-context";
import { useMenuLogic } from "../use-menu-logic";
import { MenuThemeProps } from "../types";

import { FeedbackFAB } from "../feedback-fab";
import Image from "next/image";

export function OmakaseTheme(props: MenuThemeProps) {
  const { restaurant, categories, items } = props;
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

  const currencySymbol = restaurant.currency || "USD";
  const currencySign = currencySymbol === "EUR" ? "€" : currencySymbol === "GBP" ? "£" : "$";

  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const canFeedback = currentPlan !== "free";
  const canOrder = currentPlan === "elite" || currentPlan === "enterprise";

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#CCCCCC] font-sans pb-32">
      
      {/* Omakase Header */}
      <header className="px-6 py-20 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl tracking-[0.4em] font-light text-white uppercase mb-6">
          {restaurant.name}
        </h1>
        <div className="flex items-center justify-center gap-4 text-xs tracking-widest text-[#777777] uppercase">
          <span>{restaurant.cuisine_type || "Cuisine"}</span>
          <span className="w-1 h-1 rounded-full bg-[#333333]"></span>
          <span>{restaurant.address}</span>
        </div>
      </header>

      {/* Navigation & Filters - Clean, Borderless */}
      <div className="sticky top-0 z-40 bg-[#0F0F0F]/80 backdrop-blur-xl border-b border-[#222]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center">
          
          <div className="w-full sm:w-64 shrink-0 px-6 py-4">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setters.setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm tracking-wider text-white placeholder-[#555] focus:outline-none"
            />
          </div>

          <div className="flex-grow flex items-center overflow-x-auto scrollbar-none border-t sm:border-t-0 border-[#222]">
            <div 
              ref={categoryNavRef}
              className="flex px-6 py-4 gap-8 shrink-0"
            >
              {categories.map(cat => (
                <button
                  key={cat.id}
                  id={`nav-pill-${cat.id}`}
                  onClick={() => handlers.scrollToCategory(cat.id)}
                  className={`whitespace-nowrap text-[9px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    activeCategory === cat.id 
                      ? "text-white font-medium" 
                      : "text-[#555555] hover:text-[#AAAAAA]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <main className="max-w-2xl mx-auto px-6 pt-12 space-y-24">
        {categories.map(cat => {
          const catItems = filteredItems.filter(i => i.category_id === cat.id);
          if (catItems.length === 0) return null;

          return (
            <section 
              key={cat.id} 
              id={`cat-${cat.id}`}
              ref={el => { categoryRefs.current[cat.id] = el; }}
              className="scroll-mt-32"
            >
              <div className="mb-12 text-center">
                <h2 className="text-lg tracking-[0.25em] font-light text-white uppercase">{cat.name}</h2>
                {cat.description && (
                  <p className="mt-3 text-xs italic text-[#777777] max-w-md mx-auto">{cat.description}</p>
                )}
              </div>

              <div className={layoutMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-8" : "space-y-12"}>
                {catItems.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => setters.setSelectedItem(item)}
                    className={`group cursor-pointer flex ${layoutMode === "grid" ? "flex-col gap-4 text-center items-center" : "flex-col md:flex-row gap-6 items-center md:items-start"}`}
                  >
                    {item.image_url && (
                      <div className={`shrink-0 overflow-hidden bg-[#1A1A1A] relative ${layoutMode === "grid" ? "w-full aspect-square" : "w-full md:w-32 h-32 md:h-32"}`}>
                        <Image 
                          src={item.image_url} 
                          alt={item.name} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0" 
                        fill />
                      </div>
                    )}
                    
                    <div className={`flex-grow space-y-3 w-full ${layoutMode === "grid" ? "text-center" : "text-center md:text-left"}`}>
                      <div className={`flex ${layoutMode === "grid" ? "flex-col items-center gap-1" : "flex-col md:flex-row justify-between items-center md:items-baseline gap-2"}`}>
                        <h3 className="text-sm tracking-widest text-white uppercase group-hover:text-[#AAAAAA] transition-colors">{item.name}</h3>
                        <span className="text-sm tracking-wider text-[#888888]">{currencySign}{item.price.toFixed(2)}</span>
                      </div>
                      
                      {item.description && (
                        <p className="text-[11px] leading-relaxed text-[#777777] font-sans font-light">
                          {item.description}
                        </p>
                      )}
                      
                      <div className={`flex flex-wrap gap-3 pt-2 ${layoutMode === "grid" ? "justify-center" : "justify-center md:justify-start"}`}>
                        {item.is_vegetarian && <span className="text-[8px] uppercase tracking-widest text-[#555555]">Vegetarian</span>}
                        {item.is_vegan && <span className="text-[8px] uppercase tracking-widest text-[#555555]">Vegan</span>}
                        {item.is_gluten_free && <span className="text-[8px] uppercase tracking-widest text-[#555555]">Gluten Free</span>}
                        {item.is_spicy && <span className="text-[8px] uppercase tracking-widest text-[#555555]">Spicy</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Item Modal (Omakase) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg">
          <div className="bg-[#0F0F0F] border border-[#222] w-full max-w-xl flex flex-col max-h-[90vh]">
            
            <button 
              onClick={() => setters.setSelectedItem(null)}
              className="absolute top-6 right-6 text-[#555] hover:text-white transition-colors z-10"
            >
              <X size={24} strokeWidth={1} />
            </button>
            
            <div className="p-8 sm:p-12 flex flex-col flex-grow overflow-y-auto">
              
              {selectedItem.image_url && (
                <div className="w-full h-64 mb-10 overflow-hidden bg-[#1A1A1A] relative">
                  <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover grayscale opacity-90" fill />
                </div>
              )}
              
              <div className="text-center mb-8">
                <h2 className="text-xl tracking-[0.3em] font-light text-white uppercase mb-4">{selectedItem.name}</h2>
                <div className="text-[#888] tracking-widest">
                  {currencySign}{selectedItem.price.toFixed(2)}
                </div>
              </div>
              
              <p className="text-sm text-[#777] leading-relaxed text-center font-light mb-10 max-w-md mx-auto">
                {selectedItem.description}
              </p>

              {canOrder && (
                <div className="max-w-md mx-auto w-full space-y-8">
                  {/* Quantity */}
                  <div className="flex justify-between items-center border-b border-[#222] pb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#666]">Quantity</span>
                    <div className="flex items-center gap-6 text-white">
                      <button onClick={() => setters.setOrderQuantity(Math.max(1, orderQuantity - 1))} className="text-[#666] hover:text-white transition-colors px-2">-</button>
                      <span className="text-sm tracking-widest w-4 text-center">{orderQuantity}</span>
                      <button onClick={() => setters.setOrderQuantity(orderQuantity + 1)} className="text-[#666] hover:text-white transition-colors px-2">+</button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="border-b border-[#222] pb-4">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#666] mb-4">Requests</label>
                    <input 
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setters.setOrderNotes(e.target.value)}
                      placeholder="Special instructions..."
                      className="w-full bg-transparent text-sm text-white placeholder-[#444] focus:outline-none font-light"
                    />
                  </div>
                </div>
              )}

              <div className="mt-12 pt-8 text-center border-t border-[#222]">
                <button 
                  onClick={() => canOrder ? handlers.handleAddToCart() : setters.setSelectedItem(null)}
                  className="px-12 py-4 bg-white text-black text-[10px] tracking-[0.3em] uppercase hover:bg-[#CCC] transition-colors w-full sm:w-auto"
                >
                  {canOrder ? `Add to order — ${currencySign}${(selectedItem.price * orderQuantity).toFixed(2)}` : "Return"}
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
