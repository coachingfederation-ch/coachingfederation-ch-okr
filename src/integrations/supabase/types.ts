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
    PostgrestVersion: "14.17"
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
          source_lang: string
          translations: Json
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
          source_lang?: string
          translations?: Json
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
          source_lang?: string
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      initiative_interests: {
        Row: {
          created_at: string
          email: string
          id: string
          initiative_id: string
          message: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          initiative_id: string
          message?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          initiative_id?: string
          message?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "initiative_interests_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "initiatives"
            referencedColumns: ["id"]
          },
        ]
      }
      initiative_learning_entries: {
        Row: {
          author_name: string
          created_at: string
          decision: Database["public"]["Enums"]["learning_decision"]
          do_next: string
          entry_date: string
          id: string
          initiative_id: string
          next_move: string
          proud_of: string
          signals_telling: string
          source_lang: string
          surprised_us: string
          translations: Json
          updated_at: string
          what_happened: string
        }
        Insert: {
          author_name?: string
          created_at?: string
          decision?: Database["public"]["Enums"]["learning_decision"]
          do_next?: string
          entry_date?: string
          id?: string
          initiative_id: string
          next_move?: string
          proud_of?: string
          signals_telling?: string
          source_lang?: string
          surprised_us?: string
          translations?: Json
          updated_at?: string
          what_happened?: string
        }
        Update: {
          author_name?: string
          created_at?: string
          decision?: Database["public"]["Enums"]["learning_decision"]
          do_next?: string
          entry_date?: string
          id?: string
          initiative_id?: string
          next_move?: string
          proud_of?: string
          signals_telling?: string
          source_lang?: string
          surprised_us?: string
          translations?: Json
          updated_at?: string
          what_happened?: string
        }
        Relationships: [
          {
            foreignKeyName: "initiative_learning_entries_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "initiatives"
            referencedColumns: ["id"]
          },
        ]
      }
      initiative_milestones: {
        Row: {
          created_at: string
          due_date: string | null
          id: string
          initiative_id: string
          owner: string
          sort_order: number
          source_lang: string
          title: string
          translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_date?: string | null
          id?: string
          initiative_id: string
          owner?: string
          sort_order?: number
          source_lang?: string
          title?: string
          translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_date?: string | null
          id?: string
          initiative_id?: string
          owner?: string
          sort_order?: number
          source_lang?: string
          title?: string
          translations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "initiative_milestones_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "initiatives"
            referencedColumns: ["id"]
          },
        ]
      }
      initiative_secondary_krs: {
        Row: {
          created_at: string
          initiative_id: string
          kr_id: string
        }
        Insert: {
          created_at?: string
          initiative_id: string
          kr_id: string
        }
        Update: {
          created_at?: string
          initiative_id?: string
          kr_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "initiative_secondary_krs_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "initiatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "initiative_secondary_krs_kr_id_fkey"
            columns: ["kr_id"]
            isOneToOne: false
            referencedRelation: "key_results"
            referencedColumns: ["id"]
          },
        ]
      }
      initiative_signals: {
        Row: {
          created_at: string
          direction: Database["public"]["Enums"]["signal_direction"] | null
          evidence: Database["public"]["Enums"]["evidence_type"]
          how_noticed: string
          id: string
          initiative_id: string
          name: string
          sort_order: number
          source_lang: string
          starting_point: string
          translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          direction?: Database["public"]["Enums"]["signal_direction"] | null
          evidence?: Database["public"]["Enums"]["evidence_type"]
          how_noticed?: string
          id?: string
          initiative_id: string
          name?: string
          sort_order?: number
          source_lang?: string
          starting_point?: string
          translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          direction?: Database["public"]["Enums"]["signal_direction"] | null
          evidence?: Database["public"]["Enums"]["evidence_type"]
          how_noticed?: string
          id?: string
          initiative_id?: string
          name?: string
          sort_order?: number
          source_lang?: string
          starting_point?: string
          translations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "initiative_signals_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "initiatives"
            referencedColumns: ["id"]
          },
        ]
      }
      initiatives: {
        Row: {
          aspiration: string
          availability: Database["public"]["Enums"]["initiative_availability"]
          bet_action: string
          bet_change: string
          bet_question: string
          blocked_reason: string
          commitment:
            | Database["public"]["Enums"]["initiative_commitment"]
            | null
          confidence: Database["public"]["Enums"]["bet_confidence"] | null
          created_at: string
          description: string
          end_date: string | null
          help_needed:
            | Database["public"]["Enums"]["initiative_help_needed"]
            | null
          id: string
          idea: string
          kind: Database["public"]["Enums"]["initiative_kind"]
          kr_id: string
          lead_name: string
          learning_checkpoint: string | null
          okr_set_id: string
          out_of_scope: string
          owner: string
          phase: number
          phase_type: Database["public"]["Enums"]["phase_type"] | null
          proposed_owner: string
          size: Database["public"]["Enums"]["work_size"] | null
          skill_note: string
          sort_order: number
          source_lang: string
          start_date: string | null
          status: string
          support_needed: string
          team_id: string | null
          text: string
          translations: Json
          updated_at: string
          why_now: string
        }
        Insert: {
          aspiration?: string
          availability?: Database["public"]["Enums"]["initiative_availability"]
          bet_action?: string
          bet_change?: string
          bet_question?: string
          blocked_reason?: string
          commitment?:
            | Database["public"]["Enums"]["initiative_commitment"]
            | null
          confidence?: Database["public"]["Enums"]["bet_confidence"] | null
          created_at?: string
          description?: string
          end_date?: string | null
          help_needed?:
            | Database["public"]["Enums"]["initiative_help_needed"]
            | null
          id?: string
          idea?: string
          kind?: Database["public"]["Enums"]["initiative_kind"]
          kr_id: string
          lead_name?: string
          learning_checkpoint?: string | null
          okr_set_id: string
          out_of_scope?: string
          owner?: string
          phase?: number
          phase_type?: Database["public"]["Enums"]["phase_type"] | null
          proposed_owner?: string
          size?: Database["public"]["Enums"]["work_size"] | null
          skill_note?: string
          sort_order?: number
          source_lang?: string
          start_date?: string | null
          status?: string
          support_needed?: string
          team_id?: string | null
          text?: string
          translations?: Json
          updated_at?: string
          why_now?: string
        }
        Update: {
          aspiration?: string
          availability?: Database["public"]["Enums"]["initiative_availability"]
          bet_action?: string
          bet_change?: string
          bet_question?: string
          blocked_reason?: string
          commitment?:
            | Database["public"]["Enums"]["initiative_commitment"]
            | null
          confidence?: Database["public"]["Enums"]["bet_confidence"] | null
          created_at?: string
          description?: string
          end_date?: string | null
          help_needed?:
            | Database["public"]["Enums"]["initiative_help_needed"]
            | null
          id?: string
          idea?: string
          kind?: Database["public"]["Enums"]["initiative_kind"]
          kr_id?: string
          lead_name?: string
          learning_checkpoint?: string | null
          okr_set_id?: string
          out_of_scope?: string
          owner?: string
          phase?: number
          phase_type?: Database["public"]["Enums"]["phase_type"] | null
          proposed_owner?: string
          size?: Database["public"]["Enums"]["work_size"] | null
          skill_note?: string
          sort_order?: number
          source_lang?: string
          start_date?: string | null
          status?: string
          support_needed?: string
          team_id?: string | null
          text?: string
          translations?: Json
          updated_at?: string
          why_now?: string
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
          {
            foreignKeyName: "initiatives_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      key_results: {
        Row: {
          baseline_2026: string
          baseline_locked: boolean
          created_at: string
          current_as_of: string | null
          current_value: string
          id: string
          instrument: string
          kr: string
          kr_type: Database["public"]["Enums"]["kr_type"]
          lead: string
          measure: string
          milestone_due: string | null
          milestone_status: Database["public"]["Enums"]["milestone_status"]
          okr_set_id: string
          sort_order: number
          source_lang: string
          target: string
          target_2027: string
          text: string
          translations: Json
          updated_at: string
        }
        Insert: {
          baseline_2026?: string
          baseline_locked?: boolean
          created_at?: string
          current_as_of?: string | null
          current_value?: string
          id?: string
          instrument?: string
          kr?: string
          kr_type?: Database["public"]["Enums"]["kr_type"]
          lead?: string
          measure?: string
          milestone_due?: string | null
          milestone_status?: Database["public"]["Enums"]["milestone_status"]
          okr_set_id: string
          sort_order?: number
          source_lang?: string
          target?: string
          target_2027?: string
          text?: string
          translations?: Json
          updated_at?: string
        }
        Update: {
          baseline_2026?: string
          baseline_locked?: boolean
          created_at?: string
          current_as_of?: string | null
          current_value?: string
          id?: string
          instrument?: string
          kr?: string
          kr_type?: Database["public"]["Enums"]["kr_type"]
          lead?: string
          measure?: string
          milestone_due?: string | null
          milestone_status?: Database["public"]["Enums"]["milestone_status"]
          okr_set_id?: string
          sort_order?: number
          source_lang?: string
          target?: string
          target_2027?: string
          text?: string
          translations?: Json
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
          source_lang: string
          title: string
          translations: Json
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
          source_lang?: string
          title?: string
          translations?: Json
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
          source_lang?: string
          title?: string
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      pillar_summaries: {
        Row: {
          code: string
          description: string
          label: string
          source_lang: string
          translations: Json
          updated_at: string
        }
        Insert: {
          code: string
          description: string
          label: string
          source_lang?: string
          translations?: Json
          updated_at?: string
        }
        Update: {
          code?: string
          description?: string
          label?: string
          source_lang?: string
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      role_directory: {
        Row: {
          email: string
          role: Database["public"]["Enums"]["app_role"]
          source_roles: string[]
          synced_at: string
        }
        Insert: {
          email: string
          role: Database["public"]["Enums"]["app_role"]
          source_roles?: string[]
          synced_at?: string
        }
        Update: {
          email?: string
          role?: Database["public"]["Enums"]["app_role"]
          source_roles?: string[]
          synced_at?: string
        }
        Relationships: []
      }
      role_overrides: {
        Row: {
          created_at: string
          email: string
          note: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          email: string
          note?: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          email?: string
          note?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      role_sync_state: {
        Row: {
          entry_count: number
          id: boolean
          last_error: string
          last_run_at: string | null
          last_status: string
        }
        Insert: {
          entry_count?: number
          id?: boolean
          last_error?: string
          last_run_at?: string | null
          last_status?: string
        }
        Update: {
          entry_count?: number
          id?: boolean
          last_error?: string
          last_run_at?: string | null
          last_status?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string
          id: string
          name: string
          position: number
          source_lang: string
          translations: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          position?: number
          source_lang?: string
          translations?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          position?: number
          source_lang?: string
          translations?: Json
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
      bet_confidence: "pretty_confident" | "worth_testing" | "wild_card"
      contribution: "none" | "secondary" | "primary"
      evidence_type: "see" | "hear" | "measure"
      initiative_availability: "open" | "blocked" | "parked"
      initiative_commitment: "one_off" | "recurring" | "workstream"
      initiative_help_needed: "lead" | "helpers" | "skill"
      initiative_kind: "candidate" | "simple_task" | "initiative"
      kr_type: "metric" | "milestone"
      learning_decision: "growing" | "tweak" | "surprise" | "let_go"
      milestone_status: "not_started" | "in_progress" | "done"
      phase_type: "delivery" | "discovery"
      signal_direction: "up" | "down"
      work_size: "small" | "medium"
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
      bet_confidence: ["pretty_confident", "worth_testing", "wild_card"],
      contribution: ["none", "secondary", "primary"],
      evidence_type: ["see", "hear", "measure"],
      initiative_availability: ["open", "blocked", "parked"],
      initiative_commitment: ["one_off", "recurring", "workstream"],
      initiative_help_needed: ["lead", "helpers", "skill"],
      initiative_kind: ["candidate", "simple_task", "initiative"],
      kr_type: ["metric", "milestone"],
      learning_decision: ["growing", "tweak", "surprise", "let_go"],
      milestone_status: ["not_started", "in_progress", "done"],
      phase_type: ["delivery", "discovery"],
      signal_direction: ["up", "down"],
      work_size: ["small", "medium"],
    },
  },
} as const
