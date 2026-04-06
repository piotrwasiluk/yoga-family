import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { colors, spacing } from "@/lib/constants";

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}

const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const THUMB_MARGIN = 3;

export function Toggle({ value, onValueChange, label }: ToggleProps) {
  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(
            value ? TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN : THUMB_MARGIN,
            { duration: 200 },
          ),
        },
      ],
    };
  }, [value]);

  const trackStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        value ? colors.primaryMid : colors.border,
        { duration: 200 },
      ),
    };
  }, [value]);

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={styles.container}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    marginRight: spacing.md,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: "center",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});
