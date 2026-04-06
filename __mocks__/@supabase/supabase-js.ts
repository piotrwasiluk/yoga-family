const mockAuth = {
  signInWithPassword: jest.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
  signUp: jest.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
  signOut: jest.fn().mockResolvedValue({ error: null }),
  getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
  getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
  onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
};

const mockFrom = jest.fn().mockReturnValue({
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: null, error: null }),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
});

const mockChannel = {
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn().mockReturnThis(),
  unsubscribe: jest.fn(),
};

export const createClient = jest.fn().mockReturnValue({
  auth: mockAuth,
  from: mockFrom,
  channel: jest.fn().mockReturnValue(mockChannel),
  removeChannel: jest.fn(),
});
