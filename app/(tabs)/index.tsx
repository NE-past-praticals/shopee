import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { fetchProducts, fetchCategories } from "@/api/client";
import { Product, Category } from "@/types/api";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import Colors from "@/constants/colors";

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
        <ActivityIndicator size="large" color={Colors.primary} />
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <View style={styles.productsGrid}>
          {products.slice(0, 6).map((product) => (
            <View key={product.id} style={styles.productItem}>
              <ProductCard product={product} />
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
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
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