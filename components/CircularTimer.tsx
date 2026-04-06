import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  interpolateColor,
} from "react-native-reanimated";
import { colors } from "@/lib/constants";

interface CircularTimerProps {
  duration: number;
  elapsed: number;
  size?: number;
  strokeWidth?: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function CircularTimer({
  duration,
  elapsed,
  size = 200,
  strokeWidth = 12,
}: CircularTimerProps) {
  const remaining = Math.max(0, duration - elapsed);
  const progress = duration > 0 ? elapsed / duration : 0;

  const animatedProgress = useDerivedValue(() => {
    return withTiming(progress, { duration: 300 });
  }, [progress]);

  const progressColor = useDerivedValue(() => {
    return interpolateColor(
      animatedProgress.value,
      [0, 0.6, 0.85, 1],
      [colors.primaryMid, colors.primaryMid, colors.feeling.tough, colors.feeling.sore],
    );
  }, [animatedProgress]);

  // First half rotation (0-180 degrees)
  const firstHalfStyle = useAnimatedStyle(() => {
    const rotation = Math.min(animatedProgress.value * 360, 180);
    return {
      transform: [{ rotate: `${rotation}deg` }],
      backgroundColor: progressColor.value,
    };
  });

  // Second half rotation (180-360 degrees)
  const secondHalfStyle = useAnimatedStyle(() => {
    const rotation = Math.max(0, animatedProgress.value * 360 - 180);
    return {
      transform: [{ rotate: `${rotation}deg` }],
      backgroundColor: progressColor.value,
    };
  });

  // Show second half only when past 50%
  const secondHalfContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedProgress.value > 0.5 ? 1 : 0,
    };
  });

  const halfSize = size / 2;
  const innerSize = size - strokeWidth * 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background track */}
      <View
        style={[
          styles.track,
          {
            width: size,
            height: size,
            borderRadius: halfSize,
            borderWidth: strokeWidth,
          },
        ]}
      />

      {/* Progress ring - first half */}
      <View
        style={[
          styles.halfContainer,
          {
            width: halfSize,
            height: size,
            left: halfSize,
            borderTopRightRadius: halfSize,
            borderBottomRightRadius: halfSize,
            overflow: "hidden",
          },
        ]}
      >
        <Animated.View
          style={[
            {
              width: halfSize,
              height: size,
              borderTopRightRadius: halfSize,
              borderBottomRightRadius: halfSize,
              position: "absolute",
              left: 0,
              transformOrigin: "left center",
            },
            firstHalfStyle,
          ]}
        />
      </View>

      {/* Progress ring - second half */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: halfSize,
            height: size,
            left: 0,
            borderTopLeftRadius: halfSize,
            borderBottomLeftRadius: halfSize,
            overflow: "hidden",
          },
          secondHalfContainerStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: halfSize,
              height: size,
              borderTopLeftRadius: halfSize,
              borderBottomLeftRadius: halfSize,
              position: "absolute",
              right: 0,
              transformOrigin: "right center",
            },
            secondHalfStyle,
          ]}
        />
      </Animated.View>

      {/* Inner circle with time */}
      <View
        style={[
          styles.inner,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            top: strokeWidth,
            left: strokeWidth,
          },
        ]}
      >
        <Text style={styles.time}>{formatTime(remaining)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    position: "absolute",
    borderColor: colors.border,
  },
  halfContainer: {
    position: "absolute",
  },
  inner: {
    position: "absolute",
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.text,
  },
});
