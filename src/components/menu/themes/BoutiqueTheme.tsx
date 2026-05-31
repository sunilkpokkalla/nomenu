import React from "react";
import { X, Heart, Star, Sparkles, ArrowRight } from "lucide-react";
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

  const { searchQuery, activeCategory, filterVeg, filterVegan, filterGF, filterSpicy, selectedItem, orderQuantity, orderNotes } = state;
  const { filteredItems } = computed;
  const { categoryRefs, categoryNavRef } = refs;

  const currencySymbol = restaurant.currency || "USD";
  const currencySign = currencySymbol === "EUR" ? "€" : currencySymbol === "GBP" ? "£" : "$";

  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const canFeedback = currentPlan !== "free";
  const canOrder = currentPlan === "elite" || currentPlan === "enterprise";

  return (
    <div className="min-h-screen bg-[#FFF5F8] text-[#4A3B42] font-sans pb-32" style={{ fontFamily: '"Inter", "Nunito", sans-serif' }}>
      
      {/* Decorative Top Banner */}
      <div className="w-full h-48 bg-gradient-to-r from-[#FFD1DC] via-[#FFE4E1] to-[#E6E6FA] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
        <div className="relative z-10 text-center px-6 mt-8">
          <div className="w-16 h-16 bg-white/60 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 border border-white/50 text-[#FF91A4]">
            <Sparkles size={24} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#4A3B42] mb-1">
            {restaurant.name}
          </h1>
          <p className="text-[#835C7A] font-semibold tracking-widest uppercase text-[10px]">
            {restaurant.cuisine_type || "Café & Patisserie"}
          </p>
        </div>
      </div>

      <div className="relative z-10 -mt-6">
        {/* Search & Filter Bar */}
        <div className="sticky top-0 z-40 px-4 mb-8">
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(255,182,193,0.3)] p-3 border border-white">
            
            <input 
              type="text" 
              placeholder="Search the collection..." 
              value={searchQuery}
              onChange={(e) => setters.setSearchQuery(e.target.value)}
              className="w-full bg-[#FFF5F8] text-[#4A3B42] px-5 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] placeholder-[#D8BFD8] transition-all mb-3"
            />

            {/* Category Pills */}
            <div ref={categoryNavRef} className="flex overflow-x-auto scrollbar-none gap-2 pb-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  id={`nav-pill-${cat.id}`}
                  onClick={() => handlers.scrollToCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat.id 
                      ? "bg-[#FF91A4] text-white shadow-md shadow-[#FF91A4]/30" 
                      : "bg-[#FFF5F8] text-[#835C7A] hover:bg-[#FFE4E1]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Boutique Horizontal Layout Content */}
        <main className="max-w-7xl mx-auto space-y-12">
          {categories.map(cat => {
            const catItems = filteredItems.filter(i => i.category_id === cat.id);
            if (catItems.length === 0) return null;

            return (
              <section key={cat.id} id={`cat-${cat.id}`} ref={el => { categoryRefs.current[cat.id] = el; }} className="scroll-mt-32">
                
                <div className="px-6 flex justify-between items-end mb-6 max-w-4xl mx-auto">
                  <div>
                    <h2 className="text-2xl font-black text-[#4A3B42]">{cat.name}</h2>
                    {cat.description && <p className="text-[#835C7A] text-sm mt-1">{cat.description}</p>}
                  </div>
                  <div className="text-[#FF91A4] hidden sm:block">
                    <ArrowRight size={20} />
                  </div>
                </div>

                {/* Horizontal Snap Scroll Container */}
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none px-6 pb-8 gap-6">
                  {/* Spacer for mobile alignment */}
                  <div className="w-1 shrink-0 lg:hidden"></div>
                  
                  {catItems.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => setters.setSelectedItem(item)}
                      className="snap-center shrink-0 w-[260px] sm:w-[300px] cursor-pointer group flex flex-col"
                    >
                      {/* Image Card */}
                      <div className="w-full aspect-square rounded-3xl overflow-hidden mb-4 relative shadow-md bg-white">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" fill />
                        ) : (
                          <div className="w-full h-full bg-[#FFE4E1]/30 flex items-center justify-center">
                            <Sparkles className="text-[#FFB6C1] opacity-50" size={32} />
                          </div>
                        )}
                        
                        {/* Price Badge over Image */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#4A3B42] font-black px-3 py-1.5 rounded-xl shadow-sm text-sm">
                          {currencySign}{item.price.toFixed(2)}
                        </div>

                        {/* Dietary tags */}
                        <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                          {item.is_popular && <span className="text-[9px] uppercase font-bold bg-[#FF91A4] text-white px-2 py-1 rounded-lg shadow-sm">Popular</span>}
                          {item.is_vegetarian && <span className="text-[9px] uppercase font-bold bg-[#98FB98] text-[#2E8B57] px-2 py-1 rounded-lg shadow-sm">Veg</span>}
                        </div>
                      </div>
                      
                      {/* Text Content Below */}
                      <div className="px-1">
                        <h3 className="text-lg font-bold text-[#4A3B42] mb-1 line-clamp-1 group-hover:text-[#FF91A4] transition-colors">{item.name}</h3>
                        {item.description && (
                          <p className="text-xs text-[#835C7A] line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* End Spacer */}
                  <div className="w-4 shrink-0"></div>
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {/* Item Modal (Boutique UI) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#4A3B42]/40 backdrop-blur-sm">
          
          <div className="bg-white w-full sm:max-w-md sm:rounded-[32px] rounded-t-[32px] flex flex-col max-h-[90vh] shadow-2xl overflow-hidden relative animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            
            <button onClick={() => setters.setSelectedItem(null)} className="absolute top-4 right-4 bg-white/50 backdrop-blur-md text-[#4A3B42] hover:bg-white p-2 rounded-full transition-colors z-20 shadow-sm">
              <X size={20} strokeWidth={3} />
            </button>
            
            {selectedItem.image_url ? (
              <div className="w-full aspect-square relative bg-[#FFF5F8]">
                <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" fill />
              </div>
            ) : (
              <div className="pt-12"></div>
            )}

            <div className="px-8 pt-6 pb-8 flex flex-col flex-grow overflow-y-auto">
              
              <div className="flex justify-between items-start mb-4 gap-4">
                <h2 className="text-2xl font-black text-[#4A3B42] leading-tight">{selectedItem.name}</h2>
                <div className="bg-[#FF91A4]/10 text-[#FF91A4] font-black text-xl px-4 py-1.5 rounded-xl shrink-0">
                  {currencySign}{selectedItem.price.toFixed(2)}
                </div>
              </div>
              
              <p className="text-[#835C7A] text-sm leading-relaxed mb-8">
                {selectedItem.description}
              </p>

              {canOrder ? (
                <div className="space-y-6 mt-auto">
                  <div className="flex justify-between items-center bg-[#FFF5F8] p-4 rounded-2xl">
                    <span className="text-sm font-bold text-[#835C7A]">Quantity</span>
                    <div className="flex items-center gap-4 bg-white rounded-xl p-1 shadow-sm">
                      <button onClick={() => setters.setOrderQuantity(Math.max(1, orderQuantity - 1))} className="w-8 h-8 rounded-lg bg-[#FFF5F8] text-[#FF91A4] hover:bg-[#FFE4E1] flex items-center justify-center font-bold transition-colors">-</button>
                      <span className="text-lg font-black text-[#4A3B42] w-6 text-center">{orderQuantity}</span>
                      <button onClick={() => setters.setOrderQuantity(orderQuantity + 1)} className="w-8 h-8 rounded-lg bg-[#FFF5F8] text-[#FF91A4] hover:bg-[#FFE4E1] flex items-center justify-center font-bold transition-colors">+</button>
                    </div>
                  </div>

                  <button 
                    onClick={() => handlers.handleAddToCart()}
                    className="w-full py-4 bg-[#FF91A4] text-white font-black rounded-2xl shadow-[0_8px_20px_rgba(255,145,164,0.4)] hover:shadow-[0_10px_25px_rgba(255,145,164,0.6)] hover:-translate-y-0.5 transition-all uppercase tracking-widest text-sm"
                  >
                    Add to Bag
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setters.setSelectedItem(null)}
                  className="w-full py-4 bg-[#FFF5F8] text-[#4A3B42] font-black rounded-2xl hover:bg-[#FFE4E1] transition-colors mt-auto"
                >
                  Back to Menu
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {canFeedback && <FeedbackFAB restaurantId={restaurant.id} tableNumber={tableNumber} qrCodeId={qrCodeId} />}
    </div>
  );
}
