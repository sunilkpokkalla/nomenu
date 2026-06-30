"use client";

import React from "react";
import { X, Search, Star, Leaf, Flame, Sparkles } from "lucide-react";
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
  const currencySymbol = currencySign;

  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const canFeedback = currentPlan !== "free";
  const canOrder = currentPlan === "elite" || currentPlan === "enterprise";

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#121212] font-sans pb-32">
      {/* Luxury Editorial Header */}
      <header className="relative w-full pt-20 pb-16 px-6 sm:px-12 flex flex-col items-center text-center bg-[#FAFAFA]">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-8 flex items-center justify-center gap-4 text-[#8B1E28]">
            <span className="h-[1px] w-12 bg-[#8B1E28]/30"></span>
            <Sparkles size={16} strokeWidth={1.5} />
            <span className="h-[1px] w-12 bg-[#8B1E28]/30"></span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-light tracking-widest uppercase text-[#121212] mb-6" style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
            {restaurant.name}
          </h1>

          <div className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.3em] text-[#666666] mb-12">
            {restaurant.cuisine_type || "Exquisite Dining"}
          </div>
          
          {/* Subtle Search */}
          <div className="w-full max-w-md relative group">
            <Search className="absolute left-0 top-3 h-4 w-4 text-[#999999] transition-colors group-focus-within:text-[#8B1E28]" />
            <input 
              type="text" 
              placeholder="Discover our menu..." 
              value={searchQuery}
              onChange={(e) => setters.setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-[#E5E5E5] text-[#121212] pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-[#8B1E28] transition-colors placeholder-[#999999]"
            />
          </div>
        </div>
      </header>

      <div className="relative z-10 border-t border-[#E5E5E5]">
        {/* Elegant Sticky Navigation */}
        <div className="sticky top-0 z-40 bg-[#FAFAFA]/95 backdrop-blur-md border-b border-[#E5E5E5] py-4">
          <div className="max-w-5xl mx-auto px-6">
            <div ref={categoryNavRef} className="flex overflow-x-auto scrollbar-none gap-8 sm:gap-12 pb-1 justify-start md:justify-center">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  id={`nav-pill-${cat.id}`}
                  onClick={() => handlers.scrollToCategory(cat.id)}
                  className={`shrink-0 whitespace-nowrap pb-2 text-xs sm:text-sm font-medium uppercase tracking-widest transition-all relative ${
                    activeCategory === cat.id 
                      ? "text-[#8B1E28]" 
                      : "text-[#999999] hover:text-[#121212]"
                  }`}
                >
                  {cat.name}
                  {activeCategory === cat.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#8B1E28]"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Content - Luxury Editorial Layout */}
        <main className="max-w-5xl mx-auto px-6 py-16 sm:py-24 space-y-32">
          {categories.map(cat => {
            const catItems = filteredItems.filter(i => i.category_id === cat.id);
            if (catItems.length === 0) return null;

            return (
              <section key={cat.id} id={`cat-${cat.id}`} ref={el => { categoryRefs.current[cat.id] = el; }} className="scroll-mt-32">
                
                <div className="text-center mb-16 sm:mb-20">
                  <h2 className="text-2xl sm:text-3xl font-light italic text-[#121212] mb-4" style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                    {cat.name}
                  </h2>
                  <div className="w-12 h-[1px] bg-[#8B1E28] mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                  {catItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      onClick={() => setters.setSelectedItem(item)}
                      className="group cursor-pointer flex flex-col"
                    >
                      {item.image_url ? (
                        <div className="w-full aspect-[4/3] mb-6 relative overflow-hidden bg-[#F5F5F5]">
                          <Image 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                            fill 
                          />
                        </div>
                      ) : (
                        <div className="w-full h-[1px] bg-[#E5E5E5] mb-6 hidden md:block"></div>
                      )}
                      
                      <div className="flex justify-between items-baseline mb-3 gap-4">
                        <h3 className="font-medium text-lg sm:text-xl text-[#121212] leading-tight" style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                          {item.name}
                        </h3>
                        <span className="font-light text-sm sm:text-base text-[#121212] shrink-0">
                          {currencySign}{item.price.toFixed(2)}
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className="text-[#666666] text-sm leading-relaxed mb-4 font-light">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="mt-auto flex flex-wrap gap-3 pt-2">
                        {item.is_popular && <span className="text-[9px] uppercase tracking-widest text-[#8B1E28] font-medium flex items-center gap-1"><Star size={10} /> Signature</span>}
                        {item.is_vegetarian && <span className="text-[9px] uppercase tracking-widest text-[#666666] font-medium flex items-center gap-1"><Leaf size={10} /> Vegetarian</span>}
                        {item.is_spicy && <span className="text-[9px] uppercase tracking-widest text-[#666666] font-medium flex items-center gap-1"><Flame size={10} /> Spicy</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {/* Luxury Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-white/90 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-[#FAFAFA] w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl flex flex-col relative shadow-2xl sm:border border-[#E5E5E5]">
            
            <button 
              onClick={() => setters.setSelectedItem(null)} 
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[#999999] hover:text-[#121212] p-2 transition-colors z-20 bg-white/50 backdrop-blur-sm rounded-full sm:bg-transparent"
            >
              <X size={24} strokeWidth={1} />
            </button>
            
            <div className="overflow-y-auto flex-grow flex flex-col">
              {selectedItem.image_url && (
                <div className="w-full aspect-video sm:aspect-[16/9] relative bg-[#F5F5F5] shrink-0">
                  <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" fill />
                </div>
              )}

              <div className="p-8 sm:p-12 flex flex-col flex-grow">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl sm:text-4xl font-light text-[#121212] mb-4" style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                    {selectedItem.name}
                  </h2>
                  <div className="text-xl font-light text-[#8B1E28]">
                    {currencySign}{selectedItem.price.toFixed(2)}
                  </div>
                </div>
                
                {selectedItem.description && (
                  <p className="text-[#666666] text-center text-sm sm:text-base leading-relaxed mb-12 font-light max-w-lg mx-auto">
                    {selectedItem.description}
                  </p>
                )}

                {canOrder && (
                  <div className="space-y-8 max-w-sm mx-auto w-full mt-auto">
                    {/* Quantity Selector */}
                    <div className="flex justify-center items-center gap-8">
                      <button onClick={() => setters.setOrderQuantity(Math.max(1, orderQuantity - 1))} className="w-10 h-10 border border-[#E5E5E5] text-[#121212] hover:border-[#121212] transition-colors flex items-center justify-center font-light text-xl rounded-full">-</button>
                      <span className="text-xl font-light text-[#121212] w-8 text-center">{orderQuantity}</span>
                      <button onClick={() => setters.setOrderQuantity(orderQuantity + 1)} className="w-10 h-10 border border-[#E5E5E5] text-[#121212] hover:border-[#121212] transition-colors flex items-center justify-center font-light text-xl rounded-full">+</button>
                    </div>

                    {/* Preferences */}
                    <div>
                      <textarea 
                        value={orderNotes}
                        onChange={(e) => setters.setOrderNotes(e.target.value)}
                        placeholder="Dietary requirements or special requests..."
                        className="w-full bg-transparent border-b border-[#E5E5E5] text-[#121212] p-3 text-sm font-light focus:outline-none focus:border-[#8B1E28] resize-none h-16 placeholder-[#999999] text-center"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 sm:p-8 bg-white border-t border-[#E5E5E5]">
                <button 
                  onClick={() => {
                    if (canOrder) {
                      addToCart(selectedItem, orderQuantity, orderNotes);
                    }
                    setters.setSelectedItem(null);
                  }}
                  className="w-full py-4 bg-[#121212] text-white font-medium uppercase text-xs tracking-[0.2em] hover:bg-[#8B1E28] transition-colors"
                >
                  {canOrder ? `Add to order — ${currencySign}${(selectedItem.price * orderQuantity).toFixed(2)}` : "Return to menu"}
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
