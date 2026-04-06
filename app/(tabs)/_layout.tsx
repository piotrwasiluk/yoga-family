import React from "react";
import { Text } from "react-native";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors } from "@/lib/constants";

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="group"
        options={{
          title: t("tabs.group"),
          tabBarIcon: ({ color }) => <TabIcon name="group" color={color} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: t("tabs.plan"),
          tabBarIcon: ({ color }) => <TabIcon name="plan" color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: t("tabs.alerts"),
          tabBarIcon: ({ color }) => <TabIcon name="alerts" color={color} />,
        }}
      />
    </Tabs>
  );
}

// Simple text-based tab icons (can replace with expo/vector-icons later)
function TabIcon({ name, color }: { name: string; color: string }) {
  const icons: Record<string, string> = {
    home: "\u2302",
    group: "\u263A",
    plan: "\u2637",
    alerts: "\u266A",
  };

  return <Text style={{ fontSize: 20, color }}>{icons[name] ?? "?"}</Text>;
}
