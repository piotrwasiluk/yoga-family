import React from "react";
import { render } from "@testing-library/react-native";
import { StreakCard } from "./StreakCard";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
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
});
