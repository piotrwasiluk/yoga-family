import React from "react";
import { render } from "@testing-library/react-native";
import AlertsScreen from "./alerts";

jest.mock("expo-router");

describe("AlertsScreen", () => {
  it("renders coming soon message", () => {
    const { getByText } = render(<AlertsScreen />);
    expect(getByText("alerts.title")).toBeTruthy();
    expect(getByText("alerts.comingSoon")).toBeTruthy();
  });
});
