import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { useCartStore } from "@/stores/cartStore";
import Colors from "@/constants/colors";
import Fonts from "@/constants/fonts";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export default function CartBadge() {
  const itemsCount = useCartStore((state) => state.getCartItemsCount());
  const scale = useSharedValue(1);
  
  React.useEffect(() => {
    // Animate badge when count changes
    if (itemsCount > 0) {
      scale.value = withSpring(1.2, { damping: 10, stiffness: 300 }, () => {
        scale.value = withSpring(1);
      });
    }
  }, [itemsCount]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  return (
    <View style={styles.container}>
      <ShoppingCart size={24} color={Colors.text} />
      
      {itemsCount > 0 && (
        <Animated.View style={[styles.badge, animatedStyle]}>
          <Text style={styles.count}>
            {itemsCount > 99 ? "99+" : itemsCount}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: Colors.notification,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  count: {
    color: Colors.background,
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
});