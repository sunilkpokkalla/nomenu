"use client";

import React from "react";
import { X } from "lucide-react";
import { useCart } from "../cart-context";
import { useMenuLogic } from "../use-menu-logic";
import { MenuThemeProps } from "../types";

import { FeedbackFAB } from "../feedback-fab";

export function BrutalistTheme(props: MenuThemeProps) {
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
  const canOrder = currentPlan === "elite";

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-32">
      
      {/* Brutalist Header */}
      <header className="border-b-8 border-black p-4 sm:p-8 bg-yellow-400">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="max-w-2xl">
            <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter leading-none mb-4">
              {restaurant.name}
            </h1>
            <div className="flex flex-wrap gap-4 items-center font-bold">
              <span className="bg-black text-white px-3 py-1 text-xl uppercase">
                {restaurant.cuisine_type || "FOOD"}
              </span>
              <span className="text-xl uppercase border-2 border-black px-3 py-1 bg-white">
                {restaurant.address}
              </span>
            </div>
          </div>
          
          <div className="bg-white border-4 border-black p-4 shrink-0 shadow-[8px_8px_0px_#000]">
            <p className="font-black text-2xl uppercase mb-1">OPEN NOW</p>
            <p className="font-bold text-lg">EAT OR LEAVE</p>
          </div>
        </div>
      </header>

      {/* Navigation, Search & Layout */}
      <div className="sticky top-0 z-40 bg-white border-b-8 border-black shadow-[0_10px_0_rgba(0,0,0,1)] flex flex-col">
        <div className="flex flex-col sm:flex-row border-b-4 border-black">
          <input 
            type="text" 
            placeholder="SEARCH //" 
            value={searchQuery}
            onChange={(e) => setters.setSearchQuery(e.target.value)}
            className="w-full sm:w-2/3 p-4 text-2xl font-black uppercase border-r-4 border-black bg-gray-100 focus:outline-none focus:bg-yellow-200 placeholder-gray-400 transition-colors"
          />
          <div className="flex w-full sm:w-1/3">
            <button 
              onClick={() => setters.setLayoutMode(layoutMode === "grid" ? "list" : "grid")}
              className="flex-1 p-2 sm:p-4 text-xl font-black uppercase border-r-4 border-black transition-colors bg-white hover:bg-gray-200"
              title="Toggle Layout"
            >
              {layoutMode === "grid" ? "LIST" : "GRID"}
            </button>
            <button 
              onClick={() => setters.setFilterVeg(!filterVeg)}
              className={`flex-1 p-2 sm:p-4 text-xl font-black uppercase border-r-4 border-black transition-colors ${filterVeg ? "bg-black text-white" : "bg-white hover:bg-gray-200"}`}
            >
              VEG
            </button>
            <button 
              onClick={() => setters.setFilterVegan(!filterVegan)}
              className={`flex-1 p-2 sm:p-4 text-xl font-black uppercase border-r-4 border-black transition-colors ${filterVegan ? "bg-black text-white" : "bg-white hover:bg-gray-200"}`}
            >
              VGN
            </button>
            <button 
              onClick={() => setters.setFilterGF(!filterGF)}
              className={`flex-1 p-2 sm:p-4 text-xl font-black uppercase transition-colors ${filterGF ? "bg-black text-white" : "bg-white hover:bg-gray-200"}`}
            >
              GF
            </button>
          </div>
        </div>
        <div 
          ref={categoryNavRef}
          className="flex overflow-x-auto scrollbar-none"
        >
          {categories.map(cat => (
            <button
              key={cat.id}
              id={`nav-pill-${cat.id}`}
              onClick={() => handlers.scrollToCategory(cat.id)}
              className={`whitespace-nowrap px-6 py-4 text-xl font-black uppercase border-r-4 border-black transition-colors ${
                activeCategory === cat.id 
                  ? "bg-black text-white" 
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <main className="p-4 sm:p-8 space-y-24">
        {categories.map(cat => {
          const catItems = filteredItems.filter(i => i.category_id === cat.id);
          if (catItems.length === 0) return null;

          return (
            <section 
              key={cat.id} 
              id={`cat-${cat.id}`}
              ref={el => { categoryRefs.current[cat.id] = el; }}
              className="scroll-mt-32"
            >
              <div className="mb-8 border-b-8 border-black pb-4">
                <h2 className="text-5xl font-black uppercase tracking-tight">{cat.name}</h2>
                {cat.description && (
                  <p className="mt-4 text-xl font-bold bg-yellow-300 inline-block px-2">{cat.description}</p>
                )}
              </div>

              <div className={layoutMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "flex flex-col gap-8"}>
                {catItems.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => setters.setSelectedItem(item)}
                    className={`group cursor-pointer border-4 border-black p-4 flex hover:bg-black hover:text-white transition-colors duration-0 ${layoutMode === "list" ? "flex-col sm:flex-row gap-6 items-start" : "flex-col"}`}
                  >
                    {layoutMode === "list" && item.image_url && (
                      <div className="w-full sm:w-48 h-48 border-4 border-black bg-gray-200 shrink-0">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover grayscale contrast-150" />
                      </div>
                    )}
                    <div className="flex-grow w-full flex flex-col h-full">
                      <div className={`flex items-start gap-4 ${layoutMode === "list" ? "flex-col sm:flex-row justify-between" : "justify-between"}`}>
                        <h3 className="text-3xl font-black uppercase leading-none">{item.name}</h3>
                        <span className="text-3xl font-black bg-black text-white group-hover:bg-white group-hover:text-black px-2 py-1 shrink-0">
                          {currencySign}{item.price.toFixed(2)}
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className="text-lg font-bold mt-4 leading-snug">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-auto pt-6">
                        {item.is_popular && <span className="text-sm font-black uppercase bg-yellow-400 text-black px-2 py-1 border-2 border-black">Bestseller</span>}
                        {item.is_vegetarian && <span className="text-sm font-black uppercase border-2 border-black px-2 py-1 group-hover:border-white">VEG</span>}
                        {item.is_spicy && <span className="text-sm font-black uppercase bg-red-500 text-white px-2 py-1 border-2 border-black">SPICY</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Item Modal (Brutalist) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-yellow-400/90 backdrop-blur-sm">
          <div className="bg-white border-8 border-black w-full max-w-2xl flex flex-col max-h-[90vh] shadow-[16px_16px_0px_#000]">
            
            <div className="border-b-8 border-black flex justify-between items-center p-4 bg-gray-100">
              <h2 className="text-2xl font-black uppercase tracking-tighter">ITEM DETAILS //</h2>
              <button 
                onClick={() => setters.setSelectedItem(null)}
                className="bg-black text-white hover:bg-red-500 hover:text-black border-4 border-black p-1 transition-colors"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 flex flex-col flex-grow overflow-y-auto">
              
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-4xl sm:text-6xl font-black uppercase leading-none max-w-[70%]">{selectedItem.name}</h2>
                <div className="text-4xl font-black bg-black text-white px-3 py-1">
                  {currencySign}{selectedItem.price.toFixed(2)}
                </div>
              </div>
              
              {selectedItem.image_url && (
                <div className="w-full aspect-video border-4 border-black mb-8 relative">
                  <img src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover grayscale contrast-150" />
                  <div className="absolute top-4 -right-4 bg-yellow-400 text-black border-4 border-black px-4 py-2 font-black text-2xl uppercase transform rotate-3 shadow-[4px_4px_0px_#000]">
                    LOOK
                  </div>
                </div>
              )}
              
              <p className="text-xl font-bold leading-tight mb-8">
                {selectedItem.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8 border-y-4 border-black py-4">
                {selectedItem.is_popular && <span className="text-lg font-black uppercase bg-yellow-400 text-black px-3 py-1 border-4 border-black shadow-[4px_4px_0px_#000]">Bestseller</span>}
                {selectedItem.is_vegetarian && <span className="text-lg font-black uppercase bg-green-400 text-black px-3 py-1 border-4 border-black shadow-[4px_4px_0px_#000]">Vegetarian</span>}
                {selectedItem.is_vegan && <span className="text-lg font-black uppercase bg-green-400 text-black px-3 py-1 border-4 border-black shadow-[4px_4px_0px_#000]">Vegan</span>}
                {selectedItem.is_gluten_free && <span className="text-lg font-black uppercase bg-blue-400 text-black px-3 py-1 border-4 border-black shadow-[4px_4px_0px_#000]">Gluten Free</span>}
                {selectedItem.is_spicy && <span className="text-lg font-black uppercase bg-red-500 text-white px-3 py-1 border-4 border-black shadow-[4px_4px_0px_#000]">Spicy</span>}
              </div>

              {canOrder && (
                <>
                  {/* Quantity */}
                  <div className="mb-6 flex justify-between items-center bg-gray-100 border-4 border-black p-4">
                    <span className="text-2xl font-black uppercase">QUANTITY</span>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setters.setOrderQuantity(Math.max(1, orderQuantity - 1))} className="w-12 h-12 bg-white border-4 border-black flex items-center justify-center font-black text-2xl hover:bg-black hover:text-white transition-colors">-</button>
                      <span className="text-4xl font-black w-8 text-center">{orderQuantity}</span>
                      <button onClick={() => setters.setOrderQuantity(orderQuantity + 1)} className="w-12 h-12 bg-white border-4 border-black flex items-center justify-center font-black text-2xl hover:bg-black hover:text-white transition-colors">+</button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-8">
                    <label className="block text-2xl font-black uppercase mb-2">NOTES // REQUESTS</label>
                    <textarea 
                      value={orderNotes}
                      onChange={(e) => setters.setOrderNotes(e.target.value)}
                      placeholder="TYPE HERE..."
                      className="w-full bg-white border-4 border-black p-4 font-bold text-xl focus:outline-none focus:bg-yellow-100 min-h-[120px]"
                    />
                  </div>
                </>
              )}

              <div className="mt-auto">
                <button 
                  onClick={() => canOrder ? handlers.handleAddToCart() : setters.setSelectedItem(null)}
                  className="w-full py-6 bg-black text-white font-black text-3xl tracking-tighter uppercase border-4 border-black hover:bg-white hover:text-black transition-colors shadow-[8px_8px_0px_rgba(0,0,0,0.2)]"
                >
                  {canOrder ? `ADD TO ORDER - ${currencySign}${(selectedItem.price * orderQuantity).toFixed(2)}` : "CLOSE WINDOW"}
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
