import { useGroupStore } from "./groupStore";
import type { Group, GroupMemberWithProfile, Streak, Checkin } from "@/lib/types";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

const mockGroup: Group = {
  id: "group-1",
  name: "Family Yoga",
  invite_code: "abc123",
  created_by: "user-1",
  created_at: "2024-01-01",
};

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

const mockStreak: Streak = {
  user_id: "user-1",
  group_id: "group-1",
  current_streak: 5,
  longest_streak: 10,
  last_checkin_date: "2024-01-05",
};

const mockCheckin: Checkin = {
  id: "checkin-1",
  user_id: "user-1",
  group_id: "group-1",
  checked_in_at: "2024-01-01T10:00:00Z",
  feeling: "great",
  notes: null,
  date: "2024-01-01",
};

describe("groupStore", () => {
  beforeEach(() => {
    useGroupStore.setState({
      currentGroup: null,
      members: [],
      streak: null,
      weeklyCheckins: [],
      loading: false,
      error: null,
    });
  });

  it("should have correct initial state", () => {
    const state = useGroupStore.getState();
    expect(state.currentGroup).toBeNull();
    expect(state.members).toEqual([]);
    expect(state.streak).toBeNull();
    expect(state.weeklyCheckins).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should set current group", () => {
    useGroupStore.getState().setCurrentGroup(mockGroup);
    expect(useGroupStore.getState().currentGroup).toEqual(mockGroup);
  });

  it("should set members", () => {
    useGroupStore.getState().setMembers([mockMember]);
    expect(useGroupStore.getState().members).toEqual([mockMember]);
  });

  it("should set loading", () => {
    useGroupStore.getState().setLoading(true);
    expect(useGroupStore.getState().loading).toBe(true);
  });

  it("should set error", () => {
    useGroupStore.getState().setError("Group not found");
    expect(useGroupStore.getState().error).toBe("Group not found");
  });

  it("should reset state", () => {
    useGroupStore.getState().setCurrentGroup(mockGroup);
    useGroupStore.getState().setMembers([mockMember]);
    useGroupStore.getState().reset();

    const state = useGroupStore.getState();
    expect(state.currentGroup).toBeNull();
    expect(state.members).toEqual([]);
    expect(state.streak).toBeNull();
    expect(state.weeklyCheckins).toEqual([]);
  });

  it("should store streak data", () => {
    useGroupStore.setState({ streak: mockStreak });
    expect(useGroupStore.getState().streak).toEqual(mockStreak);
  });

  it("should store weekly checkins", () => {
    useGroupStore.setState({ weeklyCheckins: [mockCheckin] });
    expect(useGroupStore.getState().weeklyCheckins).toEqual([mockCheckin]);
  });
});
