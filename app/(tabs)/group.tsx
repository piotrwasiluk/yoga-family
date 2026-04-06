import React, { useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useGroupStore } from "@/stores/groupStore";
import { useCheckinStore } from "@/stores/checkinStore";
import { colors, spacing } from "@/lib/constants";

export default function GroupScreen() {
  const { t } = useTranslation();
  const currentGroup = useGroupStore((s) => s.currentGroup);
  const members = useGroupStore((s) => s.members);
  const hasUserCheckedIn = useCheckinStore((s) => s.hasUserCheckedIn);

  const handleShareInvite = useCallback(async () => {
    if (!currentGroup?.invite_code) return;

    await Share.share({
      message: `Join my FlexTrack group! Use invite code: ${currentGroup.invite_code}`,
    });
  }, [currentGroup?.invite_code]);

  if (!currentGroup) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t("group.noGroup")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.groupName}>{currentGroup.name}</Text>
          <Button
            label={t("group.invite")}
            onPress={handleShareInvite}
            variant="outline"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("group.members")} ({members.length})
          </Text>

          {members.map((member) => {
            const checkedIn = hasUserCheckedIn(member.user_id);
            return (
              <Card key={member.id} style={styles.memberCard}>
                <View style={styles.memberRow}>
                  <Avatar
                    name={member.profiles.display_name}
                    imageUrl={member.profiles.avatar_url}
                    size={44}
                  />
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.profiles.display_name}
                    </Text>
                    <Badge
                      label={checkedIn ? t("group.completedToday") : t("group.notCompletedToday")}
                      color={checkedIn ? colors.primaryMid : colors.textSecondary}
                    />
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        <Card style={styles.inviteCard}>
          <Text style={styles.inviteLabel}>{t("group.inviteCode")}</Text>
          <Text style={styles.inviteCode}>{currentGroup.invite_code}</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  memberCard: {
    marginBottom: spacing.xs,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  memberInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  inviteCard: {
    alignItems: "center",
    gap: spacing.sm,
  },
  inviteLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  inviteCode: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
