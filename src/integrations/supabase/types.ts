export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      inventory_items: {
        Row: {
          business_id: string | null
          category: string
          cost_price: number
          created_at: string | null
          expiry_date: string | null
          id: string
          low_stock_threshold: number | null
          name: string
          quantity: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          category: string
          cost_price: number
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          low_stock_threshold?: number | null
          name: string
          quantity?: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          category?: string
          cost_price?: number
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          low_stock_threshold?: number | null
          name?: string
          quantity?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_reports: {
        Row: {
          ai_insights: string | null
          business_id: string | null
          created_at: string | null
          id: string
          net_profit: number
          report_month: string
          total_profit: number
          total_sales: number
          total_vendor_commission: number
        }
        Insert: {
          ai_insights?: string | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          net_profit: number
          report_month: string
          total_profit: number
          total_sales: number
          total_vendor_commission: number
        }
        Update: {
          ai_insights?: string | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          net_profit?: number
          report_month?: string
          total_profit?: number
          total_sales?: number
          total_vendor_commission?: number
        }
        Relationships: [
          {
            foreignKeyName: "monthly_reports_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_name: string
          business_type: Database["public"]["Enums"]["business_type"]
          created_at: string | null
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          business_name: string
          business_type: Database["public"]["Enums"]["business_type"]
          created_at?: string | null
          id: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          business_name?: string
          business_type?: Database["public"]["Enums"]["business_type"]
          created_at?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      sales_transactions: {
        Row: {
          business_id: string | null
          cost_amount: number
          created_at: string | null
          id: string
          item_id: string | null
          net_profit: number
          profit_amount: number
          quantity: number
          sale_date: string | null
          total_amount: number
          unit_price: number
          vendor_commission: number | null
          vendor_id: string | null
        }
        Insert: {
          business_id?: string | null
          cost_amount: number
          created_at?: string | null
          id?: string
          item_id?: string | null
          net_profit: number
          profit_amount: number
          quantity: number
          sale_date?: string | null
          total_amount: number
          unit_price: number
          vendor_commission?: number | null
          vendor_id?: string | null
        }
        Update: {
          business_id?: string | null
          cost_amount?: number
          created_at?: string | null
          id?: string
          item_id?: string | null
          net_profit?: number
          profit_amount?: number
          quantity?: number
          sale_date?: string | null
          total_amount?: number
          unit_price?: number
          vendor_commission?: number | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          commission_rate: number
          created_at: string | null
          id: string
          is_active: boolean | null
          owner_id: string | null
          vendor_id: string | null
        }
        Insert: {
          commission_rate: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          owner_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          commission_rate?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          owner_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_vendor_commission: {
        Args: {
          vendor_user_id: string
          owner_user_id: string
          sale_amount: number
        }
        Returns: number
      }
    }
    Enums: {
      business_type: "medical" | "ice_cream"
      user_role: "owner" | "vendor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      business_type: ["medical", "ice_cream"],
      user_role: ["owner", "vendor"],
    },
  },
} as const
