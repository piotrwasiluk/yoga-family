import React from "react";
import { render } from "@testing-library/react-native";
import HomeScreen from "./index";

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (component: unknown) => component,
    },
    useSharedValue: (val: unknown) => ({ value: val }),
    useAnimatedStyle: () => ({}),
    withTiming: (value: unknown) => value,
    withRepeat: (value: unknown) => value,
    withSequence: (...args: unknown[]) => args[0],
    Easing: {
      inOut: (fn: unknown) => fn,
      ease: 0,
    },
  };
});

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
    }),
    removeChannel: jest.fn(),
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

jest.mock("@/stores/authStore", () => ({
  useAuthStore: jest.fn((selector) =>
    selector({
      profile: { id: "1", display_name: "Test User" },
      session: { user: { id: "1" } },
    }),
  ),
}));

jest.mock("@/stores/groupStore", () => ({
  useGroupStore: jest.fn((selector) =>
    selector({
      currentGroup: null,
      members: [],
      streak: null,
      weeklyCheckins: [],
      fetchGroup: jest.fn(),
      fetchMembers: jest.fn(),
      fetchStreak: jest.fn(),
      fetchWeeklyCheckins: jest.fn(),
    }),
  ),
}));

jest.mock("@/stores/checkinStore", () => ({
  useCheckinStore: jest.fn((selector) =>
    selector({
      todayCheckins: [],
      fetchTodayCheckins: jest.fn(),
      addCheckin: jest.fn(),
      hasUserCheckedIn: () => false,
    }),
  ),
}));

describe("HomeScreen", () => {
  it("renders greeting with user name", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("home.greeting")).toBeTruthy();
  });

  it("renders mark done button when not checked in", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("home.markDone")).toBeTruthy();
  });
});
