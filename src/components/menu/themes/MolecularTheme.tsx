import { MenuProps, OrderItem } from "../types";
import { Plus, Minus, Beaker, Hexagon, Fingerprint } from "lucide-react";
import { FeedbackFAB } from "../feedback-fab";
import { useState } from "react";

export function MolecularTheme({ menu, canOrder, canFeedback }: MenuProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(
    menu.categories.length > 0 ? menu.categories[0].name : ""
  );

  const categories = menu.categories;
  const restaurantName = menu.restaurant_name || "LAB-01";
  const accentColor = menu.design_config?.accent_color || "#00E5FF";

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
    <div className="min-h-screen bg-[#F0F2F5] text-[#1a1f2e] font-mono pb-32 selection:bg-[#00E5FF] selection:text-[#001122]">
      {/* Grid Background Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      ></div>

      {/* Laboratory Header */}
      <div className="relative z-10 bg-white border-b-2 border-[#1a1f2e]">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-2 border-[#1a1f2e] rounded-sm flex items-center justify-center bg-white transform rotate-45">
              <Hexagon className="w-8 h-8 text-[#1a1f2e] -rotate-45" />
            </div>
            <div>
              <div className="text-xs tracking-[0.3em] text-slate-500 mb-1">EXPERIMENTAL KITCHEN</div>
              <h1 className="text-4xl font-bold tracking-tight text-[#1a1f2e] uppercase">
                {restaurantName}
              </h1>
            </div>
          </div>
          <div className="bg-[#1a1f2e] text-white p-4 rounded-sm border-l-4" style={{ borderColor: accentColor }}>
            <p className="text-sm max-w-xs leading-relaxed">
              {menu.design_config?.welcome_message || "SYNTHESIS // PREPARATION // CONSUMPTION"}
            </p>
          </div>
        </div>
      </div>

      {/* Clinical Navigation */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-[#1a1f2e]">
        <div className="flex overflow-x-auto hide-scrollbar px-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.name);
                document.getElementById(`category-${category.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`whitespace-nowrap px-6 py-4 border-r-2 border-[#1a1f2e] font-bold text-sm transition-all uppercase ${
                activeCategory === category.name
                  ? "bg-[#1a1f2e] text-white"
                  : "bg-white text-[#1a1f2e] hover:bg-slate-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-16 mt-8 relative z-10">
        {categories.map((category) => (
          <section key={category.id} id={`category-${category.id}`} className="scroll-mt-24">
            <div className="mb-8 flex items-end gap-4">
              <h2 className="text-3xl font-bold bg-[#1a1f2e] text-white px-4 py-1 inline-block uppercase">
                {category.name}
              </h2>
              <div className="h-2 flex-grow border-b-2 border-dashed border-[#1a1f2e] mb-2 opacity-30"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item) => (
                <div key={item.id} className="group bg-white border-2 border-[#1a1f2e] p-5 relative overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(26,31,46,1)] transition-all">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-l-2 border-b-2 border-[#1a1f2e] bg-slate-100 flex items-center justify-center">
                    <span className="text-[10px] font-bold">{item.price.toFixed(0)}</span>
                  </div>
                  
                  {item.image_url && (
                    <div className="w-full aspect-square border-2 border-[#1a1f2e] mb-4 bg-slate-50 relative overflow-hidden p-1">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover filter grayscale contrast-125"
                      />
                      {/* Scanner effect line */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#00E5FF] opacity-50 animate-[scan_4s_ease-in-out_infinite]"></div>
                    </div>
                  )}

                  <div className="flex-grow flex flex-col">
                    <h3 className="text-xl font-bold uppercase mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">{item.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                      {item.is_vegetarian && <span className="text-[9px] uppercase font-bold bg-green-100 text-green-800 px-1.5 py-0.5 border border-green-800">VEG_ISOTOPE</span>}
                      {item.is_vegan && <span className="text-[9px] uppercase font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 border border-emerald-800">VGN_ISOTOPE</span>}
                      {item.is_gluten_free && <span className="text-[9px] uppercase font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 border border-amber-800">GF_VARIANT</span>}
                    </div>

                    <div className="flex items-center justify-between border-t-2 border-dashed border-[#1a1f2e] pt-4 mt-auto">
                      <div className="font-bold text-xl">${item.price.toFixed(2)}</div>
                      
                      {canOrder && (
                        <div className="flex items-center gap-2">
                          {orderItems.find((i) => i.item_id === item.id) ? (
                            <div className="flex items-center gap-2 bg-[#1a1f2e] text-white px-2 py-1">
                              <button onClick={() => handleUpdateQuantity(item.id, -1)} className="hover:text-[#00E5FF]">
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-6 text-center font-bold">
                                {orderItems.find((i) => i.item_id === item.id)?.quantity}
                              </span>
                              <button onClick={() => handleUpdateQuantity(item.id, 1)} className="hover:text-[#00E5FF]">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="px-4 py-1.5 border-2 border-[#1a1f2e] font-bold uppercase text-xs hover:bg-[#1a1f2e] hover:text-white transition-colors"
                            >
                              EXTRACT
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

      <div className="text-center pb-8 opacity-50 text-xs font-bold uppercase flex items-center justify-center gap-2 relative z-10">
        <Fingerprint className="w-4 h-4" />
        SYSTEM PROTOTYPE BY NOMENU
      </div>

      {canFeedback && <FeedbackFAB menuId={menu.id} restaurantId={menu.restaurant_id} />}

      {/* Order Terminal (Cart) */}
      {canOrder && isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl border-4 border-[#1a1f2e] shadow-[16px_16px_0px_0px_rgba(26,31,46,1)] flex flex-col max-h-[85vh]">
            <div className="p-4 border-b-4 border-[#1a1f2e] bg-[#1a1f2e] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Beaker className="w-5 h-5" style={{ color: accentColor }} />
                <h2 className="text-xl font-bold uppercase tracking-widest">SYNTHESIS_QUEUE</h2>
              </div>
              <button onClick={() => setIsOrderModalOpen(false)} className="hover:text-red-400 p-1">
                [X] TERMINATE
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 flex-grow bg-slate-50">
              {orderItems.length === 0 ? (
                <div className="text-center text-slate-500 py-12 border-2 border-dashed border-slate-300">NO COMPOUNDS SELECTED</div>
              ) : (
                <div className="space-y-4">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 uppercase border-b-2 border-[#1a1f2e] pb-2">
                    <div className="col-span-6">COMPOUND</div>
                    <div className="col-span-2 text-center">QTY</div>
                    <div className="col-span-2 text-right">UNIT</div>
                    <div className="col-span-2 text-right">TOTAL</div>
                  </div>
                  {orderItems.map((item) => (
                    <div key={item.item_id} className="grid grid-cols-12 gap-2 items-center py-2 border-b border-dashed border-slate-300">
                      <div className="col-span-6 font-bold truncate pr-2 uppercase">{item.name}</div>
                      <div className="col-span-2 flex items-center justify-center gap-2">
                        <button onClick={() => handleUpdateQuantity(item.item_id, -1)} className="w-6 h-6 bg-slate-200 flex items-center justify-center font-bold hover:bg-slate-300">-</button>
                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.item_id, 1)} className="w-6 h-6 bg-slate-200 flex items-center justify-center font-bold hover:bg-slate-300">+</button>
                      </div>
                      <div className="col-span-2 text-right text-slate-600">${item.price.toFixed(2)}</div>
                      <div className="col-span-2 text-right font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {orderItems.length > 0 && (
              <div className="p-6 border-t-4 border-[#1a1f2e] bg-white">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold uppercase text-slate-500 tracking-widest">MASS_TOTAL</span>
                  <span className="font-bold text-3xl">${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  className="w-full py-4 bg-[#1a1f2e] text-white font-bold text-lg uppercase tracking-[0.2em] hover:bg-[#00E5FF] hover:text-[#1a1f2e] transition-colors flex items-center justify-center gap-3 group"
                >
                  <Hexagon className="w-6 h-6 group-hover:animate-spin" />
                  INITIATE SEQUENCE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Status Indicator */}
      {canOrder && totalItems > 0 && !isOrderModalOpen && (
        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-white border-4 border-[#1a1f2e] shadow-[8px_8px_0px_0px_rgba(26,31,46,1)] px-6 py-4 flex items-center gap-4 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(26,31,46,1)] transition-all group"
        >
          <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: accentColor }}></div>
          <span className="font-bold tracking-widest uppercase">
            DATA: {totalItems} // ${cartTotal.toFixed(2)}
          </span>
          <div className="w-6 h-6 border-2 border-[#1a1f2e] flex items-center justify-center group-hover:bg-[#1a1f2e] group-hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
          </div>
        </button>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(200px); }
          100% { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
