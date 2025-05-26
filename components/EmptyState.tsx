import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ShoppingBag } from "lucide-react-native";
import Colors from "@/constants/colors";
import Fonts from "@/constants/fonts";
import Button from "./Button";
import Animated, { FadeIn } from "react-native-reanimated";

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  buttonTitle?: string;
  onButtonPress?: () => void;
}

export default function EmptyState({
  title,
  message,
  icon,
  buttonTitle,
  onButtonPress,
}: EmptyStateProps) {
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(500)}
    >
      {icon || <ShoppingBag size={64} color={Colors.placeholder} />}
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {buttonTitle && onButtonPress && (
        <Button
          title={buttonTitle}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.placeholder,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    minWidth: 200,
  },
});