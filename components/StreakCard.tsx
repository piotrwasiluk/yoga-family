import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { Card } from "./ui/Card";
import { colors, spacing } from "@/lib/constants";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  const { t } = useTranslation();
  const flameScale = useSharedValue(1);

  useEffect(() => {
    if (currentStreak >= 3) {
      flameScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else {
      flameScale.value = withTiming(1, { duration: 200 });
    }
  }, [currentStreak, flameScale]);

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
    opacity: currentStreak >= 3 ? 1 : 0,
  }));

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.streakItem}>
          <View style={styles.numberRow}>
            <Text style={styles.number}>{currentStreak}</Text>
            <Animated.View style={flameStyle}>
              <Text style={styles.flame}>&#128293;</Text>
            </Animated.View>
          </View>
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
  numberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  number: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primary,
  },
  flame: {
    fontSize: 24,
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
