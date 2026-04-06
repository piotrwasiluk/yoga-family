import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  session: null,
  profile: null,
  loading: true,
  error: null,
};

export const useAuthStore = create<AuthState>()((set) => ({
  ...initialState,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ ...initialState, loading: false }),
}));
