import { useCheckinStore } from "./checkinStore";
import type { Checkin } from "@/lib/types";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
    }),
    removeChannel: jest.fn(),
  },
}));

const mockCheckin: Checkin = {
  id: "checkin-1",
  user_id: "user-1",
  group_id: "group-1",
  checked_in_at: "2024-01-01T10:00:00Z",
  feeling: "great",
  notes: null,
  date: "2024-01-01",
};

describe("checkinStore", () => {
  beforeEach(() => {
    useCheckinStore.setState({
      todayCheckins: [],
      loading: false,
      error: null,
    });
  });

  it("should have correct initial state", () => {
    const state = useCheckinStore.getState();
    expect(state.todayCheckins).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should set today checkins", () => {
    useCheckinStore.getState().setTodayCheckins([mockCheckin]);
    expect(useCheckinStore.getState().todayCheckins).toEqual([mockCheckin]);
  });

  it("should add a checkin", () => {
    useCheckinStore.getState().addCheckin(mockCheckin);
    expect(useCheckinStore.getState().todayCheckins).toEqual([mockCheckin]);
  });

  it("should not add duplicate checkins", () => {
    useCheckinStore.getState().addCheckin(mockCheckin);
    useCheckinStore.getState().addCheckin(mockCheckin);
    expect(useCheckinStore.getState().todayCheckins).toHaveLength(1);
  });

  it("should check if a user has checked in today", () => {
    useCheckinStore.getState().setTodayCheckins([mockCheckin]);
    expect(useCheckinStore.getState().hasUserCheckedIn("user-1")).toBe(true);
    expect(useCheckinStore.getState().hasUserCheckedIn("user-2")).toBe(false);
  });

  it("should set loading", () => {
    useCheckinStore.getState().setLoading(true);
    expect(useCheckinStore.getState().loading).toBe(true);
  });

  it("should reset state", () => {
    useCheckinStore.getState().setTodayCheckins([mockCheckin]);
    useCheckinStore.getState().reset();

    const state = useCheckinStore.getState();
    expect(state.todayCheckins).toEqual([]);
  });
});
