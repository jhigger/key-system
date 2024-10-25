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
      categories: {
        Row: {
          created_at: string
          name: string
          updated_at: string
          uuid: string
        }
        Insert: {
          created_at?: string
          name?: string
          updated_at?: string
          uuid?: string
        }
        Update: {
          created_at?: string
          name?: string
          updated_at?: string
          uuid?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          invoice_link: string
          purchased_by: string
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
          uuid: string
        }
        Insert: {
          created_at?: string
          invoice_link: string
          purchased_by: string
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          uuid?: string
        }
        Update: {
          created_at?: string
          invoice_link?: string
          purchased_by?: string
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_purchased_by_fkey"
            columns: ["purchased_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["uuid"]
          },
        ]
      }
      pricings: {
        Row: {
          created_at: string
          duration: number
          stock: number
          updated_at: string
          uuid: string
          value: number
        }
        Insert: {
          created_at?: string
          duration: number
          stock?: number
          updated_at?: string
          uuid: string
          value: number
        }
        Update: {
          created_at?: string
          duration?: number
          stock?: number
          updated_at?: string
          uuid?: string
          value?: number
        }
        Relationships: []
      }
      product_keys: {
        Row: {
          created_at: string
          key: string
          owner: string | null
          pricing_id: string
          product_id: string
          reserved: boolean
          updated_at: string
          uuid: string
        }
        Insert: {
          created_at?: string
          key: string
          owner?: string | null
          pricing_id: string
          product_id: string
          reserved?: boolean
          updated_at?: string
          uuid?: string
        }
        Update: {
          created_at?: string
          key?: string
          owner?: string | null
          pricing_id?: string
          product_id?: string
          reserved?: boolean
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_keys_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "product_keys_pricingId_fkey"
            columns: ["pricing_id"]
            isOneToOne: false
            referencedRelation: "pricings"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "product_keys_productId_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["uuid"]
          },
        ]
      }
      product_keys_snapshots: {
        Row: {
          created_at: string
          expiry: string | null
          hardware_id: string | null
          key: string
          order_id: string
          owner: string
          pricing: Json
          product_name: string
          updated_at: string
          uuid: string
        }
        Insert: {
          created_at?: string
          expiry?: string | null
          hardware_id?: string | null
          key: string
          order_id: string
          owner: string
          pricing: Json
          product_name: string
          updated_at?: string
          uuid?: string
        }
        Update: {
          created_at?: string
          expiry?: string | null
          hardware_id?: string | null
          key?: string
          order_id?: string
          owner?: string
          pricing?: Json
          product_name?: string
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_keys_snapshot_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "product_keys_snapshots_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["uuid"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          name: string
          pricings: string[]
          updated_at: string
          uuid: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          name: string
          pricings: string[]
          updated_at?: string
          uuid?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          name?: string
          pricings?: string[]
          updated_at?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["uuid"]
          },
        ]
      }
      users: {
        Row: {
          approved_by: string | null
          clerk_id: string
          created_at: string
          email: string
          role: string
          updated_at: string
          username: string
          uuid: string
        }
        Insert: {
          approved_by?: string | null
          clerk_id: string
          created_at?: string
          email: string
          role?: string
          updated_at?: string
          username: string
          uuid?: string
        }
        Update: {
          approved_by?: string | null
          clerk_id?: string
          created_at?: string
          email?: string
          role?: string
          updated_at?: string
          username?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["uuid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      batch_operations: {
        Args: {
          operations: Json
        }
        Returns: undefined
      }
      decrement_stock: {
        Args: {
          pricing_uuid: string
          amount: number
        }
        Returns: number
      }
      increment_stock: {
        Args: {
          pricing_uuid: string
          amount: number
        }
        Returns: number
      }
      verify_clerk_jwt: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      order_status: "paid" | "unpaid" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
