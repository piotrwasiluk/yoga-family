export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  expo_push_token: string | null;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  invite_code: string;
  created_by: string | null;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: "admin" | "member";
  joined_at: string;
}

export interface Checkin {
  id: string;
  user_id: string;
  group_id: string;
  checked_in_at: string;
  feeling: Feeling;
  notes: string | null;
  date: string;
}

export type Feeling = "great" | "good" | "tough" | "sore";

export interface WorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
}

export interface Exercise {
  id: string;
  plan_id: string;
  name: string;
  duration_seconds: number;
  sides: number;
  image_url: string | null;
  sort_order: number;
  notes: string | null;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  group_id: string;
  daily_reminder_enabled: boolean;
  daily_reminder_time: string;
  group_summary_enabled: boolean;
  group_summary_time: string;
  member_checkin_enabled: boolean;
}

export interface Streak {
  user_id: string;
  group_id: string;
  current_streak: number;
  longest_streak: number;
  last_checkin_date: string | null;
}

export interface GroupMemberWithProfile extends GroupMember {
  profiles: Profile;
}

export interface CheckinWithProfile extends Checkin {
  profiles: Profile;
}
