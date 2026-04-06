import React, { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing, borderRadius } from "@/lib/constants";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
}

function parseTime(value: string): { hours: number; minutes: number } {
  const parts = value.split(":");
  return {
    hours: parseInt(parts[0] ?? "0", 10) || 0,
    minutes: parseInt(parts[1] ?? "0", 10) || 0,
  };
}

function formatTime(hours: number, minutes: number): string {
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function formatDisplay(hours: number, minutes: number): string {
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function TimePicker({ value, onChange, label }: TimePickerProps) {
  const { hours, minutes } = parseTime(value);

  const incrementHour = useCallback(() => {
    const newHours = (hours + 1) % 24;
    onChange(formatTime(newHours, minutes));
  }, [hours, minutes, onChange]);

  const decrementHour = useCallback(() => {
    const newHours = (hours - 1 + 24) % 24;
    onChange(formatTime(newHours, minutes));
  }, [hours, minutes, onChange]);

  const incrementMinutes = useCallback(() => {
    const newMinutes = (minutes + 15) % 60;
    onChange(formatTime(hours, newMinutes));
  }, [hours, minutes, onChange]);

  const decrementMinutes = useCallback(() => {
    const newMinutes = (minutes - 15 + 60) % 60;
    onChange(formatTime(hours, newMinutes));
  }, [hours, minutes, onChange]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerRow}>
        <View style={styles.column}>
          <Pressable
            onPress={incrementHour}
            style={styles.arrowButton}
            accessibilityLabel="Increase hour"
          >
            <Text style={styles.arrow}>&#9650;</Text>
          </Pressable>
          <Text style={styles.value}>
            {formatDisplay(hours, minutes).split(":")[0]}
          </Text>
          <Pressable
            onPress={decrementHour}
            style={styles.arrowButton}
            accessibilityLabel="Decrease hour"
          >
            <Text style={styles.arrow}>&#9660;</Text>
          </Pressable>
        </View>

        <Text style={styles.separator}>:</Text>

        <View style={styles.column}>
          <Pressable
            onPress={incrementMinutes}
            style={styles.arrowButton}
            accessibilityLabel="Increase minutes"
          >
            <Text style={styles.arrow}>&#9650;</Text>
          </Pressable>
          <Text style={styles.value}>
            {minutes.toString().padStart(2, "0")}
          </Text>
          <Pressable
            onPress={decrementMinutes}
            style={styles.arrowButton}
            accessibilityLabel="Decrease minutes"
          >
            <Text style={styles.arrow}>&#9660;</Text>
          </Pressable>
        </View>

        <Text style={styles.period}>{hours >= 12 ? "PM" : "AM"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  column: {
    alignItems: "center",
    gap: spacing.xs,
  },
  arrowButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  arrow: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    minWidth: 40,
    textAlign: "center",
  },
  separator: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  period: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primaryMid,
    marginLeft: spacing.sm,
  },
});
