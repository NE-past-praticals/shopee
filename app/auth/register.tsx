import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Colors from "@/constants/colors";

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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to start shopping</Text>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        error={nameError}
        style={styles.input}
      />
      
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="your@email.com"
        error={emailError}
        style={styles.input}
      />
      
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Your password"
        secureTextEntry
        error={passwordError}
        style={styles.input}
      />
      
      <Input
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm your password"
        secureTextEntry
        error={confirmPasswordError}
        style={styles.input}
      />
      
      <Button
        title="Register"
        onPress={handleRegister}
        isLoading={isLoading}
        style={styles.button}
      />
      
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <Pressable onPress={handleLogin}>
          <Text style={styles.loginLink}>Login</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: Colors.text,
    marginRight: 4,
  },
  loginLink: {
    color: Colors.primary,
    fontWeight: "600",
  },
});