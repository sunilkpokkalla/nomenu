"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Wifi, 
  X,
  Phone,
  Clock,
  Sparkles
} from "lucide-react";
import { MenuThemeProps, MenuItem } from "../types";
import Image from "next/image";

export function BrasserieTheme({ restaurant, categories, items, tableNumber, qrCodeId }: MenuThemeProps) {
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
    <div className="min-h-screen bg-[#FDFBF7] font-serif selection:bg-orange-200">
      <div className="mx-auto max-w-md min-h-screen bg-[#FDFBF7] shadow-xl shadow-stone-200/50 flex flex-col pb-28 relative">
        
        {/* Soft Organic Header */}
        <div className="pt-16 pb-10 px-8 text-center relative shrink-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-serif text-[#292524] mb-3 tracking-tight">
              {restaurant.name}
            </h1>

            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[1px] bg-[#D6D3D1]"></span>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
                {restaurant.cuisine_type || "Brasserie"}
              </span>
              <span className="w-12 h-[1px] bg-[#D6D3D1]"></span>
            </div>
            
            <div className="flex justify-center gap-6 font-sans">
              {restaurant.phone && (
                <a href={`tel:${restaurant.phone}`} className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#57534E] hover:text-[#292524] transition-colors">
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
              )}
              {restaurant.wifi_password && (
                <button onClick={() => setShowAmenities(true)} className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#57534E] hover:text-[#292524] transition-colors cursor-pointer">
                  <Wifi className="w-3.5 h-3.5" /> WiFi
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Soft Nav */}
        <div className="sticky top-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-[#E7E5E4] py-4 px-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 h-4 w-4 text-[#A8A29E]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 font-sans text-sm bg-white border border-[#E7E5E4] rounded-2xl text-[#292524] placeholder-[#A8A29E] focus:outline-none focus:border-[#A8A29E] focus:ring-1 focus:ring-[#A8A29E] transition-all shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="absolute right-4 top-3 p-0.5 rounded-full hover:bg-stone-100"
              >
                <X className="h-4 w-4 text-[#78716C]" />
              </button>
            )}
          </div>

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
                  className={`inline-block font-sans text-[11px] font-semibold tracking-widest uppercase transition-all whitespace-nowrap cursor-pointer pb-2 border-b-2 ${
                    active ? "text-[#292524] border-[#292524]" : "text-[#A8A29E] border-transparent hover:text-[#57534E]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu List - Cardless Organic Layout */}
        <div className="px-6 py-8 space-y-16 flex-grow">
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
                  <div className="text-center space-y-2 mb-8">
                    <h2 className="text-2xl font-serif text-[#292524] tracking-tight">{cat.name}</h2>
                    {cat.description && (
                      <p className="font-sans text-xs font-medium text-[#78716C] max-w-[80%] mx-auto leading-relaxed">{cat.description}</p>
                    )}
                  </div>

                  <div className="space-y-8">
                    {categoryItems.map((item) => {
                      const price = `${currencySymbol === "EUR" ? "€" : currencySymbol === "GBP" ? "£" : "$"}${Number(item.price).toFixed(2)}`;
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="group cursor-pointer flex gap-5 pb-8 border-b border-[#E7E5E4]/60 last:border-0 last:pb-0"
                        >
                          {item.image_url && (
                            <div className="shrink-0 w-24 h-28 rounded-t-full rounded-b-full overflow-hidden bg-stone-100 relative shadow-sm border border-stone-200/50">
                              <Image 
                                src={item.image_url} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                                fill 
                              />
                            </div>
                          )}
                          
                          <div className="flex flex-col pt-2 w-full">
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <h3 className="font-serif text-[17px] leading-snug text-[#292524] group-hover:text-orange-900 transition-colors">
                                {item.name}
                              </h3>
                              <span className="font-sans text-[13px] font-medium text-[#57534E] shrink-0 mt-0.5">
                                {price}
                              </span>
                            </div>
                            
                            {item.description && (
                              <p className="font-sans text-xs text-[#78716C] leading-relaxed mb-3">
                                {item.description}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap gap-2 mt-auto">
                              {item.is_popular && (
                                <span className="font-sans text-[9px] text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-orange-100">
                                  Popular
                                </span>
                              )}
                              {item.is_vegan && (
                                <span className="font-sans text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-emerald-100">
                                  Vegan
                                </span>
                              )}
                              {item.is_gluten_free && (
                                <span className="font-sans text-[9px] text-[#57534E] bg-stone-100 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-stone-200">
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
              <p className="font-serif text-[#78716C] text-lg">No items available.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
