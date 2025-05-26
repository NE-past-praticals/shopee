import React from "react";
import { StyleSheet, Text, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { Category } from "@/types/api";
import Colors from "@/constants/colors";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/category/${category.id}`);
  };
  
  return (
    <Pressable 
      style={styles.card} 
      onPress={handlePress}
    >
      <Image 
        source={{ uri: category.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.name}>{category.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.placeholder,
  },
  name: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: Colors.background,
    padding: 8,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});