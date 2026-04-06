import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Avatar } from "./ui/Avatar";
import { Card } from "./ui/Card";
import { colors, spacing } from "@/lib/constants";
import type { GroupMemberWithProfile, Checkin } from "@/lib/types";

interface WeeklyHeatmapProps {
  members: GroupMemberWithProfile[];
  checkins: Checkin[];
  days?: number;
}

function getLast7Days(): string[] {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return labels[d.getDay()] ?? "";
}

export function WeeklyHeatmap({ members, checkins }: WeeklyHeatmapProps) {
  const { t } = useTranslation();
  const dates = useMemo(() => getLast7Days(), []);

  const checkinSet = useMemo(() => {
    const set = new Set<string>();
    for (const c of checkins) {
      set.add(`${c.user_id}-${c.date}`);
    }
    return set;
  }, [checkins]);

  return (
    <Card>
      <Text style={styles.title}>{t("heatmap.title")}</Text>

      {/* Day labels */}
      <View style={styles.headerRow}>
        <View style={styles.memberLabel} />
        {dates.map((date) => (
          <View key={date} style={styles.dayLabelCell}>
            <Text style={styles.dayLabel}>{getDayLabel(date)}</Text>
          </View>
        ))}
      </View>

      {/* Member rows */}
      {members.map((member) => (
        <View key={member.id} style={styles.memberRow}>
          <View style={styles.memberLabel}>
            <Avatar
              name={member.profiles.display_name}
              imageUrl={member.profiles.avatar_url}
              size={24}
            />
            <Text style={styles.memberName} numberOfLines={1}>
              {member.profiles.display_name}
            </Text>
          </View>
          {dates.map((date) => {
            const didCheckin = checkinSet.has(`${member.user_id}-${date}`);
            return (
              <View key={date} style={styles.cellContainer}>
                <View
                  style={[
                    styles.cell,
                    didCheckin ? styles.cellActive : styles.cellInactive,
                  ]}
                />
              </View>
            );
          })}
        </View>
      ))}
    </Card>
  );
}

const CELL_SIZE = 24;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  memberLabel: {
    width: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  dayLabelCell: {
    flex: 1,
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  memberName: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
  },
  cellContainer: {
    flex: 1,
    alignItems: "center",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 4,
  },
  cellActive: {
    backgroundColor: colors.primaryMid,
  },
  cellInactive: {
    backgroundColor: colors.surface,
  },
});
