import { create } from "zustand";
import type { Checkin, Feeling } from "@/lib/types";
import { supabase } from "@/lib/supabase";

interface CheckinState {
  todayCheckins: Checkin[];
  loading: boolean;
  error: string | null;
  setTodayCheckins: (checkins: Checkin[]) => void;
  addCheckin: (checkin: Checkin) => void;
  hasUserCheckedIn: (userId: string) => boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchTodayCheckins: (groupId: string) => Promise<void>;
  createCheckin: (userId: string, groupId: string, feeling: Feeling, notes?: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  todayCheckins: [] as Checkin[],
  loading: false,
  error: null,
};

export const useCheckinStore = create<CheckinState>()((set, get) => ({
  ...initialState,

  setTodayCheckins: (todayCheckins) => set({ todayCheckins }),

  addCheckin: (checkin) =>
    set((state) => {
      const exists = state.todayCheckins.some((c) => c.id === checkin.id);
      if (exists) return state;
      return { todayCheckins: [...state.todayCheckins, checkin] };
    }),

  hasUserCheckedIn: (userId) => {
    return get().todayCheckins.some((c) => c.user_id === userId);
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchTodayCheckins: async (groupId: string) => {
    set({ loading: true, error: null });
    try {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("checkins")
        .select("*")
        .eq("group_id", groupId)
        .eq("date", today);

      if (error) {
        set({ loading: false, error: error.message });
        return;
      }

      set({ todayCheckins: (data ?? []) as Checkin[], loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch check-ins";
      set({ loading: false, error: message });
    }
  },

  createCheckin: async (userId: string, groupId: string, feeling: Feeling, notes?: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("checkins")
        .insert({
          user_id: userId,
          group_id: groupId,
          feeling,
          notes: notes ?? null,
        })
        .select()
        .single();

      if (error) {
        set({ loading: false, error: error.message });
        return;
      }

      if (data) {
        get().addCheckin(data as Checkin);
      }
      set({ loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create check-in";
      set({ loading: false, error: message });
    }
  },

  reset: () => set(initialState),
}));
