import React, { useState, useEffect } from "react";
import { X, Cpu, Zap, Activity } from "lucide-react";
import { useCart } from "../cart-context";
import { useMenuLogic } from "../use-menu-logic";
import { MenuThemeProps } from "../types";
import { FeedbackFAB } from "../feedback-fab";

export function CyberpunkTheme(props: MenuThemeProps) {
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

  // Glitch effect state
  const [glitchText, setGlitchText] = useState(restaurant.name);
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setGlitchText(restaurant.name.split('').map(c => Math.random() > 0.8 ? String.fromCharCode(33 + Math.floor(Math.random() * 94)) : c).join(''));
        setTimeout(() => setGlitchText(restaurant.name), 100);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [restaurant.name]);

  return (
    <div className="min-h-screen bg-[#050510] text-[#0ff] font-mono pb-32 overflow-hidden relative">
      
      {/* Grid Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{
        backgroundImage: "linear-gradient(#f0f 1px, transparent 1px), linear-gradient(90deg, #0ff 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        transform: "perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)",
      }}></div>

      <div className="relative z-10">
        {/* Cyberpunk Header */}
        <header className="px-4 pt-12 pb-8 border-b-4 border-[#0ff] shadow-[0_0_20px_#0ff] bg-[#050510]/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <div className="text-[10px] text-[#f0f] tracking-widest mb-2 flex items-center gap-2 uppercase">
                <Activity size={12} className="animate-pulse" />
                SYSTEM_ONLINE // {restaurant.cuisine_type || "NEXUS_FOOD"}
              </div>
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#0ff] to-[#f0f]" style={{ textShadow: "2px 2px 0px rgba(255,0,255,0.5)" }}>
                {glitchText}
              </h1>
            </div>
            <div className="bg-[#002] border border-[#0ff] px-4 py-2 text-xs uppercase flex flex-col items-end shadow-[inset_0_0_10px_#0ff]">
              <span className="text-[#ff0]">LOC: {restaurant.address}</span>
              <span className="text-[#0ff]">STAT: ACCEPTING_UPLINKS</span>
            </div>
          </div>
        </header>

        {/* HUD Navigation */}
        <div className="sticky top-0 z-40 bg-[#050510]/90 backdrop-blur-md border-b border-[#f0f] shadow-[0_5px_15px_rgba(255,0,255,0.2)]">
          <div className="max-w-4xl mx-auto flex flex-col">
            <div className="flex border-b border-[#0ff]/30">
              <div className="flex-grow flex items-center px-4 bg-[#0ff]/10">
                <span className="text-[#f0f] font-bold mr-2">&gt;</span>
                <input 
                  type="text" 
                  placeholder="QUERY_DATABASE..." 
                  value={searchQuery}
                  onChange={(e) => setters.setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-[#0ff] py-3 text-sm focus:outline-none placeholder-[#0ff]/50 uppercase"
                />
              </div>
              <div className="flex text-xs uppercase border-l border-[#0ff]/30">
                <button onClick={() => setters.setLayoutMode(layoutMode === "grid" ? "list" : "grid")} className="px-4 py-3 hover:bg-[#0ff] hover:text-black transition-colors border-r border-[#0ff]/30">
                  {layoutMode === "grid" ? "SEQ" : "MAT"}
                </button>
                <button onClick={() => setters.setFilterVeg(!filterVeg)} className={`px-4 py-3 border-r border-[#0ff]/30 transition-colors ${filterVeg ? "bg-[#0f0] text-black" : "hover:bg-[#0f0]/20 text-[#0f0]"}`}>VEG</button>
                <button onClick={() => setters.setFilterGF(!filterGF)} className={`px-4 py-3 transition-colors ${filterGF ? "bg-[#ff0] text-black" : "hover:bg-[#ff0]/20 text-[#ff0]"}`}>GF</button>
              </div>
            </div>
            
            <div ref={categoryNavRef} className="flex overflow-x-auto scrollbar-none py-2 px-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  id={`nav-pill-${cat.id}`}
                  onClick={() => handlers.scrollToCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-1 text-xs uppercase border transition-all ${
                    activeCategory === cat.id 
                      ? "border-[#0ff] bg-[#0ff]/20 text-[#0ff] shadow-[0_0_10px_#0ff]" 
                      : "border-[#f0f]/50 text-[#f0f]/70 hover:text-[#f0f] hover:border-[#f0f]"
                  }`}
                >
                  [{cat.name}]
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matrix Data Stream (Menu Content) */}
        <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-16 mt-8">
          {categories.map(cat => {
            const catItems = filteredItems.filter(i => i.category_id === cat.id);
            if (catItems.length === 0) return null;

            return (
              <section key={cat.id} id={`cat-${cat.id}`} ref={el => { categoryRefs.current[cat.id] = el; }} className="scroll-mt-32">
                
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-black uppercase tracking-widest text-[#f0f] shadow-[#f0f] drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]">{cat.name}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#f0f] to-transparent"></div>
                  <span className="text-[10px] text-[#0ff]">SYS.DIR.{cat.id.substring(0,4)}</span>
                </div>

                <div className={layoutMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-6"}>
                  {catItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      onClick={() => setters.setSelectedItem(item)}
                      className={`group cursor-pointer bg-[#001] border border-[#0ff]/30 hover:border-[#0ff] hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all p-1 flex ${layoutMode === "list" ? "flex-col sm:flex-row gap-0" : "flex-col"}`}
                    >
                      {/* Cyber Frame */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#0ff] pointer-events-none"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#0ff] pointer-events-none"></div>

                      {layoutMode === "list" && item.image_url && (
                        <div className="w-full sm:w-40 h-40 relative overflow-hidden bg-[#000] shrink-0 border-r border-[#0ff]/20">
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100 mix-blend-screen" />
                          <div className="absolute inset-0 bg-[#0ff]/10 group-hover:bg-transparent transition-colors pointer-events-none"></div>
                        </div>
                      )}
                      
                      <div className="p-4 flex-grow flex flex-col h-full bg-[#050510]/80">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h3 className="text-lg font-bold uppercase text-[#fff] group-hover:text-[#0ff] transition-colors">{item.name}</h3>
                          <span className="text-lg font-black text-[#f0f] bg-[#f0f]/10 px-2 border border-[#f0f]/30 shrink-0">
                            {currencySign}{item.price.toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="text-[10px] text-[#0ff]/50 mb-3 flex items-center gap-2">
                          <Cpu size={10} /> ID: {item.id.substring(0,8)} | MEM: {item.calories || "1024"}KB
                        </div>
                        
                        {item.description && (
                          <p className="text-xs text-[#aaa] leading-relaxed mb-4">
                            {item.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {item.is_popular && <span className="text-[9px] uppercase bg-[#ff0] text-black px-1.5 py-0.5 font-bold">PRIME_OBJ</span>}
                          {item.is_vegetarian && <span className="text-[9px] uppercase bg-[#0f0]/20 text-[#0f0] border border-[#0f0]/50 px-1.5 py-0.5">VEG_MODULE</span>}
                          {item.is_spicy && <span className="text-[9px] uppercase bg-[#f00]/20 text-[#f00] border border-[#f00]/50 px-1.5 py-0.5">THERMAL_WARNING</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {/* Item Modal (Cyberpunk UI) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050510]/95 backdrop-blur-md">
          
          <div className="bg-[#001] border-2 border-[#0ff] w-full max-w-xl flex flex-col max-h-[90vh] shadow-[0_0_30px_rgba(0,255,255,0.2)] relative overflow-hidden">
            
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,255,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none z-20"></div>

            <div className="bg-[#0ff] text-black p-2 flex justify-between items-center z-30">
              <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
                <Zap size={16} /> DATA_ARCHIVE_VIEW //
              </div>
              <button onClick={() => setters.setSelectedItem(null)} className="hover:bg-black hover:text-[#0ff] px-2 transition-colors font-black">X</button>
            </div>
            
            <div className="p-6 sm:p-8 flex flex-col flex-grow overflow-y-auto z-30">
              
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-black uppercase text-[#fff] text-shadow-[0_0_10px_#fff] max-w-[70%]">{selectedItem.name}</h2>
                <div className="text-2xl font-black text-[#0ff] bg-[#0ff]/10 px-3 py-1 border border-[#0ff]/50">
                  {currencySign}{selectedItem.price.toFixed(2)}
                </div>
              </div>
              
              {selectedItem.image_url && (
                <div className="w-full h-56 border border-[#f0f] mb-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-full bg-[#f0f]/20 mix-blend-overlay z-10"></div>
                  <img src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover grayscale contrast-150" />
                  <div className="absolute bottom-2 right-2 text-[10px] bg-black/80 text-[#f0f] px-2 py-1 border border-[#f0f] z-20 uppercase">
                    VISUAL_DATA_LINK
                  </div>
                </div>
              )}
              
              <div className="bg-[#000] border-l-4 border-[#f0f] p-4 mb-6">
                <p className="text-sm text-[#ccc] leading-relaxed font-mono">
                  &gt; {selectedItem.description}
                </p>
              </div>

              {canOrder && (
                <div className="space-y-6 mb-8 border-t border-[#0ff]/30 pt-6">
                  {/* Quantity */}
                  <div className="flex justify-between items-center bg-[#001] border border-[#0ff]/50 p-3">
                    <span className="text-xs font-bold uppercase text-[#0ff]">UNIT_COUNT</span>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setters.setOrderQuantity(Math.max(1, orderQuantity - 1))} className="w-8 h-8 bg-[#0ff]/20 text-[#0ff] hover:bg-[#0ff] hover:text-black font-bold flex items-center justify-center transition-colors">-</button>
                      <span className="text-xl font-black text-white w-8 text-center">{orderQuantity}</span>
                      <button onClick={() => setters.setOrderQuantity(orderQuantity + 1)} className="w-8 h-8 bg-[#0ff]/20 text-[#0ff] hover:bg-[#0ff] hover:text-black font-bold flex items-center justify-center transition-colors">+</button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#0ff] mb-2">OVERRIDE_PARAMS // EXECUTIONS</label>
                    <textarea 
                      value={orderNotes}
                      onChange={(e) => setters.setOrderNotes(e.target.value)}
                      placeholder="ENTER PARAMETERS..."
                      className="w-full bg-[#000] border border-[#0ff]/50 text-[#0ff] p-3 text-sm focus:outline-none focus:border-[#f0f] min-h-[80px] uppercase"
                    />
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4">
                <button 
                  onClick={() => canOrder ? handlers.handleAddToCart() : setters.setSelectedItem(null)}
                  className="w-full py-4 bg-gradient-to-r from-[#0ff] to-[#f0f] text-black font-black text-xl uppercase hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(255,0,255,0.5)]"
                >
                  {canOrder ? `COMPILE_ORDER [${currencySign}${(selectedItem.price * orderQuantity).toFixed(2)}]` : "TERMINATE_VIEW"}
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
