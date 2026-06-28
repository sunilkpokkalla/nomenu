"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Leaf, 
  Flame, 
  Sparkles, 
  Wifi, 
  Phone, 
  MapPin, 
  X, 
  Info,
  Clock,
  ChevronRight
} from "lucide-react";
import { MenuThemeProps, MenuItem } from "../types";
import Image from "next/image";
import { useCart } from "../cart-context";
import { FeedbackFAB } from "../feedback-fab";

export function NoirTheme({ restaurant, categories, items, tableNumber, qrCodeId }: MenuThemeProps) {
  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const canOrder = currentPlan === "elite" || currentPlan === "enterprise";
  const canFeedback = currentPlan !== "free";
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  
  // Dietary filters
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterGF, setFilterGF] = useState(false);
  const [filterSpicy, setFilterSpicy] = useState(false);

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

  // References for scrolling
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Setup active category scrolling highlights
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return;
      const scrollPosition = window.scrollY + 300; 
      
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
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
    if (!matchesSearch) return false;
    if (filterVeg && !item.is_vegetarian) return false;
    if (filterVegan && !item.is_vegan) return false;
    if (filterGF && !item.is_gluten_free) return false;
    if (filterSpicy && !item.is_spicy) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans selection:bg-amber-500/30">
      <div className="mx-auto max-w-md min-h-screen bg-[#0A0A0A] shadow-2xl shadow-black flex flex-col pb-28 relative">
        
        {/* Cinematic Hero */}
        <div className="w-full h-[40vh] relative shrink-0">
          <Image 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop" 
            alt="Hero Dish" 
            className="w-full h-full object-cover" 
            fill 
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full px-8 pb-8 flex flex-col items-center text-center translate-y-4">

            <p className="text-[10px] tracking-[0.3em] uppercase text-amber-500 font-semibold mb-3">
              {restaurant.cuisine_type || "Fine Dining"}
            </p>
            <h1 className="text-5xl font-serif tracking-wide text-white drop-shadow-2xl">
              {restaurant.name}
            </h1>

          </div>
        </div>

        {/* Info Strip */}
        <div className="px-8 py-8 text-center text-xs space-y-4 shrink-0">
          {restaurant.address && (
            <p className="font-light tracking-widest text-zinc-400 uppercase text-[10px]">
              {restaurant.address}
            </p>
          )}
          <div className="flex justify-center gap-8 items-center font-medium text-zinc-300">
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`} className="hover:text-amber-500 transition-colors uppercase tracking-widest text-[10px]">
                Call Us
              </a>
            )}
            {restaurant.wifi_password && (
              <button 
                onClick={() => setShowAmenities(true)} 
                className="hover:text-amber-500 transition-colors uppercase tracking-widest text-[10px] cursor-pointer"
              >
                Guest WiFi
              </button>
            )}
          </div>
          <div className="w-8 h-[1px] bg-zinc-800 mx-auto mt-6"></div>
        </div>

        {/* Sticky Actions & Filter bar */}
        <div className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-zinc-900/50 py-4 px-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-zinc-900/50 border border-zinc-800 rounded-full text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="absolute right-4 top-3 p-0.5 rounded-full hover:bg-zinc-800"
              >
                <X className="h-4 w-4 text-zinc-400" />
              </button>
            )}
          </div>

          {/* Sticky Tab Category horizontal lists */}
          <div 
            ref={categoryNavRef} 
            className="flex gap-4 overflow-x-auto scrollbar-none pb-1"
          >
            {categories.map((cat) => {
              const active = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  id={`nav-pill-${cat.id}`}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`inline-block text-[11px] font-semibold tracking-widest uppercase transition-all whitespace-nowrap cursor-pointer pb-2 border-b-2 ${
                    active ? "text-white border-amber-500" : "text-zinc-600 border-transparent hover:text-zinc-400"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu list contents */}
        <div className="px-6 py-10 space-y-16 flex-grow">
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
                  className="scroll-mt-40 space-y-8"
                >
                  <div className="text-center space-y-3 mb-10">
                    <h2 className="text-2xl font-serif text-white tracking-widest uppercase">{cat.name}</h2>
                    {cat.description && (
                      <p className="text-xs font-light tracking-wide text-zinc-500 max-w-[80%] mx-auto">{cat.description}</p>
                    )}
                  </div>

                  <div className="grid gap-10">
                    {categoryItems.map((item) => {
                      const price = `${currencySymbol === "EUR" ? "€" : currencySymbol === "GBP" ? "£" : "$"}${Number(item.price).toFixed(2)}`;
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="group cursor-pointer flex flex-col gap-4"
                        >
                          {item.image_url && (
                            <div className="w-full aspect-[4/3] rounded-sm overflow-hidden bg-zinc-900 relative">
                              <Image 
                                src={item.image_url} 
                                alt={item.name} 
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
                                fill 
                              />
                            </div>
                          )}
                          
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-baseline gap-4">
                              <h3 className="font-serif text-lg text-zinc-200 group-hover:text-white transition-colors tracking-wide">
                                {item.name}
                              </h3>
                              <span className="font-sans text-sm text-amber-500 tracking-wider shrink-0">
                                {price}
                              </span>
                            </div>
                            
                            {item.description && (
                              <p className="text-[13px] font-light text-zinc-500 leading-relaxed max-w-[90%]">
                                {item.description}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap gap-3 pt-2">
                              {item.is_popular && (
                                <span className="text-[9px] text-amber-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" /> Signature
                                </span>
                              )}
                              {item.is_vegan && (
                                <span className="text-[9px] text-emerald-600 uppercase tracking-widest font-semibold">
                                  Vegan
                                </span>
                              )}
                              {item.is_gluten_free && (
                                <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-semibold">
                                  GF
                                </span>
                              )}
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
            <div className="text-center py-20">
              <p className="text-zinc-600">No menu items found.</p>
            </div>
          )}
        </div>

        {canFeedback && <FeedbackFAB restaurantId={restaurant.id} tableNumber={tableNumber} qrCodeId={qrCodeId} />}

      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0A0A0A]/80 backdrop-blur-md p-4 font-sans animate-in fade-in duration-300">
          <div className="bg-[#111111] w-full max-w-md rounded-t-3xl shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden border border-zinc-800/50 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-[#0A0A0A]">
              <h2 className="text-xl font-serif text-white tracking-widest uppercase">Details</h2>
              <button onClick={() => setSelectedItem(null)} className="text-zinc-500 hover:text-white p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-grow bg-[#0A0A0A] pb-8">
              {selectedItem.image_url && (
                <div className="w-full aspect-video relative bg-zinc-900 border-b border-zinc-800">
                  <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover opacity-80" fill />
                </div>
              )}
              
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-2xl font-serif text-white tracking-wide">{selectedItem.name}</h3>
                    <span className="text-lg text-amber-500 font-medium shrink-0">
                      {currencySymbol === "EUR" ? "€" : currencySymbol === "GBP" ? "£" : "$"}{(selectedItem.price).toFixed(2)}
                    </span>
                  </div>
                  {selectedItem.description && (
                    <p className="text-zinc-400 font-light leading-relaxed text-sm">
                      {selectedItem.description}
                    </p>
                  )}
                </div>

                {canOrder && (
                  <div className="space-y-6 pt-6 border-t border-zinc-800">
                    <div className="space-y-3">
                      <label className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Special Requests</label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Any allergies or dietary requirements?"
                        className="w-full bg-[#111111] border border-zinc-800 rounded-lg p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Quantity</span>
                      <div className="flex items-center gap-4 bg-[#111111] rounded-full p-1 border border-zinc-800">
                        <button 
                          onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-4 text-center text-white font-medium">{orderQuantity}</span>
                        <button 
                          onClick={() => setOrderQuantity(orderQuantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-[#111111] border-t border-zinc-800">
              <button 
                onClick={() => {
                  if (canOrder) {
                    addToCart(selectedItem, orderQuantity, orderNotes);
                  }
                  setSelectedItem(null);
                }}
                className="w-full py-4 rounded-full bg-white text-[#0A0A0A] hover:bg-zinc-200 transition-colors font-medium tracking-widest uppercase text-xs flex justify-between items-center px-6"
              >
                <span>{canOrder ? "Add to Order" : "Close"}</span>
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
    </div>
  );
}
