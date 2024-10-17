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
      orders: {
        Row: {
          created_at: string
          invoice_link: string
          product_key_snapshot: Json
          purchased_by: string
          uuid: string
        }
        Insert: {
          created_at?: string
          invoice_link: string
          product_key_snapshot: Json
          purchased_by: string
          uuid?: string
        }
        Update: {
          created_at?: string
          invoice_link?: string
          product_key_snapshot?: Json
          purchased_by?: string
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
          stock: number
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
          expiry: string | null
          hardware_id: string | null
          key: string
          owner: string | null
          pricing_id: string
          product_id: string
          updated_at: string
          uuid: string
        }
        Insert: {
          created_at?: string
          expiry?: string | null
          hardware_id?: string | null
          key: string
          owner?: string | null
          pricing_id: string
          product_id: string
          updated_at?: string
          uuid?: string
        }
        Update: {
          created_at?: string
          expiry?: string | null
          hardware_id?: string | null
          key?: string
          owner?: string | null
          pricing_id?: string
          product_id?: string
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
      products: {
        Row: {
          created_at: string
          name: string
          pricings: string[]
          updated_at: string
          uuid: string
        }
        Insert: {
          created_at?: string
          name: string
          pricings: string[]
          updated_at?: string
          uuid?: string
        }
        Update: {
          created_at?: string
          name?: string
          pricings?: string[]
          updated_at?: string
          uuid?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          clerk_id: string
          created_at: string
          email: string
          orders: string[] | null
          role: string
          updated_at: string
          username: string
          uuid: string
        }
        Insert: {
          clerk_id: string
          created_at?: string
          email: string
          orders?: string[] | null
          role?: string
          updated_at?: string
          username: string
          uuid?: string
        }
        Update: {
          clerk_id?: string
          created_at?: string
          email?: string
          orders?: string[] | null
          role?: string
          updated_at?: string
          username?: string
          uuid?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
