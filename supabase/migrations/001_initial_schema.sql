-- FlexTrack Initial Schema
-- Run this in Supabase SQL Editor or via migrations

-- Users (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  expo_push_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group membership
CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Daily check-ins
CREATE TABLE public.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  feeling TEXT CHECK (feeling IN ('great', 'good', 'tough', 'sore')),
  notes TEXT,
  date DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, group_id, date)
);

-- Workout plans
CREATE TABLE public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises within a plan
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.workout_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  sides INTEGER DEFAULT 1,
  image_url TEXT,
  sort_order INTEGER NOT NULL,
  notes TEXT
);

-- Notification preferences (per user per group)
CREATE TABLE public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  daily_reminder_enabled BOOLEAN DEFAULT TRUE,
  daily_reminder_time TIME DEFAULT '20:00',
  group_summary_enabled BOOLEAN DEFAULT TRUE,
  group_summary_time TIME DEFAULT '21:00',
  member_checkin_enabled BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, group_id)
);

-- Streak tracking
CREATE TABLE public.streaks (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_checkin_date DATE,
  PRIMARY KEY (user_id, group_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Groups
CREATE POLICY "Members can view their groups"
  ON public.groups FOR SELECT
  USING (id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid()));
CREATE POLICY "Authenticated users can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Group members
CREATE POLICY "Members can view group members"
  ON public.group_members FOR SELECT
  USING (group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can join groups"
  ON public.group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Check-ins
CREATE POLICY "Group members can view check-ins"
  ON public.checkins FOR SELECT
  USING (group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can create own check-ins"
  ON public.checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Workout plans
CREATE POLICY "Users can view own and public plans"
  ON public.workout_plans FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can insert own plans"
  ON public.workout_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plans"
  ON public.workout_plans FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans"
  ON public.workout_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Exercises
CREATE POLICY "Exercises follow plan access"
  ON public.exercises FOR SELECT
  USING (plan_id IN (SELECT id FROM public.workout_plans WHERE user_id = auth.uid() OR is_public = true));
CREATE POLICY "Users can insert own exercises"
  ON public.exercises FOR INSERT
  WITH CHECK (plan_id IN (SELECT id FROM public.workout_plans WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own exercises"
  ON public.exercises FOR UPDATE
  USING (plan_id IN (SELECT id FROM public.workout_plans WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own exercises"
  ON public.exercises FOR DELETE
  USING (plan_id IN (SELECT id FROM public.workout_plans WHERE user_id = auth.uid()));

-- Notification settings
CREATE POLICY "Users manage own notification settings"
  ON public.notification_settings FOR ALL
  USING (auth.uid() = user_id);

-- Streaks
CREATE POLICY "Group members can view streaks"
  ON public.streaks FOR SELECT
  USING (group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid()));

-- ============================================================
-- Streak trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.streaks (user_id, group_id, current_streak, longest_streak, last_checkin_date)
  VALUES (NEW.user_id, NEW.group_id, 1, 1, NEW.date)
  ON CONFLICT (user_id, group_id) DO UPDATE SET
    current_streak = CASE
      WHEN streaks.last_checkin_date = NEW.date - INTERVAL '1 day'
        THEN streaks.current_streak + 1
      WHEN streaks.last_checkin_date = NEW.date
        THEN streaks.current_streak
      ELSE 1
    END,
    longest_streak = GREATEST(
      streaks.longest_streak,
      CASE
        WHEN streaks.last_checkin_date = NEW.date - INTERVAL '1 day'
          THEN streaks.current_streak + 1
        ELSE 1
      END
    ),
    last_checkin_date = NEW.date;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_checkin_update_streak
  AFTER INSERT ON public.checkins
  FOR EACH ROW EXECUTE FUNCTION update_streak();

-- ============================================================
-- Enable realtime for checkins
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.checkins;
