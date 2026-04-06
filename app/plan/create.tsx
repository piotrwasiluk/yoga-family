import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Card } from "@/components/ui/Card";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useAuthStore } from "@/stores/authStore";
import { colors, spacing, borderRadius } from "@/lib/constants";

interface ExerciseDraft {
  name: string;
  duration_seconds: number;
  sides: number;
  notes: string | null;
}

export default function CreatePlanScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const createPlan = useWorkoutStore((s) => s.createPlan);
  const addExercise = useWorkoutStore((s) => s.addExercise);
  const loading = useWorkoutStore((s) => s.loading);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [exercises, setExercises] = useState<ExerciseDraft[]>([]);

  const [exerciseName, setExerciseName] = useState("");
  const [exerciseDuration, setExerciseDuration] = useState("30");
  const [exerciseSides, setExerciseSides] = useState("1");
  const [exerciseNotes, setExerciseNotes] = useState("");

  const handleAddExercise = useCallback(() => {
    if (!exerciseName.trim()) return;

    setExercises((prev) => [
      ...prev,
      {
        name: exerciseName.trim(),
        duration_seconds: parseInt(exerciseDuration, 10) || 30,
        sides: parseInt(exerciseSides, 10) || 1,
        notes: exerciseNotes.trim() || null,
      },
    ]);

    setExerciseName("");
    setExerciseDuration("30");
    setExerciseSides("1");
    setExerciseNotes("");
  }, [exerciseName, exerciseDuration, exerciseSides, exerciseNotes]);

  const handleRemoveExercise = useCallback((index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(async () => {
    if (!name.trim() || !session?.user?.id) return;

    const plan = await createPlan(
      session.user.id,
      name.trim(),
      description.trim() || null,
      isPublic,
    );

    if (!plan) return;

    for (const exercise of exercises) {
      await addExercise(plan.id, exercise);
    }

    router.back();
  }, [
    name,
    description,
    isPublic,
    exercises,
    session?.user?.id,
    createPlan,
    addExercise,
    router,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("plan.create")}</Text>

        <View style={styles.field}>
          <Text style={styles.label}>{t("plan.planName")}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={t("plan.planNamePlaceholder")}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t("plan.description")}</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={description}
            onChangeText={setDescription}
            placeholder={t("plan.descriptionPlaceholder")}
            placeholderTextColor={colors.textSecondary}
            multiline
          />
        </View>

        <Toggle
          value={isPublic}
          onValueChange={setIsPublic}
          label={t("plan.isPublic")}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("plan.exercises")} ({exercises.length})
          </Text>

          {exercises.map((exercise, index) => (
            <Card key={`${exercise.name}-${index}`} style={styles.exerciseCard}>
              <View style={styles.exerciseRow}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>
                    {index + 1}. {exercise.name}
                  </Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.duration_seconds}s
                    {exercise.sides > 1
                      ? ` · ${t("plan.sidesCount", { count: exercise.sides })}`
                      : ""}
                  </Text>
                </View>
                <Button
                  label={t("common.delete")}
                  onPress={() => handleRemoveExercise(index)}
                  variant="outline"
                />
              </View>
            </Card>
          ))}
        </View>

        <Card style={styles.addExerciseCard}>
          <Text style={styles.sectionTitle}>{t("plan.addExercise")}</Text>

          <TextInput
            style={styles.input}
            value={exerciseName}
            onChangeText={setExerciseName}
            placeholder={t("plan.exerciseNamePlaceholder")}
            placeholderTextColor={colors.textSecondary}
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.smallLabel}>{t("plan.duration")}</Text>
              <TextInput
                style={styles.input}
                value={exerciseDuration}
                onChangeText={setExerciseDuration}
                keyboardType="number-pad"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.smallLabel}>{t("plan.sides")}</Text>
              <TextInput
                style={styles.input}
                value={exerciseSides}
                onChangeText={setExerciseSides}
                keyboardType="number-pad"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <TextInput
            style={styles.input}
            value={exerciseNotes}
            onChangeText={setExerciseNotes}
            placeholder={t("plan.notesPlaceholder")}
            placeholderTextColor={colors.textSecondary}
          />

          <Button
            label={t("plan.addExercise")}
            onPress={handleAddExercise}
            variant="outline"
          />
        </Card>

        <Button
          label={loading ? t("common.loading") : t("common.save")}
          onPress={handleSave}
          disabled={!name.trim() || loading}
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
    gap: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  smallLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  exerciseCard: {
    marginBottom: spacing.xs,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exerciseInfo: {
    flex: 1,
    gap: 2,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  exerciseDetails: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  addExerciseCard: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  halfField: {
    flex: 1,
    gap: spacing.xs,
  },
});
