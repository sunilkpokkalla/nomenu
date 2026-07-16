export interface Restaurant {
  id: string;
  name: string;
  cuisine_type: string | null;
  address: string | null;
  phone: string | null;
  wifi_password: string | null;
  primary_color: string | null;
  accent_color: string | null;
  theme_style: string | null;
  currency: string | null;
  plan?: string | null;

  opening_time?: string | null;
  closing_time?: string | null;
  wait_time_status?: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  translations?: any;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  allergens?: string[] | null;
  calories?: number | null;
  cooking_time?: number | null;
  translations?: any;
}

export interface MenuThemeProps {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
  tableNumber?: string;
  qrCodeId?: string;
  locationLabel?: string | null;
  menuId?: string;
  displayLanguage?: string | null;
}
