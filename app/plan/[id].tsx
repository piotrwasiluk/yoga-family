import React, { useEffect, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { ExerciseRow } from "@/components/ExerciseRow";
import { useWorkoutStore } from "@/stores/workoutStore";
import { colors, spacing } from "@/lib/constants";

export default function PlanDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentPlan = useWorkoutStore((s) => s.currentPlan);
  const exercises = useWorkoutStore((s) => s.exercises);
  const loading = useWorkoutStore((s) => s.loading);
  const fetchPlanWithExercises = useWorkoutStore((s) => s.fetchPlanWithExercises);
  const deletePlan = useWorkoutStore((s) => s.deletePlan);

  useEffect(() => {
    if (id) {
      fetchPlanWithExercises(id);
    }
  }, [id, fetchPlanWithExercises]);

  const handleStartWorkout = useCallback(() => {
    if (id) {
      router.push(`/workout/${id}`);
    }
  }, [id, router]);

  const handleDelete = useCallback(() => {
    Alert.alert(t("plan.deletePlan"), t("plan.confirmDelete"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          if (id) {
            await deletePlan(id);
            router.back();
          }
        },
      },
    ]);
  }, [id, deletePlan, router, t]);

  if (loading || !currentPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t("common.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{currentPlan.name}</Text>
          {currentPlan.description ? (
            <Text style={styles.description}>{currentPlan.description}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("plan.exercises")} ({exercises.length})
          </Text>

          {exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <ExerciseRow
                key={exercise.id}
                exercise={exercise}
                index={index}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>{t("plan.noExercises")}</Text>
          )}
        </View>

        {exercises.length > 0 && (
          <Button
            label={t("plan.startWorkout")}
            onPress={handleStartWorkout}
          />
        )}

        <Button
          label={t("plan.deletePlan")}
          onPress={handleDelete}
          variant="outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
