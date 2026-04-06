import React from "react";
import { render } from "@testing-library/react-native";
import GroupScreen from "./group";

jest.mock("expo-router");
jest.mock("@/lib/supabase");

jest.mock("@/stores/authStore", () => ({
  useAuthStore: jest.fn((selector) =>
    selector({
      session: { user: { id: "user-1" } },
    }),
  ),
}));

jest.mock("@/stores/groupStore", () => ({
  useGroupStore: jest.fn((selector) =>
    selector({
      currentGroup: {
        id: "group-1",
        name: "Family Yoga",
        invite_code: "abc123",
        created_by: "user-1",
        created_at: "2024-01-01",
      },
      members: [
        {
          id: "member-1",
          group_id: "group-1",
          user_id: "user-1",
          role: "admin",
          joined_at: "2024-01-01",
          profiles: {
            id: "user-1",
            display_name: "John Doe",
            avatar_url: null,
            expo_push_token: null,
            created_at: "2024-01-01",
          },
        },
      ],
      loading: false,
      error: null,
      joinGroupByCode: jest.fn(),
      createGroup: jest.fn(),
      fetchMembers: jest.fn(),
    }),
  ),
}));

jest.mock("@/stores/checkinStore", () => ({
  useCheckinStore: jest.fn((selector) =>
    selector({
      hasUserCheckedIn: () => false,
    }),
  ),
}));

describe("GroupScreen", () => {
  it("renders group name", () => {
    const { getByText } = render(<GroupScreen />);
    expect(getByText("Family Yoga")).toBeTruthy();
  });

  it("renders member name", () => {
    const { getByText } = render(<GroupScreen />);
    expect(getByText("John Doe")).toBeTruthy();
  });

  it("renders invite code", () => {
    const { getByText } = render(<GroupScreen />);
    expect(getByText("abc123")).toBeTruthy();
  });
});
