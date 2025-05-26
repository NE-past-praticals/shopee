import React from "react";
import { StyleSheet, Text, View, FlatList, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "@/stores/cartStore";
import CartItem from "@/components/CartItem";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import Colors from "@/constants/colors";
import { ShoppingCart } from "lucide-react-native";

export default function CartScreen() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  
  const handleCheckout = () => {
    // In a real app, this would navigate to checkout
    alert("Checkout functionality would be implemented here!");
    clearCart();
  };
  
  const navigateToHome = () => {
    router.push("/");
  };
  
  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Add some products to your cart to see them here"
        icon={<ShoppingCart size={64} color={Colors.placeholder} />}
        buttonTitle="Browse Products"
        onButtonPress={navigateToHome}
      />
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id.toString()}
        renderItem={({ item }) => <CartItem item={item} />}
        contentContainerStyle={styles.listContent}
      />
      
      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>${getCartTotal().toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping:</Text>
          <Text style={styles.summaryValue}>$0.00</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${getCartTotal().toFixed(2)}</Text>
        </View>
        
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          style={styles.checkoutButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.card,
  },
  listContent: {
    padding: 16,
  },
  footer: {
    backgroundColor: Colors.background,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  checkoutButton: {
    marginTop: 16,
  },
});