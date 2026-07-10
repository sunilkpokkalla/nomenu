"use client";

import React, { useState } from "react";
import { Plus, Minus, Search, X, Info } from "lucide-react";
import { MenuThemeProps, MenuItem } from "../types";
import Image from "next/image";
import { useCart } from "../cart-context";
import { FeedbackFAB } from "../feedback-fab";
import { getCurrencySymbol } from "@/lib/currency-options";

export function MinimalistTheme({ restaurant, categories: rawCategories, items, tableNumber, qrCodeId }: MenuThemeProps) {
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

  const handleAddToCart = (item: MenuItem) => {
    if (!canOrder) return;
    addToCart(item, 1, "");
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-32">
      {/* Header */}
      <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-light tracking-tight text-black mb-4">
          {restaurant.name}
        </h1>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="flex overflow-x-auto hide-scrollbar px-6 py-4 max-w-4xl mx-auto gap-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.name);
                document.getElementById(`category-${category.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`whitespace-nowrap pb-1 border-b-2 transition-all ${
                activeCategory === category.name
                  ? "border-black text-black font-medium"
                  : "border-transparent text-gray-400 hover:text-black"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <main className="max-w-4xl mx-auto p-6 space-y-32 mt-12">
        {categories.map((category) => (
          <section key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
            <h2 className="text-2xl font-medium tracking-tight mb-12">{category.name}</h2>
            
            <div className="flex flex-col gap-12">
              {category.items.map((item) => (
                <div key={item.id} className="group flex flex-col md:flex-row gap-8 items-start border-b border-gray-100 pb-12 last:border-0">
                  {item.image_url && (
                    <div className="w-full md:w-1/3 aspect-[4/3] overflow-hidden bg-gray-50">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        width={400}
                        height={300}
                      />
                    </div>
                  )}
                  
                  <div className="flex-grow flex flex-col w-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-medium text-black">{item.name}</h3>
                      <span className="text-lg font-light">{currencySign}{item.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.is_vegetarian && <span className="text-xs tracking-widest text-gray-500 uppercase">Veg</span>}
                      {item.is_vegan && <span className="text-xs tracking-widest text-gray-500 uppercase">Vegan</span>}
                      {item.is_gluten_free && <span className="text-xs tracking-widest text-gray-500 uppercase">GF</span>}
                    </div>

                    <p className="text-gray-500 font-light leading-relaxed mb-8 max-w-xl">{item.description}</p>
                    
                    {canOrder && (
                      <div className="mt-auto">
                        {cartItems.find((i) => i.menuItem.id === item.id) ? (
                          <div className="flex items-center gap-4 bg-gray-50 w-fit rounded-full p-1">
                            <button onClick={() => updateQuantity(item.id, cartItems.find((i) => i.menuItem.id === item.id)!.quantity - 1)} className="p-2 hover:bg-white rounded-full transition-colors">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-4 text-center font-medium">
                              {cartItems.find((i) => i.menuItem.id === item.id)?.quantity}
                            </span>
                            <button onClick={() => updateQuantity(item.id, cartItems.find((i) => i.menuItem.id === item.id)!.quantity + 1)} className="p-2 hover:bg-white rounded-full transition-colors">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors uppercase tracking-widest text-xs font-medium"
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

      <div className="text-center pb-8 opacity-30 font-sans text-xs tracking-widest uppercase mt-24">
        Powered by {hasWhiteLabeling ? restaurant.name : "Nomenu"}
      </div>

      {canFeedback && <FeedbackFAB restaurantId={restaurant.id} tableNumber={tableNumber} qrCodeId={qrCodeId} />}
    </div>
  );
}
