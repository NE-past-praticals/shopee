import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { useCartStore } from "@/stores/cartStore";
import Colors from "@/constants/colors";

export default function CartBadge() {
  const itemsCount = useCartStore((state) => state.getCartItemsCount());
  
  return (
    <View style={styles.container}>
      <ShoppingCart size={24} color={Colors.text} />
      
      {itemsCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.count}>
            {itemsCount > 99 ? "99+" : itemsCount}
          </Text>
        </View>
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
    fontWeight: "700",
  },
});