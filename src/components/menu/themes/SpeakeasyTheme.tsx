"use client";

import React from "react";
import { X, Martini } from "lucide-react";
import { useCart } from "../cart-context";
import { useMenuLogic } from "../use-menu-logic";
import { MenuThemeProps } from "../types";
import { FeedbackFAB } from "../feedback-fab";
import Image from "next/image";

export function SpeakeasyTheme(props: MenuThemeProps) {
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
    <div className="min-h-screen bg-[#0A0A0A] text-[#D4AF37] font-serif pb-32" style={{ backgroundImage: "radial-gradient(#1A1A1A 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
      
      {/* Speakeasy Header */}
      <header className="px-6 pt-16 pb-12 text-center border-b border-[#D4AF37]/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,rgba(0,0,0,0)_70%)]"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <Martini className="w-8 h-8 text-[#D4AF37] mb-6 opacity-70" strokeWidth={1} />
          
          <h1 className="text-4xl sm:text-5xl tracking-[0.2em] uppercase text-[#F3E5AB] font-light mb-4" style={{ textShadow: "0 0 20px rgba(212,175,55,0.3)" }}>
            {restaurant.name}
          </h1>
          
          <div className="flex items-center justify-center gap-4 w-full max-w-xs mb-4 opacity-60">
            <div className="h-px bg-[#D4AF37] flex-1"></div>
            <p className="text-[10px] tracking-[0.3em] uppercase whitespace-nowrap">
              {restaurant.cuisine_type || "Provisions"}
            </p>
            <div className="h-px bg-[#D4AF37] flex-1"></div>
          </div>
          
          <p className="text-xs text-[#D4AF37] opacity-50 tracking-widest uppercase">
            {restaurant.address}
          </p>
        </div>
      </header>

      {/* Categories Navigation & Search */}
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-6 justify-between items-center">
          
          <div 
            ref={categoryNavRef}
            className="flex overflow-x-auto scrollbar-none justify-start gap-8 w-full sm:w-auto"
          >
            {categories.map(cat => (
              <button
                key={cat.id}
                id={`nav-pill-${cat.id}`}
                onClick={() => handlers.scrollToCategory(cat.id)}
                className={`whitespace-nowrap pb-2 text-sm tracking-[0.2em] uppercase transition-all duration-500 relative ${
                  activeCategory === cat.id 
                    ? "text-[#F3E5AB]" 
                    : "text-[#D4AF37]/50 hover:text-[#D4AF37]"
                }`}
              >
                {cat.name}
                {activeCategory === cat.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-px bg-[#F3E5AB] shadow-[0_0_8px_#F3E5AB]"></div>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <div className="relative w-full sm:w-48">
              <input 
                type="text" 
                placeholder="Inquire..." 
                value={searchQuery}
                onChange={(e) => setters.setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-[#D4AF37]/30 pb-1 text-sm tracking-[0.1em] text-[#D4AF37] placeholder-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
            <div className="flex gap-4 items-center">
              <button 
                onClick={() => setters.setLayoutMode(layoutMode === "grid" ? "list" : "grid")}
                className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors mr-2"
                title="Toggle View"
              >
                {layoutMode === "grid" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                )}
              </button>
              <button 
                onClick={() => setters.setFilterVeg(!filterVeg)}
                className={`text-[10px] tracking-[0.2em] uppercase transition-all ${filterVeg ? "text-[#F3E5AB] border-b border-[#F3E5AB]" : "text-[#D4AF37]/50 hover:text-[#D4AF37]"}`}
              >
                Veg
              </button>
              <button 
                onClick={() => setters.setFilterVegan(!filterVegan)}
                className={`text-[10px] tracking-[0.2em] uppercase transition-all ${filterVegan ? "text-[#F3E5AB] border-b border-[#F3E5AB]" : "text-[#D4AF37]/50 hover:text-[#D4AF37]"}`}
              >
                Vgn
              </button>
              <button 
                onClick={() => setters.setFilterGF(!filterGF)}
                className={`text-[10px] tracking-[0.2em] uppercase transition-all ${filterGF ? "text-[#F3E5AB] border-b border-[#F3E5AB]" : "text-[#D4AF37]/50 hover:text-[#D4AF37]"}`}
              >
                GF
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Menu Content */}
      <main className="p-4 sm:p-8 max-w-4xl mx-auto space-y-20 mt-8">
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
              <div className="mb-10 text-center">
                <h2 className="text-2xl tracking-[0.3em] uppercase text-[#D4AF37] font-light inline-block relative">
                  {cat.name}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-[1px] bg-[#D4AF37]/30"></div>
                </h2>
                {cat.description && (
                  <p className="mt-8 text-xs text-[#D4AF37]/60 tracking-wider max-w-lg mx-auto italic">{cat.description}</p>
                )}
              </div>

              <div className={layoutMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10" : "flex flex-col gap-10 max-w-2xl mx-auto"}>
                {catItems.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => setters.setSelectedItem(item)}
                    className={`group cursor-pointer flex relative ${layoutMode === "list" ? "flex-col sm:flex-row gap-6 items-center sm:items-start" : "flex-col"}`}
                  >
                    {layoutMode === "list" && item.image_url && (
                      <div className="w-full sm:w-32 aspect-square border border-[#D4AF37]/20 relative group-hover:border-[#D4AF37]/40 transition-colors p-1 shrink-0">
                        <div className="w-full h-full relative overflow-hidden">
                          <Image src={item.image_url} alt={item.name} className="w-full h-full object-cover grayscale sepia-[0.3] contrast-125 opacity-80" fill />
                          <div className="absolute inset-0 bg-[#D4AF37] mix-blend-overlay opacity-10"></div>
                        </div>
                      </div>
                    )}
                    <div className="flex-grow w-full flex flex-col">
                      <div className="flex justify-between items-baseline gap-4">
                        <h3 className="text-lg tracking-wider text-[#F3E5AB] group-hover:text-white transition-colors duration-300">
                          {item.name}
                        </h3>
                        <div className="flex-1 border-b border-dotted border-[#D4AF37]/30 mx-2 relative top-[-6px] group-hover:border-[#D4AF37]/60 transition-colors duration-300"></div>
                        <span className="text-lg text-[#D4AF37] shrink-0">
                          {currencySign}{item.price.toFixed(2)}
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-[#D4AF37]/60 mt-2 leading-relaxed tracking-wide group-hover:text-[#D4AF37]/80 transition-colors duration-300">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-3 mt-3">
                        {item.is_popular && <span className="text-[9px] tracking-widest uppercase text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded-sm">Signature</span>}
                        {item.is_vegetarian && <span className="text-[9px] tracking-widest uppercase text-[#8FBC8F] border border-[#8FBC8F]/30 px-2 py-0.5 rounded-sm">V</span>}
                        {item.is_spicy && <span className="text-[9px] tracking-widest uppercase text-[#ff6b6b] border border-[#ff6b6b]/30 px-2 py-0.5 rounded-sm">Spicy</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Item Modal (Speakeasy) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0A0A0A] border border-[#D4AF37]/30 w-full max-w-md flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(212,175,55,0.1)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
            
            <button 
              onClick={() => setters.setSelectedItem(null)}
              className="absolute top-4 right-4 text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors z-10"
            >
              <X size={24} strokeWidth={1} />
            </button>
            
            <div className="p-8 flex flex-col flex-grow overflow-y-auto">
              
              <div className="text-center mb-8 mt-4">
                <h2 className="text-2xl tracking-[0.2em] uppercase text-[#F3E5AB] font-light mb-4">{selectedItem.name}</h2>
                <div className="w-8 h-px bg-[#D4AF37]/40 mx-auto mb-4"></div>
                <div className="text-xl text-[#D4AF37]">
                  {currencySign}{selectedItem.price.toFixed(2)}
                </div>
              </div>
              
              {selectedItem.image_url && (
                <div className="w-full aspect-square border border-[#D4AF37]/20 mb-8 relative group p-2">
                  <div className="w-full h-full relative overflow-hidden">
                    <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover grayscale sepia-[0.3] contrast-125 opacity-80" fill />
                    <div className="absolute inset-0 bg-[#D4AF37] mix-blend-overlay opacity-10"></div>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-[#D4AF37]/70 leading-loose tracking-wide text-center italic mb-10">
                "{selectedItem.description}"
              </p>

              {canOrder && (
                <div className="max-w-xs mx-auto w-full space-y-6 mb-8">
                  {/* Quantity */}
                  <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-3">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/60">Quantity</span>
                    <div className="flex items-center gap-6 text-[#D4AF37]">
                      <button onClick={() => setters.setOrderQuantity(Math.max(1, orderQuantity - 1))} className="text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors px-2">-</button>
                      <span className="text-sm tracking-widest w-4 text-center">{orderQuantity}</span>
                      <button onClick={() => setters.setOrderQuantity(orderQuantity + 1)} className="text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors px-2">+</button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="border-b border-[#D4AF37]/20 pb-3">
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#D4AF37]/60 mb-3">Special Instructions</label>
                    <input 
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setters.setOrderNotes(e.target.value)}
                      placeholder="Your request..."
                      className="w-full bg-transparent text-sm text-[#D4AF37] placeholder-[#D4AF37]/30 focus:outline-none font-light italic"
                    />
                  </div>
                </div>
              )}

              <div className="mt-auto pt-6 border-t border-[#D4AF37]/20">
                <button 
                  onClick={() => canOrder ? handlers.handleAddToCart() : setters.setSelectedItem(null)}
                  className="w-full py-4 bg-transparent text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 text-xs tracking-[0.3em] uppercase transition-all duration-300"
                >
                  {canOrder ? `Request Addition — ${currencySign}${(selectedItem.price * orderQuantity).toFixed(2)}` : "Depart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {canFeedback && <FeedbackFAB restaurantId={restaurant.id} />}
    </div>
  );
}
