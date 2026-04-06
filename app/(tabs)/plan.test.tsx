import React from "react";
import { render } from "@testing-library/react-native";
import PlanScreen from "./plan";

jest.mock("expo-router");

describe("PlanScreen", () => {
  it("renders coming soon message", () => {
    const { getByText } = render(<PlanScreen />);
    expect(getByText("plan.title")).toBeTruthy();
    expect(getByText("plan.comingSoon")).toBeTruthy();
  });
});
