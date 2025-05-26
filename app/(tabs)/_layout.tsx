import React from "react";
import { Tabs } from "expo-router";
import { Home, ShoppingCart, User, Search } from "lucide-react-native";
import Colors from "@/constants/colors";
import CartBadge from "@/components/CartBadge";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function TabLayout() {
  const router = useRouter();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.placeholder,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          headerTitle: "ShopApp",
        }}
      />
      
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: () => <CartBadge />,
          headerRight: () => (
            <Pressable 
              style={{ marginRight: 16 }}
              onPress={() => router.push("/")}
            >
              <Home size={24} color={Colors.text} />
            </Pressable>
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}