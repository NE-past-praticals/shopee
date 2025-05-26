import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ShoppingBag } from "lucide-react-native";
import Colors from "@/constants/colors";
import Button from "./Button";

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
    <View style={styles.container}>
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
    </View>
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
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: Colors.placeholder,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
});