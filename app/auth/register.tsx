import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Colors from "@/constants/colors";
import Fonts from "@/constants/fonts";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/profile");
    }
    
    return () => {
      clearError();
    };
  }, [isAuthenticated]);
  
  const validateForm = () => {
    let isValid = true;
    
    if (!name) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }
    
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }
    
    return isValid;
  };
  
  const handleRegister = async () => {
    if (validateForm()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await register({
        name,
        email,
        password,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email,
      });
    }
  };
  
  const handleLogin = () => {
    router.push("/auth/login");
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.Text 
          style={styles.title}
          entering={FadeInDown.delay(100).springify()}
        >
          Create Account
        </Animated.Text>
        
        <Animated.Text 
          style={styles.subtitle}
          entering={FadeInDown.delay(200).springify()}
        >
          Sign up to start shopping
        </Animated.Text>
        
        {error && (
          <Animated.Text 
            style={styles.errorText}
            entering={FadeIn.duration(300)}
          >
            {error}
          </Animated.Text>
        )}
        
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            error={nameError}
            style={styles.input}
          />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            error={emailError}
            style={styles.input}
          />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
            error={passwordError}
            style={styles.input}
          />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(600).springify()}>
          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
            error={confirmPasswordError}
            style={styles.input}
          />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(700).springify()}>
          <Button
            title="Register"
            onPress={handleRegister}
            isLoading={isLoading}
            style={styles.button}
          />
        </Animated.View>
        
        <Animated.View 
          style={styles.loginContainer}
          entering={FadeInDown.delay(800).springify()}
        >
          <Text style={styles.loginText}>Already have an account?</Text>
          <Pressable onPress={handleLogin}>
            <Text style={styles.loginLink}>Login</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.placeholder,
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
    textAlign: "center",
    fontFamily: Fonts.medium,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  loginText: {
    color: Colors.text,
    marginRight: 4,
    fontFamily: Fonts.regular,
  },
  loginLink: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
  },
});