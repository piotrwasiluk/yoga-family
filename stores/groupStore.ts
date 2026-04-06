import { create } from "zustand";
import type { Group, GroupMemberWithProfile, Streak, Checkin } from "@/lib/types";
import { supabase } from "@/lib/supabase";

interface GroupState {
  currentGroup: Group | null;
  members: GroupMemberWithProfile[];
  streak: Streak | null;
  weeklyCheckins: Checkin[];
  loading: boolean;
  error: string | null;
  setCurrentGroup: (group: Group | null) => void;
  setMembers: (members: GroupMemberWithProfile[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchGroup: (userId: string) => Promise<void>;
  fetchMembers: (groupId: string) => Promise<void>;
  joinGroupByCode: (userId: string, inviteCode: string) => Promise<boolean>;
  createGroup: (userId: string, name: string) => Promise<boolean>;
  fetchStreak: (userId: string, groupId: string) => Promise<void>;
  fetchWeeklyCheckins: (groupId: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  currentGroup: null,
  members: [],
  streak: null,
  weeklyCheckins: [],
  loading: false,
  error: null,
};

export const useGroupStore = create<GroupState>()((set) => ({
  ...initialState,
  setCurrentGroup: (currentGroup) => set({ currentGroup }),
  setMembers: (members) => set({ members }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchGroup: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data: membership, error: memberError } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", userId)
        .limit(1)
        .single();

      if (memberError) {
        set({ loading: false, error: memberError.message });
        return;
      }

      const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("*")
        .eq("id", membership.group_id)
        .single();

      if (groupError) {
        set({ loading: false, error: groupError.message });
        return;
      }

      set({ currentGroup: group as Group, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch group";
      set({ loading: false, error: message });
    }
  },

  fetchMembers: async (groupId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("group_members")
        .select("*, profiles(*)")
        .eq("group_id", groupId);

      if (error) {
        set({ loading: false, error: error.message });
        return;
      }

      set({ members: (data ?? []) as GroupMemberWithProfile[], loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch members";
      set({ loading: false, error: message });
    }
  },

  joinGroupByCode: async (userId: string, inviteCode: string) => {
    set({ loading: true, error: null });
    try {
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("*")
        .eq("invite_code", inviteCode.trim().toLowerCase())
        .single();

      if (groupError) {
        set({ loading: false, error: "Invalid invite code" });
        return false;
      }

      const { error: joinError } = await supabase.from("group_members").insert({
        group_id: group.id,
        user_id: userId,
        role: "member",
      });

      if (joinError) {
        set({ loading: false, error: joinError.message });
        return false;
      }

      set({ currentGroup: group as Group, loading: false });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to join group";
      set({ loading: false, error: message });
      return false;
    }
  },

  createGroup: async (userId: string, name: string) => {
    set({ loading: true, error: null });
    try {
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({ name, created_by: userId })
        .select()
        .single();

      if (groupError) {
        set({ loading: false, error: groupError.message });
        return false;
      }

      const { error: memberError } = await supabase.from("group_members").insert({
        group_id: group.id,
        user_id: userId,
        role: "admin",
      });

      if (memberError) {
        set({ loading: false, error: memberError.message });
        return false;
      }

      set({ currentGroup: group as Group, loading: false });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create group";
      set({ loading: false, error: message });
      return false;
    }
  },

  fetchStreak: async (userId: string, groupId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", userId)
        .eq("group_id", groupId)
        .maybeSingle();

      if (error) {
        set({ loading: false, error: error.message });
        return;
      }

      set({ streak: (data as Streak | null) ?? null, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch streak";
      set({ loading: false, error: message });
    }
  },

  fetchWeeklyCheckins: async (groupId: string) => {
    set({ loading: true, error: null });
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const startDate = sevenDaysAgo.toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("checkins")
        .select("*")
        .eq("group_id", groupId)
        .gte("date", startDate)
        .order("date", { ascending: true });

      if (error) {
        set({ loading: false, error: error.message });
        return;
      }

      set({ weeklyCheckins: (data ?? []) as Checkin[], loading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch weekly check-ins";
      set({ loading: false, error: message });
    }
  },

  reset: () => set(initialState),
}));
