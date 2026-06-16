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
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json | null
          entity: string
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity: string
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity?: string
          entity_id?: string | null
          id?: string
        }
        Relationships: []
      }
      contestants: {
        Row: {
          biography: string | null
          contestant_number: number
          created_at: string
          faculty: string | null
          full_name: string
          id: string
          image: string | null
          status: Database["public"]["Enums"]["contestant_status"]
          top_rank: number | null
          total_votes: number
          updated_at: string
        }
        Insert: {
          biography?: string | null
          contestant_number: number
          created_at?: string
          faculty?: string | null
          full_name: string
          id?: string
          image?: string | null
          status?: Database["public"]["Enums"]["contestant_status"]
          top_rank?: number | null
          total_votes?: number
          updated_at?: string
        }
        Update: {
          biography?: string | null
          contestant_number?: number
          created_at?: string
          faculty?: string | null
          full_name?: string
          id?: string
          image?: string | null
          status?: Database["public"]["Enums"]["contestant_status"]
          top_rank?: number | null
          total_votes?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          account_number: string
          bank_account_name: string
          bank_name: string
          competition_banner: string | null
          competition_name: string
          id: number
          updated_at: string
          vote_price: number
          voting_open: boolean
        }
        Insert: {
          account_number?: string
          bank_account_name?: string
          bank_name?: string
          competition_banner?: string | null
          competition_name?: string
          id?: number
          updated_at?: string
          vote_price?: number
          voting_open?: boolean
        }
        Update: {
          account_number?: string
          bank_account_name?: string
          bank_name?: string
          competition_banner?: string | null
          competition_name?: string
          id?: number
          updated_at?: string
          vote_price?: number
          voting_open?: boolean
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          contestant_id: string
          created_at: string
          id: string
          number_of_votes: number
          payment_proof: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string
          voter_email: string
          voter_name: string
          voter_phone: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          contestant_id: string
          created_at?: string
          id?: string
          number_of_votes: number
          payment_proof?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
          voter_email: string
          voter_name: string
          voter_phone: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          contestant_id?: string
          created_at?: string
          id?: string
          number_of_votes?: number
          payment_proof?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
          voter_email?: string
          voter_name?: string
          voter_phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_contestant_id_fkey"
            columns: ["contestant_id"]
            isOneToOne: false
            referencedRelation: "contestants"
            referencedColumns: ["id"]
          },
        ]
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
      admin_list_users: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          last_sign_in_at: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
      admin_set_user_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: {
          created_at: string
          email: string
          full_name: string
          last_sign_in_at: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
      approve_transaction: {
        Args: { _tx_id: string }
        Returns: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          contestant_id: string
          created_at: string
          id: string
          number_of_votes: number
          payment_proof: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string
          voter_email: string
          voter_name: string
          voter_phone: string
        }
        SetofOptions: {
          from: "*"
          to: "transactions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      public_stats: {
        Args: never
        Returns: {
          total_contestants: number
          total_voters: number
          total_votes: number
        }[]
      }
      reject_transaction: {
        Args: { _tx_id: string }
        Returns: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          contestant_id: string
          created_at: string
          id: string
          number_of_votes: number
          payment_proof: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string
          voter_email: string
          voter_name: string
          voter_phone: string
        }
        SetofOptions: {
          from: "*"
          to: "transactions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      app_role: "admin" | "user"
      contestant_status: "active" | "inactive"
      transaction_status: "pending" | "approved" | "rejected"
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
      app_role: ["admin", "user"],
      contestant_status: ["active", "inactive"],
      transaction_status: ["pending", "approved", "rejected"],
    },
  },
} as const
