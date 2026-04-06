import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "./ui/Card";
import { colors, spacing } from "@/lib/constants";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.streakItem}>
          <Text style={styles.number}>{currentStreak}</Text>
          <Text style={styles.label}>{t("home.currentStreak")}</Text>
          <Text style={styles.unit}>{t("home.days")}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.streakItem}>
          <Text style={styles.number}>{longestStreak}</Text>
          <Text style={styles.label}>{t("home.longestStreak")}</Text>
          <Text style={styles.unit}>{t("home.days")}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakItem: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
  },
  number: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primary,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  unit: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: colors.border,
  },
});
