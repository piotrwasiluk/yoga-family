import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CheckinScreen from "./checkin";

jest.mock("expo-router");
jest.mock("expo-haptics");
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
      currentGroup: { id: "group-1" },
    }),
  ),
}));

const mockCreateCheckin = jest.fn().mockResolvedValue(undefined);
jest.mock("@/stores/checkinStore", () => ({
  useCheckinStore: jest.fn((selector) =>
    selector({
      createCheckin: mockCreateCheckin,
      loading: false,
    }),
  ),
}));

describe("CheckinScreen", () => {
  beforeEach(() => {
    mockCreateCheckin.mockClear();
  });

  it("renders feeling options", () => {
    const { getByText } = render(<CheckinScreen />);
    expect(getByText("checkin.feeling.great")).toBeTruthy();
    expect(getByText("checkin.feeling.good")).toBeTruthy();
    expect(getByText("checkin.feeling.tough")).toBeTruthy();
    expect(getByText("checkin.feeling.sore")).toBeTruthy();
  });

  it("renders check-in button", () => {
    const { getByText } = render(<CheckinScreen />);
    expect(getByText("checkin.submit")).toBeTruthy();
  });

  it("renders notes input", () => {
    const { getByTestId } = render(<CheckinScreen />);
    expect(getByTestId("notes-input")).toBeTruthy();
  });
});
