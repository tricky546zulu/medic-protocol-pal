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
      medication_administration: {
        Row: {
          administration_notes: string[] | null
          adverse_effects: string[] | null
          id: string
          medication_id: string | null
          monitoring: string[] | null
          preparation: string[] | null
        }
        Insert: {
          administration_notes?: string[] | null
          adverse_effects?: string[] | null
          id?: string
          medication_id?: string | null
          monitoring?: string[] | null
          preparation?: string[] | null
        }
        Update: {
          administration_notes?: string[] | null
          adverse_effects?: string[] | null
          id?: string
          medication_id?: string | null
          monitoring?: string[] | null
          preparation?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "medication_administration_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_contraindications: {
        Row: {
          contraindication: string
          id: string
          medication_id: string | null
        }
        Insert: {
          contraindication: string
          id?: string
          medication_id?: string | null
        }
        Update: {
          contraindication?: string
          id?: string
          medication_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medication_contraindications_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_dosing: {
        Row: {
          compatibility_stability: string[] | null
          concentration_supplied: string | null
          dose: string
          id: string
          indication: string
          infusion_pump_settings: Json | null
          medication_id: string | null
          notes: string[] | null
          patient_type: string
          provider_routes: string[] | null
          requires_infusion_pump: boolean | null
          route: string | null
        }
        Insert: {
          compatibility_stability?: string[] | null
          concentration_supplied?: string | null
          dose: string
          id?: string
          indication: string
          infusion_pump_settings?: Json | null
          medication_id?: string | null
          notes?: string[] | null
          patient_type: string
          provider_routes?: string[] | null
          requires_infusion_pump?: boolean | null
          route?: string | null
        }
        Update: {
          compatibility_stability?: string[] | null
          concentration_supplied?: string | null
          dose?: string
          id?: string
          indication?: string
          infusion_pump_settings?: Json | null
          medication_id?: string | null
          notes?: string[] | null
          patient_type?: string
          provider_routes?: string[] | null
          requires_infusion_pump?: boolean | null
          route?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medication_dosing_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_indications: {
        Row: {
          id: string
          indication_text: string
          indication_type: string
          medication_id: string | null
        }
        Insert: {
          id?: string
          indication_text: string
          indication_type: string
          medication_id?: string | null
        }
        Update: {
          id?: string
          indication_text?: string
          indication_type?: string
          medication_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medication_indications_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          classification: string[] | null
          created_at: string | null
          high_alert: boolean | null
          id: string
          infusion_only: boolean | null
          medication_name: string
          updated_at: string | null
        }
        Insert: {
          classification?: string[] | null
          created_at?: string | null
          high_alert?: boolean | null
          id?: string
          infusion_only?: boolean | null
          medication_name: string
          updated_at?: string | null
        }
        Update: {
          classification?: string[] | null
          created_at?: string | null
          high_alert?: boolean | null
          id?: string
          infusion_only?: boolean | null
          medication_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          medication_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          medication_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          medication_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
