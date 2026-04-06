import { create } from "zustand";
import type { WorkoutPlan, Exercise } from "@/lib/types";

interface WorkoutState {
  plans: WorkoutPlan[];
  currentPlan: WorkoutPlan | null;
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  setPlans: (plans: WorkoutPlan[]) => void;
  setCurrentPlan: (plan: WorkoutPlan | null) => void;
  setExercises: (exercises: Exercise[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  plans: [] as WorkoutPlan[],
  currentPlan: null,
  exercises: [] as Exercise[],
  loading: false,
  error: null,
};

export const useWorkoutStore = create<WorkoutState>()((set) => ({
  ...initialState,
  setPlans: (plans) => set({ plans }),
  setCurrentPlan: (currentPlan) => set({ currentPlan }),
  setExercises: (exercises) => set({ exercises }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
