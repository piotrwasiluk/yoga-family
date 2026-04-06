import React from "react";
import { render } from "@testing-library/react-native";
import { StreakCard } from "./StreakCard";

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

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "home.currentStreak": "Current Streak",
        "home.longestStreak": "Longest Streak",
        "home.days": "days",
      };
      return translations[key] ?? key;
    },
  }),
}));

describe("StreakCard", () => {
  it("renders current streak", () => {
    const { getByText } = render(<StreakCard currentStreak={5} longestStreak={10} />);
    expect(getByText("5")).toBeTruthy();
    expect(getByText("Current Streak")).toBeTruthy();
  });

  it("renders longest streak", () => {
    const { getByText } = render(<StreakCard currentStreak={5} longestStreak={10} />);
    expect(getByText("10")).toBeTruthy();
    expect(getByText("Longest Streak")).toBeTruthy();
  });

  it("renders zero streaks", () => {
    const { getAllByText } = render(<StreakCard currentStreak={0} longestStreak={0} />);
    expect(getAllByText("0")).toHaveLength(2);
  });

  it("renders flame emoji for streaks >= 3", () => {
    const { getByText } = render(<StreakCard currentStreak={5} longestStreak={10} />);
    // Flame emoji should be rendered (U+1F525)
    expect(getByText("\u{1F525}")).toBeTruthy();
  });
});
