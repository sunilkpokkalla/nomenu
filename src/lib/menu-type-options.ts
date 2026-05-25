export interface MenuType {
  value: string;
  label: string;
  description: string;
}

export interface MenuTypeGroup {
  label: string;
  options: MenuType[];
}

export const GLOBAL_MENU_TYPES: MenuType[] = [
  { value: "À La Carte", label: "À La Carte (Standard Choice)", description: "Individual dishes priced separately." },
  { value: "Tasting Menu", label: "Tasting Menu (Menu Dégustation)", description: "Curated multi-course tasting journey." },
  { value: "Prix Fixe", label: "Prix Fixe (Fixed Price Set)", description: "Set price for a multi-course offering." },
  { value: "Table d'Hôte", label: "Table d'Hôte (Host's Table)", description: "Complete meal with limited selections." },
  { value: "Plat du Jour", label: "Plat du Jour (Daily Specials)", description: "Specials reflecting daily fresh market runs." },
];

export const REGIONAL_MENU_TYPES: MenuType[] = [
  { value: "Formule", label: "Formule (French Lunch Combo)", description: "Standard quick lunch set (e.g. Entrée + Plat)." },
  { value: "Menú del Día", label: "Menú del Día (Menu of the Day)", description: "Traditional Spanish 3-course fixed-price lunch." },
  { value: "Teishoku", label: "Teishoku (Japanese Set Tray)", description: "Traditional Japanese set meal tray." },
  { value: "Omakase", label: "Omakase (Chef's Choice Curation)", description: "Surprise course-by-course chef curation." },
  { value: "Rodízio", label: "Rodízio (Brazilian Meat Rotation)", description: "Brazilian continuous table-side service." },
  { value: "Sunday Roast", label: "Sunday Roast Menu", description: "Traditional British roast meats set." },
  { value: "Afternoon Tea", label: "Afternoon Tea Menu", description: "Finger sandwiches, scones, and pastries." },
  { value: "Dim Sum", label: "Dim Sum Menu", description: "Cantonese small plates selection." },
  { value: "Tabehoudai", label: "Tabehoudai (Asian AYCE)", description: "All-you-can-eat Asian-style format." },
];

export const SPECIALTY_MENU_TYPES: MenuType[] = [
  { value: "All-Day Menu", label: "All-Day Menu", description: "Standard menu offered all day." },
  { value: "Brunch Menu", label: "Brunch & Breakfast Menu", description: "Late morning / mid-day breakfast specials." },
  { value: "Lunch Specials", label: "Lunch Specials Menu", description: "Speedy, lighter midday options." },
  { value: "Early Bird Menu", label: "Early Bird Menu", description: "Discounted early dinner selections." },
  { value: "Happy Hour / Bar Bites", label: "Happy Hour & Bar Bites", description: "Snacks and plates paired with drinks." },
  { value: "Beverage / Wine List", label: "Beverage & Wine List", description: "Pure drink selections and pairings." },
  { value: "Kids Menu", label: "Kids Menu", description: "Child-friendly smaller portions." },
  { value: "Event Set-Menu", label: "Festive & Event Set-Menu", description: "Special holiday or ticketed set-menu." },
];

