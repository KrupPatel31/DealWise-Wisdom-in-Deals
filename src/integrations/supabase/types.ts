export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string
          discount: number | null
          id: string
          image: string | null
          name: string
          original_price: number
          price: number
          product_id: string
          quantity: number
          store: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discount?: number | null
          id?: string
          image?: string | null
          name: string
          original_price: number
          price: number
          product_id: string
          quantity?: number
          store?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discount?: number | null
          id?: string
          image?: string | null
          name?: string
          original_price?: number
          price?: number
          product_id?: string
          quantity?: number
          store?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          category: string
          code: string
          coupon_type: string
          created_at: string
          description: string
          discount_type: string
          discount_value: number
          expires_at: string
          id: string
          is_active: boolean
          max_discount: number | null
          min_purchase: number
          store: string
          updated_at: string
          used_count: number
          verified: boolean
        }
        Insert: {
          category?: string
          code: string
          coupon_type: string
          created_at?: string
          description: string
          discount_type: string
          discount_value?: number
          expires_at: string
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_purchase?: number
          store: string
          updated_at?: string
          used_count?: number
          verified?: boolean
        }
        Update: {
          category?: string
          code?: string
          coupon_type?: string
          created_at?: string
          description?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_purchase?: number
          store?: string
          updated_at?: string
          used_count?: number
          verified?: boolean
        }
        Relationships: []
      }
      daily_deals: {
        Row: {
          category: string | null
          created_at: string
          deal_price: number
          description: string | null
          discount_percent: number
          ends_at: string
          id: string
          image_url: string | null
          is_active: boolean
          original_price: number
          product_link: string | null
          starts_at: string
          store: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          deal_price: number
          description?: string | null
          discount_percent: number
          ends_at: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          original_price: number
          product_link?: string | null
          starts_at?: string
          store: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          deal_price?: number
          description?: string | null
          discount_percent?: number
          ends_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          original_price?: number
          product_link?: string | null
          starts_at?: string
          store?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_login_claims: {
        Row: {
          claimed_date: string
          coins_awarded: number
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          claimed_date?: string
          coins_awarded?: number
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          claimed_date?: string
          coins_awarded?: number
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      deal_coins: {
        Row: {
          balance: number
          created_at: string
          id: string
          total_earned: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      deal_coins_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          order_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          id: string
          items: Json
          notes: string | null
          order_number: string
          payment_method: string
          shipping: number
          shipping_address: Json
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          items: Json
          notes?: string | null
          order_number: string
          payment_method: string
          shipping?: number
          shipping_address: Json
          status?: string
          subtotal: number
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string
          payment_method?: string
          shipping?: number
          shipping_address?: Json
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      password_reset_attempts: {
        Row: {
          attempted_at: string
          email: string
          id: string
        }
        Insert: {
          attempted_at?: string
          email: string
          id?: string
        }
        Update: {
          attempted_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          created_at: string
          id: string
          price: number
          product_name: string
          recorded_at: string
          store: string
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          product_name: string
          recorded_at?: string
          store: string
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          product_name?: string
          recorded_at?: string
          store?: string
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          coins_awarded: number
          created_at: string
          id: string
          product_id: string
          product_name: string
          rating: number
          review_text: string | null
          user_id: string
        }
        Insert: {
          coins_awarded?: number
          created_at?: string
          id?: string
          product_id: string
          product_name: string
          rating: number
          review_text?: string | null
          user_id: string
        }
        Update: {
          coins_awarded?: number
          created_at?: string
          id?: string
          product_id?: string
          product_name?: string
          rating?: number
          review_text?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          deleted_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean
          referral_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          referral_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          referral_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          coins_awarded: number
          created_at: string
          id: string
          referral_code: string
          referred_id: string
          referrer_id: string
          status: string
        }
        Insert: {
          coins_awarded?: number
          created_at?: string
          id?: string
          referral_code: string
          referred_id: string
          referrer_id: string
          status?: string
        }
        Update: {
          coins_awarded?: number
          created_at?: string
          id?: string
          referral_code?: string
          referred_id?: string
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      view_counter: {
        Row: {
          created_at: string
          id: string
          page_path: string
          updated_at: string
          view_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          page_path?: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          page_path?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
    }
    Views: {
      my_referrals: {
        Row: {
          coins_awarded: number | null
          created_at: string | null
          id: string | null
          referral_code: string | null
          referrer_id: string | null
          status: string | null
        }
        Insert: {
          coins_awarded?: number | null
          created_at?: string | null
          id?: string | null
          referral_code?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Update: {
          coins_awarded?: number | null
          created_at?: string | null
          id?: string | null
          referral_code?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_coins: {
        Args: { p_amount: number; p_user_id: string }
        Returns: number
      }
      get_or_create_deal_coins:
        | { Args: never; Returns: number }
        | { Args: { p_user_id: string }; Returns: number }
      increment_view_count: { Args: { page?: string }; Returns: number }
      spend_coins: {
        Args: { p_amount: number; p_user_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
