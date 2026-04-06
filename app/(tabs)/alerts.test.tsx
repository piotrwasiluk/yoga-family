import React from "react";
import { render } from "@testing-library/react-native";
import AlertsScreen from "./alerts";

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

jest.mock("expo-router");

jest.mock("@/stores/authStore", () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      session: { user: { id: "user-1" } },
    }),
}));

jest.mock("@/stores/groupStore", () => ({
  useGroupStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      currentGroup: { id: "group-1", name: "Family", invite_code: "abc", created_by: "user-1", created_at: "2024-01-01" },
    }),
}));

jest.mock("@/stores/notificationStore", () => ({
  useNotificationStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      settings: null,
      fetchSettings: jest.fn(),
      upsertSettings: jest.fn(),
    }),
}));

describe("AlertsScreen", () => {
  it("renders notification settings", () => {
    const { getByText } = render(<AlertsScreen />);
    expect(getByText("alerts.title")).toBeTruthy();
    expect(getByText("alerts.dailyReminder")).toBeTruthy();
    expect(getByText("alerts.groupSummary")).toBeTruthy();
    expect(getByText("alerts.memberCheckin")).toBeTruthy();
  });
});
