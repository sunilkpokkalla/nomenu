import React from "react";
import { X, Star, UtensilsCrossed } from "lucide-react";
import { useCart } from "../cart-context";
import { useMenuLogic } from "../use-menu-logic";
import { MenuThemeProps } from "../types";
import { FeedbackFAB } from "../feedback-fab";
import Image from "next/image";
import { getCurrencySymbol } from "@/lib/currency-options";

export function BistroTheme(props: MenuThemeProps) {
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

  // Classic Magazine Bento Grid
  const getBentoClass = (index: number) => {
    if (layoutMode === "list") return "col-span-1";
    
    // 5-box asymmetric magazine layout
    const pattern = index % 5;
    if (pattern === 0) return "col-span-2 row-span-2 md:col-span-2 md:row-span-2 border-b-4 border-black pb-4"; // Giant Hero
    if (pattern === 1) return "col-span-1 row-span-1 md:col-span-1 md:row-span-1 border-b border-[#DCD3C6] pb-4"; // Small side
    if (pattern === 2) return "col-span-1 row-span-1 md:col-span-1 md:row-span-1 border-b border-[#DCD3C6] pb-4"; // Small side
    if (pattern === 3) return "col-span-2 md:col-span-1 row-span-1 border-t-2 border-black pt-4"; // Medium focus
    if (pattern === 4) return "col-span-2 md:col-span-2 row-span-1 border-t-2 border-black pt-4"; // Wide focus
    return "col-span-1 row-span-1";
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] pb-32" style={{ fontFamily: '"Georgia", serif' }}>
      {/* Bistro Header */}
      <header className="w-full pt-16 pb-12 px-6 flex flex-col items-center text-center border-b-[1px] border-[#1A1A1A]">
        <div className="mb-8">
          <UtensilsCrossed size={32} strokeWidth={1} className="text-[#1A1A1A]" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-normal tracking-wide text-[#1A1A1A] mb-4 uppercase">
          {restaurant.name}
        </h1>

        <p className="text-[#666666] font-sans tracking-[0.3em] uppercase text-[10px]">
          {restaurant.cuisine_type || "Classic Bistro & Dining"}
        </p>
      </header>

      <div className="relative z-10">
        {/* Minimal Controls */}
        <div className="sticky top-0 z-40 px-0 mb-12 border-b border-[#EAE3D2] bg-[#FDFBF7]/95 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 font-sans">
            
            <div className="flex gap-4 w-full sm:w-auto">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setters.setSearchQuery(e.target.value)}
                className="flex-grow sm:w-64 bg-transparent border-b border-[#1A1A1A] text-[#1A1A1A] px-2 py-2 text-sm focus:outline-none placeholder-[#999999] transition-all rounded-none"
              />
              <button 
                onClick={() => setters.setLayoutMode(layoutMode === "grid" ? "list" : "grid")} 
                className="border border-[#1A1A1A] px-4 py-2 text-[#1A1A1A] text-xs tracking-widest uppercase hover:bg-[#1A1A1A] hover:text-[#FDFBF7] transition-colors shrink-0"
              >
                {layoutMode === "grid" ? "Index" : "Gallery"}
              </button>
            </div>

            {/* Category Nav */}
            <div ref={categoryNavRef} className="flex overflow-x-auto scrollbar-none py-1 gap-6 w-full sm:w-auto justify-start sm:justify-end">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handlers.scrollToCategory(cat.id)}
                  className={`whitespace-nowrap text-xs tracking-[0.2em] uppercase transition-all ${
                    activeCategory === cat.id 
                      ? "text-[#1A1A1A] font-bold border-b border-[#1A1A1A] pb-1" 
                      : "text-[#999999] hover:text-[#1A1A1A]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Magazine Grid Menu Content */}
        <main className="max-w-5xl mx-auto p-4 sm:p-6 space-y-24">
          {categories.map(cat => {
            const catItems = filteredItems.filter(i => i.category_id === cat.id);
            if (catItems.length === 0) return null;

            return (
              <section key={cat.id} id={`cat-${cat.id}`} ref={el => { categoryRefs.current[cat.id] = el; }} className="scroll-mt-32">
                
                <div className="mb-12 text-center border-b border-[#DCD3C6] pb-8">
                  <h2 className="text-3xl font-normal tracking-widest text-[#1A1A1A] uppercase">{cat.name}</h2>
                </div>

                <div className={layoutMode === "grid" 
                  ? "grid grid-cols-2 md:grid-cols-3 auto-rows-[250px] gap-x-8 gap-y-12" 
                  : "flex flex-col gap-8 max-w-3xl mx-auto"}>
                  
                  {catItems.map((item, index) => {
                    const bentoClass = getBentoClass(index);
                    const isGiant = bentoClass.includes("row-span-2");
                    
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => setters.setSelectedItem(item)}
                        className={`group cursor-pointer flex ${layoutMode === "list" ? "flex-col sm:flex-row gap-6 items-center border-b border-[#EAE3D2] pb-8" : `${bentoClass} flex-col h-full`}`}
                      >
                        {item.image_url ? (
                          <div className={`${layoutMode === "list" ? "w-full sm:w-48 h-48" : "w-full h-3/5 mb-4"} overflow-hidden relative grayscale-[20%] group-hover:grayscale-0 transition-all duration-700`}>
                            <Image src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" fill />
                          </div>
                        ) : (
                          <div className={`${layoutMode === "list" ? "hidden" : "hidden"}`}></div> // No placeholder box in bistro theme, just text
                        )}
                        
                        {/* Content Area */}
                        <div className={`flex flex-col flex-grow ${layoutMode === "list" ? "w-full" : "justify-between"}`}>
                          
                          <div>
                            <div className="flex justify-between items-baseline gap-4 mb-2">
                              <h3 className={`font-normal tracking-wide text-[#1A1A1A] ${isGiant ? "text-3xl" : "text-xl"}`}>
                                {item.name}
                              </h3>
                              <span className="font-sans text-sm tracking-widest text-[#666666] shrink-0">
                                {currencySign}{item.price.toFixed(2)}
                              </span>
                            </div>
                            
                            {item.description && (
                              <p className={`font-sans text-[13px] text-[#666666] leading-relaxed ${isGiant ? "line-clamp-4" : "line-clamp-2"} mt-2`}>
                                {item.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-3 mt-4 font-sans text-[10px] tracking-widest uppercase text-[#999999]">
                            {item.is_popular && <span className="flex items-center gap-1 border border-[#EAE3D2] px-2 py-1"><Star size={10}/> Chef's Pick</span>}
                            {item.is_vegetarian && <span className="border border-[#EAE3D2] px-2 py-1">Vegetarian</span>}
                            {item.is_spicy && <span className="border border-[#EAE3D2] px-2 py-1 text-[#1A1A1A]">Spicy</span>}
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

      {/* Item Modal (Bistro) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FDFBF7]/90 backdrop-blur-sm">
          
          <div className="bg-[#FDFBF7] w-full max-w-2xl max-h-[90vh] flex flex-col sm:flex-row shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-[#EAE3D2] overflow-hidden relative animate-in fade-in zoom-in-95 duration-500">
            
            <button onClick={() => setters.setSelectedItem(null)} className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-[#1A1A1A] hover:bg-black hover:text-white p-2 rounded-full transition-colors z-20">
              <X size={20} strokeWidth={1} />
            </button>
            
            {selectedItem.image_url && (
              <div className="w-full sm:w-1/2 h-64 sm:h-auto relative grayscale-[10%]">
                <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" fill />
              </div>
            )}

            <div className={`p-8 sm:p-12 flex flex-col flex-grow overflow-y-auto ${!selectedItem.image_url ? 'w-full' : 'sm:w-1/2'}`}>
              
              <div className="mb-8 border-b border-[#1A1A1A] pb-6">
                <h2 className="text-3xl font-normal text-[#1A1A1A] mb-4 leading-tight">{selectedItem.name}</h2>
                <div className="font-sans tracking-widest text-[#666666] text-lg">
                  {currencySign}{selectedItem.price.toFixed(2)}
                </div>
              </div>
              
              <p className="font-sans text-sm text-[#666666] leading-loose mb-10">
                {selectedItem.description}
              </p>

              {canOrder && (
                <div className="space-y-8 mb-10 font-sans">
                  {/* Quantity */}
                  <div className="flex justify-between items-center border-t border-b border-[#EAE3D2] py-4">
                    <span className="text-xs tracking-widest uppercase text-[#999999]">Quantity</span>
                    <div className="flex items-center gap-6">
                      <button onClick={() => setters.setOrderQuantity(Math.max(1, orderQuantity - 1))} className="text-[#1A1A1A] hover:text-[#666666] text-xl">-</button>
                      <span className="text-sm font-bold text-[#1A1A1A] w-4 text-center">{orderQuantity}</span>
                      <button onClick={() => setters.setOrderQuantity(orderQuantity + 1)} className="text-[#1A1A1A] hover:text-[#666666] text-xl">+</button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-[#999999] mb-4">Requests</label>
                    <textarea 
                      value={orderNotes}
                      onChange={(e) => setters.setOrderNotes(e.target.value)}
                      placeholder="Add a note for the kitchen..."
                      className="w-full bg-transparent border-b border-[#EAE3D2] text-[#1A1A1A] p-2 text-sm focus:outline-none focus:border-[#1A1A1A] resize-none h-16 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="mt-auto">
                <button 
                  onClick={() => canOrder ? handlers.handleAddToCart() : setters.setSelectedItem(null)}
                  className="w-full py-4 bg-[#1A1A1A] text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#333333] transition-colors"
                >
                  {canOrder ? `Add to Order — ${currencySign}${(selectedItem.price * orderQuantity).toFixed(2)}` : "Close"}
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
