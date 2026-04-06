import { create } from "zustand";
import type { WorkoutPlan, Exercise } from "@/lib/types";
import { supabase } from "@/lib/supabase";

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
  fetchPlans: (userId: string) => Promise<void>;
  fetchPlanWithExercises: (planId: string) => Promise<void>;
  createPlan: (
    userId: string,
    name: string,
    description: string | null,
    isPublic: boolean,
  ) => Promise<WorkoutPlan | null>;
  updatePlan: (
    planId: string,
    updates: Partial<Pick<WorkoutPlan, "name" | "description" | "is_public">>,
  ) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
  addExercise: (
    planId: string,
    exercise: Pick<Exercise, "name" | "duration_seconds" | "sides" | "notes">,
  ) => Promise<Exercise | null>;
  updateExercise: (
    exerciseId: string,
    updates: Partial<Pick<Exercise, "name" | "duration_seconds" | "sides" | "notes">>,
  ) => Promise<void>;
  deleteExercise: (exerciseId: string) => Promise<void>;
  reorderExercises: (exercises: { id: string; sort_order: number }[]) => Promise<void>;
  reset: () => void;
}

const initialState = {
  plans: [] as WorkoutPlan[],
  currentPlan: null as WorkoutPlan | null,
  exercises: [] as Exercise[],
  loading: false,
  error: null as string | null,
};

export const useWorkoutStore = create<WorkoutState>()((set, get) => ({
  ...initialState,
  setPlans: (plans) => set({ plans }),
  setCurrentPlan: (currentPlan) => set({ currentPlan }),
  setExercises: (exercises) => set({ exercises }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchPlans: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        set({ loading: false, error: error.message });
        return;
      }

      set({ plans: (data ?? []) as WorkoutPlan[], loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch plans";
      set({ loading: false, error: message });
    }
  },

  fetchPlanWithExercises: async (planId: string) => {
    set({ loading: true, error: null });
    try {
      const { data: plan, error: planError } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (planError) {
        set({ loading: false, error: planError.message });
        return;
      }

      const { data: exercises, error: exercisesError } = await supabase
        .from("exercises")
        .select("*")
        .eq("plan_id", planId)
        .order("sort_order", { ascending: true });

      if (exercisesError) {
        set({ loading: false, error: exercisesError.message });
        return;
      }

      set({
        currentPlan: plan as WorkoutPlan,
        exercises: (exercises ?? []) as Exercise[],
        loading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch plan";
      set({ loading: false, error: message });
    }
  },

  createPlan: async (
    userId: string,
    name: string,
    description: string | null,
    isPublic: boolean,
  ) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("workout_plans")
        .insert({ user_id: userId, name, description, is_public: isPublic })
        .select()
        .single();

      if (error) {
        set({ loading: false, error: error.message });
        return null;
      }

      const plan = data as WorkoutPlan;
      set((state) => ({ plans: [plan, ...state.plans], loading: false }));
      return plan;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create plan";
      set({ loading: false, error: message });
      return null;
    }
  },

  updatePlan: async (planId, updates) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from("workout_plans")
        .update(updates)
        .eq("id", planId);

      if (error) {
        set({ loading: false, error: error.message });
        return;
      }

      set((state) => ({
        plans: state.plans.map((p) => (p.id === planId ? { ...p, ...updates } : p)),
        currentPlan:
          state.currentPlan?.id === planId
            ? { ...state.currentPlan, ...updates }
            : state.currentPlan,
        loading: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update plan";
      set({ loading: false, error: message });
    }
  },

  deletePlan: async (planId) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from("workout_plans")
        .delete()
        .eq("id", planId);

      if (error) {
        set({ loading: false, error: error.message });
        return;
      }

      set((state) => ({
        plans: state.plans.filter((p) => p.id !== planId),
        currentPlan: state.currentPlan?.id === planId ? null : state.currentPlan,
        exercises: state.currentPlan?.id === planId ? [] : state.exercises,
        loading: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete plan";
      set({ loading: false, error: message });
    }
  },

  addExercise: async (planId, exercise) => {
    set({ loading: true, error: null });
    try {
      const currentExercises = get().exercises;
      const nextSortOrder =
        currentExercises.length > 0
          ? Math.max(...currentExercises.map((e) => e.sort_order)) + 1
          : 0;

      const { data, error } = await supabase
        .from("exercises")
        .insert({
          plan_id: planId,
          name: exercise.name,
          duration_seconds: exercise.duration_seconds,
          sides: exercise.sides,
          notes: exercise.notes,
          sort_order: nextSortOrder,
        })
        .select()
        .single();

      if (error) {
        set({ loading: false, error: error.message });
        return null;
      }

      const newExercise = data as Exercise;
      set((state) => ({
        exercises: [...state.exercises, newExercise],
        loading: false,
      }));
      return newExercise;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add exercise";
      set({ loading: false, error: message });
      return null;
    }
  },

  updateExercise: async (exerciseId, updates) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from("exercises")
        .update(updates)
        .eq("id", exerciseId);

      if (error) {
        set({ loading: false, error: error.message });
        return;
      }

      set((state) => ({
        exercises: state.exercises.map((e) =>
          e.id === exerciseId ? { ...e, ...updates } : e,
        ),
        loading: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update exercise";
      set({ loading: false, error: message });
    }
  },

  deleteExercise: async (exerciseId) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from("exercises")
        .delete()
        .eq("id", exerciseId);

      if (error) {
        set({ loading: false, error: error.message });
        return;
      }

      set((state) => ({
        exercises: state.exercises.filter((e) => e.id !== exerciseId),
        loading: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete exercise";
      set({ loading: false, error: message });
    }
  },

  reorderExercises: async (exercises) => {
    set({ loading: true, error: null });
    try {
      const updates = exercises.map(({ id, sort_order }) =>
        supabase.from("exercises").update({ sort_order }).eq("id", id),
      );

      const results = await Promise.all(updates);
      const failed = results.find((r) => r.error);

      if (failed?.error) {
        set({ loading: false, error: failed.error.message });
        return;
      }

      set((state) => {
        const orderMap = new Map(exercises.map((e) => [e.id, e.sort_order]));
        const reordered = state.exercises
          .map((e) => ({
            ...e,
            sort_order: orderMap.get(e.id) ?? e.sort_order,
          }))
          .sort((a, b) => a.sort_order - b.sort_order);
        return { exercises: reordered, loading: false };
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to reorder exercises";
      set({ loading: false, error: message });
    }
  },

  reset: () => set(initialState),
}));
