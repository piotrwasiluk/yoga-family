import React from "react";
import { View } from "react-native";
import type { ReactNode } from "react";

export function SafeAreaProvider({ children }: { children: ReactNode }) {
  return <View>{children}</View>;
}

export function SafeAreaView({ children, ...props }: { children: ReactNode; style?: object }) {
  return <View {...props}>{children}</View>;
}

export function useSafeAreaInsets() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
