export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          logo_url: string | null;
          cover_image_url: string | null;
          cuisine_type: string | null;
          address: string | null;
          phone: string | null;
          wifi_password: string | null;
          currency: string | null;
          primary_color: string | null;
          accent_color: string | null;
          theme_style: string | null;
          plan: string | null;
          subscription_status: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          name: string;
          logo_url?: string | null;
          cover_image_url?: string | null;
          cuisine_type?: string | null;
          address?: string | null;
          phone?: string | null;
          wifi_password?: string | null;
          currency?: string | null;
          primary_color?: string | null;
          accent_color?: string | null;
          theme_style?: string | null;
          plan?: string | null;
          subscription_status?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["restaurants"]["Insert"]>;
        Relationships: [];
      };
      menus: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description: string | null;
          is_active: boolean;
          schedule_type: string | null;
          schedule_start: string | null;
          schedule_end: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          description?: string | null;
          is_active?: boolean;
          schedule_type?: string | null;
          schedule_start?: string | null;
          schedule_end?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["menus"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "menus_restaurant_id_fkey";
            columns: ["restaurant_id"];
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          id: string;
          menu_id: string;
          name: string;
          description: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          menu_id: string;
          name: string;
          description?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "categories_menu_id_fkey";
            columns: ["menu_id"];
            referencedRelation: "menus";
            referencedColumns: ["id"];
          }
        ];
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string;
          restaurant_id: string;
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
          allergens: string[] | null;
          calories: number | null;
          cooking_time: number | null;
          sort_order: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          category_id: string;
          restaurant_id: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_available?: boolean;
          is_popular?: boolean;
          is_vegetarian?: boolean;
          is_vegan?: boolean;
          is_gluten_free?: boolean;
          is_spicy?: boolean;
          allergens?: string[] | null;
          calories?: number | null;
          cooking_time?: number | null;
          sort_order?: number;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["menu_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "menu_items_restaurant_id_fkey";
            columns: ["restaurant_id"];
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          }
        ];
      };
      qr_codes: {
        Row: {
          id: string;
          restaurant_id: string;
          menu_id: string;
          label: string | null;
          scan_count: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          menu_id: string;
          label?: string | null;
          scan_count?: number;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["qr_codes"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "qr_codes_restaurant_id_fkey";
            columns: ["restaurant_id"];
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "qr_codes_menu_id_fkey";
            columns: ["menu_id"];
            referencedRelation: "menus";
            referencedColumns: ["id"];
          }
        ];
      };
      menu_scans: {
        Row: {
          id: string;
          qr_code_id: string;
          restaurant_id: string;
          scanned_at: string | null;
          device_type: string | null;
          country: string | null;
        };
        Insert: {
          id?: string;
          qr_code_id: string;
          restaurant_id: string;
          scanned_at?: string | null;
          device_type?: string | null;
          country?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["menu_scans"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "menu_scans_qr_code_id_fkey";
            columns: ["qr_code_id"];
            referencedRelation: "qr_codes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "menu_scans_restaurant_id_fkey";
            columns: ["restaurant_id"];
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
