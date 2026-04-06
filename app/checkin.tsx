import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import { useGroupStore } from "@/stores/groupStore";
import { useCheckinStore } from "@/stores/checkinStore";
import { colors, spacing, borderRadius } from "@/lib/constants";
import type { Feeling } from "@/lib/types";

const FEELINGS: Feeling[] = ["great", "good", "tough", "sore"];

export default function CheckinScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const currentGroup = useGroupStore((s) => s.currentGroup);
  const createCheckin = useCheckinStore((s) => s.createCheckin);
  const loading = useCheckinStore((s) => s.loading);

  const [feeling, setFeeling] = useState<Feeling>("great");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    if (!session?.user?.id || !currentGroup?.id) return;

    await createCheckin(session.user.id, currentGroup.id, feeling, notes || undefined);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t("checkin.title")}</Text>

        <View style={styles.feelingRow}>
          {FEELINGS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFeeling(f)}
              style={[
                styles.feelingButton,
                {
                  backgroundColor: feeling === f ? `${colors.feeling[f]}20` : colors.surface,
                  borderColor: feeling === f ? colors.feeling[f] : colors.border,
                },
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: feeling === f }}
            >
              <Text
                style={[
                  styles.feelingText,
                  { color: feeling === f ? colors.feeling[f] : colors.textSecondary },
                ]}
              >
                {t(`checkin.feeling.${f}`)}
              </Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          style={styles.notesInput}
          placeholder={t("checkin.notesPlaceholder")}
          placeholderTextColor={colors.textSecondary}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          testID="notes-input"
        />

        <Button label={t("checkin.submit")} onPress={handleSubmit} loading={loading} />

        <Button label={t("common.cancel")} onPress={() => router.back()} variant="outline" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
    gap: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  feelingRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
  feelingButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  feelingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
    minHeight: 80,
  },
});
