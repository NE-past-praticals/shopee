import React from "react";
import { StyleSheet, TextInput, View, Text, ViewStyle } from "react-native";
import Colors from "@/constants/colors";
import Fonts from "@/constants/fonts";
import Animated, { FadeIn } from "react-native-reanimated";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  label?: string;
  error?: string;
  style?: ViewStyle;
}

export default function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  label,
  error,
  style,
}: InputProps) {
  return (
    <Animated.View 
      style={[styles.container, style]}
      entering={FadeIn.duration(300)}
    >
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholder}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
      
      {error && (
        <Animated.Text 
          style={styles.errorText}
          entering={FadeIn.duration(300)}
        >
          {error}
        </Animated.Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    marginBottom: 8,
    color: Colors.text,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginTop: 4,
  },
});