import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { StreakCard } from "@/components/StreakCard";
import { MemberPill } from "@/components/MemberPill";
import { useAuthStore } from "@/stores/authStore";
import { useGroupStore } from "@/stores/groupStore";
import { useCheckinStore } from "@/stores/checkinStore";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/lib/constants";
import type { Checkin } from "@/lib/types";

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const session = useAuthStore((s) => s.session);
  const currentGroup = useGroupStore((s) => s.currentGroup);
  const members = useGroupStore((s) => s.members);
  const fetchGroup = useGroupStore((s) => s.fetchGroup);
  const fetchMembers = useGroupStore((s) => s.fetchMembers);
  const fetchTodayCheckins = useCheckinStore((s) => s.fetchTodayCheckins);
  const addCheckin = useCheckinStore((s) => s.addCheckin);
  const hasUserCheckedIn = useCheckinStore((s) => s.hasUserCheckedIn);

  const userCheckedIn = session?.user?.id ? hasUserCheckedIn(session.user.id) : false;

  useEffect(() => {
    if (session?.user?.id) {
      fetchGroup(session.user.id);
    }
  }, [session?.user?.id, fetchGroup]);

  useEffect(() => {
    if (currentGroup?.id) {
      fetchMembers(currentGroup.id);
      fetchTodayCheckins(currentGroup.id);
    }
  }, [currentGroup?.id, fetchMembers, fetchTodayCheckins]);

  // Realtime subscription for check-ins
  useEffect(() => {
    if (!currentGroup?.id) return;

    const channel = supabase
      .channel(`checkins-${currentGroup.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "checkins",
          filter: `group_id=eq.${currentGroup.id}`,
        },
        (payload) => {
          addCheckin(payload.new as Checkin);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentGroup?.id, addCheckin]);

  const handleCheckin = () => {
    router.push("/checkin");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>
          {t("home.greeting", { name: profile?.display_name ?? "" })}
        </Text>

        <StreakCard currentStreak={0} longestStreak={0} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("home.todayStatus")}</Text>
          {members.length > 0 ? (
            <View style={styles.memberPills}>
              {members.map((member) => (
                <MemberPill
                  key={member.id}
                  name={member.profiles.display_name}
                  avatarUrl={member.profiles.avatar_url}
                  checkedIn={hasUserCheckedIn(member.user_id)}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>{t("home.noneCompleted")}</Text>
          )}
        </View>

        {!userCheckedIn && (
          <Button label={t("home.markDone")} onPress={handleCheckin} />
        )}
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
  greeting: {
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
  memberPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
