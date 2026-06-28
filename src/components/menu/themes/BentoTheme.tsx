"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Leaf, 
  Flame, 
  Wifi, 
  X,
  Phone,
  MapPin,
  Sparkles
} from "lucide-react";
import { MenuThemeProps, MenuItem } from "../types";
import Image from "next/image";
import { useCart } from "../cart-context";
import { FeedbackFAB } from "../feedback-fab";

export function BentoTheme({ restaurant, categories, items, tableNumber, qrCodeId }: MenuThemeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  
  // Modals
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showAmenities, setShowAmenities] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState("");

  useEffect(() => {
    setOrderQuantity(1);
    setOrderNotes("");
  }, [selectedItem]);

  const currencySymbol = restaurant.currency || "USD";
  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const canOrder = currentPlan === "elite" || currentPlan === "enterprise";
  const canFeedback = currentPlan !== "free";
  const { addToCart } = useCart();

  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

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
      
      if (currentCategory && currentCategory !== activeCategory) {
        setActiveCategory(currentCategory);
        const activeNavEl = document.getElementById(`nav-pill-${currentCategory}`);
        if (activeNavEl && categoryNavRef.current) {
          const navContainer = categoryNavRef.current;
          const leftOffset = activeNavEl.offsetLeft - (navContainer.clientWidth / 2) + (activeNavEl.clientWidth / 2);
          navContainer.scrollTo({ left: leftOffset, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    if (categories.length > 0) {
      setActiveCategory(categories[0].id);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory, categories]);

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
    <div className="min-h-screen bg-[#F0FDF4] font-sans selection:bg-[#FFD166] selection:text-black">
      <div className="mx-auto max-w-md min-h-screen bg-[#F0FDF4] shadow-[8px_0_0_0_rgba(0,0,0,1)] border-x-4 border-black flex flex-col pb-28 relative">
        
        {/* Vibrant Neo-brutalist Header */}
        <div className="bg-[#FFD166] border-b-4 border-black p-6 pt-12 relative overflow-hidden shrink-0">
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#EF476F] rounded-full border-4 border-black"></div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#118AB2] border-4 border-black rotate-12"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="inline-block bg-white border-2 border-black rounded-full px-3 py-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <span className="text-[10px] font-black uppercase tracking-widest text-black">
                {restaurant.cuisine_type || "Street Food"}
              </span>
            </div>
            
            <h1 className="text-5xl font-black text-black leading-none drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-tight">
              {restaurant.name}
            </h1>

            
            <div className="flex gap-2 flex-wrap">
              {restaurant.phone && (
                <a href={`tel:${restaurant.phone}`} className="bg-white border-2 border-black px-2 py-1 text-[10px] font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex items-center gap-1 hover:translate-y-[2px] hover:shadow-none transition-all">
                  <Phone className="w-3 h-3" /> Call
                </a>
              )}
              {restaurant.wifi_password && (
                <button onClick={() => setShowAmenities(true)} className="bg-white border-2 border-black px-2 py-1 text-[10px] font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex items-center gap-1 hover:translate-y-[2px] hover:shadow-none transition-all">
                  <Wifi className="w-3 h-3" /> WiFi
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Nav Bar */}
        <div className="sticky top-0 z-30 bg-[#F0FDF4] border-b-4 border-black py-4 px-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-black" />
            <input
              type="text"
              placeholder="SEARCH MENU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-black placeholder-black/50 font-black focus:outline-none focus:translate-y-[2px] focus:translate-x-[2px] focus:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all uppercase"
            />
          </div>

          <div 
            ref={categoryNavRef} 
            className="flex gap-3 overflow-x-auto scrollbar-none pb-2 pt-1"
          >
            {categories.map((cat) => {
              const active = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  id={`nav-pill-${cat.id}`}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`inline-block px-4 py-2 text-xs font-black uppercase transition-all whitespace-nowrap cursor-pointer border-2 border-black ${
                    active 
                      ? "bg-[#EF476F] text-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]" 
                      : "bg-white text-black hover:bg-slate-100 shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="px-4 py-8 space-y-12 flex-grow bg-[url('https://www.transparenttextures.com/patterns/halftone.png')]">
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
                  <div className="inline-block bg-black text-white px-4 py-2 mb-6 transform -rotate-2">
                    <h2 className="text-2xl font-black uppercase tracking-wider">{cat.name}</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {categoryItems.map((item) => {
                      const price = `${currencySymbol === "EUR" ? "€" : currencySymbol === "GBP" ? "£" : "$"}${Number(item.price).toFixed(2)}`;
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="group cursor-pointer bg-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all flex flex-col h-full"
                        >
                          {item.image_url ? (
                            <div className="w-full aspect-square border-b-4 border-black bg-slate-100 relative overflow-hidden">
                              <Image 
                                src={item.image_url} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                fill 
                              />
                              {item.is_popular && (
                                <div className="absolute top-2 -right-6 bg-[#FFD166] text-black text-[10px] font-black py-1 px-8 rotate-45 border-y-2 border-black">
                                  POPULAR
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-full aspect-square border-b-4 border-black bg-[#118AB2] relative overflow-hidden flex items-center justify-center">
                               {item.is_popular && (
                                <div className="absolute top-2 -right-6 bg-[#FFD166] text-black text-[10px] font-black py-1 px-8 rotate-45 border-y-2 border-black">
                                  POPULAR
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="p-3 flex flex-col flex-grow">
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h3 className="font-black text-sm text-black uppercase leading-tight line-clamp-2">
                                {item.name}
                              </h3>
                            </div>
                            <span className="font-black text-sm text-[#EF476F] mb-2">
                              {price}
                            </span>
                            
                            {item.description && (
                              <p className="text-[10px] font-bold text-slate-600 line-clamp-2 leading-snug mt-auto">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })
          ) : (
            <div className="text-center py-20">
              <p className="font-black uppercase text-xl">No food found!</p>
            </div>
          )}
        </div>

      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col max-h-[90vh]">
            <div className="p-4 border-b-4 border-black flex justify-between items-center bg-[#FFD166]">
              <h2 className="text-xl font-black text-black uppercase">Item Details</h2>
              <button onClick={() => setSelectedItem(null)} className="text-black hover:bg-black hover:text-white p-1 border-2 border-transparent hover:border-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-grow bg-white pb-6">
              {selectedItem.image_url && (
                <div className="w-full aspect-video border-b-4 border-black bg-slate-100 relative">
                  <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" fill />
                </div>
              )}
              
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-2xl font-black text-black uppercase leading-tight">{selectedItem.name}</h3>
                    <span className="text-xl font-black text-[#EF476F] shrink-0 border-2 border-black px-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-white">
                      {currencySymbol === "EUR" ? "€" : currencySymbol === "GBP" ? "£" : "$"}{(selectedItem.price).toFixed(2)}
                    </span>
                  </div>
                  {selectedItem.description && (
                    <p className="text-black font-bold text-sm leading-snug mt-4 bg-slate-100 p-3 border-2 border-black border-dashed">
                      {selectedItem.description}
                    </p>
                  )}
                </div>

                {canOrder && (
                  <div className="space-y-6 pt-6 border-t-4 border-black border-dashed">
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-black text-black">Special Requests</label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="ALLERGIES? PREFERENCES?"
                        className="w-full bg-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-3 text-sm text-black font-bold focus:outline-none focus:translate-y-[2px] focus:translate-x-[2px] focus:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all resize-none uppercase"
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border-4 border-black p-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                      <span className="text-sm uppercase font-black text-black">Quantity</span>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                          className="w-8 h-8 flex items-center justify-center border-2 border-black font-black hover:bg-black hover:text-white transition-colors"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-black font-black text-lg">{orderQuantity}</span>
                        <button 
                          onClick={() => setOrderQuantity(orderQuantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border-2 border-black font-black hover:bg-black hover:text-white transition-colors bg-[#118AB2] text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-slate-100 border-t-4 border-black">
              <button 
                onClick={() => {
                  if (canOrder) {
                    addToCart(selectedItem, orderQuantity, orderNotes);
                  }
                  setSelectedItem(null);
                }}
                className={`w-full py-4 border-4 border-black text-black uppercase font-black text-lg flex justify-between items-center px-6 transition-all hover:translate-y-[2px] hover:translate-x-[2px] shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${canOrder ? 'bg-[#EF476F] text-white' : 'bg-white'}`}
              >
                <span>{canOrder ? "Add To Order" : "Close"}</span>
                {canOrder && (
                  <span>
                    {currencySymbol === "EUR" ? "€" : currencySymbol === "GBP" ? "£" : "$"}{(selectedItem.price * orderQuantity).toFixed(2)}
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
