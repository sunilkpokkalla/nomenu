import React from "react";
import { X, Heart, Star, Flame, Sparkles } from "lucide-react";
import { useCart } from "../cart-context";
import { useMenuLogic } from "../use-menu-logic";
import { MenuThemeProps } from "../types";
import { FeedbackFAB } from "../feedback-fab";
import Image from "next/image";
import { getCurrencySymbol } from "@/lib/currency-options";

export function EditorialTheme(props: MenuThemeProps) {
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
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1918] pb-32" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      {/* Editorial Header */}
      <header className="relative w-full pt-24 pb-16 px-6 flex flex-col items-center text-center border-b border-[#E2DFD8]">
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#8C8881] mb-6 font-medium">
            Vol. 1 — {restaurant.cuisine_type || "Fine Dining"}
          </p>
          <h1 className="text-5xl sm:text-7xl font-serif tracking-tight text-[#1A1918] mb-6 leading-none" style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}>
            {restaurant.name}
          </h1>

          <div className="w-16 h-[1px] bg-[#1A1918] opacity-30 mb-6"></div>
          <p className="max-w-md text-[#5C5A56] text-sm leading-relaxed font-light">
            A curated selection of culinary experiences, beautifully crafted and thoughtfully presented.
          </p>
        </div>
      </header>

      <div className="relative z-10">
        {/* Floating Controls */}
        <div className="sticky top-0 z-40 px-4 py-6 bg-[#F9F8F6]/95 backdrop-blur-md border-b border-[#E2DFD8]/50">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-6 items-center justify-between">
            
            <div className="w-full sm:w-1/3">
              <input 
                type="text" 
                placeholder="Search the collection..." 
                value={searchQuery}
                onChange={(e) => setters.setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[#1A1918] border-b border-[#1A1918]/20 px-0 py-2 text-sm font-light focus:outline-none focus:border-[#1A1918] transition-colors placeholder-[#8C8881]"
              />
            </div>

            {/* Category Bubbles */}
            <div ref={categoryNavRef} className="w-full sm:w-2/3 flex overflow-x-auto scrollbar-none gap-6 pb-2 sm:pb-0 justify-start sm:justify-end">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  id={`nav-pill-${cat.id}`}
                  onClick={() => handlers.scrollToCategory(cat.id)}
                  className={`shrink-0 whitespace-nowrap text-[11px] tracking-[0.2em] uppercase transition-all pb-1 ${
                    activeCategory === cat.id 
                      ? "text-[#1A1918] border-b border-[#1A1918] font-medium" 
                      : "text-[#8C8881] border-b border-transparent hover:text-[#1A1918]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Pill Filters */}
          <div className="max-w-4xl mx-auto mt-4 flex gap-4 overflow-x-auto scrollbar-none">
            <button onClick={() => setters.setFilterVeg(!filterVeg)} className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1 border transition-all ${filterVeg ? "border-[#1A1918] bg-[#1A1918] text-white" : "border-[#E2DFD8] text-[#8C8881] hover:border-[#1A1918]/30"}`}>Plant-based</button>
            <button onClick={() => setters.setFilterGF(!filterGF)} className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1 border transition-all ${filterGF ? "border-[#1A1918] bg-[#1A1918] text-white" : "border-[#E2DFD8] text-[#8C8881] hover:border-[#1A1918]/30"}`}>Gluten Free</button>
            <button onClick={() => setters.setFilterSpicy(!filterSpicy)} className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1 border transition-all ${filterSpicy ? "border-[#1A1918] bg-[#1A1918] text-white" : "border-[#E2DFD8] text-[#8C8881] hover:border-[#1A1918]/30"}`}>Spicy</button>
          </div>
        </div>

        {/* Menu Content */}
        <main className="max-w-4xl mx-auto p-4 sm:p-8 space-y-32 mt-12">
          {categories.map((cat, catIdx) => {
            const catItems = filteredItems.filter(i => i.category_id === cat.id);
            if (catItems.length === 0) return null;

            return (
              <section key={cat.id} id={`cat-${cat.id}`} ref={el => { categoryRefs.current[cat.id] = el; }} className="scroll-mt-48">
                
                <div className="flex flex-col items-center mb-16 text-center">
                  <span className="text-[10px] tracking-[0.3em] text-[#8C8881] mb-4 uppercase">Chapter {catIdx + 1}</span>
                  <h2 className="text-4xl font-serif text-[#1A1918] italic" style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}>{cat.name}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                  {catItems.map((item, index) => {
                    // Create an asymmetrical layout feel
                    const isWide = index % 3 === 0;
                    
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => setters.setSelectedItem(item)}
                        className={`group cursor-pointer flex flex-col ${isWide ? "md:col-span-2 md:flex-row md:items-center gap-8" : "gap-4"}`}
                      >
                        {item.image_url && (
                          <div className={`relative overflow-hidden ${isWide ? "w-full md:w-1/2 aspect-[4/3]" : "w-full aspect-[3/4]"} bg-[#E2DFD8]`}>
                            <Image src={item.image_url} alt={item.name} className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out" fill />
                          </div>
                        )}
                        
                        <div className={`flex flex-col ${isWide ? "w-full md:w-1/2" : "w-full"}`}>
                          <div className="flex justify-between items-baseline mb-3 gap-4">
                            <h3 className="font-serif text-2xl text-[#1A1918] leading-tight" style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}>
                              {item.name}
                            </h3>
                            <span className="text-sm font-light tracking-widest text-[#5C5A56] shrink-0">
                              {currencySign}{item.price.toFixed(2)}
                            </span>
                          </div>
                          
                          {item.description && (
                            <p className="text-[13px] text-[#5C5A56] leading-relaxed font-light mb-6">
                              {item.description}
                            </p>
                          )}
                          
                          <div className="mt-auto flex flex-wrap gap-3">
                            {item.is_popular && <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] border-b border-[#D4AF37] pb-0.5">Signature</span>}
                            {item.is_vegetarian && <span className="text-[9px] uppercase tracking-[0.2em] text-[#4CAF50] border-b border-[#4CAF50] pb-0.5">Plant</span>}
                            {item.is_spicy && <span className="text-[9px] uppercase tracking-[0.2em] text-[#E53935] border-b border-[#E53935] pb-0.5">Spicy</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {/* Item Modal (Editorial) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#F9F8F6]/90 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl flex flex-col md:flex-row max-h-[95vh] shadow-2xl relative animate-in fade-in duration-500 overflow-hidden border border-[#E2DFD8]">
            
            <button onClick={() => setters.setSelectedItem(null)} className="absolute top-6 right-6 text-[#1A1918] hover:opacity-50 transition-opacity z-20 mix-blend-difference">
              <X size={28} strokeWidth={1} color="white" />
            </button>
            
            {/* Left side Image */}
            {selectedItem.image_url && (
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-[#E2DFD8]">
                <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" fill />
              </div>
            )}

            {/* Right side content */}
            <div className={`w-full ${selectedItem.image_url ? "md:w-1/2" : "w-full"} overflow-y-auto p-8 sm:p-16 flex flex-col`}>
              
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#8C8881] mb-4">
                The Collection
              </p>
              
              <h2 className="text-4xl sm:text-5xl font-serif text-[#1A1918] mb-6 leading-tight" style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}>
                {selectedItem.name}
              </h2>
              
              <div className="w-12 h-[1px] bg-[#1A1918] opacity-20 mb-6"></div>
              
              <p className="text-[#5C5A56] text-sm leading-relaxed font-light mb-12">
                {selectedItem.description}
              </p>

              {canOrder && (
                <div className="space-y-10 mb-12">
                  {/* Quantity */}
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8C8881] mb-4">Quantity</label>
                    <div className="flex items-center gap-6">
                      <button onClick={() => setters.setOrderQuantity(Math.max(1, orderQuantity - 1))} className="text-[#1A1918] hover:opacity-50 transition-opacity p-2">
                        <span className="text-2xl font-light">-</span>
                      </button>
                      <span className="text-2xl font-serif text-[#1A1918] w-8 text-center" style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}>{orderQuantity}</span>
                      <button onClick={() => setters.setOrderQuantity(orderQuantity + 1)} className="text-[#1A1918] hover:opacity-50 transition-opacity p-2">
                        <span className="text-2xl font-light">+</span>
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8C8881] mb-4">Special Instructions</label>
                    <textarea 
                      value={orderNotes}
                      onChange={(e) => setters.setOrderNotes(e.target.value)}
                      placeholder="Any specific preparation requests..."
                      className="w-full bg-transparent border-b border-[#E2DFD8] text-[#1A1918] pb-2 text-sm font-light focus:outline-none focus:border-[#1A1918] resize-none h-12"
                    />
                  </div>
                </div>
              )}

              <div className="mt-auto pt-8 flex items-center justify-between">
                <span className="text-2xl font-light tracking-widest text-[#1A1918]">
                  {currencySign}{selectedItem.price.toFixed(2)}
                </span>
                <button 
                  onClick={() => canOrder ? handlers.handleAddToCart() : setters.setSelectedItem(null)}
                  className="px-8 py-4 bg-[#1A1918] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-black transition-colors"
                >
                  {canOrder ? "Add to Selection" : "Close"}
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
