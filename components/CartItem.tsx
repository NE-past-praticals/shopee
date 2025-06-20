import React from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Minus, Plus, Trash2 } from "lucide-react-native";
import { CartItem as CartItemType } from "@/types/api";
import { useCartStore } from "@/stores/cartStore";
import Colors from "@/constants/colors";
import Fonts from "@/constants/fonts";
import Animated, { FadeInRight, FadeOutRight, Layout } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface CartItemProps {
  item: CartItemType;
  index: number;
}

export default function CartItem({ item, index }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCartStore();
  
  const handleIncrement = () => {
    updateQuantity(item.product.id, item.quantity + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(item.product.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeInRight.delay(index * 100).springify()}
      exiting={FadeOutRight.springify()}
      layout={Layout.springify()}
    >
      <Image 
        source={{ uri: item.product.images[0] }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {item.product.title}
        </Text>
        <Text style={styles.price}>${item.product.price.toFixed(2)}</Text>
        
        <View style={styles.actions}>
          <View style={styles.quantity}>
            <Pressable 
              style={styles.quantityButton} 
              onPress={handleDecrement}
            >
              <Minus size={16} color={Colors.text} />
            </Pressable>
            
            <Text style={styles.quantityText}>{item.quantity}</Text>
            
            <Pressable 
              style={styles.quantityButton} 
              onPress={handleIncrement}
            >
              <Plus size={16} color={Colors.text} />
            </Pressable>
          </View>
          
          <Pressable 
            style={styles.removeButton} 
            onPress={handleRemove}
          >
            <Trash2 size={18} color={Colors.error} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.placeholder,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    paddingHorizontal: 8,
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
  removeButton: {
    padding: 8,
  },
});