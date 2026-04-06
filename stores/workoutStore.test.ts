import { useWorkoutStore } from "./workoutStore";
import type { WorkoutPlan, Exercise } from "@/lib/types";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

const mockPlan: WorkoutPlan = {
  id: "plan-1",
  user_id: "user-1",
  name: "Morning Stretch",
  description: "A gentle morning routine",
  is_public: false,
  created_at: "2024-01-01",
};

const mockExercise: Exercise = {
  id: "exercise-1",
  plan_id: "plan-1",
  name: "Forward Fold",
  duration_seconds: 30,
  sides: 1,
  image_url: null,
  sort_order: 0,
  notes: null,
};

describe("workoutStore", () => {
  beforeEach(() => {
    useWorkoutStore.setState({
      plans: [],
      currentPlan: null,
      exercises: [],
      loading: false,
      error: null,
    });
  });

  it("should have correct initial state", () => {
    const state = useWorkoutStore.getState();
    expect(state.plans).toEqual([]);
    expect(state.currentPlan).toBeNull();
    expect(state.exercises).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should set plans", () => {
    useWorkoutStore.getState().setPlans([mockPlan]);
    expect(useWorkoutStore.getState().plans).toEqual([mockPlan]);
  });

  it("should set current plan", () => {
    useWorkoutStore.getState().setCurrentPlan(mockPlan);
    expect(useWorkoutStore.getState().currentPlan).toEqual(mockPlan);
  });

  it("should set exercises", () => {
    useWorkoutStore.getState().setExercises([mockExercise]);
    expect(useWorkoutStore.getState().exercises).toEqual([mockExercise]);
  });

  it("should set loading", () => {
    useWorkoutStore.getState().setLoading(true);
    expect(useWorkoutStore.getState().loading).toBe(true);
  });

  it("should set error", () => {
    useWorkoutStore.getState().setError("Something went wrong");
    expect(useWorkoutStore.getState().error).toBe("Something went wrong");
  });

  it("should reset state", () => {
    useWorkoutStore.getState().setPlans([mockPlan]);
    useWorkoutStore.getState().setCurrentPlan(mockPlan);
    useWorkoutStore.getState().setExercises([mockExercise]);
    useWorkoutStore.getState().reset();

    const state = useWorkoutStore.getState();
    expect(state.plans).toEqual([]);
    expect(state.currentPlan).toBeNull();
    expect(state.exercises).toEqual([]);
  });

  it("should clear exercises when deleting the current plan from state", () => {
    useWorkoutStore.setState({
      plans: [mockPlan],
      currentPlan: mockPlan,
      exercises: [mockExercise],
    });

    // Simulate state after delete: filter plan out, clear current if matches
    const planId = mockPlan.id;
    useWorkoutStore.setState((state) => ({
      plans: state.plans.filter((p) => p.id !== planId),
      currentPlan: state.currentPlan?.id === planId ? null : state.currentPlan,
      exercises: state.currentPlan?.id === planId ? [] : state.exercises,
    }));

    expect(useWorkoutStore.getState().currentPlan).toBeNull();
    expect(useWorkoutStore.getState().exercises).toEqual([]);
    expect(useWorkoutStore.getState().plans).toEqual([]);
  });

  it("should update exercise sort order locally", () => {
    const exercises: Exercise[] = [
      { ...mockExercise, id: "ex-1", sort_order: 0 },
      { ...mockExercise, id: "ex-2", sort_order: 1 },
      { ...mockExercise, id: "ex-3", sort_order: 2 },
    ];
    useWorkoutStore.setState({ exercises });

    const orderMap = new Map([
      ["ex-1", 2],
      ["ex-2", 0],
      ["ex-3", 1],
    ]);

    useWorkoutStore.setState((state) => ({
      exercises: state.exercises
        .map((e) => ({
          ...e,
          sort_order: orderMap.get(e.id) ?? e.sort_order,
        }))
        .sort((a, b) => a.sort_order - b.sort_order),
    }));

    const sorted = useWorkoutStore.getState().exercises;
    expect(sorted[0]?.id).toBe("ex-2");
    expect(sorted[1]?.id).toBe("ex-3");
    expect(sorted[2]?.id).toBe("ex-1");
  });
});
