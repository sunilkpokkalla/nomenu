import React from "react";
import { X, Heart, Star, Flame, Zap } from "lucide-react";
import { useCart } from "../cart-context";
import { useMenuLogic } from "../use-menu-logic";
import { MenuThemeProps } from "../types";
import { FeedbackFAB } from "../feedback-fab";
import Image from "next/image";

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

  const currencySymbol = restaurant.currency || "USD";
  const currencySign = currencySymbol === "EUR" ? "€" : currencySymbol === "GBP" ? "£" : "$";

  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const canFeedback = currentPlan !== "free";
  const canOrder = currentPlan === "elite" || currentPlan === "enterprise";

  return (
    <div className="min-h-screen bg-[#FFD166] text-black font-sans pb-32" style={{ fontFamily: '"Inter", "system-ui", sans-serif' }}>
      
      {/* Pop Diner Header */}
      <header className="relative w-full pt-16 pb-10 px-6 flex flex-col items-center text-center border-b-4 border-black bg-[#EF476F]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIyIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMSkiLz4KPC9zdmc+')] opacity-50 pointer-events-none mix-blend-overlay"></div>
        <div className="relative z-10 w-full max-w-3xl">
          <div className="w-24 h-24 bg-[#118AB2] border-4 border-black rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-6 mx-auto text-white rotate-6 hover:-rotate-12 transition-transform duration-300">
            <Zap size={44} strokeWidth={2.5} fill="#FFD166" color="black" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4 -rotate-1">
            {restaurant.name}
          </h1>
          <div className="inline-block bg-black text-[#FFD166] text-xs font-black uppercase tracking-widest px-4 py-2 border-2 border-white rounded-md transform rotate-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            {restaurant.cuisine_type || "Vibrant Pop Diner"}
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {/* Floating Controls */}
        <div className="sticky top-0 z-40 px-4 py-4 bg-[#FFD166]/90 backdrop-blur-xl border-b-4 border-black shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
          <div className="max-w-3xl mx-auto">
            
            <div className="flex gap-3 mb-4">
              <input 
                type="text" 
                placeholder="Find a bite..." 
                value={searchQuery}
                onChange={(e) => setters.setSearchQuery(e.target.value)}
                className="flex-grow bg-white text-black border-4 border-black px-4 py-3 font-bold focus:outline-none focus:ring-0 focus:translate-x-1 focus:translate-y-1 focus:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder-gray-400"
              />
            </div>

            {/* Pill Filters */}
            <div className="flex gap-3 mb-4 overflow-x-auto scrollbar-none pb-2">
              <button onClick={() => setters.setFilterVeg(!filterVeg)} className={`shrink-0 px-4 py-1.5 border-4 border-black font-black uppercase tracking-wider transition-all ${filterVeg ? "bg-[#06D6A0] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1" : "bg-white text-gray-500 hover:bg-gray-100"}`}>🌿 Plant-based</button>
              <button onClick={() => setters.setFilterGF(!filterGF)} className={`shrink-0 px-4 py-1.5 border-4 border-black font-black uppercase tracking-wider transition-all ${filterGF ? "bg-[#118AB2] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1" : "bg-white text-gray-500 hover:bg-gray-100"}`}>🌾 Gluten Free</button>
              <button onClick={() => setters.setFilterSpicy(!filterSpicy)} className={`shrink-0 px-4 py-1.5 border-4 border-black font-black uppercase tracking-wider transition-all ${filterSpicy ? "bg-[#EF476F] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1" : "bg-white text-gray-500 hover:bg-gray-100"}`}>🌶️ Spicy</button>
            </div>

            {/* Category Bubbles */}
            <div ref={categoryNavRef} className="flex overflow-x-auto scrollbar-none gap-3 pb-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  id={`nav-pill-${cat.id}`}
                  onClick={() => handlers.scrollToCategory(cat.id)}
                  className={`shrink-0 whitespace-nowrap px-4 py-2 border-4 border-black font-black uppercase text-sm transition-all ${
                    activeCategory === cat.id 
                      ? "bg-black text-[#FFD166] shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-0.5 translate-y-0.5" 
                      : "bg-white text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Content */}
        <main className="max-w-5xl mx-auto p-4 sm:p-6 space-y-16 mt-6">
          {categories.map(cat => {
            const catItems = filteredItems.filter(i => i.category_id === cat.id);
            if (catItems.length === 0) return null;

            return (
              <section key={cat.id} id={`cat-${cat.id}`} ref={el => { categoryRefs.current[cat.id] = el; }} className="scroll-mt-60">
                
                <div className="inline-block bg-black text-white px-6 py-2 border-l-8 border-[#06D6A0] mb-8 transform -skew-x-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
                  <h2 className="text-4xl font-black uppercase tracking-tighter skew-x-12">{cat.name}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {catItems.map((item, index) => {
                    const rotationClass = index % 2 === 0 ? "hover:rotate-2" : "hover:-rotate-2";
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => setters.setSelectedItem(item)}
                        className={`group cursor-pointer bg-white border-4 border-black p-4 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${rotationClass} hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-2`}
                      >
                        {item.image_url ? (
                          <div className="w-full h-48 border-4 border-black mb-4 relative overflow-hidden bg-[#118AB2]">
                            <Image src={item.image_url} alt={item.name} className="w-full h-full object-cover grayscale-[20%] contrast-125 group-hover:grayscale-0 transition-all duration-300" fill />
                            <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none group-hover:bg-transparent transition-all"></div>
                          </div>
                        ) : (
                          <div className="w-full h-48 border-4 border-black mb-4 bg-[#06D6A0] flex items-center justify-center">
                             <Zap size={48} className="text-black opacity-20" />
                          </div>
                        )}
                        
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h3 className="font-black text-2xl uppercase tracking-tighter leading-none text-black drop-shadow-[1px_1px_0px_rgba(0,0,0,0.1)]">
                            {item.name}
                          </h3>
                          <span className="font-black text-xl bg-white border-2 border-black px-2 py-1 transform rotate-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                            {currencySign}{item.price.toFixed(2)}
                          </span>
                        </div>
                        
                        {item.description && (
                          <p className="text-sm font-bold text-gray-700 leading-tight mb-4 line-clamp-3">
                            {item.description}
                          </p>
                        )}
                        
                        <div className="mt-auto flex flex-wrap gap-2 pt-2 border-t-4 border-dashed border-gray-200">
                          {item.is_popular && <span className="text-[10px] uppercase font-black bg-[#EF476F] border-2 border-black text-white px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1"><Star size={10} fill="currentColor"/> HOT</span>}
                          {item.is_vegetarian && <span className="text-[10px] uppercase font-black bg-[#06D6A0] border-2 border-black text-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">VEG</span>}
                          {item.is_spicy && <span className="text-[10px] uppercase font-black bg-black border-2 border-black text-white px-2 py-1 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">SPICY</span>}
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

      {/* Item Modal (Pop Diner) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFD166] border-4 border-black w-full max-w-lg flex flex-col max-h-[90vh] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative animate-in zoom-in-95 duration-200">
            
            <button onClick={() => setters.setSelectedItem(null)} className="absolute -top-4 -right-4 bg-white border-4 border-black text-black hover:bg-[#EF476F] hover:text-white p-2 rounded-full transition-colors z-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:scale-110 hover:rotate-90">
              <X size={24} strokeWidth={4} />
            </button>
            
            <div className="overflow-y-auto p-6 sm:p-8 flex flex-col">
              {selectedItem.image_url && (
                <div className="w-full h-64 border-4 border-black relative mb-6 bg-white transform -rotate-1">
                  <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover contrast-125" fill />
                </div>
              )}

              <div className="flex justify-between items-start gap-4 mb-4">
                <h2 className="text-4xl font-black uppercase tracking-tighter leading-none text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">{selectedItem.name}</h2>
                <div className="bg-white border-4 border-black text-black font-black text-2xl px-4 py-2 transform rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
                  {currencySign}{selectedItem.price.toFixed(2)}
                </div>
              </div>
              
              <p className="text-black text-lg font-bold leading-snug mb-8 border-l-4 border-black pl-4">
                {selectedItem.description}
              </p>

              {canOrder && (
                <div className="space-y-6 mb-8 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                  {/* Quantity */}
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black uppercase text-black">Amount</span>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setters.setOrderQuantity(Math.max(1, orderQuantity - 1))} className="w-12 h-12 border-4 border-black bg-[#EF476F] text-white hover:bg-black transition-colors flex items-center justify-center font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none">-</button>
                      <span className="text-3xl font-black text-black w-8 text-center">{orderQuantity}</span>
                      <button onClick={() => setters.setOrderQuantity(orderQuantity + 1)} className="w-12 h-12 border-4 border-black bg-[#06D6A0] text-black hover:bg-black hover:text-white transition-colors flex items-center justify-center font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none">+</button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-wider text-black mb-2">Requests / Allergies</label>
                    <textarea 
                      value={orderNotes}
                      onChange={(e) => setters.setOrderNotes(e.target.value)}
                      placeholder="Gimme extra sauce..."
                      className="w-full bg-gray-100 text-black border-4 border-black p-4 text-base font-bold focus:outline-none focus:bg-white resize-none h-24 shadow-[inset_4px_4px_0px_rgba(0,0,0,0.1)]"
                    />
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4">
                <button 
                  onClick={() => canOrder ? handlers.handleAddToCart() : setters.setSelectedItem(null)}
                  className="w-full py-4 bg-[#118AB2] border-4 border-black text-white font-black uppercase text-2xl tracking-tight shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  {canOrder ? `ADD IT • ${currencySign}${(selectedItem.price * orderQuantity).toFixed(2)}` : "CLOSE"}
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
