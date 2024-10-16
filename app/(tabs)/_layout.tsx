import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="sources"
        options={{
          title: "Water Sources",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "water" : "water-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="discussion"
        options={{
          title: "Discussion",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="chatbubbles-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alert"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "notifications" : "notifications-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
