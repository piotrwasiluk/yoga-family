import React, { useEffect, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Toggle } from "@/components/ui/Toggle";
import { TimePicker } from "@/components/ui/TimePicker";
import { Card } from "@/components/ui/Card";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/authStore";
import { useGroupStore } from "@/stores/groupStore";
import { colors, spacing } from "@/lib/constants";

export default function AlertsScreen() {
  const { t } = useTranslation();
  const session = useAuthStore((s) => s.session);
  const currentGroup = useGroupStore((s) => s.currentGroup);
  const settings = useNotificationStore((s) => s.settings);
  const fetchSettings = useNotificationStore((s) => s.fetchSettings);
  const upsertSettings = useNotificationStore((s) => s.upsertSettings);

  useEffect(() => {
    if (session?.user?.id && currentGroup?.id) {
      fetchSettings(session.user.id, currentGroup.id);
    }
  }, [session?.user?.id, currentGroup?.id, fetchSettings]);

  const handleToggle = useCallback(
    (
      key:
        | "daily_reminder_enabled"
        | "group_summary_enabled"
        | "member_checkin_enabled",
      value: boolean,
    ) => {
      if (!session?.user?.id || !currentGroup?.id) return;
      upsertSettings(session.user.id, currentGroup.id, { [key]: value });
    },
    [session?.user?.id, currentGroup?.id, upsertSettings],
  );

  const handleTimeChange = useCallback(
    (key: "daily_reminder_time" | "group_summary_time", value: string) => {
      if (!session?.user?.id || !currentGroup?.id) return;
      upsertSettings(session.user.id, currentGroup.id, { [key]: value });
    },
    [session?.user?.id, currentGroup?.id, upsertSettings],
  );

  if (!currentGroup) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.title}>{t("alerts.title")}</Text>
          <Text style={styles.emptyText}>{t("alerts.noGroup")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("alerts.title")}</Text>

        <Card style={styles.settingCard}>
          <Toggle
            value={settings?.daily_reminder_enabled ?? true}
            onValueChange={(v) => handleToggle("daily_reminder_enabled", v)}
            label={t("alerts.dailyReminder")}
          />
          <Text style={styles.settingDescription}>
            {t("alerts.dailyReminderDescription")}
          </Text>
          {(settings?.daily_reminder_enabled ?? true) && (
            <TimePicker
              value={settings?.daily_reminder_time ?? "20:00"}
              onChange={(v) => handleTimeChange("daily_reminder_time", v)}
              label={t("alerts.reminderTime")}
            />
          )}
        </Card>

        <Card style={styles.settingCard}>
          <Toggle
            value={settings?.group_summary_enabled ?? true}
            onValueChange={(v) => handleToggle("group_summary_enabled", v)}
            label={t("alerts.groupSummary")}
          />
          <Text style={styles.settingDescription}>
            {t("alerts.groupSummaryDescription")}
          </Text>
          {(settings?.group_summary_enabled ?? true) && (
            <TimePicker
              value={settings?.group_summary_time ?? "21:00"}
              onChange={(v) => handleTimeChange("group_summary_time", v)}
              label={t("alerts.summaryTime")}
            />
          )}
        </Card>

        <Card style={styles.settingCard}>
          <Toggle
            value={settings?.member_checkin_enabled ?? false}
            onValueChange={(v) => handleToggle("member_checkin_enabled", v)}
            label={t("alerts.memberCheckin")}
          />
          <Text style={styles.settingDescription}>
            {t("alerts.memberCheckinDescription")}
          </Text>
        </Card>
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  settingCard: {
    gap: spacing.sm,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
