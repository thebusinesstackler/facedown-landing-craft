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
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_admin: boolean
          password_hash: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_admin?: boolean
          password_hash: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_admin?: boolean
          password_hash?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      appointment_reminders: {
        Row: {
          appointment_id: string
          created_at: string
          id: string
          scheduled_time: string
          sent_at: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          id?: string
          scheduled_time: string
          sent_at?: string | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          id?: string
          scheduled_time?: string
          sent_at?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_reminders_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          description: string | null
          id: string
          lead_email: string
          lead_name: string
          lead_phone: string | null
          reminder_email: boolean | null
          reminder_sms: boolean | null
          reminder_time_minutes: number | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          description?: string | null
          id?: string
          lead_email: string
          lead_name: string
          lead_phone?: string | null
          reminder_email?: boolean | null
          reminder_sms?: boolean | null
          reminder_time_minutes?: number | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          description?: string | null
          id?: string
          lead_email?: string
          lead_name?: string
          lead_phone?: string | null
          reminder_email?: boolean | null
          reminder_sms?: boolean | null
          reminder_time_minutes?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      campaign_emails: {
        Row: {
          campaign_id: string
          content: string
          created_at: string
          id: string
          recipient: string
          scheduled_time: string | null
          sent_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          content: string
          created_at?: string
          id?: string
          recipient: string
          scheduled_time?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          content?: string
          created_at?: string
          id?: string
          recipient?: string
          scheduled_time?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_emails_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          ai_feature: string | null
          created_at: string
          id: string
          name: string
          recipient_list_id: string | null
          scheduled_time: string | null
          send_interval_minutes: number | null
          status: string
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_feature?: string | null
          created_at?: string
          id?: string
          name: string
          recipient_list_id?: string | null
          scheduled_time?: string | null
          send_interval_minutes?: number | null
          status: string
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_feature?: string | null
          created_at?: string
          id?: string
          name?: string
          recipient_list_id?: string | null
          scheduled_time?: string | null
          send_interval_minutes?: number | null
          status?: string
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_orders: {
        Row: {
          address: string | null
          card_name: string | null
          card_number_masked: string | null
          city: string | null
          created_at: string
          email: string
          end_date: string | null
          expiry_date: string | null
          id: string
          name: string
          phone: string | null
          price: number | null
          rental_period: string | null
          start_date: string | null
          state: string | null
          status: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          card_name?: string | null
          card_number_masked?: string | null
          city?: string | null
          created_at?: string
          email: string
          end_date?: string | null
          expiry_date?: string | null
          id?: string
          name: string
          phone?: string | null
          price?: number | null
          rental_period?: string | null
          start_date?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          card_name?: string | null
          card_number_masked?: string | null
          city?: string | null
          created_at?: string
          email?: string
          end_date?: string | null
          expiry_date?: string | null
          id?: string
          name?: string
          phone?: string | null
          price?: number | null
          rental_period?: string | null
          start_date?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          components: Json
          created_at: string
          id: string
          is_favorite: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          components: Json
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          components?: Json
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          state: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      sender_configurations: {
        Row: {
          created_at: string
          id: string
          is_verified: boolean | null
          provider: string
          provider_details: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_verified?: boolean | null
          provider: string
          provider_details: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_verified?: boolean | null
          provider?: string
          provider_details?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verified_domains: {
        Row: {
          created_at: string
          domain: string
          id: string
          updated_at: string
          user_id: string
          verification_records: Json | null
          verification_status: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          updated_at?: string
          user_id: string
          verification_records?: Json | null
          verification_status: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          updated_at?: string
          user_id?: string
          verification_records?: Json | null
          verification_status?: string
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
      user_role: "admin" | "user"
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
      user_role: ["admin", "user"],
    },
  },
} as const
