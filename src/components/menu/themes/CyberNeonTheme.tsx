"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Wifi, 
  X,
  Phone,
  Terminal,
  Zap,
  Sparkles,
  Plus,
  Minus
} from "lucide-react";
import { MenuThemeProps, MenuItem } from "../types";
import Image from "next/image";
import { useCart } from "../cart-context";
import { FeedbackFAB } from "../feedback-fab";
import { getCurrencySymbol } from "@/lib/currency-options";

export function CyberNeonTheme({ restaurant, categories, items, tableNumber, qrCodeId }: MenuThemeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  
  // Modals
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showAmenities, setShowAmenities] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState("");
  
  const { addToCart } = useCart();
  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const canOrder = currentPlan === "elite" || currentPlan === "enterprise";
  const canFeedback = currentPlan !== "free";

  const handleAddToCart = () => {
    if (!selectedItem || !canOrder) return;
    addToCart(selectedItem, orderQuantity, orderNotes);
    setSelectedItem(null);
    setOrderQuantity(1);
    setOrderNotes("");
  };

  const currencySign = getCurrencySymbol(restaurant.currency);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const activeCategoryRef = useRef(activeCategory);
  useEffect(() => {
    activeCategoryRef.current = activeCategory;
  }, [activeCategory]);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return;
      const scrollPosition = window.scrollY + 250; 
      
      let currentCategory = "";
      for (const catId of Object.keys(categoryRefs.current)) {
        const el = categoryRefs.current[catId];
        if (el && el.offsetTop <= scrollPosition) {
          currentCategory = catId;
        }
      }
      
      if (currentCategory && currentCategory !== activeCategoryRef.current) {
        setActiveCategory(currentCategory);
        const activeNavEl = document.getElementById(`nav-pill-${currentCategory}`);
        if (activeNavEl && categoryNavRef.current) {
          const navContainer = categoryNavRef.current;
          const leftOffset = activeNavEl.offsetLeft - (navContainer.clientWidth / 2) + (activeNavEl.clientWidth / 2);
          navContainer.scrollTo({ left: leftOffset, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    if (categories.length > 0 && !activeCategoryRef.current) {
      setActiveCategory(categories[0].id);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    isScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    
    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
    }, 1000);

    const el = categoryRefs.current[catId];
    if (el) {
      const offset = el.offsetTop - 140;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-[#09090B] text-[#00FF41] font-mono selection:bg-[#00FF41] selection:text-black">
      <div className="mx-auto w-full max-w-full sm:max-w-xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl min-h-screen bg-[#09090B] shadow-[0_0_50px_rgba(0,255,65,0.1)] border-x border-[#00FF41]/20 flex flex-col pb-28 relative">
        
        {/* Cyber Neon Header matching exact mockup */}
        <div className="pt-16 pb-6 px-6 text-center bg-[#09090B] relative">
          <h1 className="text-3xl sm:text-5xl font-mono font-bold tracking-widest text-[#00FF41] uppercase mb-2 drop-shadow-[0_0_20px_rgba(0,255,65,0.8)]">
            {restaurant.name}
          </h1>
          
          <p className="text-[#008F11] font-mono tracking-[0.3em] text-xs uppercase mb-6 font-semibold">
            {restaurant.cuisine_type || "FINE DINING"}
          </p>

          <div className="w-full border-t border-[#00FF41] shadow-[0_0_12px_#00FF41] my-4"></div>

          <div className="text-[#008F11] font-mono text-[11px] tracking-widest uppercase py-2 bg-[#121215]/90 border-y border-[#00FF41]/30 flex justify-center items-center gap-2">
            <span>LOC // {restaurant.address || "MAIN STREET"}</span>
            {restaurant.wifi_password && (
              <button onClick={() => setShowAmenities(true)} className="text-[#00FF41] hover:underline ml-4 cursor-pointer">
                [WIFI]
              </button>
            )}
          </div>
        </div>

        {/* Sticky Cyber Search & Category Navigation */}
        <div className="sticky top-0 z-30 bg-[#09090B]/95 backdrop-blur-md border-b border-[#00FF41]/30 py-3 px-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#00FF41]/70" />
            <input
              type="text"
              placeholder="SEARCH MENU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#141417] border border-[#00FF41]/40 text-[#00FF41] placeholder-[#008F11] font-mono text-sm focus:outline-none focus:border-[#00FF41] focus:shadow-[0_0_15px_rgba(0,255,65,0.4)] transition-all uppercase rounded-xl"
            />
          </div>

          <div 
            ref={categoryNavRef} 
            className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1 pt-1"
          >
            {categories.map((cat) => {
              const active = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  id={`nav-pill-${cat.id}`}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`inline-block px-4 py-2 text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer rounded-xl border ${
                    active 
                      ? "bg-[#00FF41] text-black border-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.8)]" 
                      : "bg-[#141417] text-[#00FF41] border-[#00FF41]/30 hover:border-[#00FF41] hover:shadow-[0_0_10px_rgba(0,255,65,0.3)]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cyber Neon Menu Content - Matching Exact Card Mockup */}
        <div className="px-4 py-8 space-y-12 flex-grow">
          {categories.length > 0 ? (
            categories.map((cat) => {
              const categoryItems = filteredItems.filter((item) => item.category_id === cat.id);
              if (categoryItems.length === 0) return null;

              return (
                <section
                  key={cat.id}
                  id={`cat-${cat.id}`}
                  ref={(el) => {
                    categoryRefs.current[cat.id] = el;
                  }}
                  className="scroll-mt-40 space-y-6"
                >
                  <div className="text-center border-b border-[#00FF41]/20 pb-3">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-[#00FF41] drop-shadow-[0_0_10px_rgba(0,255,65,0.6)]">{cat.name}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {categoryItems.map((item) => {
                      const price = `${currencySign}${Number(item.price).toFixed(2)}`;
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="group cursor-pointer bg-[#18181B] rounded-2xl border-l-4 border-t-2 border-r border-b border-[#00FF41] border-[#00FF41]/30 shadow-[0_0_15px_rgba(0,255,65,0.1)] hover:shadow-[0_0_25px_rgba(0,255,65,0.35)] transition-all p-4 flex items-center gap-4 relative overflow-hidden"
                        >
                          {item.image_url ? (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#00FF41]/40 relative bg-[#09090B]">
                              <Image 
                                src={item.image_url} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                fill 
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl shrink-0 border border-[#00FF41]/40 bg-[#121215] flex items-center justify-center">
                              <Zap className="w-8 h-8 text-[#00FF41]/40" />
                            </div>
                          )}
                          
                          <div className="flex-grow min-w-0 pr-2">
                            <h3 className="font-mono font-bold text-base sm:text-lg text-[#00FF41] tracking-wide leading-tight drop-shadow-[0_0_6px_rgba(0,255,65,0.5)] truncate">
                              {item.name}
                            </h3>
                            
                            {item.description && (
                              <p className="text-[#00A816] font-mono text-xs leading-relaxed line-clamp-2 mt-1.5">
                                {item.description}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-2 pt-2">
                              {item.is_popular && <span className="text-[9px] uppercase border border-[#00FF41] px-1.5 py-0.5 text-[#00FF41] bg-[#00FF41]/10 rounded">POPULAR</span>}
                              {item.is_vegetarian && <span className="text-[9px] uppercase border border-[#00FF41]/40 px-1.5 py-0.5 text-[#00FF41] rounded">VEG</span>}
                            </div>
                          </div>

                          <div className="shrink-0 ml-auto">
                            <div className="border border-[#00FF41] bg-[#00FF41]/10 text-[#00FF41] font-mono font-bold px-3 py-1.5 rounded-lg text-sm shadow-[0_0_10px_rgba(0,255,65,0.4)] whitespace-nowrap">
                              {price}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })
          ) : (
            <div className="text-center py-20 border border-[#00FF41]/20 bg-[#18181B] rounded-2xl">
              <p className="font-mono text-sm uppercase text-[#00FF41]/60">NO MENU ITEMS FOUND</p>
            </div>
          )}
        </div>

      </div>

      {/* Cyber Neon Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-x-0 bottom-0 sm:inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-300" onClick={() => setSelectedItem(null)}>
          <div className="relative bg-[#18181B] w-full sm:max-w-lg border-l-4 border-t-2 border-r border-b border-[#00FF41] shadow-[0_0_40px_rgba(0,255,65,0.4)] rounded-t-3xl sm:rounded-2xl flex flex-col max-h-[92vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1 bg-[#00FF41]/40 rounded-full mx-auto my-2.5 sm:hidden"></div>
            
            <div className="p-4 border-b border-[#00FF41]/30 flex justify-between items-center bg-[#121215]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00FF41]" />
                <h2 className="text-sm font-bold text-[#00FF41] uppercase tracking-wider">ITEM DETAILS</h2>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-[#00FF41] hover:bg-[#00FF41] hover:text-black p-1.5 transition-colors border border-[#00FF41]/40 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow space-y-6">
              {selectedItem.image_url && (
                <div className="w-full aspect-[4/3] sm:aspect-[16/11] relative bg-[#09090B] border border-[#00FF41]/40 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                  <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" fill />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-2xl font-bold text-[#00FF41] uppercase tracking-wide drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]">{selectedItem.name}</h3>
                  <div className="border border-[#00FF41] bg-[#00FF41]/10 text-[#00FF41] font-mono font-bold px-3 py-1.5 rounded-lg text-lg shadow-[0_0_10px_rgba(0,255,65,0.5)] shrink-0">
                    {currencySign}{Number(selectedItem.price).toFixed(2)}
                  </div>
                </div>

                {selectedItem.description && (
                  <p className="text-sm text-[#00A816] leading-relaxed font-mono">
                    {selectedItem.description}
                  </p>
                )}
              </div>

              {canOrder && (
                <div className="space-y-6 pt-4 border-t border-[#00FF41]/20">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-[#00FF41] font-bold">SPECIAL REQUESTS</label>
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Special instructions..."
                      className="w-full bg-[#121215] border border-[#00FF41]/40 p-3 text-sm text-[#00FF41] placeholder-[#008F11] focus:outline-none focus:border-[#00FF41] transition-all resize-none font-mono rounded-xl"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center justify-between bg-[#121215] p-3 border border-[#00FF41]/30 rounded-xl">
                    <span className="text-xs uppercase tracking-widest text-[#00FF41] font-bold">QUANTITY</span>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                        className="w-8 h-8 flex items-center justify-center border border-[#00FF41]/50 text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-colors rounded-lg font-bold"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center text-white font-bold text-lg">{orderQuantity}</span>
                      <button 
                        onClick={() => setOrderQuantity(orderQuantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-[#00FF41]/50 text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-colors rounded-lg font-bold"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#121215] border-t border-[#00FF41]/30">
              <button
                onClick={() => canOrder ? handleAddToCart() : setSelectedItem(null)}
                className="w-full py-3.5 bg-[#00FF41] text-black font-bold uppercase text-sm tracking-widest hover:bg-[#00FF41]/90 shadow-[0_0_20px_rgba(0,255,65,0.6)] transition-all flex justify-between items-center px-6 rounded-xl"
              >
                <span>{canOrder ? "ADD TO ORDER" : "CLOSE"}</span>
                {canOrder && (
                  <span className="font-black">
                    {currencySign}{(selectedItem.price * orderQuantity).toFixed(2)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {canFeedback && <FeedbackFAB restaurantId={restaurant.id} tableNumber={tableNumber} qrCodeId={qrCodeId} />}
    </div>
  );
}
