import React from "react";
import { render } from "@testing-library/react-native";
import { WeeklyHeatmap } from "./WeeklyHeatmap";
import type { GroupMemberWithProfile, Checkin } from "@/lib/types";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "heatmap.title": "Weekly Activity",
      };
      return translations[key] ?? key;
    },
  }),
}));

const mockMember: GroupMemberWithProfile = {
  id: "member-1",
  group_id: "group-1",
  user_id: "user-1",
  role: "admin",
  joined_at: "2024-01-01",
  profiles: {
    id: "user-1",
    display_name: "Test User",
    avatar_url: null,
    expo_push_token: null,
    created_at: "2024-01-01",
  },
};

describe("WeeklyHeatmap", () => {
  it("renders title", () => {
    const { getByText } = render(
      <WeeklyHeatmap members={[mockMember]} checkins={[]} />,
    );
    expect(getByText("Weekly Activity")).toBeTruthy();
  });

  it("renders member name", () => {
    const { getByText } = render(
      <WeeklyHeatmap members={[mockMember]} checkins={[]} />,
    );
    expect(getByText("Test User")).toBeTruthy();
  });

  it("renders with empty members", () => {
    const { getByText } = render(
      <WeeklyHeatmap members={[]} checkins={[]} />,
    );
    expect(getByText("Weekly Activity")).toBeTruthy();
  });

  it("renders multiple members", () => {
    const member2: GroupMemberWithProfile = {
      ...mockMember,
      id: "member-2",
      user_id: "user-2",
      profiles: {
        ...mockMember.profiles,
        id: "user-2",
        display_name: "User Two",
      },
    };
    const { getByText } = render(
      <WeeklyHeatmap members={[mockMember, member2]} checkins={[]} />,
    );
    expect(getByText("Test User")).toBeTruthy();
    expect(getByText("User Two")).toBeTruthy();
  });
});
