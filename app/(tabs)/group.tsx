import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useGroupStore } from "@/stores/groupStore";
import { useCheckinStore } from "@/stores/checkinStore";
import { useAuthStore } from "@/stores/authStore";
import { colors, spacing, borderRadius } from "@/lib/constants";

export default function GroupScreen() {
  const { t } = useTranslation();
  const session = useAuthStore((s) => s.session);
  const currentGroup = useGroupStore((s) => s.currentGroup);
  const members = useGroupStore((s) => s.members);
  const loading = useGroupStore((s) => s.loading);
  const error = useGroupStore((s) => s.error);
  const joinGroupByCode = useGroupStore((s) => s.joinGroupByCode);
  const createGroup = useGroupStore((s) => s.createGroup);
  const hasUserCheckedIn = useCheckinStore((s) => s.hasUserCheckedIn);

  const [inviteCode, setInviteCode] = useState("");
  const [groupName, setGroupName] = useState("");

  const handleShareInvite = useCallback(async () => {
    if (!currentGroup?.invite_code) return;

    await Share.share({
      message: `Join my FlexTrack group! Use invite code: ${currentGroup.invite_code}`,
    });
  }, [currentGroup?.invite_code]);

  const handleJoinGroup = useCallback(async () => {
    if (!inviteCode.trim() || !session?.user?.id) return;
    const success = await joinGroupByCode(session.user.id, inviteCode.trim());
    if (success) {
      setInviteCode("");
    }
  }, [inviteCode, session?.user?.id, joinGroupByCode]);

  const handleCreateGroup = useCallback(async () => {
    if (!groupName.trim() || !session?.user?.id) return;
    const success = await createGroup(session.user.id, groupName.trim());
    if (success) {
      setGroupName("");
    }
  }, [groupName, session?.user?.id, createGroup]);

  // Join/Create flow when no group
  if (!currentGroup) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.joinContent}>
          <Text style={styles.joinTitle}>{t("group.noGroupYet")}</Text>

          <Card style={styles.joinCard}>
            <Text style={styles.joinCardTitle}>{t("group.joinByCode")}</Text>
            <TextInput
              style={styles.input}
              value={inviteCode}
              onChangeText={setInviteCode}
              placeholder={t("group.enterCode")}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
            />
            <Button
              label={loading ? t("common.loading") : t("group.join")}
              onPress={handleJoinGroup}
              disabled={!inviteCode.trim() || loading}
            />
          </Card>

          <Text style={styles.orText}>{t("group.orCreateNew")}</Text>

          <Card style={styles.joinCard}>
            <Text style={styles.joinCardTitle}>{t("group.createGroup")}</Text>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder={t("group.enterGroupName")}
              placeholderTextColor={colors.textSecondary}
            />
            <Button
              label={loading ? t("common.loading") : t("group.create")}
              onPress={handleCreateGroup}
              disabled={!groupName.trim() || loading}
            />
          </Card>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </ScrollView>
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
          <Text style={styles.inviteCodeText}>{currentGroup.invite_code}</Text>
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
  inviteCodeText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 4,
  },
  // Join/Create styles
  joinContent: {
    padding: spacing.lg,
    gap: spacing.lg,
    justifyContent: "center",
    flexGrow: 1,
  },
  joinTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  joinCard: {
    gap: spacing.md,
  },
  joinCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  orText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: colors.feeling.sore,
    textAlign: "center",
  },
});
