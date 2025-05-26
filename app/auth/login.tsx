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

export default function LoginScreen() {
  const router = useRouter();
  const { login, continueAsGuest, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
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
    
    return isValid;
  };
  
  const handleLogin = async () => {
    if (validateForm()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await login({ email, password });
    }
  };
  
  const handleRegister = () => {
    router.push("/auth/register");
  };
  
  const handleGuestLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    continueAsGuest();
    router.replace("/");
  };
  
  const handleDemoLogin = () => {
    setEmail("john@mail.com");
    setPassword("changeme");
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
          Welcome Back
        </Animated.Text>
        
        <Animated.Text 
          style={styles.subtitle}
          entering={FadeInDown.delay(200).springify()}
        >
          Sign in to your account
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
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            error={emailError}
            style={styles.input}
          />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).springify()}>
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
        
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <Button
            title="Login"
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.button}
          />
        </Animated.View>
        
        <Animated.View 
          style={styles.registerContainer}
          entering={FadeInDown.delay(600).springify()}
        >
          <Text style={styles.registerText}>Don't have an account?</Text>
          <Pressable onPress={handleRegister}>
            <Text style={styles.registerLink}>Register</Text>
          </Pressable>
        </Animated.View>
        
        <Animated.View 
          style={styles.dividerContainer}
          entering={FadeInDown.delay(700).springify()}
        >
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(800).springify()}>
          <Button
            title="Continue as Guest"
            onPress={handleGuestLogin}
            variant="outline"
            style={styles.guestButton}
          />
        </Animated.View>
        
        <Animated.View 
          style={styles.demoContainer}
          entering={FadeInDown.delay(900).springify()}
        >
          <Text style={styles.demoText}>Demo credentials:</Text>
          <Text style={styles.demoCredentials}>Email: john@mail.com</Text>
          <Text style={styles.demoCredentials}>Password: changeme</Text>
          <Pressable 
            style={styles.demoButton}
            onPress={handleDemoLogin}
          >
            <Text style={styles.demoButtonText}>Fill Demo Credentials</Text>
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
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: Colors.text,
    marginRight: 4,
    fontFamily: Fonts.regular,
  },
  registerLink: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    color: Colors.placeholder,
    fontFamily: Fonts.medium,
  },
  guestButton: {
    marginBottom: 24,
  },
  demoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  demoText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 8,
  },
  demoCredentials: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginBottom: 4,
  },
  demoButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: Colors.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  demoButtonText: {
    color: Colors.primary,
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
});