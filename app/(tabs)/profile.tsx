import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/Button";
import Colors from "@/constants/colors";
import { User, LogOut, ShoppingBag, Heart, Settings } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
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
    }
  };
  
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
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
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <User size={64} color={Colors.placeholder} />
            </View>
          )}
          
          <Button
            title="Change Photo"
            variant="outline"
            onPress={handlePickImage}
            style={styles.changePhotoButton}
            textStyle={styles.changePhotoText}
          />
        </View>
        
        <Text style={styles.name}>{user?.name || "User"}</Text>
        <Text style={styles.email}>{user?.email || "user@example.com"}</Text>
      </View>
      
      <View style={styles.section}>
        <View style={styles.menuItem}>
          <ShoppingBag size={24} color={Colors.text} />
          <Text style={styles.menuText}>My Orders</Text>
        </View>
        
        <View style={styles.menuItem}>
          <Heart size={24} color={Colors.text} />
          <Text style={styles.menuText}>Wishlist</Text>
        </View>
        
        <View style={styles.menuItem}>
          <Settings size={24} color={Colors.text} />
          <Text style={styles.menuText}>Settings</Text>
        </View>
      </View>
      
      <Button
        title="Logout"
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
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
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
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: Colors.placeholder,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.placeholder,
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 32,
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
    marginLeft: 16,
    color: Colors.text,
  },
  logoutButton: {
    margin: 24,
    borderColor: Colors.error,
  },
});