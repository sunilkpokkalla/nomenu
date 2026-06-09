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
          stripe_account_id: string | null;
          timezone: string | null;
          created_at: string | null;
          slug: string | null;
          subdomain: string | null;
          custom_domain: string | null;
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
          stripe_account_id?: string | null;
          timezone?: string | null;
          created_at?: string | null;
          slug?: string | null;
          subdomain?: string | null;
          custom_domain?: string | null;
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
          menu_type: string | null;
          design_config: Json | null;
          tax_rate: number | null;
          service_charge: number | null;
          service_charge_type: string | null;
          location_label: string | null;
          created_at: string | null;
          slug: string | null;
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
          menu_type?: string | null;
          design_config?: Json | null;
          tax_rate?: number | null;
          service_charge?: number | null;
          service_charge_type?: string | null;
          location_label?: string | null;
          created_at?: string | null;
          slug?: string | null;
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
          location_zone: string | null;
          scan_count: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          menu_id: string;
          label?: string | null;
          location_zone?: string | null;
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
      customer_feedback: {
        Row: {
          id: string;
          restaurant_id: string;
          rating: number;
          comment: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["customer_feedback"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "customer_feedback_restaurant_id_fkey";
            columns: ["restaurant_id"];
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          restaurant_id: string;
          table_number: string | null;
          customer_name: string | null;
          daily_order_number: number | null;
          total_amount: number;
          status: string;
          created_at: string;
          payment_intent_id: string | null;
          is_paid: boolean;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          table_number?: string | null;
          customer_name?: string | null;
          daily_order_number?: number | null;
          total_amount: number;
          status?: string;
          created_at?: string;
          payment_intent_id?: string | null;
          is_paid?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "orders_restaurant_id_fkey";
            columns: ["restaurant_id"];
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          }
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          price_at_time_of_order: number;
          customer_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id: string;
          quantity?: number;
          price_at_time_of_order: number;
          customer_notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_menu_item_id_fkey";
            columns: ["menu_item_id"];
            referencedRelation: "menu_items";
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
