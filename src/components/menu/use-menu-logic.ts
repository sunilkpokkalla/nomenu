import { useState, useEffect, useRef, useMemo } from "react";
import { MenuItem, Category } from "./types";
import { useCart } from "./cart-context";

export function useMenuLogic(categories: Category[], items: MenuItem[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [layoutMode, setLayoutMode] = useState<"list" | "grid">("list");
  
  // Dietary filters
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterGF, setFilterGF] = useState(false);
  const [filterSpicy, setFilterSpicy] = useState(false);

  // Selected item for details modal
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Cart state for the modal
  const { addToCart } = useCart();
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState("");

  // Reset modal state when selected item changes
  useEffect(() => {
    if (selectedItem) {
      setOrderQuantity(1);
      setOrderNotes("");
    }
  }, [selectedItem]);

  // Amenities Modal
  const [showAmenities, setShowAmenities] = useState(false);

  // References for categories to detect scroll position
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Set up active category scrolling highlights
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return;
      const scrollPosition = window.scrollY + 200; // Offset for sticky bar
      
      let currentCategory = "";
      for (const catId of Object.keys(categoryRefs.current)) {
        const el = categoryRefs.current[catId];
        if (el && el.offsetTop <= scrollPosition) {
          currentCategory = catId;
        }
      }
      
      if (currentCategory && currentCategory !== activeCategory) {
        setActiveCategory(currentCategory);
        // Center the active pill in the horizontal scrolling menu
        const activeNavEl = document.getElementById(`nav-pill-${currentCategory}`);
        if (activeNavEl && categoryNavRef.current) {
          const navContainer = categoryNavRef.current;
          const leftOffset = activeNavEl.offsetLeft - (navContainer.clientWidth / 2) + (activeNavEl.clientWidth / 2);
          navContainer.scrollTo({ left: leftOffset, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger initial run
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory, categories]);

  // Smooth scroll handler to categories
  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    isScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    
    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
    }, 1000);

    const el = categoryRefs.current[catId];
    if (el) {
      const offset = el.offsetTop - 140; // Offset for banner header / sticky nav
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  // Filter items based on search and dietary preferences
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
      if (!matchesSearch) return false;

      // Dietary filters
      if (filterVeg && !item.is_vegetarian) return false;
      if (filterVegan && !item.is_vegan) return false;
      if (filterGF && !item.is_gluten_free) return false;
      if (filterSpicy && !item.is_spicy) return false;

      return true;
    });
  }, [items, searchQuery, filterVeg, filterVegan, filterGF, filterSpicy]);

  // Group items by category (respecting sort_order)
  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    categories.forEach(c => {
      groups[c.id] = [];
    });
    
    filteredItems.forEach(item => {
      if (groups[item.category_id]) {
        groups[item.category_id].push(item);
      }
    });
    return groups;
  }, [filteredItems, categories]);

  // Handle adding to cart from modal
  const handleAddToCart = () => {
    if (selectedItem) {
      addToCart(selectedItem, orderQuantity, orderNotes.trim());
      setSelectedItem(null);
      setOrderQuantity(1);
      setOrderNotes("");
    }
  };

  return {
    state: {
      searchQuery,
      activeCategory,
      layoutMode,
      filterVeg,
      filterVegan,
      filterGF,
      filterSpicy,
      selectedItem,
      orderQuantity,
      orderNotes,
      showAmenities
    },
    setters: {
      setSearchQuery,
      setActiveCategory,
      setLayoutMode,
      setFilterVeg,
      setFilterVegan,
      setFilterGF,
      setFilterSpicy,
      setSelectedItem,
      setOrderQuantity,
      setOrderNotes,
      setShowAmenities
    },
    refs: {
      categoryRefs,
      categoryNavRef
    },
    handlers: {
      scrollToCategory,
      handleAddToCart
    },
    computed: {
      filteredItems,
      groupedItems
    }
  };
}
