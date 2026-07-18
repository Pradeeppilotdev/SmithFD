export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          goal: string | null;
          goal_updated_at: string | null;
          created_at: string;
          last_synced_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          goal?: string | null;
          goal_updated_at?: string | null;
          created_at?: string;
          last_synced_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          goal?: string | null;
          goal_updated_at?: string | null;
          created_at?: string;
          last_synced_at?: string | null;
        };
        Relationships: [];
      };
      access_tokens: {
        Row: {
          id: string;
          user_id: string;
          token_hash: string;
          label: string | null;
          created_at: string;
          revoked_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          token_hash: string;
          label?: string | null;
          created_at?: string;
          revoked_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          token_hash?: string;
          label?: string | null;
          created_at?: string;
          revoked_at?: string | null;
        };
        Relationships: [];
      };
      decisions: {
        Row: {
          id: string;
          project_id: string;
          action: string;
          contradicts: boolean;
          reasoning: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          action: string;
          contradicts: boolean;
          reasoning?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          action?: string;
          contradicts?: boolean;
          reasoning?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      overrides: {
        Row: {
          id: string;
          project_id: string;
          action: string;
          action_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          action: string;
          action_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          action?: string;
          action_hash?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
