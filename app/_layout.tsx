import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useAuthStore } from "@/stores/authStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { View } from "react-native";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootLayoutNav />
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { hasCompletedOnboarding } = useOnboardingStore();
  const { isAuthenticated, isGuest } = useAuthStore();

  useEffect(() => {
    // Check if the user is on a protected route
    const inAuthGroup = segments[0] === "auth";
    const inOnboardingGroup = segments[0] === "onboarding";
    
    // If onboarding is not completed, redirect to onboarding
    if (!hasCompletedOnboarding && !inOnboardingGroup) {
      router.push("/onboarding");
      return;
    }
    
    // If onboarding is completed but user is in onboarding, redirect to home
    if (hasCompletedOnboarding && inOnboardingGroup) {
      router.replace("/(tabs)");
      return;
    }
    
    // If user is in auth group but already authenticated or guest, redirect to home
    if (inAuthGroup && (isAuthenticated || isGuest)) {
      router.replace("/(tabs)");
    }
  }, [hasCompletedOnboarding, isAuthenticated, isGuest, segments]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontFamily: "Poppins-SemiBold",
            fontWeight: "600",
          },
          contentStyle: {
            backgroundColor: Colors.card,
          },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="product/[id]" 
          options={{ 
            title: "Product Details",
            headerBackTitle: "Back",
            presentation: "card",
          }} 
        />
        <Stack.Screen 
          name="category/[id]" 
          options={{ 
            title: "Category",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="auth/login" 
          options={{ 
            title: "Login",
            headerBackTitle: "Back",
            presentation: "modal",
          }} 
        />
        <Stack.Screen 
          name="auth/register" 
          options={{ 
            title: "Register",
            headerBackTitle: "Back",
            presentation: "modal",
          }} 
        />
      </Stack>
    </>
  );
}