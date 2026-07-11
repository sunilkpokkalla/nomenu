"use client";

import React, { useState } from "react";
import { Plus, Minus, Search, X, Info , Wifi } from "lucide-react";
import { MenuThemeProps, MenuItem } from "../types";
import Image from "next/image";
import { useCart } from "../cart-context";
import { FeedbackFAB } from "../feedback-fab";
import { getCurrencySymbol } from "@/lib/currency-options";

export function LuxuryTheme({ restaurant, categories: rawCategories, items, tableNumber, qrCodeId }: MenuThemeProps) {
  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const canOrder = currentPlan === "elite" || currentPlan === "enterprise";
  const canFeedback = currentPlan !== "free";
  const hasWhiteLabeling = currentPlan === "elite" || currentPlan === "enterprise";

  const categories = rawCategories.map(cat => ({
    ...cat,
    items: items.filter(item => item.category_id === cat.id && item.is_available)
  })).filter(cat => cat.items.length > 0);

  const { items: cartItems, addToCart, updateQuantity } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>(
    categories.length > 0 ? categories[0].name : ""
  );

  const currencySign = getCurrencySymbol(restaurant.currency);
  const accentColor = restaurant.accent_color || "#D4AF37"; // Default gold

  const handleAddToCart = (item: MenuItem) => {
    if (!canOrder) return;
    addToCart(item, 1, "");
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#FDFCF0] font-serif pb-32">
      {/* Header */}
      <div className="pt-24 pb-16 px-6 max-w-4xl mx-auto text-center border-b border-white/10">
        <h1 className="text-4xl md:text-5xl font-normal tracking-widest uppercase text-white mb-6" style={{ color: accentColor }}>
          {restaurant.name}
        </h1>
        {restaurant.wifi_password && (
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm tracking-widest">
            <Wifi className="w-4 h-4" /> <span>{restaurant.wifi_password}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/10">
        <div className="flex overflow-x-auto hide-scrollbar px-6 py-5 max-w-4xl mx-auto gap-10 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.name);
                document.getElementById(`category-${category.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`whitespace-nowrap pb-1 uppercase tracking-widest text-xs transition-all ${
                activeCategory === category.name
                  ? "border-b border-[#D4AF37] text-white"
                  : "border-b border-transparent text-white/40 hover:text-white/80"
              }`}
              style={{
                borderColor: activeCategory === category.name ? accentColor : 'transparent'
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <main className="max-w-4xl mx-auto p-6 space-y-32 mt-16">
        {categories.map((category) => (
          <section key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
            <h2 className="text-2xl italic tracking-wide mb-16 text-center text-white/80">
              — {category.name} —
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {category.items.map((item) => (
                <div key={item.id} className="group flex flex-col">
                  {item.image_url && (
                    <div className="w-full aspect-square overflow-hidden mb-6 opacity-90 group-hover:opacity-100 transition-opacity">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        width={400}
                        height={400}
                      />
                    </div>
                  )}
                  
                  <div className="flex-grow flex flex-col w-full text-center px-4">
                    <h3 className="text-lg tracking-widest uppercase text-white mb-2">{item.name}</h3>
                    
                    <div className="flex justify-center flex-wrap gap-2 mb-4">
                      {item.is_vegetarian && <span className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase">Veg</span>}
                      {item.is_vegan && <span className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase">Vegan</span>}
                      {item.is_gluten_free && <span className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase">GF</span>}
                    </div>

                    <p className="text-white/50 font-light italic leading-relaxed mb-6 text-sm">{item.description}</p>
                    
                    <div className="mt-auto">
                      <div className="text-lg font-light tracking-wide mb-6">
                        {currencySign}{item.price.toFixed(2)}
                      </div>

                      {canOrder && (
                        <div className="flex justify-center">
                          {cartItems.find((i) => i.menuItem.id === item.id) ? (
                            <div className="flex items-center gap-4 border border-white/20 rounded-none p-1">
                              <button onClick={() => updateQuantity(item.id, cartItems.find((i) => i.menuItem.id === item.id)!.quantity - 1)} className="p-2 hover:bg-white/10 transition-colors text-white/60">
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-6 text-center font-sans font-light">
                                {cartItems.find((i) => i.menuItem.id === item.id)?.quantity}
                              </span>
                              <button onClick={() => updateQuantity(item.id, cartItems.find((i) => i.menuItem.id === item.id)!.quantity + 1)} className="p-2 hover:bg-white/10 transition-colors text-white/60">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="px-8 py-2 border border-white/20 text-white/80 hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-[10px] font-sans"
                            >
                              Add to order
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <div className="text-center pb-8 opacity-20 font-sans text-[10px] tracking-[0.3em] uppercase mt-32 border-t border-white/10 pt-8 max-w-md mx-auto">
        Powered by {hasWhiteLabeling ? restaurant.name : "Nomenu"}
      </div>

      {canFeedback && <FeedbackFAB restaurantId={restaurant.id} tableNumber={tableNumber} qrCodeId={qrCodeId} />}
    </div>
  );
}
