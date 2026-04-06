import { useAuthStore } from "./authStore";

// Mock the supabase client
jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      session: null,
      profile: null,
      loading: true,
      error: null,
    });
  });

  it("should have correct initial state", () => {
    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("should set session", () => {
    const mockSession = { access_token: "test", user: { id: "1" } };
    useAuthStore.getState().setSession(mockSession as never);
    expect(useAuthStore.getState().session).toEqual(mockSession);
  });

  it("should set profile", () => {
    const mockProfile = {
      id: "1",
      display_name: "Test User",
      avatar_url: null,
      expo_push_token: null,
      created_at: "2024-01-01",
    };
    useAuthStore.getState().setProfile(mockProfile);
    expect(useAuthStore.getState().profile).toEqual(mockProfile);
  });

  it("should set loading", () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it("should set error", () => {
    useAuthStore.getState().setError("Test error");
    expect(useAuthStore.getState().error).toBe("Test error");
  });

  it("should clear state on reset", () => {
    useAuthStore.getState().setSession({ access_token: "test" } as never);
    useAuthStore.getState().setProfile({
      id: "1",
      display_name: "Test",
      avatar_url: null,
      expo_push_token: null,
      created_at: "2024-01-01",
    });
    useAuthStore.getState().reset();

    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
