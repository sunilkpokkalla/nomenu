import React from "react";
import { X, Heart, Star, Flame, Waves } from "lucide-react";
import { useCart } from "../cart-context";
import { useMenuLogic } from "../use-menu-logic";
import { MenuThemeProps } from "../types";
import { FeedbackFAB } from "../feedback-fab";
import Image from "next/image";

export function ResortTheme(props: MenuThemeProps) {
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

  // Bento Box Class Generator
  const getBentoClass = (index: number) => {
    if (layoutMode === "list") return "col-span-1";
    
    // 5-box asymmetric pattern
    const pattern = index % 5;
    if (pattern === 0) return "col-span-2 row-span-2 md:col-span-2 md:row-span-2"; // Giant Hero Card
    if (pattern === 1) return "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; // Small square
    if (pattern === 2) return "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; // Small square
    if (pattern === 3) return "col-span-2 md:col-span-2 row-span-1"; // Wide banner
    if (pattern === 4) return "col-span-2 md:col-span-1 row-span-1"; // Medium square
    return "col-span-1 row-span-1";
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF] text-[#003366] font-sans pb-32" style={{ fontFamily: '"Inter", "system-ui", sans-serif' }}>
      
      {/* Resort Header */}
      <header className="relative w-full pt-20 pb-12 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB]/30 to-transparent z-0"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,105,148,0.2)] flex items-center justify-center mb-6 mx-auto text-[#006994] rotate-3 hover:rotate-0 transition-transform">
            <Waves size={36} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-[#003366] mb-3">
            {restaurant.name}
          </h1>
          <p className="text-[#006994] font-semibold tracking-widest uppercase text-xs">
            {restaurant.cuisine_type || "Oasis Resort & Beach Club"}
          </p>
        </div>
      </header>

      <div className="relative z-10">
        {/* Floating Controls */}
        <div className="sticky top-4 z-40 px-4 mb-10">
          <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_40px_rgba(0,51,102,0.1)] p-3 border border-white/50">
            
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                placeholder="Search resort menu..." 
                value={searchQuery}
                onChange={(e) => setters.setSearchQuery(e.target.value)}
                className="flex-grow bg-[#F0F8FF] text-[#003366] px-6 py-4 rounded-[20px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#87CEEB] placeholder-[#87CEEB] transition-all"
              />
              <button 
                onClick={() => setters.setLayoutMode(layoutMode === "grid" ? "list" : "grid")} 
                className="bg-[#F0F8FF] px-6 py-4 rounded-[20px] hover:bg-[#E0F7FA] transition-colors text-[#006994] font-bold text-sm"
              >
                {layoutMode === "grid" ? "List View" : "Bento Grid"}
              </button>
            </div>

            {/* Pill Filters */}
            <div className="flex gap-2 px-1 mb-3">
              <button onClick={() => setters.setFilterVeg(!filterVeg)} className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all ${filterVeg ? "bg-[#4CAF50] text-white shadow-md" : "bg-white border border-[#4CAF50]/30 text-[#4CAF50] hover:bg-[#4CAF50]/10"}`}>Plant-based</button>
              <button onClick={() => setters.setFilterGF(!filterGF)} className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all ${filterGF ? "bg-[#FF9800] text-white shadow-md" : "bg-white border border-[#FF9800]/30 text-[#FF9800] hover:bg-[#FF9800]/10"}`}>Gluten Free</button>
            </div>

            {/* Category Bubbles */}
            <div ref={categoryNavRef} className="flex overflow-x-auto scrollbar-none py-2 px-1 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  id={`nav-pill-${cat.id}`}
                  onClick={() => handlers.scrollToCategory(cat.id)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                    activeCategory === cat.id 
                      ? "bg-[#003366] text-white shadow-[0_8px_16px_rgba(0,51,102,0.3)] scale-105" 
                      : "bg-white border border-[#87CEEB]/50 text-[#006994] hover:bg-[#E0F7FA] hover:text-[#003366]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bento Grid Menu Content */}
        <main className="max-w-5xl mx-auto p-4 sm:p-6 space-y-24">
          {categories.map(cat => {
            const catItems = filteredItems.filter(i => i.category_id === cat.id);
            if (catItems.length === 0) return null;

            return (
              <section key={cat.id} id={`cat-${cat.id}`} ref={el => { categoryRefs.current[cat.id] = el; }} className="scroll-mt-48">
                
                <div className="flex items-center gap-4 mb-10 pl-2">
                  <div className="w-12 h-1 bg-[#87CEEB] rounded-full"></div>
                  <h2 className="text-3xl font-black text-[#003366]">{cat.name}</h2>
                </div>

                <div className={layoutMode === "grid" 
                  ? "grid grid-cols-2 md:grid-cols-3 auto-rows-[220px] gap-4 sm:gap-6" 
                  : "flex flex-col gap-4 max-w-3xl mx-auto"}>
                  
                  {catItems.map((item, index) => {
                    const bentoClass = getBentoClass(index);
                    const isGiant = bentoClass.includes("row-span-2");
                    
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => setters.setSelectedItem(item)}
                        className={`group cursor-pointer bg-white rounded-[32px] overflow-hidden shadow-[0_10px_30px_rgba(0,51,102,0.05)] hover:shadow-[0_20px_40px_rgba(0,105,148,0.15)] hover:-translate-y-1 transition-all duration-300 flex ${layoutMode === "list" ? "flex-col sm:flex-row p-4 gap-6 items-center h-auto" : `${bentoClass} flex-col relative`}`}
                      >
                        {item.image_url ? (
                          <div className={`${layoutMode === "list" ? "w-full sm:w-40 h-40 rounded-[24px]" : "absolute inset-0 w-full h-full"} overflow-hidden z-0`}>
                            <Image src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" fill />
                            {/* Gradient Overlay for Bento items */}
                            {layoutMode === "grid" && (
                              <div className={`absolute inset-0 bg-gradient-to-t ${isGiant ? "from-[#003366]/90 via-[#003366]/40 to-transparent" : "from-[#003366]/80 to-transparent"} z-10`}></div>
                            )}
                          </div>
                        ) : (
                          // Fallback gradient if no image
                          <div className={`${layoutMode === "list" ? "w-full sm:w-40 h-40 rounded-[24px]" : "absolute inset-0 w-full h-full"} bg-gradient-to-br from-[#E0F7FA] to-[#87CEEB]/30 z-0`}></div>
                        )}
                        
                        {/* Content Area */}
                        <div className={`relative z-20 flex flex-col justify-end h-full ${layoutMode === "list" ? "w-full py-2" : "p-6"}`}>
                          
                          {/* Price Tag */}
                          <div className={`absolute ${layoutMode === "list" ? "top-2 right-0" : "top-4 right-4"} z-30`}>
                            <span className="text-sm font-black bg-white/90 backdrop-blur-md text-[#003366] px-4 py-2 rounded-2xl shadow-lg">
                              {currencySign}{item.price.toFixed(2)}
                            </span>
                          </div>

                          <div className={layoutMode === "list" ? "pr-20" : "mt-auto"}>
                            <h3 className={`font-black ${layoutMode === "list" ? "text-2xl text-[#003366] mb-2" : `text-white drop-shadow-md ${isGiant ? "text-3xl mb-2" : "text-xl mb-1"}`}`}>
                              {item.name}
                            </h3>
                            
                            {(item.description && (layoutMode === "list" || isGiant)) && (
                              <p className={`text-sm line-clamp-2 ${layoutMode === "list" ? "text-[#006994]" : "text-white/80 font-medium"} mb-4`}>
                                {item.description}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.is_popular && <span className="text-[10px] uppercase font-black bg-[#FF9800] text-white px-3 py-1.5 rounded-xl flex items-center gap-1"><Star size={10} fill="currentColor"/> Signature</span>}
                              {item.is_vegetarian && <span className="text-[10px] uppercase font-black bg-[#4CAF50] text-white px-3 py-1.5 rounded-xl">Plant</span>}
                              {item.is_spicy && <span className="text-[10px] uppercase font-black bg-[#F44336] text-white px-3 py-1.5 rounded-xl"><Flame size={10} fill="currentColor"/></span>}
                            </div>
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

      {/* Item Modal (Resort) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center p-0 sm:p-4 bg-[#003366]/40 backdrop-blur-md">
          
          <div className="bg-white sm:rounded-[40px] rounded-t-[40px] w-full max-w-lg mx-auto flex flex-col max-h-[90vh] shadow-2xl overflow-hidden relative animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            
            <button onClick={() => setters.setSelectedItem(null)} className="absolute top-4 right-4 bg-black/20 backdrop-blur-xl text-white hover:bg-black/40 p-3 rounded-full transition-colors z-20">
              <X size={20} strokeWidth={3} />
            </button>
            
            {selectedItem.image_url ? (
              <div className="w-full h-72 relative">
                <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" fill />
              </div>
            ) : (
              <div className="w-full h-32 bg-gradient-to-br from-[#E0F7FA] to-[#87CEEB]/30"></div>
            )}

            <div className="px-8 pt-8 pb-8 flex flex-col flex-grow overflow-y-auto bg-white relative z-10 -mt-10 rounded-t-[40px]">
              
              <div className="flex justify-between items-start gap-4 mb-4">
                <h2 className="text-3xl font-black text-[#003366] leading-tight">{selectedItem.name}</h2>
                <div className="bg-[#E0F7FA] text-[#006994] font-black text-xl px-4 py-2 rounded-2xl shrink-0">
                  {currencySign}{selectedItem.price.toFixed(2)}
                </div>
              </div>
              
              <p className="text-[#006994] text-lg leading-relaxed mb-8 font-medium">
                {selectedItem.description}
              </p>

              {canOrder && (
                <div className="space-y-6 mb-8 bg-[#F0F8FF] p-6 rounded-[32px]">
                  {/* Quantity */}
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-[#003366]">Quantity</span>
                    <div className="flex items-center gap-4 bg-white rounded-2xl p-1.5 shadow-sm">
                      <button onClick={() => setters.setOrderQuantity(Math.max(1, orderQuantity - 1))} className="w-10 h-10 rounded-xl bg-[#F0F8FF] text-[#006994] hover:bg-[#E0F7FA] transition-colors flex items-center justify-center font-black text-xl">-</button>
                      <span className="text-xl font-black text-[#003366] w-6 text-center">{orderQuantity}</span>
                      <button onClick={() => setters.setOrderQuantity(orderQuantity + 1)} className="w-10 h-10 rounded-xl bg-[#F0F8FF] text-[#006994] hover:bg-[#E0F7FA] transition-colors flex items-center justify-center font-black text-xl">+</button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-3">Special requests?</label>
                    <textarea 
                      value={orderNotes}
                      onChange={(e) => setters.setOrderNotes(e.target.value)}
                      placeholder="e.g., extra ice, no lime..."
                      className="w-full bg-white text-[#003366] placeholder-[#87CEEB] rounded-2xl p-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#87CEEB] resize-none h-24 shadow-sm"
                    />
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4">
                <button 
                  onClick={() => canOrder ? handlers.handleAddToCart() : setters.setSelectedItem(null)}
                  className="w-full py-5 bg-[#003366] text-white font-black text-xl rounded-full shadow-[0_10px_20px_rgba(0,51,102,0.3)] hover:shadow-[0_15px_30px_rgba(0,51,102,0.4)] hover:-translate-y-1 active:scale-95 transition-all"
                >
                  {canOrder ? `Add to Order • ${currencySign}${(selectedItem.price * orderQuantity).toFixed(2)}` : "Close Details"}
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
