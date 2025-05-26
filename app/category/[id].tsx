import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchProductsByCategory, fetchCategories } from "@/api/client";
import { Product, Category } from "@/types/api";
import ProductCard from "@/components/ProductCard";
import Colors from "@/constants/colors";
import Fonts from "@/constants/fonts";
import EmptyState from "@/components/EmptyState";
import { ShoppingBag } from "lucide-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import LottieView from "lottie-react-native";

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!id) {
          setError("Category ID is missing");
          return;
        }
        
        const [productsData, categoriesData] = await Promise.all([
          fetchProductsByCategory(Number(id)),
          fetchCategories(),
        ]);
        
        setProducts(productsData);
        
        const foundCategory = categoriesData.find(
          (cat) => cat.id === Number(id)
        );
        setCategory(foundCategory || null);
      } catch (err) {
        setError("Failed to load category data. Please try again.");
        console.error("Error loading category data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id]);
  
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
  
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  
  if (products.length === 0) {
    return (
      <EmptyState
        title={`No products in ${category?.name || "this category"}`}
        message="Try checking out other categories"
        icon={<ShoppingBag size={64} color={Colors.placeholder} />}
      />
    );
  }
  
  return (
    <View style={styles.container}>
      {category && (
        <Animated.View 
          style={styles.header}
          entering={FadeIn.duration(500)}
        >
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.productCount}>
            {products.length} {products.length === 1 ? "product" : "products"}
          </Text>
        </Animated.View>
      )}
      
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.productItem}>
            <ProductCard product={item} index={index} />
          </View>
        )}
        contentContainerStyle={styles.productsList}
        columnWrapperStyle={styles.productsRow}
      />
    </View>
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
  header: {
    backgroundColor: Colors.background,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryName: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  productCount: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.placeholder,
  },
  productsList: {
    padding: 16,
  },
  productsRow: {
    justifyContent: "space-between",
  },
  productItem: {
    width: "48%",
    marginBottom: 16,
  },
});