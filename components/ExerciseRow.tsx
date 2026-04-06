import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "./ui/Card";
import { colors, spacing } from "@/lib/constants";
import type { Exercise } from "@/lib/types";

interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  onPress?: () => void;
  isActive?: boolean;
}

function formatDuration(seconds: number): string {
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  return `${seconds}s`;
}

export function ExerciseRow({
  exercise,
  index,
  onPress,
  isActive = false,
}: ExerciseRowProps) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <Card
        style={[styles.card, isActive && styles.activeCard]}
      >
        <View style={styles.row}>
          <View
            style={[styles.indexBadge, isActive && styles.activeIndexBadge]}
          >
            <Text
              style={[styles.indexText, isActive && styles.activeIndexText]}
            >
              {index + 1}
            </Text>
          </View>

          <View style={styles.info}>
            <Text style={[styles.name, isActive && styles.activeName]}>
              {exercise.name}
            </Text>
            <View style={styles.details}>
              <Text style={styles.duration}>
                {formatDuration(exercise.duration_seconds)}
              </Text>
              {exercise.sides > 1 && (
                <Text style={styles.sides}>
                  {t("plan.sidesCount", { count: exercise.sides })}
                </Text>
              )}
            </View>
            {exercise.notes ? (
              <Text style={styles.notes} numberOfLines={1}>
                {exercise.notes}
              </Text>
            ) : null}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    minHeight: 44,
  },
  card: {
    marginBottom: spacing.xs,
  },
  activeCard: {
    borderColor: colors.primaryMid,
    borderWidth: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  indexBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  activeIndexBadge: {
    backgroundColor: colors.primaryMid,
  },
  indexText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  activeIndexText: {
    color: colors.white,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  activeName: {
    color: colors.primary,
  },
  details: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  duration: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  sides: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  notes: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
});
