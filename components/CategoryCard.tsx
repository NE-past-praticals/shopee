import React from "react";
import { StyleSheet, Text, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { Category } from "@/types/api";
import Colors from "@/constants/colors";
import Fonts from "@/constants/fonts";
import Animated, { FadeInLeft, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const router = useRouter();
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const handlePress = () => {
    router.push(`/category/${category.id}`);
  };
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };
  
  return (
    <Animated.View
      entering={FadeInLeft.delay(index * 100).springify()}
    >
      <AnimatedPressable 
        style={[styles.card, animatedStyle]} 
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Image 
          source={{ uri: category.image }} 
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.name}>{category.name}</Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 12,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    backgroundColor: "rgba(0,0,0,0.7)",
    color: Colors.background,
    padding: 10,
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    textAlign: "center",
  },
});