// Helper to get chef recommendations based on cuisine_type
export function getChefRecommendations(cuisineType: string | null | undefined): MenuType[] {
  if (!cuisineType) {
    return [
      { value: "À La Carte", label: "À La Carte (Standard Choice)", description: "Recommended for Casual Dining" },
      { value: "Lunch Specials", label: "Lunch Specials Menu", description: "Recommended for Midday Dining" }
    ];
  }

  const normalized = cuisineType.toLowerCase();

  if (normalized.includes("fine dining") || normalized.includes("omakase") || normalized.includes("chef")) {
    return [
      { value: "Tasting Menu", label: "Tasting Menu (Menu Dégustation)", description: "Fine Dining Curation" },
      { value: "Prix Fixe", label: "Prix Fixe (Fixed Price Set)", description: "Structured Set Course" },
      { value: "Omakase", label: "Omakase (Chef's Choice Curation)", description: "Surprise Chef Curation" }
    ];
  }

  if (normalized.includes("bistro") || normalized.includes("french") || normalized.includes("brasserie")) {
    return [
      { value: "À La Carte", label: "À La Carte (Standard Choice)", description: "Classic Bistro Layout" },
      { value: "Plat du Jour", label: "Plat du Jour (Daily Specials)", description: "Market Fresh Specials" },
      { value: "Formule", label: "Formule (French Lunch Combo)", description: "Quick French Lunch Set" }
    ];
  }

  if (normalized.includes("spanish") || normalized.includes("tapas") || normalized.includes("mexican") || normalized.includes("taqueria")) {
    return [
      { value: "À La Carte", label: "À La Carte (Standard Choice)", description: "Standard Option Selection" },
      { value: "Menú del Día", label: "Menú del Día (Menu of the Day)", description: "Spanish Daily Lunch Set" },
      { value: "Happy Hour / Bar Bites", label: "Tapas / Shared Bar Bites", description: "Social Drinking / Tapas Plates" }
    ];
  }

  if (normalized.includes("japanese") || normalized.includes("sushi") || normalized.includes("korean") || normalized.includes("ramen")) {
    return [
      { value: "À La Carte", label: "À La Carte (Standard Choice)", description: "Standard Option Selection" },
      { value: "Teishoku", label: "Teishoku (Japanese Set Tray)", description: "Traditional Japanese Tray Sets" },
      { value: "Omakase", label: "Omakase (Chef's Choice Curation)", description: "Sushi Counter Curation" },
      { value: "Tabehoudai", label: "Tabehoudai (Asian AYCE)", description: "BBQ / Hot Pot Formats" }
    ];
  }

  if (normalized.includes("buffet") || normalized.includes("churrascaria") || normalized.includes("brazilian") || normalized.includes("hot pot")) {
    return [
      { value: "Tabehoudai", label: "Tabehoudai (AYCE / Buffet)", description: "All-You-Can-Eat Buffet Format" },
      { value: "Rodízio", label: "Rodízio (Brazilian Meat Rotation)", description: "Continuous Meat Skewers" }
    ];
  }

  if (normalized.includes("pub") || normalized.includes("gastropub") || normalized.includes("bar") || normalized.includes("brewpub") || normalized.includes("cocktail")) {
    return [
      { value: "Happy Hour / Bar Bites", label: "Happy Hour & Bar Bites", description: "Small Plates & Snack Pairs" },
      { value: "Beverage / Wine List", label: "Beverage & Wine List", description: "Drink-focused Curation" },
      { value: "À La Carte", label: "À La Carte (Pub Classics)", description: "Dine-in Pub Classics" },
      { value: "Sunday Roast", label: "Sunday Roast Menu", description: "Traditional Roast Menu" }
    ];
  }

  if (normalized.includes("café") || normalized.includes("cafe") || normalized.includes("coffee") || normalized.includes("tea") || normalized.includes("bakery")) {
    return [
      { value: "Brunch Menu", label: "Brunch & Breakfast Menu", description: "Morning & Afternoon Specials" },
      { value: "All-Day Menu", label: "All-Day Menu", description: "Deli / Coffee Shop Staples" },
      { value: "Afternoon Tea", label: "Afternoon Tea Menu", description: "High Tea Scones & Pastries" }
    ];
  }

  // Fallback defaults
  return [
    { value: "À La Carte", label: "À La Carte (Standard Choice)", description: "Recommended standard choice" },
    { value: "Lunch Specials", label: "Lunch Specials Menu", description: "Recommended midday options" },
    { value: "All-Day Menu", label: "All-Day Menu", description: "Diner style always-available options" }
  ];
}
