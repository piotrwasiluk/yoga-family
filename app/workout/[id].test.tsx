import React from "react";
import { render } from "@testing-library/react-native";
import WorkoutScreen from "./[id]";

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (component: unknown) => component,
    },
    useAnimatedStyle: () => ({}),
    useDerivedValue: (fn: () => unknown) => ({ value: fn() }),
    withTiming: (value: unknown) => value,
    interpolateColor: (_progress: number, _input: number[], output: string[]) =>
      output[0],
  };
});

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({ id: "plan-1" }),
}));

jest.mock("expo-haptics", () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: "success" },
}));

jest.mock("@/stores/workoutStore", () => ({
  useWorkoutStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      currentPlan: { id: "plan-1", name: "Morning Stretch", description: null, user_id: "user-1", is_public: false, created_at: "2024-01-01" },
      exercises: [
        { id: "ex-1", plan_id: "plan-1", name: "Forward Fold", duration_seconds: 30, sides: 1, image_url: null, sort_order: 0, notes: null },
        { id: "ex-2", plan_id: "plan-1", name: "Downward Dog", duration_seconds: 45, sides: 2, image_url: null, sort_order: 1, notes: null },
      ],
      fetchPlanWithExercises: jest.fn(),
    }),
}));

describe("WorkoutScreen", () => {
  it("renders current exercise name", () => {
    const { getAllByText } = render(<WorkoutScreen />);
    expect(getAllByText("Forward Fold").length).toBeGreaterThanOrEqual(1);
  });

  it("renders exercise progress", () => {
    const { getByText } = render(<WorkoutScreen />);
    expect(getByText("workout.exerciseOf")).toBeTruthy();
  });

  it("renders pause and skip buttons", () => {
    const { getByText } = render(<WorkoutScreen />);
    expect(getByText("workout.pause")).toBeTruthy();
    expect(getByText("workout.skip")).toBeTruthy();
  });

  it("renders exercise list", () => {
    const { getAllByText, getByText } = render(<WorkoutScreen />);
    expect(getAllByText("Forward Fold").length).toBeGreaterThanOrEqual(1);
    expect(getByText("Downward Dog")).toBeTruthy();
  });
});
