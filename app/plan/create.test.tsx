import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CreatePlanScreen from "./create";

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (component: unknown) => component,
    },
    useAnimatedStyle: () => ({}),
    withTiming: (value: unknown) => value,
  };
});

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock("@/stores/workoutStore", () => ({
  useWorkoutStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      createPlan: jest.fn(),
      addExercise: jest.fn(),
      loading: false,
    }),
}));

jest.mock("@/stores/authStore", () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      session: { user: { id: "user-1" } },
    }),
}));

describe("CreatePlanScreen", () => {
  it("renders plan creation form", () => {
    const { getByText, getByPlaceholderText } = render(<CreatePlanScreen />);
    expect(getByText("plan.create")).toBeTruthy();
    expect(getByPlaceholderText("plan.planNamePlaceholder")).toBeTruthy();
    expect(getByPlaceholderText("plan.descriptionPlaceholder")).toBeTruthy();
  });

  it("renders exercise form section", () => {
    const { getAllByText, getByPlaceholderText } = render(<CreatePlanScreen />);
    expect(getAllByText("plan.addExercise").length).toBeGreaterThanOrEqual(1);
    expect(getByPlaceholderText("plan.exerciseNamePlaceholder")).toBeTruthy();
  });

  it("renders save button", () => {
    const { getByText } = render(<CreatePlanScreen />);
    expect(getByText("common.save")).toBeTruthy();
  });
});
