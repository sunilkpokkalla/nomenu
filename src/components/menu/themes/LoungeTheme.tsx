import React from "react";
import { X, GlassWater, Martini, Sparkles } from "lucide-react";
import { useCart } from "../cart-context";
import { useMenuLogic } from "../use-menu-logic";
import { MenuThemeProps } from "../types";
import { FeedbackFAB } from "../feedback-fab";
import Image from "next/image";

export function LoungeTheme(props: MenuThemeProps) {
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

  // Nightlife Bento Grid
  const getBentoClass = (index: number) => {
    if (layoutMode === "list") return "col-span-1";
    
    // 5-box asymmetric dark mode layout
    const pattern = index % 5;
    if (pattern === 0) return "col-span-2 row-span-2 md:col-span-2 md:row-span-2"; // Giant Hero
    if (pattern === 1) return "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; // Small square
    if (pattern === 2) return "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; // Small square
    if (pattern === 3) return "col-span-2 md:col-span-2 row-span-1"; // Wide banner
    if (pattern === 4) return "col-span-2 md:col-span-1 row-span-1"; // Medium square
    return "col-span-1 row-span-1";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-sans pb-32" style={{ fontFamily: '"Inter", "system-ui", sans-serif' }}>
      {/* Ambient Glow Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#D4AF37]/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#8A2BE2]/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10">
        {/* Lounge Header */}
        <header className="px-6 pt-20 pb-16 text-center flex flex-col items-center">
          <div className="mb-6 text-[#D4AF37] opacity-80 flex gap-4">
            <Martini size={32} strokeWidth={1} />
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white mb-2" style={{ textShadow: '0 0 40px rgba(212, 175, 55, 0.3)' }}>
            {restaurant.name}
          </h1>

          <p className="text-[#D4AF37] font-medium tracking-[0.2em] uppercase text-xs mt-4 opacity-80">
            {restaurant.cuisine_type || "Premium Lounge & Bar"}
          </p>
        </header>

        {/* Floating Controls */}
        <div className="sticky top-4 z-40 px-4 mb-12">
          <div className="max-w-3xl mx-auto bg-black/60 backdrop-blur-2xl rounded-3xl p-3 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                placeholder="Search menu..." 
                value={searchQuery}
                onChange={(e) => setters.setSearchQuery(e.target.value)}
                className="flex-grow bg-white/5 border border-white/10 text-white px-5 py-3 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37]/50 placeholder-white/30 transition-all"
              />
              <button 
                onClick={() => setters.setLayoutMode(layoutMode === "grid" ? "list" : "grid")} 
                className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl hover:bg-white/10 transition-colors text-white text-sm font-medium"
              >
                {layoutMode === "grid" ? "List View" : "Bento Grid"}
              </button>
            </div>

            {/* Category Nav */}
            <div ref={categoryNavRef} className="flex overflow-x-auto scrollbar-none py-2 px-1 gap-4">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handlers.scrollToCategory(cat.id)}
                  className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.id 
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                      : "bg-transparent text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bento Grid Menu Content */}
        <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-32">
          {categories.map(cat => {
            const catItems = filteredItems.filter(i => i.category_id === cat.id);
            if (catItems.length === 0) return null;

            return (
              <section key={cat.id} id={`cat-${cat.id}`} ref={el => { categoryRefs.current[cat.id] = el; }} className="scroll-mt-40">
                
                <div className="flex items-center gap-4 mb-12 pl-2 border-l-4 border-[#D4AF37]">
                  <h2 className="text-4xl font-bold text-white pl-4 tracking-tight">{cat.name}</h2>
                </div>

                <div className={layoutMode === "grid" 
                  ? "grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4 sm:gap-6" 
                  : "flex flex-col gap-6 max-w-3xl mx-auto"}>
                  
                  {catItems.map((item, index) => {
                    const bentoClass = getBentoClass(index);
                    const isGiant = bentoClass.includes("row-span-2");
                    
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => setters.setSelectedItem(item)}
                        className={`group cursor-pointer bg-[#141414] rounded-3xl overflow-hidden border border-white/5 hover:border-[#D4AF37]/30 hover:shadow-[0_10px_40px_rgba(212,175,55,0.15)] hover:-translate-y-1 transition-all duration-500 flex ${layoutMode === "list" ? "flex-col sm:flex-row p-4 gap-6 items-start sm:items-center relative" : `${bentoClass} flex-col relative`}`}
                      >
                        {item.image_url ? (
                          <div className={`${layoutMode === "list" ? "w-full sm:w-32 h-40 sm:h-32 rounded-2xl relative shrink-0" : "absolute inset-0 w-full h-full"} overflow-hidden z-0`}>
                            <Image src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000" fill />
                            {/* Dark Gradient Overlay for Bento items */}
                            {layoutMode === "grid" && (
                              <div className={`absolute inset-0 bg-gradient-to-t ${isGiant ? "from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" : "from-[#0A0A0A] to-transparent"} z-10`}></div>
                            )}
                          </div>
                        ) : (
                          // Fallback dark gradient if no image
                          <div className={`${layoutMode === "list" ? "w-full sm:w-32 h-40 sm:h-32 rounded-2xl relative shrink-0" : "absolute inset-0 w-full h-full"} bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] z-0 flex items-center justify-center opacity-30`}>
                            <GlassWater size={48} className="text-white/20" />
                          </div>
                        )}
                        
                        {/* Content Area */}
                        <div className={`relative z-20 flex flex-col justify-center w-full ${layoutMode === "list" ? "py-2" : "p-6 h-full mt-auto"}`}>
                          
                          <div className={`flex justify-between items-start gap-4 mb-2`}>
                            <h3 className={`font-bold tracking-tight text-white ${layoutMode === "list" ? "text-xl" : isGiant ? "text-3xl" : "text-lg"}`}>
                              {item.name}
                            </h3>
                            <span className={`shrink-0 font-bold bg-black/60 backdrop-blur-md border border-white/10 text-[#D4AF37] px-3 py-1.5 rounded-full shadow-lg ${layoutMode === "grid" ? "absolute top-4 right-4" : "text-sm"}`}>
                              {currencySign}{item.price.toFixed(2)}
                            </span>
                          </div>
                          
                          {(item.description && (layoutMode === "list" || isGiant)) && (
                            <p className={`text-sm line-clamp-2 font-light leading-relaxed mb-4 ${layoutMode === "list" ? "text-white/50 pr-4" : "text-white/60"}`}>
                              {item.description}
                            </p>
                          )}
                          
                          <div className={`flex flex-wrap gap-2 ${layoutMode === "list" ? "mt-auto" : "mt-2"}`}>
                            {item.is_popular && <span className="text-[10px] uppercase font-bold bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] px-2 py-1 rounded-md flex items-center gap-1"><Sparkles size={10}/> Premium</span>}
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

      {/* Item Modal (Lounge) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl">
          
          <div className="bg-[#111] sm:border border-white/10 sm:rounded-[40px] rounded-t-[40px] w-full max-w-xl mx-auto flex flex-col max-h-[90vh] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden relative animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            
            <button onClick={() => setters.setSelectedItem(null)} className="absolute top-6 right-6 bg-black/50 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 p-3 rounded-full transition-colors z-20">
              <X size={20} strokeWidth={2} />
            </button>
            
            {selectedItem.image_url ? (
              <div className="w-full h-80 relative">
                <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" fill />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
              </div>
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]"></div>
            )}

            <div className={`px-8 sm:px-12 pb-12 flex flex-col flex-grow overflow-y-auto ${selectedItem.image_url ? '-mt-24 relative z-10' : 'pt-8'}`}>
              
              <div className="flex justify-between items-end gap-4 mb-6">
                <h2 className="text-4xl font-bold text-white tracking-tight leading-none">{selectedItem.name}</h2>
                <div className="text-[#D4AF37] font-bold text-2xl shrink-0">
                  {currencySign}{selectedItem.price.toFixed(2)}
                </div>
              </div>
              
              <p className="text-white/60 text-lg leading-relaxed mb-10 font-light">
                {selectedItem.description}
              </p>

              {canOrder && (
                <div className="space-y-8 mb-10">
                  {/* Quantity */}
                  <div className="flex justify-between items-center py-4 border-y border-white/5">
                    <span className="text-sm font-medium text-white/50 uppercase tracking-widest">Quantity</span>
                    <div className="flex items-center gap-6">
                      <button onClick={() => setters.setOrderQuantity(Math.max(1, orderQuantity - 1))} className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center justify-center text-xl font-light">-</button>
                      <span className="text-2xl font-bold text-white w-6 text-center">{orderQuantity}</span>
                      <button onClick={() => setters.setOrderQuantity(orderQuantity + 1)} className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center justify-center text-xl font-light">+</button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-white/50 uppercase tracking-widest mb-4">Special Requests</label>
                    <textarea 
                      value={orderNotes}
                      onChange={(e) => setters.setOrderNotes(e.target.value)}
                      placeholder="e.g., shaken not stirred..."
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-2xl p-5 text-base focus:outline-none focus:border-[#D4AF37]/50 resize-none h-28 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="mt-auto pt-6">
                <button 
                  onClick={() => canOrder ? handlers.handleAddToCart() : setters.setSelectedItem(null)}
                  className="w-full py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] active:scale-95 transition-all"
                >
                  {canOrder ? `Add to Tab • ${currencySign}${(selectedItem.price * orderQuantity).toFixed(2)}` : "Close Details"}
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
