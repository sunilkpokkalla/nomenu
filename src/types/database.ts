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
      affiliates: {
        Row: {
          id: string;
          auth_id: string | null;
          name: string;
          email: string;
          paypal_email: string | null;
          referral_code: string;
          stripe_account_id: string | null;
          total_clicks: number | null;
          total_paid_amount: number | null;
          expertise: string | null;
          social_influence: string | null;
          social_media_details: string | null;
          location: string | null;
          purpose: string | null;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          auth_id?: string | null;
          name: string;
          email: string;
          paypal_email?: string | null;
          referral_code: string;
          stripe_account_id?: string | null;
          total_clicks?: number | null;
          total_paid_amount?: number | null;
          expertise?: string | null;
          social_influence?: string | null;
          social_media_details?: string | null;
          location?: string | null;
          purpose?: string | null;
          status?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string | null;
          name?: string;
          email?: string;
          paypal_email?: string | null;
          referral_code?: string;
          stripe_account_id?: string | null;
          total_clicks?: number | null;
          total_paid_amount?: number | null;
          expertise?: string | null;
          social_influence?: string | null;
          social_media_details?: string | null;
          location?: string | null;
          purpose?: string | null;
          status?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      affiliate_payouts: {
        Row: {
          id: string;
          referrer_code: string;
          referred_restaurant_id: string | null;
          amount: number;
          status: "pending" | "paid" | "credited";
          created_at: string;
          clears_at: string | null;
        };
        Insert: {
          id?: string;
          referrer_code: string;
          referred_restaurant_id?: string | null;
          amount: number;
          status?: "pending" | "paid" | "credited";
          created_at?: string;
          clears_at?: string | null;
        };
        Update: {
          id?: string;
          referrer_code?: string;
          referred_restaurant_id?: string | null;
          amount?: number;
          status?: "pending" | "paid" | "credited";
          created_at?: string;
          clears_at?: string | null;
        };
        Relationships: [];
      };
      ai_image_jobs: {
        Row: {
          id: string;
          restaurant_id: string;
          status: "pending" | "processing" | "completed" | "failed" | "paid";
          prompt: string | null;
          result_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          status?: "pending" | "processing" | "completed" | "failed" | "paid";
          prompt?: string | null;
          result_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          status?: "pending" | "processing" | "completed" | "failed" | "paid";
          prompt?: string | null;
          result_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
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
          billing_cycle: string | null;
          subscription_status: string | null;
          referred_by_code: string | null;
          paypal_email: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_account_id: string | null;
          square_access_token: string | null;
          square_refresh_token: string | null;
          square_merchant_id: string | null;

          timezone: string | null;
          created_at: string | null;
          slug: string | null;
          subdomain: string | null;
          custom_domain: string | null;
          prep_time_minutes: number | null;
          max_takeaway_per_slot: number | null;
          max_reserve_per_slot: number | null;
          opening_time: string | null;
          closing_time: string | null;
          magic_credits: number | null;
          recovery_offer_text: string | null;
          recovery_message: string | null;
          service_recovery_enabled: boolean | null;
          service_recovery_message: string | null;
          offer_manager_visit: boolean | null;
          offer_compensation: boolean | null;
          loyalty_stamp_color: string | null;
          loyalty_stamp_icon: string | null;
          loyalty_card_layout: string | null;
          loyalty_reward_text: string | null;
          loyalty_pin_code: string | null;
          wait_time_status: string | null;
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
          billing_cycle?: string | null;
          subscription_status?: string | null;
          referred_by_code?: string | null;
          paypal_email?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_account_id?: string | null;
          square_access_token?: string | null;
          square_refresh_token?: string | null;
          square_merchant_id?: string | null;

          timezone?: string | null;
          created_at?: string | null;
          slug?: string | null;
          subdomain?: string | null;
          custom_domain?: string | null;
          prep_time_minutes?: number | null;
          max_takeaway_per_slot?: number | null;
          max_reserve_per_slot?: number | null;
          opening_time?: string | null;
          closing_time?: string | null;
          magic_credits?: number | null;
          recovery_offer_text?: string | null;
          recovery_message?: string | null;
          service_recovery_enabled?: boolean | null;
          service_recovery_message?: string | null;
          offer_manager_visit?: boolean | null;
          offer_compensation?: boolean | null;
          loyalty_stamp_color?: string | null;
          loyalty_stamp_icon?: string | null;
          loyalty_card_layout?: string | null;
          loyalty_reward_text?: string | null;
          loyalty_pin_code?: string | null;
          wait_time_status?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["restaurants"]["Insert"]>;
        Relationships: [];
      };
      restaurant_staff: {
        Row: {
          id: string;
          restaurant_id: string;
          auth_id: string | null;
          email: string;
          role: "manager" | "kitchen" | "waitstaff";
          status: "invited" | "active";
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          auth_id?: string | null;
          email: string;
          role: "manager" | "kitchen" | "waitstaff";
          status?: "invited" | "active";
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          auth_id?: string | null;
          email?: string;
          role?: "manager" | "kitchen" | "waitstaff";
          status?: "invited" | "active";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "restaurant_staff_restaurant_id_fkey";
            columns: ["restaurant_id"];
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          }
        ];
      };
      loyalty_cards: {
        Row: {
          id: string;
          restaurant_id: string | null;
          feedback_id: string | null;
          stamps: number;
          last_stamp_at: string | null;
          created_at: string | null;
          phone_number: string | null;
        };
        Insert: {
          id?: string;
          restaurant_id?: string | null;
          feedback_id?: string | null;
          stamps?: number;
          last_stamp_at?: string | null;
          created_at?: string | null;
          phone_number?: string | null;
        };
        Update: {
          id?: string;
          restaurant_id?: string | null;
          feedback_id?: string | null;
          stamps?: number;
          last_stamp_at?: string | null;
          created_at?: string | null;
          phone_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "loyalty_cards_restaurant_id_fkey";
            columns: ["restaurant_id"];
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "loyalty_cards_feedback_id_fkey";
            columns: ["feedback_id"];
            referencedRelation: "customer_feedback";
            referencedColumns: ["id"];
          }
        ];
      };
      loyalty_scan_tokens: {
        Row: {
          id: string;
          restaurant_id: string;
          created_at: string;
          expires_at: string;
          is_used: boolean;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          created_at?: string;
          expires_at: string;
          is_used?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["loyalty_scan_tokens"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "loyalty_scan_tokens_restaurant_id_fkey";
            columns: ["restaurant_id"];
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          }
        ];
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
          fulfillment_type: string | null;
          created_at: string | null;
          slug: string | null;
          allow_manual_payments: boolean | null;
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
          fulfillment_type?: string | null;
          created_at?: string | null;
          slug?: string | null;
          allow_manual_payments?: boolean | null;
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
          mode: string | null;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          menu_id: string;
          label?: string | null;
          location_zone?: string | null;
          scan_count?: number;
          created_at?: string | null;
          mode?: string | null;
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
