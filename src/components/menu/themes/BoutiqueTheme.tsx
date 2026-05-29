import React from "react";
import { X, Heart, Star, Sparkles } from "lucide-react";
import { useCart } from "../cart-context";
import { useMenuLogic } from "../use-menu-logic";
import { MenuThemeProps } from "../types";
import { FeedbackFAB } from "../feedback-fab";
import Image from "next/image";

export function BoutiqueTheme(props: MenuThemeProps) {
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
    <div className="min-h-screen bg-[#FFF0F5] text-[#835C7A] font-sans pb-32" style={{ fontFamily: '"Nunito", "Quicksand", sans-serif' }}>
      
      {/* Decorative Blob Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#FFE4E1] to-[#FFB6C1] blur-3xl"></div>
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[60%] rounded-full bg-gradient-to-tl from-[#E6E6FA] to-[#D8BFD8] blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Boutique Header */}
        <header className="px-6 pt-16 pb-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full shadow-[0_10px_20px_rgba(255,182,193,0.3)] flex items-center justify-center mb-6 text-[#FFB6C1]">
            <Sparkles size={28} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#DDA0DD] mb-2 drop-shadow-sm">
            {restaurant.name}
          </h1>
          <p className="text-[#B0C4DE] font-medium tracking-wider uppercase text-sm">
            {restaurant.cuisine_type || "Café & Sweets"}
          </p>
        </header>

        {/* Floating Controls */}
        <div className="sticky top-4 z-40 px-4 mb-10">
          <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgba(255,182,193,0.2)] p-2 border border-white">
            
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                placeholder="Search our menu..." 
                value={searchQuery}
                onChange={(e) => setters.setSearchQuery(e.target.value)}
                className="flex-grow bg-[#FFF0F5]/50 text-[#835C7A] px-5 py-3 rounded-2xl text-sm focus:outline-none focus:bg-[#FFF0F5] placeholder-[#D8BFD8] transition-colors"
              />
              <button 
                onClick={() => setters.setLayoutMode(layoutMode === "grid" ? "list" : "grid")} 
                className="bg-[#FFF0F5]/50 px-5 py-3 rounded-2xl hover:bg-[#FFE4E1] transition-colors text-[#DDA0DD]"
              >
                {layoutMode === "grid" ? "List" : "Grid"}
              </button>
            </div>

            {/* Pill Filters */}
            <div className="flex gap-2 px-1">
              <button onClick={() => setters.setFilterVeg(!filterVeg)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterVeg ? "bg-[#98FB98] text-[#2E8B57] shadow-sm" : "bg-transparent text-[#98FB98] hover:bg-[#98FB98]/10"}`}>Vegetarian</button>
              <button onClick={() => setters.setFilterGF(!filterGF)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterGF ? "bg-[#FFDAB9] text-[#CD853F] shadow-sm" : "bg-transparent text-[#FFDAB9] hover:bg-[#FFDAB9]/10"}`}>Gluten Free</button>
            </div>

            {/* Category Bubbles */}
            <div ref={categoryNavRef} className="flex overflow-x-auto scrollbar-none py-2 px-1 gap-3 mt-2 border-t border-[#FFF0F5]">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  id={`nav-pill-${cat.id}`}
                  onClick={() => handlers.scrollToCategory(cat.id)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    activeCategory === cat.id 
                      ? "bg-[#DDA0DD] text-white shadow-[0_4px_10px_rgba(221,160,221,0.4)] scale-105" 
                      : "bg-[#FFF0F5]/50 text-[#D8BFD8] hover:bg-[#FFE4E1] hover:text-[#DDA0DD]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dreamcore Menu Content */}
        <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-16">
          {categories.map(cat => {
            const catItems = filteredItems.filter(i => i.category_id === cat.id);
            if (catItems.length === 0) return null;

            return (
              <section key={cat.id} id={`cat-${cat.id}`} ref={el => { categoryRefs.current[cat.id] = el; }} className="scroll-mt-40">
                
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold text-[#DDA0DD] mb-2">{cat.name}</h2>
                  {cat.description && <p className="text-[#D8BFD8] italic">{cat.description}</p>}
                </div>

                <div className={layoutMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-6 max-w-2xl mx-auto"}>
                  {catItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      onClick={() => setters.setSelectedItem(item)}
                      className={`group cursor-pointer bg-white/70 backdrop-blur-sm rounded-[32px] p-4 flex hover:bg-white hover:shadow-[0_15px_35px_rgba(255,182,193,0.3)] hover:-translate-y-1 transition-all duration-300 border border-white ${layoutMode === "list" ? "flex-col sm:flex-row gap-6 items-center" : "flex-col"}`}
                    >
                      {item.image_url && (
                        <div className={`w-full ${layoutMode === "list" ? "sm:w-32 h-32" : "h-48 mb-4"} rounded-[24px] overflow-hidden shrink-0 shadow-inner bg-[#FFF0F5] relative`}>
                          <Image src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" fill />
                        </div>
                      )}
                      
                      <div className="flex-grow w-full flex flex-col justify-center text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2 mb-2">
                          <h3 className="text-xl font-bold text-[#835C7A]">{item.name}</h3>
                          <span className="text-lg font-extrabold text-[#FFB6C1] bg-[#FFF0F5] px-4 py-1 rounded-full">
                            {currencySign}{item.price.toFixed(2)}
                          </span>
                        </div>
                        
                        {item.description && (
                          <p className="text-sm text-[#B0C4DE] leading-relaxed mb-4">
                            {item.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-auto">
                          {item.is_popular && <span className="text-[10px] uppercase font-bold bg-[#FFF0F5] text-[#FFB6C1] px-3 py-1 rounded-full flex items-center gap-1"><Heart size={10} fill="currentColor"/> Popular</span>}
                          {item.is_vegetarian && <span className="text-[10px] uppercase font-bold bg-[#F0FFF0] text-[#98FB98] px-3 py-1 rounded-full flex items-center gap-1"><Star size={10} fill="currentColor"/> Veg</span>}
                          {item.is_spicy && <span className="text-[10px] uppercase font-bold bg-[#FFE4E1] text-[#FA8072] px-3 py-1 rounded-full flex items-center gap-1"><Sparkles size={10} fill="currentColor"/> Spicy</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {/* Item Modal (Boutique UI) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#835C7A]/20 backdrop-blur-sm">
          
          <div className="bg-white rounded-[40px] w-full max-w-md flex flex-col max-h-[90vh] shadow-[0_20px_60px_rgba(131,92,122,0.2)] overflow-hidden border-4 border-white relative">
            
            <button onClick={() => setters.setSelectedItem(null)} className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-[#D8BFD8] hover:text-[#DDA0DD] hover:bg-[#FFF0F5] p-2 rounded-full transition-colors z-20">
              <X size={24} />
            </button>
            
            {selectedItem.image_url ? (
              <div className="w-full h-64 relative">
                <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" fill />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
              </div>
            ) : (
              <div className="pt-12"></div>
            )}

            <div className={`px-8 pb-8 flex flex-col flex-grow overflow-y-auto ${selectedItem.image_url ? '-mt-12 relative z-10' : ''}`}>
              
              <div className="text-center mb-6">
                <h2 className="text-3xl font-extrabold text-[#835C7A] mb-2">{selectedItem.name}</h2>
                <div className="inline-block bg-[#FFF0F5] text-[#FFB6C1] font-black text-xl px-6 py-2 rounded-full shadow-inner">
                  {currencySign}{selectedItem.price.toFixed(2)}
                </div>
              </div>
              
              <p className="text-center text-[#B0C4DE] leading-relaxed mb-8">
                {selectedItem.description}
              </p>

              {canOrder && (
                <div className="space-y-6 mb-8 bg-[#FFF0F5]/50 p-6 rounded-[32px] border border-[#FFF0F5]">
                  {/* Quantity */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-[#DDA0DD]">Quantity</span>
                    <div className="flex items-center gap-4 bg-white rounded-full p-1 shadow-sm">
                      <button onClick={() => setters.setOrderQuantity(Math.max(1, orderQuantity - 1))} className="w-8 h-8 rounded-full bg-[#FFF0F5] text-[#FFB6C1] hover:bg-[#FFE4E1] transition-colors flex items-center justify-center font-bold">-</button>
                      <span className="text-lg font-bold text-[#835C7A] w-6 text-center">{orderQuantity}</span>
                      <button onClick={() => setters.setOrderQuantity(orderQuantity + 1)} className="w-8 h-8 rounded-full bg-[#FFF0F5] text-[#FFB6C1] hover:bg-[#FFE4E1] transition-colors flex items-center justify-center font-bold">+</button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-bold text-[#DDA0DD] mb-2">Special requests?</label>
                    <textarea 
                      value={orderNotes}
                      onChange={(e) => setters.setOrderNotes(e.target.value)}
                      placeholder="e.g., extra sweet, no ice..."
                      className="w-full bg-white text-[#835C7A] placeholder-[#D8BFD8] rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFE4E1] shadow-inner resize-none h-24"
                    />
                  </div>
                </div>
              )}

              <div className="mt-auto">
                <button 
                  onClick={() => canOrder ? handlers.handleAddToCart() : setters.setSelectedItem(null)}
                  className="w-full py-4 bg-gradient-to-r from-[#FFB6C1] to-[#DDA0DD] text-white font-bold text-lg rounded-full shadow-[0_10px_20px_rgba(221,160,221,0.3)] hover:shadow-[0_15px_30px_rgba(221,160,221,0.4)] hover:-translate-y-1 transition-all"
                >
                  {canOrder ? `Add to Order • ${currencySign}${(selectedItem.price * orderQuantity).toFixed(2)}` : "Back to Menu"}
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
