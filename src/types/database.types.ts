// Hand-written to exactly match supabase/migrations/*.sql.
// Structured to match the shape produced by `supabase gen types typescript`,
// so running that command against a live project can replace this file with
// no other code changes required.

export type UserRole = "admin" | "media_buyer";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: UserRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      associations: {
        Row: {
          id: string;
          name: string;
          code: string | null;
          description: string | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["associations"]["Insert"]>;
        Relationships: [];
      };
      platforms: {
        Row: {
          id: string;
          name: string;
          slug: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["platforms"]["Insert"]>;
        Relationships: [];
      };
      association_platforms: {
        Row: {
          association_id: string;
          platform_id: string;
          created_at: string;
        };
        Insert: {
          association_id: string;
          platform_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["association_platforms"]["Insert"]>;
        Relationships: [];
      };
      association_media_buyers: {
        Row: {
          association_id: string;
          media_buyer_id: string;
          assigned_by: string | null;
          created_at: string;
        };
        Insert: {
          association_id: string;
          media_buyer_id: string;
          assigned_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["association_media_buyers"]["Insert"]>;
        Relationships: [];
      };
      statistics_entries: {
        Row: {
          id: string;
          association_id: string;
          platform_id: string;
          created_by: string;
          period_start: string;
          period_end: string;
          currency_code: string;
          budget: number;
          amount_spent: number;
          donation_count: number;
          donation_value: number;
          advertising_return: number;
          association_return: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          association_id: string;
          platform_id: string;
          created_by: string;
          period_start: string;
          period_end: string;
          currency_code?: string;
          budget?: number;
          amount_spent?: number;
          donation_count?: number;
          donation_value?: number;
          advertising_return?: number;
          association_return?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["statistics_entries"]["Insert"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: number;
          actor_id: string | null;
          action: string;
          table_name: string;
          record_id: string | null;
          old_data: Record<string, unknown> | null;
          new_data: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          actor_id?: string | null;
          action: string;
          table_name: string;
          record_id?: string | null;
          old_data?: Record<string, unknown> | null;
          new_data?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_assigned_to_association: {
        Args: { association_uuid: string };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
    };
  };
}
