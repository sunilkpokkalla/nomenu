"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { 
  X, 
  Search, 
  Plus, 
  ArrowLeft, 
  Flame, 
  Leaf, 
  Sparkles, 
  Clock, 
  Award, 
  Check,
  UtensilsCrossed
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { GLOBAL_DISH_LIBRARY, LibraryDish } from "@/lib/global-dish-library";
import { Loader2 } from "lucide-react";
import { createMenuItem } from "@/app/dashboard/actions";
import Image from "next/image";

interface ChefLibraryModalProps {
  cuisineType: string | null | undefined;
  menus: { id: string; name: string }[];
  categories: { id: string; name: string; menu_id: string }[];
  onSelectDish?: (dish: LibraryDish) => void;
}

const CUISINE_CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "french", label: "French & Bistro" },
  { id: "italian", label: "Italian" },
  { id: "american", label: "American Diner" },
  { id: "mexican", label: "Mexican" },
  { id: "japanese", label: "Japanese & Asian" },
  { id: "indian", label: "Indian" },
  { id: "spanish", label: "Spanish & Tapas" },
  { id: "breakfast", label: "Breakfast & Cafe" },
  { id: "drinks", label: "Beverages & Drinks" },
  { id: "kids", label: "Kids Menu" }
];

export function ChefLibraryModal({ cuisineType, menus, categories, onSelectDish }: ChefLibraryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [selectedDish, setSelectedDish] = useState<LibraryDish | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [magicCredits, setMagicCredits] = useState<number | null>(null);

  // Supabase-powered search state
  const [searchResults, setSearchResults] = useState<LibraryDish[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch credits when modal opens
  useEffect(() => {
    if (isOpen) {
      fetch("/api/restaurant/credits")
        .then(res => res.json())
        .then(data => {
          if (data.magic_credits !== undefined) {
            setMagicCredits(data.magic_credits);
          }
        })
        .catch(err => console.error("Failed to fetch credits", err));
    }
  }, [isOpen]);

  // Debounced Supabase search — fires when user types
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/library?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          // Map Supabase shape to LibraryDish shape
          const mapped: LibraryDish[] = data.map((row: { name: string; description: string; category_id: string | null; image_url: string | null; }) => ({
            name: row.name,
            description: row.description || "",
            category: row.category_id || "Other",
            cuisines: [],
            imageUrl: row.image_url || undefined,
          }));
          setSearchResults(mapped);
        }
      } catch (err) {
        console.error("Library search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  // Handle Stripe checkout for Magic Credits
  const handleBuyCredits = async () => {
    try {
      const res = await fetch("/api/stripe/credit-checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to initiate checkout");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to initiate checkout");
    }
  };

  // Configuration Form State
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formMenuId, setFormMenuId] = useState(menus[0]?.id || "");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  // Dietary checkboxes state
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formIsVegetarian, setFormIsVegetarian] = useState(false);
  const [formIsVegan, setFormIsVegan] = useState(false);
  const [formIsGlutenFree, setFormIsGlutenFree] = useState(false);
  const [formIsSpicy, setFormIsSpicy] = useState(false);

  // Normalize user cuisine for matching recommendations
  const normalizedCuisine = useMemo(() => {
    return cuisineType ? cuisineType.toLowerCase() : "";
  }, [cuisineType]);

  // 1. Determine which explicit country tabs should be shown
  const matchedCountryCuisines = useMemo(() => {
    if (!cuisineType) return [];
    const norm = cuisineType.toLowerCase();
    
    // Map of aliases to our supported categories
    const aliases: Record<string, string> = {
      'bangladeshi': 'indian',
      'pakistani': 'indian',
      'sri lankan': 'indian',
      'nepalese': 'indian',
      'british': 'american', // maps to pub/diner food mostly
      'canadian': 'american',
      'argentine': 'spanish',
      'colombian': 'mexican', // rough proxy for latin american
      'peruvian': 'mexican',
      'korean': 'japanese', // proxy for asian
      'chinese': 'japanese',
      'thai': 'japanese',
      'vietnamese': 'japanese',
    };

    // Check aliases first
    for (const [alias, target] of Object.entries(aliases)) {
      if (norm.includes(alias)) return [target];
    }

    const supportedCountries = ["french", "italian", "american", "mexican", "japanese", "indian", "spanish"];
    const match = supportedCountries.find(c => norm.includes(c) || c.includes(norm));
    
    return match ? [match] : ["unsupported"];
  }, [cuisineType]);

  // Filter the category pills to only show relevant ones
  const visibleCategories = useMemo(() => {
    // We never want to show ALL tabs just because it's unsupported.
    // If unsupported, we just show the generic tabs so the user isn't confused by "French" tabs in a Bangladeshi restaurant.
    return CUISINE_CATEGORIES.filter(cat => {
      if (["all", "breakfast", "drinks", "kids"].includes(cat.id)) return true;
      return matchedCountryCuisines.includes(cat.id);
    });
  }, [matchedCountryCuisines]);

  // The actual library of items available to the user
  const restaurantLibrary = useMemo(() => {
    // If the cuisine is completely unsupported, give them the entire global library 
    // so they can at least search for things, even if the tabs are hidden.
    if (matchedCountryCuisines.includes("unsupported")) {
      return GLOBAL_DISH_LIBRARY;
    }

    return GLOBAL_DISH_LIBRARY.filter(dish => {
      const cuisines = dish.cuisines || [];
      const isMatchedCountry = cuisines.some(c => matchedCountryCuisines.includes(c));
      const isGeneric = cuisines.some(c => ["breakfast", "drinks", "kids", "cafe", "bistro", "pub", "fast food"].includes(c));
      return isMatchedCountry || isGeneric;
    });
  }, [matchedCountryCuisines]);

  // Filtered dishes: use Supabase results when searching, local library for tabs
  const filteredDishes = useMemo(() => {
    // When searching — use live Supabase results
    if (searchQuery.trim()) return searchResults;

    // Deduplicate local library for tab browsing
    const seen = new Set<string>();
    const deduped = restaurantLibrary.filter(dish => {
      const key = dish.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return deduped.filter(dish => {
      // 1. Search Query Match
      if (searchQuery) {
        const matchesSearch = 
          dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          dish.description.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
      }

      // 2. Cuisine Pill Filter Match (only applies when NOT searching)
      if (selectedCuisine === "all") return true;
      
      if (selectedCuisine === "french") return dish.cuisines.includes("french") || dish.cuisines.includes("bistro");
      if (selectedCuisine === "italian") return dish.cuisines.includes("italian") || dish.cuisines.includes("pizza");
      if (selectedCuisine === "american") return dish.cuisines.includes("american diner");
      if (selectedCuisine === "mexican") return dish.cuisines.includes("mexican") || dish.cuisines.includes("taqueria");
      if (selectedCuisine === "japanese") return dish.cuisines.includes("japanese") || dish.cuisines.includes("sushi") || dish.cuisines.includes("ramen") || dish.cuisines.includes("teishoku");
      if (selectedCuisine === "indian") return dish.cuisines.includes("indian");
      if (selectedCuisine === "spanish") return dish.cuisines.includes("spanish") || dish.cuisines.includes("tapas");
      if (selectedCuisine === "breakfast") return dish.cuisines.includes("cafe") || dish.cuisines.includes("coffee") || dish.cuisines.includes("bakery") || dish.cuisines.includes("breakfast");
      if (selectedCuisine === "drinks") return dish.cuisines.includes("bar") || dish.cuisines.includes("cocktail") || dish.cuisines.includes("drinks") || dish.cuisines.includes("beverages") || dish.category === "Beverages" || dish.category === "Cocktails" || dish.category === "Drinks";
      if (selectedCuisine === "kids") return dish.cuisines.includes("kids menu");

      return true;
    });
  }, [searchQuery, selectedCuisine, restaurantLibrary, searchResults]);

  const activeCuisineTab = selectedCuisine;

  // Filter categories to only display those belonging to the currently selected menu in the form
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => cat.menu_id === formMenuId);
  }, [categories, formMenuId]);

  // Handle generating a custom dish via AI
  const handleMagicGenerate = async () => {
    if (!searchQuery) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/menu/magic-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "OUT_OF_CREDITS") {
          alert("You are out of Magic Credits! Please purchase more to continue.");
          setMagicCredits(0);
          return;
        }
        throw new Error("Generation failed");
      }
      if (data.dish) {
        setMagicCredits(prev => (prev !== null && prev > 0) ? prev - 1 : prev);
        handleSelectDish(data.dish);
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Failed to generate dish. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle selecting a dish to start configuration
  const handleSelectDish = (dish: LibraryDish) => {
    if (onSelectDish) {
      onSelectDish(dish);
      setIsOpen(false);
      return;
    }

    setSelectedDish(dish);
    setFormName(dish.name);
    setFormDescription(dish.description);
    setFormPrice("");
    
    // Set default menu and category
    const defaultMenuId = menus[0]?.id || "";
    setFormMenuId(defaultMenuId);

    const relatedCats = categories.filter(cat => cat.menu_id === defaultMenuId);
    if (relatedCats.length > 0) {
      setFormCategoryId(relatedCats[0].id);
      setIsNewCategory(false);
    } else {
      setFormCategoryId("");
      setIsNewCategory(true);
    }

    // Set dietary tags
    setFormIsPopular(true); // default highlight newly added ones
    setFormIsVegetarian(!!dish.isVegetarian);
    setFormIsVegan(!!dish.isVegan);
    setFormIsGlutenFree(!!dish.isGlutenFree);
    setFormIsSpicy(!!dish.isSpicy);
  };

  // When changing the menu inside the form, update category state accordingly
  const handleMenuChange = (menuId: string) => {
    setFormMenuId(menuId);
    const relatedCats = categories.filter(cat => cat.menu_id === menuId);
    if (relatedCats.length > 0) {
      setFormCategoryId(relatedCats[0].id);
      setIsNewCategory(false);
    } else {
      setFormCategoryId("");
      setIsNewCategory(true);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setIsOpen(true);
          setSelectedDish(null);
          setSearchQuery("");
          
          if (cuisineType) {
            const norm = cuisineType.toLowerCase();
            const countries = ["french", "italian", "american", "mexican", "japanese", "indian", "spanish"];
            const match = countries.find(c => norm.includes(c) || c.includes(norm));
            setSelectedCuisine(match || "all");
          } else {
            setSelectedCuisine("all");
          }
        }}
        className="w-full bg-primary text-white hover:bg-primary/90 border-primary font-bold transition flex items-center justify-center gap-1.5 h-11 shadow-sm hover:shadow"
      >
        <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400" />
        Browse Chef's Library
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* MODAL HEADER */}
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50/50 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {selectedDish ? (
                    <>
                      <button 
                        onClick={() => setSelectedDish(null)}
                        className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <span>Configure Item: {selectedDish.name}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" />
                      <span>Chef's Global Dishes Library</span>
                    </>
                  )}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedDish 
                    ? "Set your price and options before saving to your menu." 
                    : onSelectDish 
                      ? "Select a dish to autofill your form with gourmet details."
                      : "Instantly create professional menu items with pre-written gourmet descriptions."}
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* BROWSE MODE */}
            {!selectedDish && (
              <>
                {/* SEARCH AND FILTERS */}
                <div className="p-5 border-b space-y-4 shrink-0 bg-white">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search 965+ dishes... (e.g. Takoyaki, Negroni, Crème Brûlée, Mango Lassi)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-9 h-10 border-slate-200 focus:ring-slate-900 focus:border-slate-900"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-3 h-4 w-4 text-slate-400 animate-spin" />
                    )}
                  </div>
                  
                  {/* Category Pill Filters */}
                  <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pr-2 scrollbar-thin">
                    {visibleCategories.map((cat) => {
                      const isActive = activeCuisineTab === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCuisine(cat.id)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition ${
                            isActive
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DISHES LIST */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-slate-500">
                      Showing {filteredDishes.length} {filteredDishes.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  {filteredDishes.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {filteredDishes.map((dish, index) => {
                        return (
                          <div
                            key={`${dish.name}-${index}`}
                            onClick={() => handleSelectDish(dish)}
                            className="bg-white border hover:border-slate-400 p-4 rounded-xl shadow-sm transition flex flex-col justify-between cursor-pointer group hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200"
                            style={{ animationDelay: `${index * 15}ms` }}
                          >
                            <div className="flex gap-4">
                              <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-50 border relative flex items-center justify-center flex-col gap-1 text-slate-300">
                                {dish.imageUrl ? (
                                  <img 
                                    src={dish.imageUrl} 
                                    alt={dish.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center border-b group-hover:from-slate-100 group-hover:to-slate-200 transition">
                                    <UtensilsCrossed className="w-8 h-8 text-slate-300 mb-1" strokeWidth={1.5} />
                                    <span className="text-[9px] font-medium text-slate-400/80 uppercase tracking-wider">No Image</span>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-bold text-slate-950 group-hover:text-primary transition flex-1 min-w-0 leading-tight">
                                    {dish.name}
                                  </h3>
                                  <div className="flex items-center shrink-0">
                                    <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 rounded bg-slate-100 border truncate max-w-[80px]">
                                      {dish.category}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                  {dish.description}
                                </p>
                              </div>
                            </div>
                              
                            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                              <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-500 mr-2">
                                {dish.isVegetarian && <span className="flex items-center text-green-600 gap-0.5 font-medium"><Leaf className="h-3 w-3" /> Veg</span>}
                                {dish.isVegan && <span className="flex items-center text-emerald-600 gap-0.5 font-medium"><Sparkles className="h-3 w-3" /> Vegan</span>}
                                {dish.isGlutenFree && <span className="text-blue-600 font-semibold bg-blue-50 px-1 border border-blue-100 rounded">GF</span>}
                                {dish.isSpicy && <span className="flex items-center text-rose-600 gap-0.5 font-medium"><Flame className="h-3 w-3" /> Hot</span>}
                              </div>
                              <span className="shrink-0 text-xs font-bold text-slate-900 group-hover:text-primary transition flex items-center gap-1 bg-slate-50 group-hover:bg-primary/5 border border-slate-200 px-2.5 py-1 rounded-lg">
                                <Plus className="h-3.5 w-3.5" /> Select
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row items-center justify-center p-8 md:p-12 gap-8 text-center md:text-left bg-white border border-dashed rounded-xl shadow-sm">
                      <div className="flex-1 flex flex-col items-center md:items-start max-w-sm">
                        <Search className="h-12 w-12 text-slate-300" />
                        <h4 className="font-semibold text-slate-900 mt-3">No matching dishes found</h4>
                        <p className="text-xs text-slate-500 mt-1 mb-6">
                          Try searching for something else or browse categories. You can always add custom dishes manually.
                        </p>
                        
                        {searchQuery && (
                          <div className="flex flex-col items-center md:items-start space-y-3 w-full">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-semibold text-slate-500">
                                You have <span className={magicCredits === 0 ? "text-red-500 font-bold text-sm" : "text-amber-600 font-bold text-sm"}>{magicCredits ?? '...'}</span> free {magicCredits === 1 ? 'credit' : 'credits'} to use
                              </span>
                            </div>
                            
                            {(magicCredits !== null && magicCredits <= 0) ? (
                              <Button 
                                onClick={handleBuyCredits} 
                                className="bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md transition-all hover:-translate-y-0.5 w-full"
                              >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Buy 20 Magic Credits ($5.00)
                              </Button>
                            ) : (
                              <Button 
                                onClick={handleMagicGenerate} 
                                disabled={isGenerating || magicCredits === null}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md transition-all hover:-translate-y-0.5 w-full"
                              >
                                <Sparkles className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-pulse' : ''}`} />
                                {isGenerating ? "Consulting AI Chef..." : `Generate "${searchQuery}" with AI`}
                              </Button>
                            )}
                            <span className="text-[10px] text-amber-600/80 font-semibold uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-100 self-center md:self-start">
                              1 Credit Per Dish
                            </span>
                          </div>
                        )}
                      </div>

                      {searchQuery && (
                        <>
                          <div className="hidden md:block w-px bg-slate-200 self-stretch min-h-[150px]"></div>
                          
                          <div className="flex-1 flex flex-col items-center md:items-start max-w-xs text-left">
                            <div className="text-[10px] text-slate-500 bg-amber-50/50 p-4 rounded-xl border border-amber-100/60 shadow-sm w-full">
                              <p className="font-bold text-amber-800 mb-2 flex items-center gap-1 text-sm">
                                <Sparkles className="w-4 h-4" /> What is Magic AI?
                              </p>
                              <p className="leading-relaxed mb-4 text-slate-600 text-xs">
                                Each credit instantly generates a premium food photo, culinary description, and price using our expert AI models.
                              </p>
                              
                              <div className="w-full bg-amber-100/50 rounded-lg p-3">
                                <p className="font-bold text-amber-900 mb-2 uppercase tracking-wider text-[9px]">Bonus Credits per Plan</p>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-2 w-full text-amber-700/80 font-medium text-xs">
                                  <span>Free: <b className="text-amber-900">2</b></span>
                                  <span>Pro: <b className="text-amber-900">5</b></span>
                                  <span>Elite: <b className="text-amber-900">10</b></span>
                                  <span>Enterprise: <b className="text-amber-900">25</b></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* CONFIGURATION MODE (FORM SUBMISSION) */}
            {selectedDish && !onSelectDish && (
              <form action={createMenuItem} className="flex-1 overflow-y-auto flex flex-col">
                <div className="flex-1 p-6 space-y-5 bg-slate-50/50">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* LEFT PANEL: INFO MOCKUP */}
                    <div className="space-y-4">
                      <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Library Baseline Card</span>
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-slate-950">{selectedDish.name}</h3>
                          <Badge variant="secondary">{selectedDish.category}</Badge>
                          <p className="text-sm text-slate-600 italic">
                            "{selectedDish.description}"
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-500 border-t pt-3">

                          {selectedDish.isVegetarian && <span className="flex items-center text-green-600 gap-0.5 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded"><Leaf className="h-3 w-3" /> Vegetarian</span>}
                          {selectedDish.isVegan && <span className="flex items-center text-emerald-600 gap-0.5 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded"><Sparkles className="h-3 w-3" /> Vegan</span>}
                          {selectedDish.isGlutenFree && <span className="text-blue-600 font-semibold bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">Gluten Free</span>}
                          {selectedDish.isSpicy && <span className="flex items-center text-rose-600 gap-0.5 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded"><Flame className="h-3 w-3" /> Spicy</span>}
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 text-xs text-amber-800 space-y-1.5">
                        <h4 className="font-bold flex items-center gap-1"><Award className="h-4 w-4" /> Chef's Gourmet Description</h4>
                        <p className="leading-relaxed">
                          This description is professionally pre-written to maximize guest appeal. You can edit the text on the right if you have a custom twist to the classic recipe.
                        </p>
                      </div>
                    </div>

                    {/* RIGHT PANEL: SETTINGS & FIELDS */}
                    <div className="space-y-4">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <Label htmlFor="modal-form-name">Item Name</Label>
                        <Input
                          id="modal-form-name"
                          name="name"
                          type="text"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          required
                          className="h-10 border-slate-200 bg-white"
                        />
                      </div>

                      {/* Pricing and Menu Assignment */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="modal-form-price" className="text-slate-900 font-semibold">Price (USD)</Label>
                          <Input
                            id="modal-form-price"
                            name="price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formPrice}
                            onChange={(e) => setFormPrice(e.target.value)}
                            required
                            className="h-10 border-slate-200 bg-white text-base font-semibold"
                            autoFocus
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="modal-form-menu">Assign to Menu</Label>
                          <select
                            id="modal-form-menu"
                            name="menuId"
                            value={formMenuId}
                            onChange={(e) => handleMenuChange(e.target.value)}
                            className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                            required
                          >
                            {menus.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Category Selection */}
                      <div className="space-y-3 border-t pt-3">
                        <div className="flex items-center justify-between text-sm">
                          <Label className="font-semibold text-slate-700">Category Placement</Label>
                          <button
                            type="button"
                            onClick={() => setIsNewCategory(!isNewCategory)}
                            className="text-xs font-bold text-slate-900 hover:underline transition"
                          >
                            {isNewCategory ? "Choose Existing" : "Create New Category"}
                          </button>
                        </div>

                        {isNewCategory ? (
                          <div className="space-y-2 animate-in slide-in-from-top-1 duration-150">
                            <Input
                              name="newCategoryName"
                              placeholder="e.g. Appetizers, Hot Mains, House Specials"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              required
                              className="h-10 border-slate-200 bg-white"
                            />
                            <p className="text-[10px] text-slate-400">
                              This will create a new category in your selected menu.
                            </p>
                          </div>
                        ) : (
                          <div>
                            {filteredCategories.length > 0 ? (
                              <select
                                name="categoryId"
                                value={formCategoryId}
                                onChange={(e) => setFormCategoryId(e.target.value)}
                                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                required
                              >
                                {filteredCategories.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="rounded-lg border border-dashed border-slate-200 bg-white p-3 text-center">
                                <p className="text-xs text-slate-500 mb-1.5">No categories exist in this menu yet.</p>
                                <button
                                  type="button"
                                  onClick={() => setIsNewCategory(true)}
                                  className="text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border px-3 py-1 rounded-md"
                                >
                                  Create One Now
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Description Area */}
                      <div className="space-y-1.5">
                        <Label htmlFor="modal-form-description">Gourmet Description</Label>
                        <Textarea
                          id="modal-form-description"
                          name="description"
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          rows={3}
                          className="border-slate-200 bg-white text-xs leading-relaxed"
                        />
                      </div>

                      {/* Checkbox settings */}
                      <div className="border-t pt-3 space-y-2">
                        <Label>Dietary & Menu Flags</Label>
                        <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                          <label className="flex items-center gap-2 cursor-pointer py-1">
                            <input
                              type="checkbox"
                              name="isPopular"
                              value="true"
                              checked={formIsPopular}
                              onChange={(e) => setFormIsPopular(e.target.checked)}
                              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                            />
                            Popular / Chef Spec
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer py-1">
                            <input
                              type="checkbox"
                              name="isVegetarian"
                              value="true"
                              checked={formIsVegetarian}
                              onChange={(e) => setFormIsVegetarian(e.target.checked)}
                              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                            />
                            Vegetarian
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer py-1">
                            <input
                              type="checkbox"
                              name="isVegan"
                              value="true"
                              checked={formIsVegan}
                              onChange={(e) => setFormIsVegan(e.target.checked)}
                              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                            />
                            Vegan
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer py-1">
                            <input
                              type="checkbox"
                              name="isGlutenFree"
                              value="true"
                              checked={formIsGlutenFree}
                              onChange={(e) => setFormIsGlutenFree(e.target.checked)}
                              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                            />
                            Gluten Free
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer py-1">
                            <input
                              type="checkbox"
                              name="isSpicy"
                              value="true"
                              checked={formIsSpicy}
                              onChange={(e) => setFormIsSpicy(e.target.checked)}
                              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                            />
                            Spicy
                          </label>

                          {/* Default available */}
                          <input type="hidden" name="isAvailable" value="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODAL FOOTER */}
                <div className="px-6 py-4 border-t flex items-center justify-between bg-slate-50/50 shrink-0">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setSelectedDish(null)}
                    className="h-10 border-slate-200 hover:bg-slate-100"
                  >
                    <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Browse
                  </Button>
                  <Button 
                    type="submit" 
                    className="h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6"
                  >
                    <Check className="mr-1.5 h-4 w-4" /> Save to Menu
                  </Button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}
