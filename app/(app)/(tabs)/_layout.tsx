import { router, Tabs } from "expo-router";
import React from "react";
import { Button, Pressable } from "react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

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
        name="home"
        options={{
          title: "Homes",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
          tabBarButton: (props) => (
            <Pressable
              android_ripple={{
                color: "white", // Color of the ripple effect
                borderless: false, // Makes the ripple confined to the button area
              }}
              {...props} // Spread props to ensure tab functionality (like navigation) still works
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "code-slash" : "code-slash-outline"}
              color={color}
            />
          ),
          tabBarButton: (props) => (
            <Pressable
              android_ripple={{
                color: "white", // Color of the ripple effect
                borderless: false, // Makes the ripple confined to the button area
              }}
              {...props} // Spread props to ensure tab functionality (like navigation) still works
            />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "About Me",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
            />
          ),
          tabBarButton: (props) => (
            <Pressable
              android_ripple={{
                color: "white", // Color of the ripple effect
                borderless: false, // Makes the ripple confined to the button area
              }}
              {...props} // Spread props to ensure tab functionality (like navigation) still works
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
            />
          ),
          tabBarButton: (props) => (
            <Button
              title="Go to Index Page"
              onPress={() => router.replace('/index')} // Use router.push to navigate
            />
          ),
        }}
      /> */}
    </Tabs>
  );
}
