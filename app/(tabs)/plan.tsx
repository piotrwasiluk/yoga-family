import React, { useEffect, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useAuthStore } from "@/stores/authStore";
import { colors, spacing } from "@/lib/constants";
import type { WorkoutPlan } from "@/lib/types";

export default function PlanScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const plans = useWorkoutStore((s) => s.plans);
  const loading = useWorkoutStore((s) => s.loading);
  const fetchPlans = useWorkoutStore((s) => s.fetchPlans);

  useEffect(() => {
    if (session?.user?.id) {
      fetchPlans(session.user.id);
    }
  }, [session?.user?.id, fetchPlans]);

  const handleCreatePlan = useCallback(() => {
    router.push("/plan/create");
  }, [router]);

  const handlePlanPress = useCallback(
    (planId: string) => {
      router.push(`/plan/${planId}`);
    },
    [router],
  );

  const renderPlan = useCallback(
    ({ item }: { item: WorkoutPlan }) => (
      <Pressable
        onPress={() => handlePlanPress(item.id)}
        style={styles.planPressable}
      >
        <Card style={styles.planCard}>
          <Text style={styles.planName}>{item.name}</Text>
          {item.description ? (
            <Text style={styles.planDescription} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </Card>
      </Pressable>
    ),
    [handlePlanPress],
  );

  if (plans.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("plan.title")}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>{t("plan.empty")}</Text>
          <Text style={styles.emptySubtitle}>{t("plan.createFirst")}</Text>
          <Button label={t("plan.create")} onPress={handleCreatePlan} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("plan.title")}</Text>
        <Button
          label={t("plan.create")}
          onPress={handleCreatePlan}
          variant="outline"
        />
      </View>
      <FlashList
        data={plans}
        renderItem={renderPlan}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  planPressable: {
    minHeight: 44,
  },
  planCard: {
    marginBottom: spacing.sm,
  },
  planName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  planDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
});
