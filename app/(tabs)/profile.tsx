import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Alert, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/Button";
import Colors from "@/constants/colors";
import Fonts from "@/constants/fonts";
import { User, LogOut, ShoppingBag, Heart, Settings, ChevronRight } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useOnboardingStore } from "@/stores/onboardingStore";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isGuest, logout } = useAuthStore();
  const { resetOnboarding } = useOnboardingStore();
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  
  const handleLogin = () => {
    router.push("/auth/login");
  };
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            logout();
          },
          style: "destructive",
        },
      ]
    );
  };
  
  const handlePickImage = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const handleResetOnboarding = () => {
    Alert.alert(
      "Reset Onboarding",
      "Are you sure you want to see the onboarding screens again?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          onPress: () => {
            resetOnboarding();
            router.replace("/");
          },
        },
      ]
    );
  };
  
  if (!isAuthenticated && !isGuest) {
    return (
      <Animated.View 
        style={styles.container}
        entering={FadeIn.duration(500)}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={64} color={Colors.placeholder} />
          </View>
        </View>
        
        <Text style={styles.title}>Welcome to ShopApp</Text>
        <Text style={styles.subtitle}>
          Please login to access your profile and orders
        </Text>
        
        <Button
          title="Login / Register"
          onPress={handleLogin}
          style={styles.loginButton}
        />
      </Animated.View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeIn.duration(500)}
      >
        <View style={styles.avatarContainer}>
          {avatar && !isGuest ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <User size={64} color={Colors.placeholder} />
            </View>
          )}
          
          {!isGuest && (
            <Button
              title="Change Photo"
              variant="outline"
              onPress={handlePickImage}
              style={styles.changePhotoButton}
              textStyle={styles.changePhotoText}
            />
          )}
        </View>
        
        <Text style={styles.name}>{isGuest ? "Guest User" : (user?.name || "User")}</Text>
        {!isGuest && <Text style={styles.email}>{user?.email || "user@example.com"}</Text>}
        
        {isGuest && (
          <Text style={styles.guestMessage}>
            You are browsing as a guest. Create an account to save your information.
          </Text>
        )}
        
        {isGuest && (
          <Button
            title="Create Account"
            onPress={() => router.push("/auth/register")}
            style={styles.createAccountButton}
          />
        )}
      </Animated.View>
      
      <View style={styles.section}>
        {[
          { icon: <ShoppingBag size={24} color={Colors.text} />, title: "My Orders", delay: 0 },
          { icon: <Heart size={24} color={Colors.text} />, title: "Wishlist", delay: 100 },
          { icon: <Settings size={24} color={Colors.text} />, title: "Settings", delay: 200 },
          { 
            icon: <LogOut size={24} color={Colors.primary} />, 
            title: "Reset Onboarding", 
            color: Colors.primary,
            onPress: handleResetOnboarding,
            delay: 300
          },
        ].map((item, index) => (
          <Animated.View 
            key={index}
            entering={FadeInDown.delay(item.delay).springify()}
          >
            <Pressable 
              style={styles.menuItem}
              onPress={item.onPress}
            >
              {item.icon}
              <Text style={[styles.menuText, item.color && { color: item.color }]}>
                {item.title}
              </Text>
              <ChevronRight size={20} color={Colors.placeholder} />
            </Pressable>
          </Animated.View>
        ))}
      </View>
      
      <Button
        title={isGuest ? "Sign Out" : "Logout"}
        variant="outline"
        onPress={handleLogout}
        style={styles.logoutButton}
        textStyle={{ color: Colors.error }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.card,
  },
  header: {
    backgroundColor: Colors.background,
    padding: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  name: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.placeholder,
  },
  guestMessage: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.placeholder,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  createAccountButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.placeholder,
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 32,
    lineHeight: 22,
  },
  loginButton: {
    marginHorizontal: 32,
  },
  section: {
    backgroundColor: Colors.background,
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  menuText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    marginLeft: 16,
    color: Colors.text,
    flex: 1,
  },
  logoutButton: {
    margin: 24,
    borderColor: Colors.error,
  },
});