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
  Flame,
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
      <div className="mx-auto w-full max-w-full sm:max-w-xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl min-h-screen bg-[#09090B] shadow-[0_0_50px_rgba(0,255,65,0.15)] border-x border-[#00FF41]/20 flex flex-col pb-28 relative">
        
        {/* Cyberpunk Terminal Header */}
        <div className="bg-[#121215] border-b border-[#00FF41]/30 p-6 pt-10 sm:pt-12 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-[10px] text-[#00FF41] select-none pointer-events-none hidden sm:block">
            SYSTEM.READY<br/>
            CYBER_MENU_V2.0<br/>
            NEON_PROTOCOL_ACTIVE
          </div>
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#00FF41]/10 border border-[#00FF41]/40 px-3 py-1 rounded-sm shadow-[0_0_10px_rgba(0,255,65,0.2)]">
              <Terminal className="w-3.5 h-3.5 text-[#00FF41] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00FF41]">
                {restaurant.cuisine_type || "Tech Nightlife & Dining"}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-wider uppercase drop-shadow-[0_0_15px_rgba(0,255,65,0.6)]">
              {restaurant.name}
            </h1>

            <div className="flex gap-3 flex-wrap pt-1">
              {restaurant.phone && (
                <a href={`tel:${restaurant.phone}`} className="bg-[#18181B] border border-[#00FF41]/50 px-3 py-1.5 text-xs font-bold text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-all flex items-center gap-1.5 shadow-[0_0_8px_rgba(0,255,65,0.2)]">
                  <Phone className="w-3.5 h-3.5" /> CALL
                </a>
              )}
              {restaurant.wifi_password && (
                <button onClick={() => setShowAmenities(true)} className="bg-[#18181B] border border-[#00FF41]/50 px-3 py-1.5 text-xs font-bold text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-all flex items-center gap-1.5 shadow-[0_0_8px_rgba(0,255,65,0.2)] cursor-pointer">
                  <Wifi className="w-3.5 h-3.5" /> WIFI
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Cyber Search & Category Navigation */}
        <div className="sticky top-0 z-30 bg-[#09090B]/95 backdrop-blur-md border-b border-[#00FF41]/30 py-3 px-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#00FF41]/70" />
            <input
              type="text"
              placeholder="SEARCH_MATRIX_ITEMS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#121215] border border-[#00FF41]/40 text-[#00FF41] placeholder-[#00FF41]/40 font-mono text-sm focus:outline-none focus:border-[#00FF41] focus:shadow-[0_0_15px_rgba(0,255,65,0.4)] transition-all uppercase rounded-none"
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
                  className={`inline-block px-4 py-2 text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer border ${
                    active 
                      ? "bg-[#00FF41] text-black border-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.8)]" 
                      : "bg-[#121215] text-[#00FF41] border-[#00FF41]/30 hover:border-[#00FF41] hover:shadow-[0_0_10px_rgba(0,255,65,0.3)]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cyber Neon Menu Content */}
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
                  className="scroll-mt-40"
                >
                  <div className="inline-flex items-center gap-2 bg-[#121215] border-l-4 border-[#00FF41] px-4 py-2 mb-6 border-y border-r border-[#00FF41]/20 shadow-[0_0_15px_rgba(0,255,65,0.15)]">
                    <Zap className="w-4 h-4 text-[#00FF41] animate-pulse" />
                    <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">{cat.name}</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {categoryItems.map((item) => {
                      const price = `${currencySign}${Number(item.price).toFixed(2)}`;
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="group cursor-pointer bg-[#121215] border border-[#00FF41]/30 hover:border-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.05)] hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all flex flex-col h-full relative"
                        >
                          {item.image_url ? (
                            <div className="w-full aspect-video sm:aspect-square border-b border-[#00FF41]/30 bg-[#09090B] relative overflow-hidden">
                              <Image 
                                src={item.image_url} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                fill 
                              />
                              {item.is_popular && (
                                <div className="absolute top-2 right-2 bg-[#00FF41] text-black text-[9px] font-black py-0.5 px-2.5 uppercase shadow-[0_0_10px_rgba(0,255,65,0.8)]">
                                  POPULAR
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-full aspect-video sm:aspect-square border-b border-[#00FF41]/30 bg-[#18181B] relative overflow-hidden flex items-center justify-center">
                              <Zap className="w-8 h-8 text-[#00FF41]/30" />
                              {item.is_popular && (
                                <div className="absolute top-2 right-2 bg-[#00FF41] text-black text-[9px] font-black py-0.5 px-2.5 uppercase shadow-[0_0_10px_rgba(0,255,65,0.8)]">
                                  POPULAR
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="p-4 flex flex-col flex-grow">
                            <div className="flex justify-between items-start gap-2 mb-1.5">
                              <h3 className="font-bold text-base sm:text-sm text-white uppercase leading-snug group-hover:text-[#00FF41] transition-colors line-clamp-2">
                                {item.name}
                              </h3>
                            </div>
                            <span className="font-black text-base sm:text-sm text-[#00FF41] mb-2 drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]">
                              {price}
                            </span>
                            
                            {item.description && (
                              <p className="text-xs sm:text-[11px] font-mono text-zinc-400 line-clamp-2 leading-relaxed mt-auto">
                                {item.description}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-2 pt-3">
                              {item.is_vegetarian && <span className="text-[9px] uppercase border border-[#00FF41]/40 px-1.5 py-0.5 text-[#00FF41]">VEG</span>}
                              {item.is_spicy && <span className="text-[9px] uppercase border border-[#FF007F]/50 px-1.5 py-0.5 text-[#FF007F]">SPICY</span>}
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
            <div className="text-center py-20 border border-[#00FF41]/20 bg-[#121215]">
              <p className="font-mono text-sm uppercase text-[#00FF41]/60">NO_ITEMS_FOUND_IN_MATRIX</p>
            </div>
          )}
        </div>

      </div>

      {/* Cyber Neon Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-x-0 bottom-0 sm:inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-300" onClick={() => setSelectedItem(null)}>
          <div className="relative bg-[#121215] w-full sm:max-w-xl border-t-2 sm:border-2 border-[#00FF41] shadow-[0_0_40px_rgba(0,255,65,0.3)] rounded-t-3xl sm:rounded-none flex flex-col max-h-[92vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1 bg-[#00FF41]/40 rounded-full mx-auto my-2.5 sm:hidden"></div>
            
            <div className="p-4 border-b border-[#00FF41]/30 flex justify-between items-center bg-[#18181B]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00FF41]" />
                <h2 className="text-base font-bold text-white uppercase tracking-wider">ITEM_MATRIX_DATA</h2>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-[#00FF41] hover:bg-[#00FF41] hover:text-black p-1.5 transition-colors border border-[#00FF41]/40">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow space-y-6">
              {selectedItem.image_url && (
                <div className="w-full aspect-[4/3] sm:aspect-[16/11] relative bg-[#09090B] border border-[#00FF41]/40 overflow-hidden shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                  <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" fill />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-2xl font-black text-white uppercase tracking-wide">{selectedItem.name}</h3>
                  <span className="text-xl font-black text-[#00FF41] drop-shadow-[0_0_10px_rgba(0,255,65,0.8)] shrink-0">
                    {currencySign}{Number(selectedItem.price).toFixed(2)}
                  </span>
                </div>

                {selectedItem.description && (
                  <p className="text-sm text-zinc-300 leading-relaxed font-mono">
                    {selectedItem.description}
                  </p>
                )}
              </div>

              {canOrder && (
                <div className="space-y-6 pt-4 border-t border-[#00FF41]/20">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-[#00FF41] font-bold">SPEC_NOTES</label>
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Enter custom instructions..."
                      className="w-full bg-[#09090B] border border-[#00FF41]/40 p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00FF41] transition-all resize-none font-mono"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center justify-between bg-[#09090B] p-3 border border-[#00FF41]/30">
                    <span className="text-xs uppercase tracking-widest text-[#00FF41] font-bold">QTY</span>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                        className="w-8 h-8 flex items-center justify-center border border-[#00FF41]/50 text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center text-white font-bold text-lg">{orderQuantity}</span>
                      <button 
                        onClick={() => setOrderQuantity(orderQuantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-[#00FF41]/50 text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#18181B] border-t border-[#00FF41]/30">
              <button
                onClick={() => canOrder ? handleAddToCart() : setSelectedItem(null)}
                className="w-full py-3.5 bg-[#00FF41] text-black font-bold uppercase text-sm tracking-widest hover:bg-[#00FF41]/90 shadow-[0_0_20px_rgba(0,255,65,0.6)] transition-all flex justify-between items-center px-6"
              >
                <span>{canOrder ? "TRANSMIT ORDER" : "CLOSE_MATRIX"}</span>
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
