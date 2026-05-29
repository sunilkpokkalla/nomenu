"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCart } from "../cart-context";
import { useMenuLogic } from "../use-menu-logic";
import { MenuThemeProps } from "../types";
import { FeedbackFAB } from "../feedback-fab";
import Image from "next/image";

export function RetroTheme(props: MenuThemeProps) {
  const { restaurant, categories, items } = props;
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

  const [time, setTime] = useState("");
  useEffect(() => {
    setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('en-US', { hour12: false })), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#000080] text-[#00FF00] pb-32" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
      
      {/* Windows 98 / Arcade Header */}
      <header className="p-4 bg-[#C0C0C0] border-b-[3px] border-r-[3px] border-b-black border-r-black border-t-[3px] border-l-[3px] border-t-white border-l-white m-2 sm:m-4 text-black">
        <div className="bg-[#000080] text-white px-2 py-1 flex justify-between items-center mb-4">
          <h1 className="text-sm font-bold tracking-widest">{restaurant.name} - v1.0.exe</h1>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-[#C0C0C0] border border-white border-b-black border-r-black flex items-center justify-center text-xs">_</div>
            <div className="w-4 h-4 bg-[#C0C0C0] border border-white border-b-black border-r-black flex items-center justify-center text-xs">□</div>
            <div className="w-4 h-4 bg-[#C0C0C0] border border-white border-b-black border-r-black flex items-center justify-center text-xs font-bold">X</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <p className="text-xl font-black uppercase text-[#FF00FF] drop-shadow-[2px_2px_0px_#000]">
              {restaurant.name}
            </p>
            <p className="text-sm font-bold mt-1 text-black bg-yellow-300 inline-block px-1 border border-black">
              {restaurant.cuisine_type || "MENU"}
            </p>
          </div>
          
          <div className="text-right w-full sm:w-auto text-xs font-bold border-2 border-inset border-gray-500 bg-white p-2">
            <div>{restaurant.address}</div>
            <div className="text-blue-600">{time}</div>
          </div>
        </div>
      </header>

      {/* Navigation, Search, and Filters */}
      <div className="sticky top-0 z-40 bg-[#C0C0C0] px-2 sm:px-4 pt-2 border-b border-gray-500 shadow-md">
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          {/* Windows 98 Style Search */}
          <div className="flex items-center w-full sm:w-2/3 border-[2px] border-inset border-gray-500 bg-white">
            <span className="pl-2 text-gray-500">🔎</span>
            <input 
              type="text" 
              placeholder="Query files..." 
              value={searchQuery}
              onChange={(e) => setters.setSearchQuery(e.target.value)}
              className="w-full p-1 font-mono text-sm text-black focus:outline-none bg-transparent"
            />
          </div>
          {/* Windows 98 Style Filter Toggles */}
          <div className="flex w-full sm:w-1/3 gap-1">
            <button 
              onClick={() => setters.setLayoutMode(layoutMode === "grid" ? "list" : "grid")}
              className="flex-1 text-xs font-bold border-[2px] border-outset border-gray-300 py-1 bg-[#C0C0C0] hover:bg-[#D0D0D0]"
              title="Toggle Layout"
            >
              {layoutMode === "grid" ? "LIST" : "GRID"}
            </button>
            <button 
              onClick={() => setters.setFilterVeg(!filterVeg)}
              className={`flex-1 text-xs font-bold border-[2px] border-outset border-gray-300 py-1 ${filterVeg ? "border-inset bg-[#B0B0B0]" : "bg-[#C0C0C0] hover:bg-[#D0D0D0]"}`}
            >
              VEG
            </button>
            <button 
              onClick={() => setters.setFilterVegan(!filterVegan)}
              className={`flex-1 text-xs font-bold border-[2px] border-outset border-gray-300 py-1 ${filterVegan ? "border-inset bg-[#B0B0B0]" : "bg-[#C0C0C0] hover:bg-[#D0D0D0]"}`}
            >
              VGN
            </button>
            <button 
              onClick={() => setters.setFilterGF(!filterGF)}
              className={`flex-1 text-xs font-bold border-[2px] border-outset border-gray-300 py-1 ${filterGF ? "border-inset bg-[#B0B0B0]" : "bg-[#C0C0C0] hover:bg-[#D0D0D0]"}`}
            >
              GF
            </button>
          </div>
        </div>

        <div 
          ref={categoryNavRef}
          className="flex overflow-x-auto scrollbar-none gap-1"
        >
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`nav-pill-${cat.id}`}
                onClick={() => handlers.scrollToCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-1 text-sm font-bold border-t-[2px] border-l-[2px] border-r-[2px] rounded-t-sm transition-colors ${
                  isActive 
                    ? "bg-[#C0C0C0] text-black border-t-white border-l-white border-r-black z-10 -mb-[1px] pb-2" 
                    : "bg-gray-300 text-gray-600 border-t-gray-100 border-l-gray-100 border-r-gray-500 mt-1"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Content */}
      <main className="p-2 sm:p-4 space-y-8 bg-[#C0C0C0] m-2 sm:m-4 border-b-[3px] border-r-[3px] border-b-black border-r-black border-t-[3px] border-l-[3px] border-t-white border-l-white">
        {categories.map(cat => {
          const catItems = filteredItems.filter(i => i.category_id === cat.id);
          if (catItems.length === 0) return null;

          return (
            <section 
              key={cat.id} 
              id={`cat-${cat.id}`}
              ref={el => { categoryRefs.current[cat.id] = el; }}
              className="scroll-mt-32 border-2 border-gray-500 bg-white p-4"
            >
              <div className="mb-4 pb-2 border-b-2 border-dashed border-gray-400">
                <h2 className="text-2xl font-bold uppercase text-[#000080]">{cat.name}</h2>
                {cat.description && (
                  <p className="mt-1 text-xs text-gray-600 italic">{cat.description}</p>
                )}
              </div>

              <div className={layoutMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
                {catItems.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => setters.setSelectedItem(item)}
                    className={`cursor-pointer border-[2px] border-outset border-gray-300 bg-[#E0E0E0] p-3 flex hover:bg-[#D0D0D0] active:border-inset active:bg-[#B0B0B0] ${layoutMode === "list" ? "flex-col sm:flex-row gap-4 items-start" : "flex-col"}`}
                  >
                    {layoutMode === "list" && item.image_url && (
                      <div className="w-full sm:w-32 h-32 border-[2px] border-inset border-gray-500 bg-black overflow-hidden relative shrink-0">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10" />
                        <Image src={item.image_url} alt={item.name} className="w-full h-full object-cover opacity-80 mix-blend-screen" style={{ filter: "contrast(1.5) saturate(1.5) sepia(0.5) hue-rotate(-50deg)" }} fill />
                      </div>
                    )}
                    <div className="flex-grow w-full flex flex-col h-full">
                      <div className={`flex items-start gap-4 text-black ${layoutMode === "list" ? "flex-col sm:flex-row justify-between" : "justify-between"}`}>
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <span className="text-lg font-bold text-[#000080] shrink-0">
                          {currencySign}{item.price.toFixed(2)}
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className="text-xs mt-2 text-gray-700 font-medium">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mt-auto pt-3">
                        {item.is_popular && <span className="text-[10px] font-bold bg-[#FF00FF] text-white px-1 shadow-[1px_1px_0px_#000]">HOT</span>}
                        {item.is_vegetarian && <span className="text-[10px] font-bold bg-[#00FF00] text-black px-1 shadow-[1px_1px_0px_#000]">VEG</span>}
                        {item.is_spicy && <span className="text-[10px] font-bold bg-[#FF0000] text-white px-1 shadow-[1px_1px_0px_#000]">SPICY</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Item Modal (Retro) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-[#C0C0C0] border-[3px] border-outset border-gray-300 w-full max-w-md flex flex-col max-h-[90vh] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="bg-[#000080] text-white p-1 flex justify-between items-center">
              <h2 className="text-sm font-bold truncate px-1">item_details.exe</h2>
              <button 
                onClick={() => setters.setSelectedItem(null)}
                className="bg-[#C0C0C0] text-black px-2 border-[2px] border-outset border-gray-300 font-bold hover:bg-[#D0D0D0] active:border-inset"
              >
                X
              </button>
            </div>
            
            <div className="p-4 flex flex-col flex-grow overflow-y-auto text-black font-mono">
              <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>
              
              {selectedItem.image_url && (
                <div className="w-full h-48 border-[2px] border-inset border-gray-500 mb-4 bg-black overflow-hidden relative">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10" />
                  <Image src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover opacity-80 mix-blend-screen" style={{ filter: "contrast(1.5) saturate(1.5) sepia(0.5) hue-rotate(-50deg)" }} fill />
                </div>
              )}
              
              <div className="text-3xl font-black text-[#000080] mb-4">
                {currencySign}{selectedItem.price.toFixed(2)}
              </div>
              
              <p className="text-sm bg-white p-2 border-[2px] border-inset border-gray-500 mb-6">
                {selectedItem.description}
              </p>

              {canOrder && (
                <div className="space-y-4 mb-6">
                  {/* Quantity */}
                  <div className="flex items-center gap-4 bg-[#C0C0C0] p-2 border-[2px] border-outset border-gray-300">
                    <span className="font-bold text-sm">Qty:</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setters.setOrderQuantity(Math.max(1, orderQuantity - 1))} className="w-8 h-8 bg-[#C0C0C0] border-[2px] border-outset border-gray-300 active:border-inset font-bold">-</button>
                      <div className="w-12 h-8 bg-white border-[2px] border-inset border-gray-500 flex items-center justify-center font-bold">
                        {orderQuantity}
                      </div>
                      <button onClick={() => setters.setOrderQuantity(orderQuantity + 1)} className="w-8 h-8 bg-[#C0C0C0] border-[2px] border-outset border-gray-300 active:border-inset font-bold">+</button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-[#C0C0C0] p-2 border-[2px] border-outset border-gray-300">
                    <label className="block font-bold text-sm mb-2">Params:</label>
                    <input 
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setters.setOrderNotes(e.target.value)}
                      placeholder="Input..."
                      className="w-full bg-white border-[2px] border-inset border-gray-500 px-2 py-1 focus:outline-none focus:bg-[#000080] focus:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4">
                <button 
                  onClick={() => canOrder ? handlers.handleAddToCart() : setters.setSelectedItem(null)}
                  className="w-full py-2 bg-[#C0C0C0] text-black font-bold border-[3px] border-outset border-gray-300 hover:bg-[#D0D0D0] active:border-inset flex justify-center items-center gap-2"
                >
                  <span className="text-[#000080]">▶</span> {canOrder ? `EXECUTE ADD_TO_CART [${currencySign}${(selectedItem.price * orderQuantity).toFixed(2)}]` : "CLOSE WINDOW"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {canFeedback && <FeedbackFAB restaurantId={restaurant.id} />}
    </div>
  );
}
