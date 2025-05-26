import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Colors from "@/constants/colors";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  
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
      await login({ email, password });
    }
  };
  
  const handleRegister = () => {
    router.push("/auth/register");
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
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
      
      <Button
        title="Login"
        onPress={handleLogin}
        isLoading={isLoading}
        style={styles.button}
      />
      
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account?</Text>
        <Pressable onPress={handleRegister}>
          <Text style={styles.registerLink}>Register</Text>
        </Pressable>
      </View>
      
      <View style={styles.demoContainer}>
        <Text style={styles.demoText}>Demo credentials:</Text>
        <Text style={styles.demoCredentials}>Email: john@mail.com</Text>
        <Text style={styles.demoCredentials}>Password: changeme</Text>
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
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: Colors.text,
    marginRight: 4,
  },
  registerLink: {
    color: Colors.primary,
    fontWeight: "600",
  },
  demoContainer: {
    marginTop: 48,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  demoText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  demoCredentials: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
});