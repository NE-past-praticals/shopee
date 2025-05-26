import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator, Pressable, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchProduct } from "@/api/client";
import { Product } from "@/types/api";
import Button from "@/components/Button";
import { useCartStore } from "@/stores/cartStore";
import Colors from "@/constants/colors";
import Fonts from "@/constants/fonts";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react-native";
import Animated, { FadeIn, FadeInUp, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addToCart } = useCartStore();
  const successAnimation = useRef<LottieView>(null);
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!id) {
          setError("Product ID is missing");
          return;
        }
        
        const productData = await fetchProduct(Number(id));
        setProduct(productData);
      } catch (err) {
        setError("Failed to load product. Please try again.");
        console.error("Error loading product:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      setIsAddingToCart(true);
      scale.value = withSpring(1.1, { damping: 10, stiffness: 300 }, () => {
        scale.value = withSpring(1);
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Show animation
      successAnimation.current?.play();
      
      // Add to cart after animation
      setTimeout(() => {
        addToCart(product);
        setIsAddingToCart(false);
      }, 1500);
    }
  };
  
  const handlePrevImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handleNextImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <LottieView
          source={require('@/assets/animations/loading.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }
  
  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || "Product not found"}</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product.images[currentImageIndex] }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        {product.images.length > 1 && (
          <>
            <Pressable style={[styles.imageNav, styles.prevButton]} onPress={handlePrevImage}>
              <ChevronLeft size={24} color={Colors.background} />
            </Pressable>
            
            <Pressable style={[styles.imageNav, styles.nextButton]} onPress={handleNextImage}>
              <ChevronRight size={24} color={Colors.background} />
            </Pressable>
            
            <View style={styles.pagination}>
              {product.images.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.activeDot
                  ]} 
                />
              ))}
            </View>
          </>
        )}
        
        <Pressable 
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <Heart 
            size={24} 
            color={isFavorite ? Colors.error : Colors.background} 
            fill={isFavorite ? Colors.error : "none"} 
          />
        </Pressable>
      </View>
      
      <Animated.View 
        style={styles.content}
        entering={FadeInUp.springify()}
      >
        <Text style={styles.category}>{product.category.name}</Text>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>
        
        <Animated.View style={animatedStyle}>
          <Button
            title={isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
            onPress={handleAddToCart}
            style={styles.addButton}
            disabled={isAddingToCart}
          />
        </Animated.View>
        
        {isAddingToCart && (
          <View style={styles.successAnimation}>
            <LottieView
              ref={successAnimation}
              source={require('@/assets/animations/success.json')}
              autoPlay={false}
              loop={false}
              style={{ width: 100, height: 100 }}
            />
          </View>
        )}
      </Animated.View>
    </ScrollView>
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
  errorText: {
    color: Colors.error,
    fontSize: 16,
    textAlign: "center",
    fontFamily: Fonts.medium,
  },
  imageContainer: {
    position: "relative",
    height: 350,
    backgroundColor: Colors.placeholder,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageNav: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  prevButton: {
    left: 16,
  },
  nextButton: {
    right: 16,
  },
  pagination: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.background,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 24,
    paddingBottom: 40,
  },
  category: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.placeholder,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginBottom: 24,
  },
  addButton: {
    marginTop: 8,
  },
  successAnimation: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 10,
  },
});