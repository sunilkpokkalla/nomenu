import { MenuThemeProps, MenuItem } from "../types";
import { Plus, Minus, ShoppingBag, Leaf, Info } from "lucide-react";
import { FeedbackFAB } from "../feedback-fab";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "../cart-context";
export function BotanicalTheme({ restaurant, categories: rawCategories, items, tableNumber, qrCodeId }: MenuThemeProps) {
  const currentPlan = restaurant.plan?.toLowerCase() || "free";
  const canOrder = currentPlan === "elite" || currentPlan === "enterprise";
  const canFeedback = currentPlan === "pro" || currentPlan === "growth" || canOrder;
  const hasWhiteLabeling = currentPlan === "elite" || currentPlan === "enterprise";

  const categories = rawCategories.map(cat => ({
    ...cat,
    items: items.filter(item => item.category_id === cat.id && item.is_available)
  })).filter(cat => cat.items.length > 0);

  const { items: cartItems, addToCart, updateQuantity } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>(
    categories.length > 0 ? categories[0].name : ""
  );

  const restaurantName = restaurant.name || "The Garden";
  const accentColor = restaurant.accent_color || "#3E5739";
  const welcomeMessage = "Locally sourced, organically inspired.";

  const handleAddToCart = (item: MenuItem) => {
    if (!canOrder) return;
    addToCart(item, 1, "");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C3B29] font-serif pb-32 selection:bg-[#3E5739] selection:text-white">
      {/* Botanical Header Pattern */}
      <div 
        className="h-48 w-full relative overflow-hidden flex items-center justify-center bg-[#EAE3D2]"
        style={{
          backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/4/4e/Leaves_Pattern.svg')",
          backgroundSize: "400px",
          backgroundBlendMode: "overlay",
          opacity: 0.9
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FDFBF7]"></div>
        <div className="relative z-10 text-center px-6">
          <Leaf className="w-8 h-8 mx-auto mb-4 text-[#3E5739] opacity-80" />
          <h1 className="text-4xl md:text-5xl font-normal tracking-widest uppercase" style={{ color: accentColor }}>
            {restaurantName}
          </h1>
          <p className="mt-3 text-sm italic text-[#556B50] max-w-md mx-auto">
            {welcomeMessage}
          </p>
        </div>
      </div>

      {/* Earthy Navigation */}
      <div className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EAE3D2]">
        <div className="flex overflow-x-auto hide-scrollbar px-4 py-4 max-w-4xl mx-auto gap-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.name);
                document.getElementById(`category-${category.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`whitespace-nowrap pb-1 border-b-2 transition-all ${
                activeCategory === category.name
                  ? "border-[#3E5739] text-[#3E5739] font-medium"
                  : "border-transparent text-[#8A9A86] hover:text-[#3E5739]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 sm:p-8 space-y-24 mt-8">
        {categories.map((category) => (
          <section key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
            <div className="mb-12 text-center">
              <h2 className="text-2xl italic text-[#3E5739]">{category.name}</h2>
              <div className="w-12 h-px bg-[#8A9A86] mx-auto mt-4 opacity-50"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {category.items.map((item) => (
                <div key={item.id} className="group flex flex-col">
                  {item.image_url ? (
                    <div className="w-full aspect-[4/3] overflow-hidden rounded-t-full mb-6 border border-[#EAE3D2] relative">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      fill />
                      <div className="absolute inset-0 border-[4px] border-[#FDFBF7] rounded-t-full rounded-b-sm pointer-events-none z-10"></div>
                    </div>
                  ) : null}
                  
                  <div className="flex-grow flex flex-col text-center px-4">
                    <h3 className="text-lg font-medium text-[#2C3B29] mb-2">{item.name}</h3>
                    
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                      {item.is_vegetarian && <span className="text-[10px] uppercase tracking-wider text-[#3E5739] border border-[#3E5739]/30 px-2 py-0.5 rounded-full">Veg</span>}
                      {item.is_vegan && <span className="text-[10px] uppercase tracking-wider text-[#3E5739] border border-[#3E5739]/30 px-2 py-0.5 rounded-full">Vegan</span>}
                      {item.is_gluten_free && <span className="text-[10px] uppercase tracking-wider text-[#8A9A86] border border-[#8A9A86]/30 px-2 py-0.5 rounded-full">GF</span>}
                    </div>

                    <p className="text-sm text-[#556B50] italic leading-relaxed mb-6">{item.description}</p>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-[#EAE3D2] pt-4">
                      <span className="text-lg font-medium tracking-wide">${item.price.toFixed(2)}</span>
                      
                      {canOrder && (
                        <div className="flex items-center gap-3">
                          {cartItems.find((i) => i.menuItem.id === item.id) ? (
                            <div className="flex items-center gap-3 bg-[#EAE3D2]/50 rounded-full p-1 border border-[#EAE3D2]">
                              <button onClick={() => updateQuantity(item.id, cartItems.find((i) => i.menuItem.id === item.id)!.quantity - 1)} className="p-1.5 hover:bg-white rounded-full transition-colors text-[#3E5739]">
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-4 text-center font-sans font-medium text-sm">
                                {cartItems.find((i) => i.menuItem.id === item.id)?.quantity}
                              </span>
                              <button onClick={() => updateQuantity(item.id, cartItems.find((i) => i.menuItem.id === item.id)!.quantity + 1)} className="p-1.5 hover:bg-white rounded-full transition-colors text-[#3E5739]">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="px-6 py-2 rounded-full border border-[#3E5739] text-[#3E5739] hover:bg-[#3E5739] hover:text-white transition-colors uppercase tracking-widest text-xs font-sans font-medium"
                            >
                              Add
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

      <div className="text-center pb-8 opacity-40 font-sans text-xs tracking-widest uppercase">
        <Leaf className="w-4 h-4 mx-auto mb-2" />
        Cultivated by {hasWhiteLabeling ? restaurant.name : "Nomenu"}
      </div>

      {canFeedback && <FeedbackFAB restaurantId={restaurant.id} tableNumber={tableNumber} qrCodeId={qrCodeId} />}

      {canFeedback && <FeedbackFAB restaurantId={restaurant.id} tableNumber={tableNumber} qrCodeId={qrCodeId} />}
    </div>
  );
}
