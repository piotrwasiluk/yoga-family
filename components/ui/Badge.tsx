import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, borderRadius, spacing } from "@/lib/constants";
import type { Feeling } from "@/lib/types";

interface BadgeProps {
  label: string;
  feeling?: Feeling;
  color?: string;
}

export function Badge({ label, feeling, color }: BadgeProps) {
  const bgColor = feeling ? colors.feeling[feeling] : color ?? colors.primaryMid;

  return (
    <View style={[styles.badge, { backgroundColor: `${bgColor}20` }]}>
      <Text style={[styles.text, { color: bgColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
