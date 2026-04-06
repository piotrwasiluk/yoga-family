import { useNotificationStore } from "./notificationStore";
import type { NotificationSettings } from "@/lib/types";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

const mockSettings: NotificationSettings = {
  id: "ns-1",
  user_id: "user-1",
  group_id: "group-1",
  daily_reminder_enabled: true,
  daily_reminder_time: "20:00",
  group_summary_enabled: true,
  group_summary_time: "21:00",
  member_checkin_enabled: false,
};

describe("notificationStore", () => {
  beforeEach(() => {
    useNotificationStore.setState({
      settings: null,
      loading: false,
      error: null,
    });
  });

  it("should have correct initial state", () => {
    const state = useNotificationStore.getState();
    expect(state.settings).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should set settings", () => {
    useNotificationStore.getState().setSettings(mockSettings);
    expect(useNotificationStore.getState().settings).toEqual(mockSettings);
  });

  it("should set loading", () => {
    useNotificationStore.getState().setLoading(true);
    expect(useNotificationStore.getState().loading).toBe(true);
  });

  it("should set error", () => {
    useNotificationStore.getState().setError("Network error");
    expect(useNotificationStore.getState().error).toBe("Network error");
  });

  it("should reset state", () => {
    useNotificationStore.getState().setSettings(mockSettings);
    useNotificationStore.getState().setLoading(true);
    useNotificationStore.getState().reset();

    const state = useNotificationStore.getState();
    expect(state.settings).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
