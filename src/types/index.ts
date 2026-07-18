export interface Project {
  id: string;
  user_id: string;
  name: string;
  goal: string | null;
  goal_updated_at: string | null;
  created_at: string;
  last_synced_at: string | null;
}

export interface Decision {
  id: string;
  project_id: string;
  action: string;
  contradicts: boolean;
  reasoning: string | null;
  created_at: string;
}

export interface Override {
  id: string;
  project_id: string;
  action: string;
  action_hash: string | null;
  created_at: string;
}
