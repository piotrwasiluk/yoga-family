import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "./ui/Avatar";
import { colors, borderRadius, spacing } from "@/lib/constants";

interface MemberPillProps {
  name: string;
  avatarUrl?: string | null;
  checkedIn: boolean;
}

export function MemberPill({ name, avatarUrl, checkedIn }: MemberPillProps) {
  return (
    <View style={[styles.pill, checkedIn && styles.pillCheckedIn]}>
      <Avatar name={name} imageUrl={avatarUrl} size={28} />
      <Text style={[styles.name, checkedIn && styles.nameCheckedIn]} numberOfLines={1}>
        {name}
      </Text>
      {checkedIn && <Text style={styles.check}>&#10003;</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillCheckedIn: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryMid,
  },
  name: {
    fontSize: 14,
    color: colors.textSecondary,
    maxWidth: 100,
  },
  nameCheckedIn: {
    color: colors.primary,
    fontWeight: "500",
  },
  check: {
    color: colors.primaryMid,
    fontSize: 14,
    fontWeight: "700",
  },
});
