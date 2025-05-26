import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { Product } from "@/types/api";
import Colors from "@/constants/colors";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };
  
  return (
    <Pressable 
      style={styles.card} 
      onPress={handlePress}
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
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: Colors.placeholder,
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
});