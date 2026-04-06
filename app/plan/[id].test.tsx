import React from "react";
import { render } from "@testing-library/react-native";
import PlanDetailScreen from "./[id]";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({ id: "plan-1" }),
}));

jest.mock("@/stores/workoutStore", () => ({
  useWorkoutStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      currentPlan: { id: "plan-1", name: "Morning Stretch", description: "Gentle routine", user_id: "user-1", is_public: false, created_at: "2024-01-01" },
      exercises: [
        { id: "ex-1", plan_id: "plan-1", name: "Forward Fold", duration_seconds: 30, sides: 1, image_url: null, sort_order: 0, notes: null },
      ],
      loading: false,
      fetchPlanWithExercises: jest.fn(),
      deletePlan: jest.fn(),
    }),
}));

describe("PlanDetailScreen", () => {
  it("renders plan name", () => {
    const { getByText } = render(<PlanDetailScreen />);
    expect(getByText("Morning Stretch")).toBeTruthy();
  });

  it("renders plan description", () => {
    const { getByText } = render(<PlanDetailScreen />);
    expect(getByText("Gentle routine")).toBeTruthy();
  });

  it("renders exercise", () => {
    const { getByText } = render(<PlanDetailScreen />);
    expect(getByText("Forward Fold")).toBeTruthy();
  });

  it("renders start workout button", () => {
    const { getByText } = render(<PlanDetailScreen />);
    expect(getByText("plan.startWorkout")).toBeTruthy();
  });
});
