"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Wifi, 
  X,
  Phone,
  Sparkles
} from "lucide-react";
import { MenuThemeProps, MenuItem } from "../types";
import Image from "next/image";

export function ZenTheme({ restaurant, categories, items, tableNumber, qrCodeId }: MenuThemeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  
  // Modals
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showAmenities, setShowAmenities] = useState(false);

  const currencySymbol = restaurant.currency || "USD";

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
    <div className="min-h-screen bg-white font-sans selection:bg-zinc-100">
      <div className="mx-auto max-w-md min-h-screen bg-white flex flex-col pb-28 relative">
        
        {/* Pure Minimal Header */}
        <div className="pt-20 pb-12 px-8 text-center relative shrink-0">
          <h1 className="text-3xl font-light tracking-[0.25em] uppercase text-zinc-900 mb-6">
            {restaurant.name}
          </h1>
          
          <div className="w-8 h-[1px] bg-zinc-200 mx-auto mb-6"></div>
          
          <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-medium mb-8">
            {restaurant.cuisine_type || "Fine Dining"}
          </p>

          <div className="flex justify-center gap-8">
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`} className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors">
                Call
              </a>
            )}
            {restaurant.wifi_password && (
              <button onClick={() => setShowAmenities(true)} className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
                WiFi
              </button>
            )}
          </div>
        </div>

        {/* Sticky Minimal Nav */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-y border-zinc-100 py-3 px-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-0 top-3 h-4 w-4 text-zinc-300" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 text-sm bg-transparent border-none text-zinc-900 placeholder-zinc-300 focus:outline-none focus:ring-0 transition-all font-light tracking-wide"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="absolute right-0 top-3 p-0.5 rounded-full hover:bg-zinc-50"
              >
                <X className="h-4 w-4 text-zinc-400" />
              </button>
            )}
          </div>

          <div 
            ref={categoryNavRef} 
            className="flex gap-6 overflow-x-auto scrollbar-none pb-2"
          >
            {categories.map((cat) => {
              const active = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  id={`nav-pill-${cat.id}`}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`inline-block text-[10px] font-medium tracking-[0.2em] uppercase transition-all whitespace-nowrap cursor-pointer pb-2 ${
                    active ? "text-zinc-900 border-b border-zinc-900" : "text-zinc-300 border-b border-transparent hover:text-zinc-500"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Grid - Asymmetric Minimalist Layout */}
        <div className="px-6 py-12 space-y-24 flex-grow">
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
                  className="scroll-mt-40 space-y-12"
                >
                  <div className="space-y-4">
                    <h2 className="text-sm font-medium tracking-[0.3em] uppercase text-zinc-900">{cat.name}</h2>
                    {cat.description && (
                      <p className="text-xs font-light text-zinc-400 leading-relaxed max-w-[90%]">{cat.description}</p>
                    )}
                  </div>

                  <div className="grid gap-16">
                    {categoryItems.map((item, index) => {
                      const price = `${currencySymbol === "EUR" ? "€" : currencySymbol === "GBP" ? "£" : "$"}${Number(item.price).toFixed(2)}`;
                      const isEven = index % 2 === 0;
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="group cursor-pointer flex flex-col gap-6"
                        >
                          {item.image_url && (
                            <div className="w-full aspect-square bg-zinc-50 relative">
                              <Image 
                                src={item.image_url} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[20%]" 
                                fill 
                              />
                            </div>
                          )}
                          
                          <div className={`flex flex-col w-full ${!isEven && item.image_url ? 'pl-8' : 'pr-8'}`}>
                            <h3 className="font-light text-lg tracking-wide text-zinc-900 mb-1">
                              {item.name}
                            </h3>
                            <span className="font-medium text-xs text-zinc-500 tracking-wider mb-3">
                              {price}
                            </span>
                            
                            {item.description && (
                              <p className="text-xs font-light text-zinc-400 leading-relaxed mb-4">
                                {item.description}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap gap-4 mt-auto">
                              {item.is_popular && (
                                <span className="text-[8px] text-zinc-900 uppercase tracking-[0.2em] font-medium flex items-center gap-1.5">
                                  <Sparkles className="w-3 h-3 text-amber-400" /> Signature
                                </span>
                              )}
                              {item.is_vegan && (
                                <span className="text-[8px] text-zinc-500 uppercase tracking-[0.2em] font-medium">
                                  Vegan
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
            <div className="text-center py-20 border-t border-zinc-100">
              <p className="font-light tracking-widest text-zinc-400 text-sm uppercase">Menu items unavailable</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
