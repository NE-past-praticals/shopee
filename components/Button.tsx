import React from "react";
import { StyleSheet, Text, Pressable, ActivityIndicator, ViewStyle, TextStyle } from "react-native";
import Colors from "@/constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    variant === "primary" && styles.primaryButton,
    variant === "secondary" && styles.secondaryButton,
    variant === "outline" && styles.outlineButton,
    (disabled || isLoading) && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === "primary" && styles.primaryText,
    variant === "secondary" && styles.secondaryText,
    variant === "outline" && styles.outlineText,
    (disabled || isLoading) && styles.disabledText,
    textStyle,
  ];

  return (
    <Pressable
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === "outline" ? Colors.primary : Colors.background} 
          size="small" 
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: Colors.background,
  },
  secondaryText: {
    color: Colors.background,
  },
  outlineText: {
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.background,
  },
});