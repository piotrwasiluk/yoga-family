import { create } from "zustand";
import type { NotificationSettings } from "@/lib/types";
import { supabase } from "@/lib/supabase";

interface NotificationState {
  settings: NotificationSettings | null;
  loading: boolean;
  error: string | null;
  setSettings: (settings: NotificationSettings | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchSettings: (userId: string, groupId: string) => Promise<void>;
  upsertSettings: (
    userId: string,
    groupId: string,
    updates: Partial<
      Pick<
        NotificationSettings,
        | "daily_reminder_enabled"
        | "daily_reminder_time"
        | "group_summary_enabled"
        | "group_summary_time"
        | "member_checkin_enabled"
      >
    >,
  ) => Promise<void>;
  reset: () => void;
}

const initialState = {
  settings: null as NotificationSettings | null,
  loading: false,
  error: null as string | null,
};

export const useNotificationStore = create<NotificationState>()((set) => ({
  ...initialState,
  setSettings: (settings) => set({ settings }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchSettings: async (userId: string, groupId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", userId)
        .eq("group_id", groupId)
        .maybeSingle();

      if (error) {
        set({ loading: false, error: error.message });
        return;
      }

      set({ settings: data as NotificationSettings | null, loading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch notification settings";
      set({ loading: false, error: message });
    }
  },

  upsertSettings: async (userId, groupId, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("notification_settings")
        .upsert(
          { user_id: userId, group_id: groupId, ...updates },
          { onConflict: "user_id,group_id" },
        )
        .select()
        .single();

      if (error) {
        set({ loading: false, error: error.message });
        return;
      }

      set({ settings: data as NotificationSettings, loading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update notification settings";
      set({ loading: false, error: message });
    }
  },

  reset: () => set(initialState),
}));
