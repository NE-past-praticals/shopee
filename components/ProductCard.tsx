import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { Product } from "@/types/api";
import Colors from "@/constants/colors";
import Fonts from "@/constants/fonts";
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { ShoppingCart } from "lucide-react-native";
import { useCartStore } from "@/stores/cartStore";
import * as Haptics from "expo-haptics";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };
  
  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 10, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };
  
  const handleAddToCart = () => {
    addToCart(product);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).springify()}
    >
      <AnimatedPressable 
        style={[styles.card, animatedStyle]} 
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Image 
          source={{ uri: product.images[0] }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {product.title}
          </Text>
          <Text style={styles.category} numberOfLines={1}>
            {product.category.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <Pressable 
              style={styles.cartButton}
              onPress={handleAddToCart}
            >
              <ShoppingCart size={16} color={Colors.background} />
            </Pressable>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: Colors.placeholder,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.placeholder,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  cartButton: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});