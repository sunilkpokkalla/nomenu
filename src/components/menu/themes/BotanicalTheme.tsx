import { MenuProps, OrderItem } from "../types";
import { Plus, Minus, ShoppingBag, Leaf, Info } from "lucide-react";
import { FeedbackFAB } from "../feedback-fab";
import { useState } from "react";

export function BotanicalTheme({ menu, canOrder, canFeedback }: MenuProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(
    menu.categories.length > 0 ? menu.categories[0].name : ""
  );

  const categories = menu.categories;
  const restaurantName = menu.restaurant_name || "The Garden";
  const accentColor = menu.design_config?.accent_color || "#3E5739";

  const handleAddToCart = (item: any) => {
    if (!canOrder) return;
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.item_id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          notes: "",
        },
      ];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setOrderItems((prev) => {
      return prev
        .map((item) => {
          if (item.item_id === itemId) {
            return { ...item, quantity: Math.max(0, item.quantity + delta) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const cartTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

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
            {menu.design_config?.welcome_message || "Locally sourced, organically inspired."}
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
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
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
                          {orderItems.find((i) => i.item_id === item.id) ? (
                            <div className="flex items-center gap-3 bg-[#EAE3D2]/50 rounded-full p-1 border border-[#EAE3D2]">
                              <button onClick={() => handleUpdateQuantity(item.id, -1)} className="p-1.5 hover:bg-white rounded-full transition-colors text-[#3E5739]">
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-4 text-center font-sans font-medium text-sm">
                                {orderItems.find((i) => i.item_id === item.id)?.quantity}
                              </span>
                              <button onClick={() => handleUpdateQuantity(item.id, 1)} className="p-1.5 hover:bg-white rounded-full transition-colors text-[#3E5739]">
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
        Cultivated by Nomenu
      </div>

      {canFeedback && <FeedbackFAB menuId={menu.id} restaurantId={menu.restaurant_id} />}

      {/* Cart Modal - Earthy style */}
      {canOrder && isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-[#2C3B29]/40 backdrop-blur-sm p-4 font-sans">
          <div className="bg-[#FDFBF7] w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#EAE3D2]">
            <div className="p-6 border-b border-[#EAE3D2] flex justify-between items-center bg-[#EAE3D2]/30">
              <h2 className="text-xl font-serif text-[#2C3B29]">Your Basket</h2>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-[#8A9A86] hover:text-[#2C3B29] p-2 rounded-full hover:bg-white transition-colors">
                ✕
              </button>
            </div>
            
            <div className="p-6 max-h-[50vh] overflow-y-auto space-y-6">
              {orderItems.length === 0 ? (
                <div className="text-center text-[#8A9A86] py-8 font-serif italic">Your basket is empty.</div>
              ) : (
                orderItems.map((item) => (
                  <div key={item.item_id} className="flex justify-between items-start gap-4 pb-6 border-b border-[#EAE3D2]/50 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <h4 className="font-serif text-[#2C3B29] text-lg">{item.name}</h4>
                      <div className="text-[#3E5739] font-medium mt-1">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-3 bg-[#EAE3D2]/50 rounded-full p-1 border border-[#EAE3D2]">
                      <button onClick={() => handleUpdateQuantity(item.item_id, -1)} className="p-2 hover:bg-white rounded-full transition-colors text-[#3E5739]">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-4 text-center font-medium text-sm text-[#2C3B29]">
                        {item.quantity}
                      </span>
                      <button onClick={() => handleUpdateQuantity(item.item_id, 1)} className="p-2 hover:bg-white rounded-full transition-colors text-[#3E5739]">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {orderItems.length > 0 && (
              <div className="p-6 bg-[#EAE3D2]/30 border-t border-[#EAE3D2]">
                <div className="flex justify-between items-center mb-6 text-lg font-serif">
                  <span className="text-[#556B50]">Total Harvest</span>
                  <span className="font-medium text-[#2C3B29] text-2xl">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full py-4 rounded-full bg-[#3E5739] text-white font-medium hover:bg-[#2C3B29] transition-colors uppercase tracking-widest text-sm">
                  Send to Kitchen
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {canOrder && totalItems > 0 && !isOrderModalOpen && (
        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#3E5739] text-white px-8 py-4 rounded-full shadow-xl flex items-center gap-4 hover:scale-105 transition-transform font-sans"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-2 -right-3 bg-[#EAE3D2] text-[#2C3B29] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          </div>
          <span className="font-medium tracking-widest uppercase text-sm">Basket • ${cartTotal.toFixed(2)}</span>
        </button>
      )}
    </div>
  );
}
