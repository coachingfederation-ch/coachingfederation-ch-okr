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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alignment_rows: {
        Row: {
          ce: Database["public"]["Enums"]["contribution"]
          how: string
          id: string
          oe: Database["public"]["Enums"]["contribution"]
          pillar: string
          sg: Database["public"]["Enums"]["contribution"]
          sort_order: number
          updated_at: string
        }
        Insert: {
          ce?: Database["public"]["Enums"]["contribution"]
          how?: string
          id?: string
          oe?: Database["public"]["Enums"]["contribution"]
          pillar: string
          sg?: Database["public"]["Enums"]["contribution"]
          sort_order?: number
          updated_at?: string
        }
        Update: {
          ce?: Database["public"]["Enums"]["contribution"]
          how?: string
          id?: string
          oe?: Database["public"]["Enums"]["contribution"]
          pillar?: string
          sg?: Database["public"]["Enums"]["contribution"]
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      initiatives: {
        Row: {
          created_at: string
          id: string
          kr_id: string
          okr_set_id: string
          sort_order: number
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          kr_id: string
          okr_set_id: string
          sort_order?: number
          text?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          kr_id?: string
          okr_set_id?: string
          sort_order?: number
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "initiatives_kr_id_fkey"
            columns: ["kr_id"]
            isOneToOne: false
            referencedRelation: "key_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "initiatives_okr_set_id_fkey"
            columns: ["okr_set_id"]
            isOneToOne: false
            referencedRelation: "okr_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      key_results: {
        Row: {
          created_at: string
          id: string
          kr: string
          lead: string
          okr_set_id: string
          sort_order: number
          target: string
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          kr?: string
          lead?: string
          okr_set_id: string
          sort_order?: number
          target?: string
          text?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          kr?: string
          lead?: string
          okr_set_id?: string
          sort_order?: number
          target?: string
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "key_results_okr_set_id_fkey"
            columns: ["okr_set_id"]
            isOneToOne: false
            referencedRelation: "okr_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      okr_sets: {
        Row: {
          alignment: string
          created_at: string
          customer: string
          id: string
          number: number
          objective: string
          pillars: string[]
          role_label: string
          role_name: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          alignment?: string
          created_at?: string
          customer?: string
          id?: string
          number: number
          objective?: string
          pillars?: string[]
          role_label?: string
          role_name?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          alignment?: string
          created_at?: string
          customer?: string
          id?: string
          number?: number
          objective?: string
          pillars?: string[]
          role_label?: string
          role_name?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      pillar_summaries: {
        Row: {
          code: string
          description: string
          label: string
          updated_at: string
        }
        Insert: {
          code: string
          description: string
          label: string
          updated_at?: string
        }
        Update: {
          code?: string
          description?: string
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "editor" | "admin"
      contribution: "none" | "secondary" | "primary"
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
    Enums: {
      app_role: ["editor", "admin"],
      contribution: ["none", "secondary", "primary"],
    },
  },
} as const
