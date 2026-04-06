import React from "react";
import { render } from "@testing-library/react-native";
import PlanScreen from "./plan";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock("@/stores/workoutStore", () => ({
  useWorkoutStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      plans: [],
      loading: false,
      fetchPlans: jest.fn(),
    }),
}));

jest.mock("@/stores/authStore", () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      session: { user: { id: "user-1" } },
    }),
}));

describe("PlanScreen", () => {
  it("renders empty state when no plans", () => {
    const { getByText } = render(<PlanScreen />);
    expect(getByText("plan.title")).toBeTruthy();
    expect(getByText("plan.empty")).toBeTruthy();
    expect(getByText("plan.createFirst")).toBeTruthy();
  });

  it("renders create button", () => {
    const { getByText } = render(<PlanScreen />);
    expect(getByText("plan.create")).toBeTruthy();
  });
});
