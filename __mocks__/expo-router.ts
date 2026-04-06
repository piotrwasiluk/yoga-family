export const useRouter = jest.fn().mockReturnValue({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn().mockReturnValue(false),
});

export const useSegments = jest.fn().mockReturnValue([]);
export const useRootNavigationState = jest.fn().mockReturnValue({ key: "test" });
export const usePathname = jest.fn().mockReturnValue("/");
export const useLocalSearchParams = jest.fn().mockReturnValue({});

export const Link = "Link";
export const Redirect = "Redirect";
export const Stack = {
  Screen: "Stack.Screen",
};
export const Tabs = {
  Screen: "Tabs.Screen",
};
export const Slot = "Slot";

export function withLayoutContext<T>(component: T): T {
  return component;
}
