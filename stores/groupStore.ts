import { create } from "zustand";
import type { Group, GroupMemberWithProfile } from "@/lib/types";
import { supabase } from "@/lib/supabase";

interface GroupState {
  currentGroup: Group | null;
  members: GroupMemberWithProfile[];
  loading: boolean;
  error: string | null;
  setCurrentGroup: (group: Group | null) => void;
  setMembers: (members: GroupMemberWithProfile[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchGroup: (userId: string) => Promise<void>;
  fetchMembers: (groupId: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  currentGroup: null,
  members: [],
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

  reset: () => set(initialState),
}));
