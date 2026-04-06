import React from "react";
import { View } from "react-native";

export function Image(props: Record<string, unknown>) {
  return <View testID="expo-image" {...props} />;
}
