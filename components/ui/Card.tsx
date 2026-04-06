import React from "react";
import { View, StyleSheet } from "react-native";
import type { ReactNode } from "react";
import { colors, borderRadius, spacing } from "@/lib/constants";

interface CardProps {
  children: ReactNode;
  style?: object;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
