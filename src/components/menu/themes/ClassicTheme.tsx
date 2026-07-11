"use client";

import React, { useState } from "react";
import { Plus, Minus, Search, X , Wifi } from "lucide-react";
import { MenuThemeProps, MenuItem } from "../types";
import Image from "next/image";
import { useCart } from "../cart-context";
import { FeedbackFAB } from "../feedback-fab";
import { getCurrencySymbol } from "@/lib/currency-options";

export function ClassicTheme({ restaurant, categories: rawCategories, items, tableNumber, qrCodeId }: MenuThemeProps) {
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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-32">
      {/* Header */}
      <div className="bg-white py-12 px-6 shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            {restaurant.name}
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-3 shadow-sm">
        <div className="flex overflow-x-auto hide-scrollbar px-6 max-w-4xl mx-auto gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.name);
                document.getElementById(`category-${category.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeCategory === category.name
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <main className="max-w-4xl mx-auto p-6 mt-8 space-y-12">
        {categories.map((category) => (
          <section key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-2">{category.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  {item.image_url && (
                    <div className="w-full aspect-video overflow-hidden bg-gray-100">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        width={400}
                        height={300}
                      />
                    </div>
                  )}
                  
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-md text-sm">
                        {currencySign}{item.price.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{item.description}</p>
                    
                    {canOrder && (
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        {cartItems.find((i) => i.menuItem.id === item.id) ? (
                          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.id, cartItems.find((i) => i.menuItem.id === item.id)!.quantity - 1)} className="p-2 bg-white shadow-sm rounded-md hover:bg-gray-100 transition-colors">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-bold">
                              {cartItems.find((i) => i.menuItem.id === item.id)?.quantity}
                            </span>
                            <button onClick={() => updateQuantity(item.id, cartItems.find((i) => i.menuItem.id === item.id)!.quantity + 1)} className="p-2 bg-white shadow-sm rounded-md hover:bg-gray-100 transition-colors">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="w-full py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors text-sm"
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

      <div className="text-center pb-8 pt-8 text-gray-400 text-sm mt-12">
        Powered by {hasWhiteLabeling ? restaurant.name : "Nomenu"}
      </div>

      {canFeedback && <FeedbackFAB restaurantId={restaurant.id} tableNumber={tableNumber} qrCodeId={qrCodeId} />}
    </div>
  );
}
