import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { fetchProducts, fetchCategories } from "@/api/client";
import { Product, Category } from "@/types/api";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import Colors from "@/constants/colors";
import Fonts from "@/constants/fonts";
import Animated, { FadeIn } from "react-native-reanimated";
import LottieView from "lottie-react-native";

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error("Error loading home data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading && !refreshing) {
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

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Animated.View 
        style={styles.welcomeSection}
        entering={FadeIn.duration(500)}
      >
        <Text style={styles.welcomeTitle}>Welcome to ShopApp</Text>
        <Text style={styles.welcomeSubtitle}>Discover amazing products</Text>
      </Animated.View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <View style={styles.productsGrid}>
          {products.slice(0, 6).map((product, index) => (
            <View key={product.id} style={styles.productItem}>
              <ProductCard product={product} index={index} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.card,
  },
  content: {
    padding: 16,
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
  welcomeSection: {
    marginBottom: 24,
    paddingVertical: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.placeholder,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    marginBottom: 16,
    color: Colors.text,
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productItem: {
    width: "48%",
    marginBottom: 16,
  },
});