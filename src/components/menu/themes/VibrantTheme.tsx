"use client";

import React, { useState } from "react";
import { Plus, Minus, Search, X, Info , Wifi } from "lucide-react";
import { MenuThemeProps, MenuItem } from "../types";
import Image from "next/image";
import { useCart } from "../cart-context";
import { FeedbackFAB } from "../feedback-fab";
import { getCurrencySymbol } from "@/lib/currency-options";

export function VibrantTheme({ restaurant, categories: rawCategories, items, tableNumber, qrCodeId }: MenuThemeProps) {
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
  const accentColor = restaurant.accent_color || "#EF4444"; // Default vibrant red

  const handleAddToCart = (item: MenuItem) => {
    if (!canOrder) return;
    addToCart(item, 1, "");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-32">
      {/* Header */}
      <div 
        className="pt-16 pb-12 px-6 rounded-b-[40px] mb-8 shadow-sm"
        style={{ backgroundColor: accentColor }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            {restaurant.name}
          </h1>
          {restaurant.wifi_password && (
            <div className="flex items-center justify-center gap-2 text-white/80 font-medium text-sm mt-2">
              <Wifi className="w-4 h-4" /> <span>{restaurant.wifi_password}</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md pt-2 pb-4 border-b border-slate-100">
        <div className="flex overflow-x-auto hide-scrollbar px-4 max-w-4xl mx-auto gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.name);
                document.getElementById(`category-${category.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeCategory === category.name
                  ? "text-white shadow-md shadow-black/10 scale-105"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{
                backgroundColor: activeCategory === category.name ? accentColor : undefined
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <main className="max-w-4xl mx-auto p-4 space-y-16 mt-8">
        {categories.map((category) => (
          <section key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
            <h2 className="text-3xl font-black tracking-tight mb-8 text-slate-900 px-2">{category.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.items.map((item) => (
                <div key={item.id} className="group bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300">
                  {item.image_url && (
                    <div className="w-full aspect-video overflow-hidden bg-slate-50 relative">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        width={400}
                        height={300}
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-sm shadow-sm">
                        {currencySign}{item.price.toFixed(2)}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6 flex-grow flex flex-col w-full">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">{item.name}</h3>
                      {!item.image_url && (
                        <span className="font-bold whitespace-nowrap bg-slate-100 px-3 py-1 rounded-full text-sm">
                          {currencySign}{item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.is_vegetarian && <span className="text-[10px] font-bold tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase">Veg</span>}
                      {item.is_vegan && <span className="text-[10px] font-bold tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase">Vegan</span>}
                      {item.is_gluten_free && <span className="text-[10px] font-bold tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded-md uppercase">GF</span>}
                    </div>

                    <p className="text-slate-500 font-medium leading-relaxed mb-6 text-sm">{item.description}</p>
                    
                    {canOrder && (
                      <div className="mt-auto pt-4 border-t border-slate-100">
                        {cartItems.find((i) => i.menuItem.id === item.id) ? (
                          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-1">
                            <button onClick={() => updateQuantity(item.id, cartItems.find((i) => i.menuItem.id === item.id)!.quantity - 1)} className="p-3 bg-white shadow-sm hover:bg-slate-100 rounded-lg transition-colors text-slate-700">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-lg text-slate-900">
                              {cartItems.find((i) => i.menuItem.id === item.id)?.quantity}
                            </span>
                            <button onClick={() => updateQuantity(item.id, cartItems.find((i) => i.menuItem.id === item.id)!.quantity + 1)} className="p-3 bg-white shadow-sm hover:bg-slate-100 rounded-lg transition-colors text-slate-700">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="w-full py-3.5 rounded-xl text-white font-bold transition-transform active:scale-95"
                            style={{ backgroundColor: accentColor }}
                          >
                            Add to order
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <div className="text-center pb-8 opacity-40 font-bold text-xs tracking-widest uppercase mt-24">
        Powered by {hasWhiteLabeling ? restaurant.name : "Nomenu"}
      </div>

      {canFeedback && <FeedbackFAB restaurantId={restaurant.id} tableNumber={tableNumber} qrCodeId={qrCodeId} />}
    </div>
  );
}
