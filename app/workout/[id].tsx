import React, { useEffect, useCallback, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { Button } from "@/components/ui/Button";
import { CircularTimer } from "@/components/CircularTimer";
import { ExerciseRow } from "@/components/ExerciseRow";
import { useWorkoutStore } from "@/stores/workoutStore";
import { colors, spacing } from "@/lib/constants";

interface WorkoutState {
  exerciseIndex: number;
  side: number;
  elapsed: number;
  paused: boolean;
  completed: boolean;
}

export default function WorkoutScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercises = useWorkoutStore((s) => s.exercises);
  const currentPlan = useWorkoutStore((s) => s.currentPlan);
  const fetchPlanWithExercises = useWorkoutStore((s) => s.fetchPlanWithExercises);

  const [state, setState] = useState<WorkoutState>({
    exerciseIndex: 0,
    side: 1,
    elapsed: 0,
    paused: false,
    completed: false,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (id) {
      fetchPlanWithExercises(id);
    }
  }, [id, fetchPlanWithExercises]);

  const currentExercise = exercises[state.exerciseIndex];

  const advanceToNext = useCallback(() => {
    setState((prev) => {
      const exercise = exercises[prev.exerciseIndex];
      if (!exercise) return { ...prev, completed: true };

      // More sides to do?
      if (prev.side < exercise.sides) {
        return { ...prev, side: prev.side + 1, elapsed: 0 };
      }

      // More exercises?
      if (prev.exerciseIndex < exercises.length - 1) {
        return { ...prev, exerciseIndex: prev.exerciseIndex + 1, side: 1, elapsed: 0 };
      }

      // Workout complete
      return { ...prev, completed: true };
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [exercises]);

  // Timer tick
  useEffect(() => {
    if (state.paused || state.completed || !currentExercise) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setState((prev) => {
        const nextElapsed = prev.elapsed + 1;
        const exercise = exercises[prev.exerciseIndex];
        if (exercise && nextElapsed >= exercise.duration_seconds) {
          return prev; // Will be handled by advanceToNext effect
        }
        return { ...prev, elapsed: nextElapsed };
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.paused, state.completed, state.exerciseIndex, state.side, currentExercise, exercises]);

  // Auto-advance when timer completes
  useEffect(() => {
    if (
      currentExercise &&
      state.elapsed >= currentExercise.duration_seconds &&
      !state.paused &&
      !state.completed
    ) {
      advanceToNext();
    }
  }, [state.elapsed, state.paused, state.completed, currentExercise, advanceToNext]);

  const togglePause = useCallback(() => {
    setState((prev) => ({ ...prev, paused: !prev.paused }));
  }, []);

  const handleSkip = useCallback(() => {
    advanceToNext();
  }, [advanceToNext]);

  const handleCheckin = useCallback(() => {
    router.replace("/checkin");
  }, [router]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  // Completion screen
  if (state.completed) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedTitle}>{t("workout.congratulations")}</Text>
          <Text style={styles.completedSubtitle}>{currentPlan?.name}</Text>
          <View style={styles.completedActions}>
            <Button label={t("workout.checkInNow")} onPress={handleCheckin} />
            <Button
              label={t("workout.goBack")}
              onPress={handleGoBack}
              variant="outline"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentExercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t("common.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sideLabel =
    currentExercise.sides > 1
      ? currentExercise.sides === 2
        ? state.side === 1
          ? t("workout.leftSide")
          : t("workout.rightSide")
        : t("workout.side", { current: state.side, total: currentExercise.sides })
      : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.progressText}>
          {t("workout.exerciseOf", {
            current: state.exerciseIndex + 1,
            total: exercises.length,
          })}
        </Text>

        <View style={styles.timerSection}>
          <CircularTimer
            duration={currentExercise.duration_seconds}
            elapsed={state.elapsed}
            size={220}
          />
          <Text style={styles.exerciseName}>{currentExercise.name}</Text>
          {sideLabel ? <Text style={styles.sideLabel}>{sideLabel}</Text> : null}
        </View>

        <View style={styles.controls}>
          <Button
            label={state.paused ? t("workout.resume") : t("workout.pause")}
            onPress={togglePause}
          />
          <Button
            label={t("workout.skip")}
            onPress={handleSkip}
            variant="outline"
          />
        </View>

        <View style={styles.exerciseList}>
          {exercises.map((exercise, index) => (
            <ExerciseRow
              key={exercise.id}
              exercise={exercise}
              index={index}
              isActive={index === state.exerciseIndex}
            />
          ))}
        </View>
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
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  timerSection: {
    alignItems: "center",
    gap: spacing.md,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  sideLabel: {
    fontSize: 16,
    color: colors.primaryMid,
    fontWeight: "600",
  },
  controls: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
  },
  exerciseList: {
    width: "100%",
    gap: spacing.xs,
  },
  completedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.lg,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
  },
  completedSubtitle: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  completedActions: {
    gap: spacing.md,
    width: "100%",
    marginTop: spacing.lg,
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
