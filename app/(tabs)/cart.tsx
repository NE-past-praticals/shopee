import React from "react";
import { StyleSheet, Text, View, FlatList, SafeAreaView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import CartItem from "@/components/CartItem";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import Colors from "@/constants/colors";
import Fonts from "@/constants/fonts";
import { ShoppingCart } from "lucide-react-native";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";

export default function CartScreen() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { isAuthenticated, isGuest } = useAuthStore();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  
  const handleCheckout = () => {
    if (!isAuthenticated && !isGuest) {
      // User is not logged in or guest
      Alert.alert(
        "Login Required",
        "Please login or continue as guest to checkout",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Login",
            onPress: () => router.push("/auth/login"),
          },
        ]
      );
      return;
    }
    
    if (isGuest) {
      // Guest user - offer to create account
      Alert.alert(
        "Create Account?",
        "Would you like to create an account to track your order?",
        [
          {
            text: "Continue as Guest",
            onPress: () => {
              // Proceed with checkout as guest
              processCheckout();
            },
          },
          {
            text: "Create Account",
            onPress: () => router.push("/auth/register"),
          },
        ]
      );
      return;
    }
    
    // Regular authenticated user
    processCheckout();
  };
  
  const processCheckout = () => {
    setIsCheckingOut(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Simulate checkout process
    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      Alert.alert(
        "Order Placed!",
        "Your order has been successfully placed.",
        [{ text: "OK" }]
      );
    }, 2000);
  };
  
  const navigateToHome = () => {
    router.push("/");
  };
  
  if (isCheckingOut) {
    return (
      <View style={styles.centered}>
        <LottieView
          source={require('@/assets/animations/checkout.json')}
          autoPlay
          loop={false}
          style={{ width: 200, height: 200 }}
        />
        <Text style={styles.checkoutText}>Processing your order...</Text>
      </View>
    );
  }
  
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
      <Animated.FlatList
        data={items}
        keyExtractor={(item) => item.product.id.toString()}
        renderItem={({ item, index }) => <CartItem item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        itemLayoutAnimation={Layout.springify()}
      />
      
      <Animated.View 
        style={styles.footer}
        entering={FadeIn.duration(500)}
      >
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
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.card,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.card,
  },
  checkoutText: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  listContent: {
    padding: 16,
  },
  footer: {
    backgroundColor: Colors.background,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  checkoutButton: {
    marginTop: 16,
  },
});